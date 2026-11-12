// Skia PathKit (WASM) for exact stroke outlining and boolean ops. Node only.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fitD } from "./fit.ts";

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PK = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SkPath = any;

let pk: PK | null = null;

export async function pathkit(): Promise<PK> {
  if (pk) return pk;
  const init = require("pathkit-wasm/bin/pathkit.js");
  pk = await init({ wasmBinary: readFileSync(require.resolve("pathkit-wasm/bin/pathkit.wasm")) });
  return pk;
}

export function fromD(PK: PK, d: string): SkPath {
  const p = PK.FromSVGString(d);
  if (!p) throw new Error(`PathKit could not parse: ${d.slice(0, 80)}`);
  return p;
}

export function strokeOf(PK: PK, d: string, width: number): SkPath {
  const p = fromD(PK, d);
  p.stroke({ width, cap: PK.StrokeCap.ROUND, join: PK.StrokeJoin.ROUND, miter_limit: 4 });
  return p;
}

export function empty(PK: PK): SkPath {
  return PK.NewPath();
}

/**
 * Normalise before every boolean: results of earlier ops can carry fill-type
 * state that makes later ops silently return nothing (seen on flame-off).
 */
function norm(p: SkPath): SkPath {
  return p.copy().simplify();
}

export function union(PK: PK, paths: SkPath[]): SkPath {
  let acc = empty(PK);
  for (const p of paths) {
    const next = norm(acc).op(norm(p), PK.PathOp.UNION);
    if (next) acc = next;
  }
  return acc;
}

export function diff(PK: PK, a: SkPath, b: SkPath): SkPath {
  return norm(a).op(norm(b), PK.PathOp.DIFFERENCE) ?? a;
}

export function inter(PK: PK, a: SkPath, b: SkPath): SkPath {
  return norm(a).op(norm(b), PK.PathOp.INTERSECT) ?? empty(PK);
}

/** Simplified, curve-fitted, rounded SVG path data. */
export function toD(p: SkPath, digits = 2): string {
  return fitD(toRawD(p, 4), 0.03);
}

/** Simplified path data straight from Skia (many tiny quads), rounded. */
export function toRawD(p: SkPath, digits = 2): string {
  const s = p.copy().simplify();
  const k = 10 ** digits;
  return s
    .toSVGString()
    .replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (m: string) => {
      const r = Math.round(Number(m) * k) / k;
      return Object.is(r, -0) ? "0" : String(r);
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmpty(p: SkPath): boolean {
  const b = p.computeTightBounds();
  return !b || b.fRight - b.fLeft < 0.01 || b.fBottom - b.fTop < 0.01;
}
