// Tiny drawing DSL for base icons. Every helper returns SVG path data in the
// 24×24 grid; `a()` / `af()` mark the icon's accent element.

import { shapeToD } from "./svg.js";

export type Role = "line" | "accent" | "accent-fill";
export interface Part {
  d: string;
  role: Role;
}
export type ShapeInput = string | Part;

const num = (v: number) => String(v);

/** Circle. */
export const C = (cx: number, cy: number, r: number) =>
  shapeToD({ tag: "circle", attrs: { cx: num(cx), cy: num(cy), r: num(r) } });
/** Ellipse. */
export const E = (cx: number, cy: number, rx: number, ry: number) =>
  shapeToD({ tag: "ellipse", attrs: { cx: num(cx), cy: num(cy), rx: num(rx), ry: num(ry) } });
/** Rectangle with optional corner radius. */
export const R = (x: number, y: number, w: number, h: number, r = 0) =>
  shapeToD({ tag: "rect", attrs: { x: num(x), y: num(y), width: num(w), height: num(h), rx: num(r) } });
/** Open polyline through x,y pairs. */
export const P = (...xy: number[]) => shapeToD({ tag: "polyline", attrs: { points: xy.join(" ") } });
/** Closed polygon through x,y pairs. */
export const G = (...xy: number[]) => shapeToD({ tag: "polygon", attrs: { points: xy.join(" ") } });
/** A dot (rendered by the round cap). */
export const D = (x: number, y: number) => `M${x} ${y}h.01`;

/** Mark as the accent element (stroked in the accent colour). */
export const a = (d: string): Part => ({ d, role: "accent" });
/** Mark as a filled accent element (e.g. a solid dot). */
export const af = (d: string): Part => ({ d, role: "accent-fill" });

export const part = (s: ShapeInput): Part => (typeof s === "string" ? { d: s, role: "line" } : s);

/** A regular star / burst polygon. */
export function star(cx: number, cy: number, outer: number, inner: number, points = 5, rot = -90): string {
  const xy: number[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const ang = ((rot + (i * 180) / points) * Math.PI) / 180;
    xy.push(Math.round((cx + r * Math.cos(ang)) * 100) / 100, Math.round((cy + r * Math.sin(ang)) * 100) / 100);
  }
  return G(...xy);
}

/** Regular polygon (hexagon etc.). */
export function ngon(cx: number, cy: number, r: number, sides: number, rot = -90): string {
  const xy: number[] = [];
  for (let i = 0; i < sides; i++) {
    const ang = ((rot + (i * 360) / sides) * Math.PI) / 180;
    xy.push(Math.round((cx + r * Math.cos(ang)) * 100) / 100, Math.round((cy + r * Math.sin(ang)) * 100) / 100);
  }
  return G(...xy);
}

/** Arc from angle a0 to a1 (degrees, 0 = right, clockwise) as path data. */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (deg: number) => {
    const t = (deg * Math.PI) / 180;
    return `${Math.round((cx + r * Math.cos(t)) * 100) / 100} ${Math.round((cy + r * Math.sin(t)) * 100) / 100}`;
  };
  const sweep = a1 > a0 ? 1 : 0;
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${p(a0)}A${r} ${r} 0 ${large} ${sweep} ${p(a1)}`;
}

/** Corner brackets (scan frame) inset by `m` with bracket length `l`. */
export function brackets(m = 3.5, l = 4.5, r = 3): string {
  const n = 24 - m;
  return (
    `M${m} ${m + l}V${m + r}a${r} ${r} 0 0 1 ${r}-${r}H${m + l}` +
    `M${n - l} ${m}H${n - r}a${r} ${r} 0 0 1 ${r} ${r}V${m + l}` +
    `M${n} ${n - l}V${n - r}a${r} ${r} 0 0 1-${r} ${r}H${n - l}` +
    `M${m + l} ${n}H${m + r}a${r} ${r} 0 0 1-${r}-${r}V${n - l}`
  );
}

import { transformD } from "./geom.js";

const round2 = (v: number) => Math.round(v * 1000) / 1000;
/** Rotate path data about the icon centre (degrees, clockwise). */
export function rot(d: string, deg: number): string {
  if (deg % 360 === 0) return d;
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  return transformD(d, (p) => ({ x: round2(12 + (p.x - 12) * c - (p.y - 12) * s), y: round2(12 + (p.x - 12) * s + (p.y - 12) * c) }));
}
export const flipX = (d: string) => transformD(d, (p) => ({ x: 24 - p.x, y: p.y }));
export const flipY = (d: string) => transformD(d, (p) => ({ x: p.x, y: 24 - p.y }));

/** Apply a path transform to a shape, keeping its role. */
export function mapShape(s: ShapeInput, f: (d: string) => string): ShapeInput {
  return typeof s === "string" ? f(s) : { ...s, d: f(s.d) };
}
