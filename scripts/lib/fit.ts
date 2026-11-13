// Curve fitting for outline paths (Schneider, "An Algorithm for Automatically
// Fitting Digitized Curves", Graphics Gems 1990). Skia's stroker emits dozens of
// tiny quads per round cap; this refits each smooth run between corners into a
// few cubics within `tol` grid units, keeping straight edges as lines.
import { parsePath, type Pt, type Seg } from "../../packages/core/src/path.ts";
import { pointAt, segLength } from "../../packages/core/src/geom.ts";

type V = Pt;
const add = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k });
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y;
const len = (a: V) => Math.hypot(a.x, a.y);
const norm = (a: V): V => {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l };
};
const dist = (a: V, b: V) => len(sub(a, b));

type Bez = [V, V, V, V];
const bez = (b: Bez, t: number): V => {
  const u = 1 - t;
  return add(add(mul(b[0], u * u * u), mul(b[1], 3 * u * u * t)), add(mul(b[2], 3 * u * t * t), mul(b[3], t * t * t)));
};
const bezD1 = (b: Bez, t: number): V => {
  const u = 1 - t;
  return add(add(mul(sub(b[1], b[0]), 3 * u * u), mul(sub(b[2], b[1]), 6 * u * t)), mul(sub(b[3], b[2]), 3 * t * t));
};
const bezD2 = (b: Bez, t: number): V => add(mul(add(sub(b[2], mul(b[1], 2)), b[0]), 6 * (1 - t)), mul(add(sub(b[3], mul(b[2], 2)), b[1]), 6 * t));

function chordParams(pts: V[]): number[] {
  const u = [0];
  for (let i = 1; i < pts.length; i++) u.push(u[i - 1]! + dist(pts[i]!, pts[i - 1]!));
  const total = u[u.length - 1]! || 1;
  return u.map((x) => x / total);
}

function generate(pts: V[], u: number[], t1: V, t2: V): Bez {
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0;
  for (let i = 0; i < pts.length; i++) {
    const t = u[i]!;
    const v = 1 - t;
    const a1 = mul(t1, 3 * t * v * v);
    const a2 = mul(t2, 3 * t * t * v);
    c00 += dot(a1, a1);
    c01 += dot(a1, a2);
    c11 += dot(a2, a2);
    const tmp = sub(pts[i]!, add(mul(first, v * v * v + 3 * t * v * v), mul(last, 3 * t * t * v + t * t * t)));
    x0 += dot(a1, tmp);
    x1 += dot(a2, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  let alpha1 = det ? (x0 * c11 - x1 * c01) / det : 0;
  let alpha2 = det ? (c00 * x1 - c01 * x0) / det : 0;
  const segLen = dist(first, last);
  const eps = 1e-6 * segLen;
  // Degenerate or runaway solutions (near-parallel tangents) fall back to the safe heuristic.
  const bad = (a: number) => !Number.isFinite(a) || a < eps || a > segLen * 2;
  if (bad(alpha1) || bad(alpha2)) alpha1 = alpha2 = segLen / 3;
  return [first, add(first, mul(t1, alpha1)), add(last, mul(t2, alpha2)), last];
}

function maxError(pts: V[], b: Bez, u: number[]): [number, number] {
  let max = 0;
  let split = Math.floor(pts.length / 2);
  for (let i = 1; i < pts.length - 1; i++) {
    const d = dist(bez(b, u[i]!), pts[i]!);
    if (d > max) {
      max = d;
      split = i;
    }
  }
  return [max, split];
}

function reparam(b: Bez, pts: V[], u: number[]): number[] {
  return u.map((t, i) => {
    const d = sub(bez(b, t), pts[i]!);
    const d1 = bezD1(b, t);
    const d2 = bezD2(b, t);
    const num = dot(d, d1);
    const den = dot(d1, d1) + dot(d, d2);
    return den ? Math.max(0, Math.min(1, t - num / den)) : t;
  });
}

function fitCubic(pts: V[], t1: V, t2: V, tol: number, out: Bez[], depth = 0): void {
  if (pts.length === 2) {
    const l = dist(pts[0]!, pts[1]!) / 3;
    out.push([pts[0]!, add(pts[0]!, mul(t1, l)), add(pts[1]!, mul(t2, l)), pts[1]!]);
    return;
  }
  let u = chordParams(pts);
  let b = generate(pts, u, t1, t2);
  let [err, split] = maxError(pts, b, u);
  if (err < tol) return void out.push(b);
  if (err < tol * 6) {
    for (let k = 0; k < 6; k++) {
      u = reparam(b, pts, u);
      b = generate(pts, u, t1, t2);
      [err, split] = maxError(pts, b, u);
      if (err < tol) return void out.push(b);
    }
  }
  if (depth > 12 || pts.length < 3) return void out.push(b);
  const center = norm(sub(pts[split - 1]!, pts[split + 1]!));
  fitCubic(pts.slice(0, split + 1), t1, center, tol, out, depth + 1);
  fitCubic(pts.slice(split), mul(center, -1), t2, tol, out, depth + 1);
}

const tangentStart = (s: Seg): V => norm(s.kind === "L" ? sub(s.b, s.a) : sub(len(sub(s.c1, s.a)) > 1e-6 ? s.c1 : s.b, s.a));
const tangentEnd = (s: Seg): V => norm(s.kind === "L" ? sub(s.b, s.a) : sub(s.b, len(sub(s.b, s.c2)) > 1e-6 ? s.c2 : s.a));

const f2 = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? "0" : String(r);
};

/** Refit path data; corners (> CORNER deg) and real straight lines are preserved. */
export function fitD(d: string, tol = 0.03): string {
  const CORNER = (32 * Math.PI) / 180;
  const MIN_LINE = 0.6;
  let out = "";
  for (const sp of parsePath(d)) {
    const segs = sp.segs.filter((s) => segLength(s, 4) > 1e-4);
    if (!segs.length) continue;
    // Break points: corners between segments, and both ends of any "real" straight line.
    const isLine = (s: Seg) => s.kind === "L" && segLength(s) >= MIN_LINE;
    const n = segs.length;
    const breakAfter = segs.map((s, i) => {
      const nxt = segs[(i + 1) % n]!;
      if (!sp.closed && i === n - 1) return true;
      const ang = Math.acos(Math.max(-1, Math.min(1, dot(tangentEnd(s), tangentStart(nxt)))));
      return ang > CORNER || isLine(s) || isLine(nxt);
    });
    // Rotate a closed loop so it starts right after a break (if any).
    let start = 0;
    if (sp.closed) {
      const k = breakAfter.findIndex(Boolean);
      start = k === -1 ? 0 : (k + 1) % n;
    }
    const order = Array.from({ length: n }, (_, i) => segs[(start + i) % n]!);
    const brk = Array.from({ length: n }, (_, i) => breakAfter[(start + i) % n]!);
    out += `M${f2(order[0]!.a.x)} ${f2(order[0]!.a.y)}`;
    let run: Seg[] = [];
    const flush = () => {
      if (!run.length) return;
      if (run.length === 1 && isLine(run[0]!)) {
        out += `L${f2(run[0]!.b.x)} ${f2(run[0]!.b.y)}`;
      } else {
        const pts: V[] = [run[0]!.a];
        for (const s of run) {
          if (s.kind === "L") pts.push(s.b);
          else for (let i = 1; i <= 4; i++) pts.push(pointAt(s, i / 4));
        }
        const dedup = pts.filter((p, i) => i === 0 || dist(p, pts[i - 1]!) > 1e-4);
        if (dedup.length < 2) {
          run = [];
          return;
        }
        const curves: Bez[] = [];
        fitCubic(dedup, tangentStart(run[0]!), mul(tangentEnd(run[run.length - 1]!), -1), tol, curves);
        for (const c of curves) {
          const straight = dist(c[1], c[0]) < 1e-3 && dist(c[2], c[3]) < 1e-3;
          out += straight ? `L${f2(c[3].x)} ${f2(c[3].y)}` : `C${f2(c[1].x)} ${f2(c[1].y)} ${f2(c[2].x)} ${f2(c[2].y)} ${f2(c[3].x)} ${f2(c[3].y)}`;
        }
      }
      run = [];
    };
    order.forEach((s, i) => {
      run.push(s);
      if (brk[i]) flush();
    });
    flush();
    if (sp.closed) out += "Z";
  }
  return out;
}
