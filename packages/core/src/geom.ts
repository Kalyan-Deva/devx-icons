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
