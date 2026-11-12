// SVG path data -> absolute line/cubic segments, grouped into subpaths.

export interface Pt {
  x: number;
  y: number;
}

export type Seg =
  | { kind: "L"; a: Pt; b: Pt }
  | { kind: "C"; a: Pt; c1: Pt; c2: Pt; b: Pt };

export interface Subpath {
  segs: Seg[];
  closed: boolean;
  /** Start point, kept so zero-length subpaths (dots) survive. */
  start: Pt;
}

const EPS = 1e-6;

class Scanner {
  i = 0;
  constructor(private s: string) {}

  private skip(): void {
    while (this.i < this.s.length && /[\s,]/.test(this.s[this.i]!)) this.i++;
  }

  peekCommand(): string | null {
    this.skip();
    const c = this.s[this.i];
    return c !== undefined && /[a-zA-Z]/.test(c) ? c : null;
  }

  done(): boolean {
    this.skip();
    return this.i >= this.s.length;
  }

  hasNumber(): boolean {
    this.skip();
    const c = this.s[this.i];
    return c !== undefined && /[-+.\d]/.test(c);
  }

  command(): string {
    this.skip();
    return this.s[this.i++]!;
  }

  number(): number {
    this.skip();
    const m = /^[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/.exec(this.s.slice(this.i));
    if (!m) throw new Error(`Bad number in path at ${this.i}: "${this.s.slice(this.i, this.i + 12)}"`);
    this.i += m[0].length;
    return Number(m[0]);
  }

  /** Arc flags may be written without separators ("a1 1 0 011 1"). */
  flag(): number {
    this.skip();
    const c = this.s[this.i];
    if (c !== "0" && c !== "1") throw new Error(`Bad arc flag at ${this.i}`);
    this.i++;
    return Number(c);
  }
}

/** Convert an SVG elliptical arc to cubic Bézier segments (SVG spec F.6). */
export function arcToCubics(
  a: Pt,
  rxIn: number,
  ryIn: number,
  rotDeg: number,
  largeArc: number,
  sweep: number,
  b: Pt,
): Seg[] {
  if (Math.hypot(b.x - a.x, b.y - a.y) < EPS) return [];
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx < EPS || ry < EPS) return [{ kind: "L", a, b }];

  const phi = (rotDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (a.x - b.x) / 2;
  const dy = (a.y - b.y) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;

  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const k = Math.sqrt(lambda);
    rx *= k;
    ry *= k;
  }

  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let coef = Math.sqrt(Math.max(0, num / den));
  if (largeArc === sweep) coef = -coef;
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (a.x + b.x) / 2;
  const cy = sin * cxp + cos * cyp + (a.y + b.y) / 2;

  const angle = (ux: number, uy: number, vx: number, vy: number) =>
    Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI;
  if (sweep && dt < 0) dt += 2 * Math.PI;

  const n = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9));
  const step = dt / n;
  const k = (4 / 3) * Math.tan(step / 4);
  const point = (t: number): Pt => ({
    x: cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin,
    y: cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos,
  });
  const deriv = (t: number): Pt => ({
    x: -rx * Math.sin(t) * cos - ry * Math.cos(t) * sin,
    y: -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos,
  });

  const out: Seg[] = [];
  let prev = a;
  for (let i = 0; i < n; i++) {
    const ta = t1 + i * step;
    const tb = ta + step;
    const pb = i === n - 1 ? b : point(tb);
    const da = deriv(ta);
    const db = deriv(tb);
    out.push({
      kind: "C",
      a: prev,
      c1: { x: prev.x + k * da.x, y: prev.y + k * da.y },
      c2: { x: pb.x - k * db.x, y: pb.y - k * db.y },
      b: pb,
    });
    prev = pb;
  }
  return out;
}

export function parsePath(d: string): Subpath[] {
  const sc = new Scanner(d);
  const subs: Subpath[] = [];
  let cur: Subpath | null = null;
  let p: Pt = { x: 0, y: 0 };
  let start: Pt = { x: 0, y: 0 };
  let lastC2: Pt | null = null; // for S
  let lastQ: Pt | null = null; // for T
  let cmd = "";

  const ensure = (): Subpath => {
    if (!cur) {
      cur = { segs: [], closed: false, start: { ...p } };
      subs.push(cur);
    }
    return cur;
  };
  const line = (b: Pt) => {
    ensure().segs.push({ kind: "L", a: p, b });
    p = b;
  };
  const cubic = (c1: Pt, c2: Pt, b: Pt) => {
    ensure().segs.push({ kind: "C", a: p, c1, c2, b });
    p = b;
  };

  while (!sc.done()) {
    const next = sc.peekCommand();
    if (next) cmd = sc.command();
    else if (!cmd) throw new Error("Path must start with a command");
    else if (!sc.hasNumber()) throw new Error(`Unexpected char in path at ${sc.i}`);

    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ox = rel ? p.x : 0;
    const oy = rel ? p.y : 0;
    const pt = (): Pt => ({ x: sc.number() + ox, y: sc.number() + oy });

    let c2: Pt | null = null;
    let q: Pt | null = null;
    switch (C) {
      case "M": {
        p = pt();
        start = p;
        cur = { segs: [], closed: false, start: { ...p } };
        subs.push(cur);
        cmd = rel ? "l" : "L"; // implicit lineto for following pairs
        break;
      }
      case "L":
        line(pt());
        break;
      case "H":
        line({ x: sc.number() + ox, y: p.y });
        break;
      case "V":
        line({ x: p.x, y: sc.number() + oy });
        break;
      case "C": {
        const c1 = pt();
        c2 = pt();
        cubic(c1, c2, pt());
        break;
      }
      case "S": {
        const c1 = lastC2 ? { x: 2 * p.x - lastC2.x, y: 2 * p.y - lastC2.y } : p;
        c2 = pt();
        cubic(c1, c2, pt());
        break;
      }
      case "Q":
      case "T": {
        q =
          C === "Q"
            ? pt()
            : lastQ
              ? { x: 2 * p.x - lastQ.x, y: 2 * p.y - lastQ.y }
              : p;
        const b = pt();
        const c1 = { x: p.x + (2 / 3) * (q.x - p.x), y: p.y + (2 / 3) * (q.y - p.y) };
        const cc2 = { x: b.x + (2 / 3) * (q.x - b.x), y: b.y + (2 / 3) * (q.y - b.y) };
        cubic(c1, cc2, b);
        break;
      }
      case "A": {
        const rx = sc.number();
        const ry = sc.number();
        const rot = sc.number();
        const large = sc.flag();
        const sweep = sc.flag();
        const b = pt();
        for (const s of arcToCubics(p, rx, ry, rot, large, sweep, b)) ensure().segs.push(s);
        p = b;
        break;
      }
      case "Z": {
        const s = ensure();
        if (Math.hypot(p.x - start.x, p.y - start.y) > EPS) line(start);
        s.closed = true;
        p = start;
        cur = null;
        break;
      }
      default:
        throw new Error(`Unsupported path command "${cmd}"`);
    }
    lastC2 = c2;
    lastQ = q;
  }
  return subs;
}
