// Shared helpers for icon source files.
export * from "../packages/core/src/dsl.ts";
import { part, type ShapeInput } from "../packages/core/src/dsl.ts";
import { VARIANT_IDS, type BaseIcon } from "../packages/core/src/variants.ts";

export const ALL = VARIANT_IDS;
/** Status-style variants (no off/dot), for things that are already badges or tiny. */
export const SOME = ["plus", "minus", "check", "x", "alert", "lock", "search", "bolt"];
export const NONE: string[] = [];

type Opts = { v?: string[]; sf?: string[] };
export type Entry = [name: string, tags: string, shapes: ShapeInput[], opts?: Opts];

export function define(category: string, variants: string[], entries: Entry[]): BaseIcon[] {
  return entries.map(([name, tags, shapes, opts]) => ({
    name,
    category,
    tags: tags.split(/\s*,\s*|\s+/).filter(Boolean),
    parts: shapes.map(part),
    variants: opts?.v ?? variants,
    solidFill: opts?.sf,
  }));
}

import { mapShape, rot, flipX, flipY } from "../packages/core/src/dsl.ts";
type Opts2 = { v?: string[]; sf?: string[] };

/** Four rotations of a right-pointing design: name-right, -down, -left, -up. */
export function dirs(name: string, tags: string, shapes: ShapeInput[], opts?: Opts2): Entry[] {
  const turns: [string, number][] = [["right", 0], ["down", 90], ["left", 180], ["up", 270]];
  return turns.map(([dir, deg]) => [
    `${name}-${dir}`,
    `${tags} ${dir}`,
    shapes.map((s) => mapShape(s, (d) => rot(d, deg))),
    opts ? { ...opts, sf: opts.sf?.map((d) => rot(d, deg)) } : undefined,
  ]);
}

/** Mirror an entry horizontally (or vertically). */
export function mirror(e: Entry, name: string, tags: string, axis: "x" | "y" = "x"): Entry {
  const f = axis === "x" ? flipX : flipY;
  return [name, tags, e[2].map((s) => mapShape(s, f)), e[3] ? { ...e[3], sf: e[3].sf?.map(f) } : undefined];
}
