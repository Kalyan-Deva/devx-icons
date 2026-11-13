// Checks on generated geometry (replaces the old per-file lint).
import { samplePoints } from "../../packages/core/src/geom.ts";
import type { SolidPart } from "../../packages/core/src/render.ts";
import type { IconDef } from "../../packages/core/src/variants.ts";

const SAFE_LINE = { min: 1.5, max: 22.5 }; // stroke centrelines
const SAFE_SOLID = { min: 0.5, max: 23.5 }; // filled outlines (edge = centreline ± half stroke)

export function validateIcon(icon: IconDef, solid: SolidPart[]): string[] {
  const out: string[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(icon.name)) out.push("name must be kebab-case");
  if (!icon.parts.length) out.push("line: empty");
  if (!icon.tags.length) out.push("no tags");
  const accents = icon.parts.filter((p) => p.role !== "line").length;
  if (!accents && icon.parts.length > 1) out.push("line: no accent element (every multi-part DevX icon has one)");
  const check = (d: string, box: { min: number; max: number }, what: string) => {
    if (/NaN|undefined|Infinity/.test(d)) return out.push(`${what}: bad number`);
    for (const p of samplePoints(d, 4)) {
      if (p.x < box.min || p.x > box.max || p.y < box.min || p.y > box.max) {
        out.push(`${what}: leaves safe area at ${p.x.toFixed(2)},${p.y.toFixed(2)}`);
        return;
      }
    }
  };
  for (const p of icon.parts) check(p.d, SAFE_LINE, "line");
  if (!solid.some((p) => p.d && !p.accent)) out.push("solid: empty body");
  for (const p of solid) if (p.d) check(p.d, SAFE_SOLID, "solid");
  return out;
}
