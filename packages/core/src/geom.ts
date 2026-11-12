// Exact geometry on parsed path segments: evaluate, split, cut, transform, serialise.
// Browser-safe (no deps) so the docs site can use it too.

import { parsePath, type Pt, type Seg, type Subpath } from "./path.js";

export type Run = Seg[]; // a continuous open (or closed) stroke

export function pointAt(s: Seg, t: number): Pt {
  if (s.kind === "L") return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
  const u = 1 - t;
  return {
    x: u * u * u * s.a.x + 3 * u * u * t * s.c1.x + 3 * u * t * t * s.c2.x + t * t * t * s.b.x,
    y: u * u * u * s.a.y + 3 * u * u * t * s.c1.y + 3 * u * t * t * s.c2.y + t * t * t * s.b.y,
  };
}

const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** The part of a segment between t0 and t1 (exact for lines and cubics). */
export function subSeg(s: Seg, t0: number, t1: number): Seg {
  if (s.kind === "L") return { kind: "L", a: pointAt(s, t0), b: pointAt(s, t1) };
  // Split at t1, then split the left part at t0/t1.
  const splitAt = (c: Extract<Seg, { kind: "C" }>, t: number) => {
    const p01 = lerp(c.a, c.c1, t);
    const p12 = lerp(c.c1, c.c2, t);
    const p23 = lerp(c.c2, c.b, t);
    const p012 = lerp(p01, p12, t);
    const p123 = lerp(p12, p23, t);
    const m = lerp(p012, p123, t);
    return [
      { kind: "C" as const, a: c.a, c1: p01, c2: p012, b: m },
      { kind: "C" as const, a: m, c1: p123, c2: p23, b: c.b },
    ];
  };
  let left = t1 >= 1 ? s : splitAt(s, t1)[0]!;
  if (t0 <= 0) return left;
  return splitAt(left, t0 / t1)[1]!;
}

export function segLength(s: Seg, steps = 12): number {
  let l = 0;
  let prev = s.a;
  for (let i = 1; i <= steps; i++) {
    const p = pointAt(s, i / steps);
    l += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return l;
}

export const runLength = (r: Run) => r.reduce((a, s) => a + segLength(s), 0);

/**
 * Remove every part of the subpaths for which `inside(p)` is true.
 * Returns the surviving pieces as runs; pieces shorter than `minLen` are dropped.
 */
export function cut(subs: Subpath[], inside: (p: Pt) => boolean, minLen = 0.45): { runs: Run[]; closed: boolean[] } {
  const runs: Run[] = [];
  const closed: boolean[] = [];
  for (const sp of subs) {
    if (sp.segs.length === 0) {
      // A dot (zero-length subpath): keep it unless it is inside.
      if (!inside(sp.start)) {
        runs.push([{ kind: "L", a: sp.start, b: { x: sp.start.x + 0.01, y: sp.start.y } }]);
        closed.push(false);
      }
      continue;
    }
    const pieces: Run[] = [];
    let cur: Run = [];
    let untouched = true;
    for (const seg of sp.segs) {
      const N = 32;
      const ts: number[] = [0];
      let prevIn = inside(pointAt(seg, 0));
      for (let i = 1; i <= N; i++) {
        const t = i / N;
        const nowIn = inside(pointAt(seg, t));
        if (nowIn !== prevIn) {
          let lo = (i - 1) / N;
          let hi = t;
          for (let k = 0; k < 24; k++) {
            const mid = (lo + hi) / 2;
            if (inside(pointAt(seg, mid)) === prevIn) lo = mid;
            else hi = mid;
          }
          ts.push((lo + hi) / 2);
          untouched = false;
        }
        prevIn = nowIn;
      }
      ts.push(1);
      for (let i = 0; i + 1 < ts.length; i++) {
        const t0 = ts[i]!;
        const t1 = ts[i + 1]!;
        if (t1 - t0 < 1e-6) continue;
        const midIn = inside(pointAt(seg, (t0 + t1) / 2));
        if (midIn) {
          untouched = false;
          if (cur.length) pieces.push(cur);
          cur = [];
        } else {
          cur.push(t0 === 0 && t1 === 1 ? seg : subSeg(seg, t0, t1));
        }
      }
    }
    if (cur.length) pieces.push(cur);
    if (untouched && pieces.length === 1) {
      runs.push(pieces[0]!);
      closed.push(sp.closed);
      continue;
    }
    // A cut closed loop: if the last piece ends where the first begins, join them.
    if (sp.closed && pieces.length > 1) {
      const first = pieces[0]!;
      const last = pieces[pieces.length - 1]!;
      const a = last[last.length - 1]!.b;
      const b = first[0]!.a;
      if (Math.hypot(a.x - b.x, a.y - b.y) < 1e-6) {
        pieces[0] = [...last, ...first];
        pieces.pop();
      }
    }
    for (const p of pieces) {
      if (runLength(p) >= minLen) {
        runs.push(p);
        closed.push(false);
      }
    }
  }
  return { runs, closed };
}

const fmt = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? "0" : String(r);
};

/** Serialise runs as compact absolute path data. */
export function runsToD(runs: Run[], closed?: boolean[]): string {
  let d = "";
  runs.forEach((run, i) => {
    if (!run.length) return;
    let p = run[0]!.a;
    d += `M${fmt(p.x)} ${fmt(p.y)}`;
    for (const s of run) {
      if (s.kind === "L") d += `L${fmt(s.b.x)} ${fmt(s.b.y)}`;
      else d += `C${fmt(s.c1.x)} ${fmt(s.c1.y)} ${fmt(s.c2.x)} ${fmt(s.c2.y)} ${fmt(s.b.x)} ${fmt(s.b.y)}`;
      p = s.b;
    }
    if (closed?.[i]) d += "Z";
  });
  return d;
}

export function transformD(d: string, f: (p: Pt) => Pt): string {
  const subs = parsePath(d);
  return runsToD(
    subs.map((sp) =>
      sp.segs.length
        ? sp.segs.map((s): Seg =>
            s.kind === "L"
              ? { kind: "L", a: f(s.a), b: f(s.b) }
              : { kind: "C", a: f(s.a), c1: f(s.c1), c2: f(s.c2), b: f(s.b) },
          )
        : [{ kind: "L", a: f(sp.start), b: f({ x: sp.start.x + 0.01, y: sp.start.y }) }],
    ),
    subs.map((s) => s.closed),
  );
}

export const scaleAbout = (cx: number, cy: number, k: number) => (p: Pt): Pt => ({
  x: cx + (p.x - cx) * k,
  y: cy + (p.y - cy) * k,
});

/** Distance from p to segment ab. */
export function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

/** Sample points along all subpaths of `d` (for containment tests, bounds). */
export function samplePoints(d: string, perSeg = 8): Pt[] {
  const pts: Pt[] = [];
  for (const sp of parsePath(d)) {
    pts.push(sp.start);
    for (const s of sp.segs) for (let i = 1; i <= perSeg; i++) pts.push(pointAt(s, i / perSeg));
  }
  return pts;
}

/** Flatten closed subpaths of `d` into polygons. */
export function polygons(d: string, perSeg = 10): Pt[][] {
  return parsePath(d)
    .filter((sp) => sp.closed && sp.segs.length)
    .map((sp) => {
      const poly: Pt[] = [sp.start];
      for (const s of sp.segs) for (let i = 1; i <= perSeg; i++) poly.push(pointAt(s, i / perSeg));
      return poly;
    });
}

export function pointInPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function polygonArea(poly: Pt[]): number {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) s += (poly[j]!.x + poly[i]!.x) * (poly[j]!.y - poly[i]!.y);
  return Math.abs(s / 2);
}

// ---------------------------------------------------------------------------
// Open loop — the DevX signature. Every closed outline opens at 1 o'clock.

/** Direction of the opening from a shape's centre: 1 o'clock (30° right of up). */
export const LOOP_DIR: Pt = { x: 0.5, y: -Math.sqrt(3) / 2 };
/** Shapes shorter than this (perimeter) stay closed: dots, keyholes, tiny rings. */
export const LOOP_MIN_PERIMETER = 14;

export interface LoopGap {
  seg: number;
  t: number;
  p: Pt;
  /** Outward unit normal at p. */
  n: Pt;
  perimeter: number;
}

const unit = (v: Pt): Pt => {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
};

function tangentAt(s: Seg, t: number): Pt {
  const e = 1e-3;
  const a = pointAt(s, Math.max(0, t - e));
  const b = pointAt(s, Math.min(1, t + e));
  return unit({ x: b.x - a.x, y: b.y - a.y });
}

/** Where a closed subpath opens: the outline point facing 1 o'clock from its centre. */
export function loopGap(sp: Subpath): LoopGap | null {
  if (!sp.closed || !sp.segs.length) return null;
  const N = 24;
  const pts: { seg: number; t: number; p: Pt }[] = [];
  let perimeter = 0;
  sp.segs.forEach((s, i) => {
    perimeter += segLength(s);
    for (let k = 0; k < N; k++) pts.push({ seg: i, t: k / N, p: pointAt(s, k / N) });
  });
  if (perimeter < LOOP_MIN_PERIMETER) return null;
  const c = pts.reduce((a, q) => ({ x: a.x + q.p.x / pts.length, y: a.y + q.p.y / pts.length }), { x: 0, y: 0 });
  // Score: alignment with the 1 o'clock ray, then distance from the centre (outermost wins).
  const score = (p: Pt) => {
    const v = { x: p.x - c.x, y: p.y - c.y };
    const d = Math.hypot(v.x, v.y) || 1;
    return (v.x * LOOP_DIR.x + v.y * LOOP_DIR.y) / d + d * 1e-3;
  };
  let best = pts[0]!;
  for (const q of pts) if (score(q.p) > score(best.p)) best = q;
  // Refine t locally (golden-section on the score).
  const s = sp.segs[best.seg]!;
  let lo = Math.max(0, best.t - 1 / N);
  let hi = Math.min(1, best.t + 1 / N);
  for (let k = 0; k < 30; k++) {
    const m1 = lo + (hi - lo) * 0.382;
    const m2 = lo + (hi - lo) * 0.618;
    if (score(pointAt(s, m1)) < score(pointAt(s, m2))) lo = m1;
    else hi = m2;
  }
  const t = (lo + hi) / 2;
  const p = pointAt(s, t);
  const tan = tangentAt(s, t);
  let n: Pt = { x: tan.y, y: -tan.x };
  if (n.x * (p.x - c.x) + n.y * (p.y - c.y) < 0) n = { x: -n.x, y: -n.y };
  return { seg: best.seg, t, p, n, perimeter };
}

/** Cut the first `len` units of arc length off a run (or the last, with fromEnd). */
function trimRun(run: Run, len: number, fromEnd: boolean): Run {
  const segs = fromEnd ? [...run].reverse() : [...run];
  let left = len;
  while (segs.length) {
    const s = segs[0]!;
    const l = segLength(s, 16);
    if (l > left) {
      // binary search t so that the trimmed part has length `left`
      let a = 0;
      let b = 1;
      for (let k = 0; k < 30; k++) {
        const m = (a + b) / 2;
        const part = fromEnd ? segLength(subSeg(s, 1 - m, 1), 16) : segLength(subSeg(s, 0, m), 16);
        if (part < left) a = m;
        else b = m;
      }
      const t = (a + b) / 2;
      segs[0] = fromEnd ? subSeg(s, 0, 1 - t) : subSeg(s, t, 1);
      break;
    }
    left -= l;
    segs.shift();
  }
  return fromEnd ? segs.reverse() : segs;
}

/** Open every sufficiently large closed subpath of `d` at 1 o'clock, removing `gap` units. */
export function openLoopD(d: string, gap: number): string {
  const runs: Run[] = [];
  const closed: boolean[] = [];
  for (const sp of parsePath(d)) {
    if (!sp.segs.length) {
      runs.push([{ kind: "L", a: sp.start, b: { x: sp.start.x + 0.01, y: sp.start.y } }]);
      closed.push(false);
      continue;
    }
    const g = loopGap(sp);
    if (!g) {
      runs.push(sp.segs);
      closed.push(sp.closed);
      continue;
    }
    const s = sp.segs[g.seg]!;
    const head = g.t > 1e-6 ? [subSeg(s, 0, g.t)] : [];
    const tail = g.t < 1 - 1e-6 ? [subSeg(s, g.t, 1)] : [];
    // Loop starting and ending at the gap point.
    let run: Run = [...tail, ...sp.segs.slice(g.seg + 1), ...sp.segs.slice(0, g.seg), ...head];
    const half = Math.min(gap, g.perimeter * 0.2) / 2;
    run = trimRun(trimRun(run, half, false), half, true);
    runs.push(run);
    closed.push(false);
  }
  return runsToD(runs, closed);
}
