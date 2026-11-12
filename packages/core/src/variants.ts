// Variant badges. A badge is drawn in the accent colour and cuts a clean gap
// (GAP) into the base icon — the DevX "open gap" signature, applied by rule.

import { parsePath, type Pt } from "./path.js";
import { cut, distToSegment, runsToD } from "./geom.js";
import { C, G, R, star, type Part } from "./dsl.js";

export const STROKE = 1.75;
export const GAP = 1.25; // visible gap between a badge and the base, edge to edge

export type CutShape =
  | { kind: "circle"; cx: number; cy: number; r: number } // r = badge extent (glyph edge from centre)
  | { kind: "band"; a: Pt; b: Pt }; // slash line

export interface VariantDef {
  id: string;
  label: string;
  /** Badge parts in line style (accent). */
  parts: Part[];
  /** Region the badge occupies; the base is cut around it. */
  zone: CutShape;
  /** Solid style: "disc" = filled accent disc with the glyph knocked out; "same" = reuse parts. */
  solid: "disc" | "same";
}

const BC = 18; // badge centre
const ac = (d: string): Part => ({ d, role: "accent" });

export const VARIANTS: VariantDef[] = [
  { id: "plus", label: "Add", parts: [ac("M18 15v6M15 18h6")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "minus", label: "Remove", parts: [ac("M15 18h6")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "check", label: "Done", parts: [ac("M15 18l2 2 4-4")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "x", label: "Close", parts: [ac("M15.5 15.5l5 5M20.5 15.5l-5 5")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "alert", label: "Warning", parts: [ac("M18 15v3.25M18 21h.01")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "clock", label: "Pending", parts: [ac(C(18, 18, 3.25)), ac("M18 16.5V18l1 .75")], zone: { kind: "circle", cx: BC, cy: BC, r: 3.25 }, solid: "disc" },
  {
    id: "lock",
    label: "Locked",
    parts: [ac(R(15, 17.25, 6, 4.25, 1)), ac("M16.25 17.25V16a1.75 1.75 0 0 1 3.5 0v1.25")],
    zone: { kind: "circle", cx: BC, cy: BC, r: 3.5 },
    solid: "disc",
  },
  { id: "search", label: "Find", parts: [ac(C(17.5, 17.5, 2.5)), ac("M19.5 19.5l1.75 1.75")], zone: { kind: "circle", cx: BC, cy: BC, r: 3.25 }, solid: "disc" },
  { id: "star", label: "Favourite", parts: [ac(star(18, 18.2, 3.4, 1.6))], zone: { kind: "circle", cx: BC, cy: BC, r: 3.4 }, solid: "disc" },
  {
    id: "heart",
    label: "Love",
    parts: [ac("M18 21s-3.25-1.9-3.25-4.25a1.75 1.75 0 0 1 3.25-.9 1.75 1.75 0 0 1 3.25.9C21.25 19.1 18 21 18 21z")],
    zone: { kind: "circle", cx: BC, cy: BC, r: 3.4 },
    solid: "disc",
  },
  { id: "upload", label: "Upload", parts: [ac("M18 21v-6M15.5 17.5 18 15l2.5 2.5")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "download", label: "Download", parts: [ac("M18 15v6M15.5 18.5 18 21l2.5-2.5")], zone: { kind: "circle", cx: BC, cy: BC, r: 3 }, solid: "disc" },
  { id: "edit", label: "Edit", parts: [ac("M19.6 14.9a1.06 1.06 0 0 1 1.5 1.5L17 20.5l-2 .5.5-2z")], zone: { kind: "circle", cx: BC, cy: BC, r: 3.25 }, solid: "disc" },
  { id: "bolt", label: "Quick", parts: [ac("M18.75 14.75 15.75 18.5h4.5l-3 3.75")], zone: { kind: "circle", cx: BC, cy: BC, r: 3.25 }, solid: "disc" },
  { id: "off", label: "Off", parts: [ac("M3 3l18 18")], zone: { kind: "band", a: { x: 3, y: 3 }, b: { x: 21, y: 21 } }, solid: "same" },
  { id: "dot", label: "New", parts: [{ d: C(18.5, 5.5, 2.5), role: "accent-fill" }], zone: { kind: "circle", cx: 18.5, cy: 5.5, r: 2.5 - STROKE / 2 }, solid: "same" },
];

export const VARIANT_IDS = VARIANTS.map((v) => v.id);
export const variantById = new Map(VARIANTS.map((v) => [v.id, v]));

/** Is p inside the cut region for a line-style base (centreline test)? */
export function lineCutTest(zone: CutShape): (p: Pt) => boolean {
  // base centreline must stay GAP + both half-strokes away from the badge glyph edge
  const clear = GAP + STROKE;
  if (zone.kind === "circle") {
    const R2 = zone.r + clear;
    return (p) => Math.hypot(p.x - zone.cx, p.y - zone.cy) < R2;
  }
  return (p) => distToSegment(p, zone.a, zone.b) < clear;
}

/** Cut base parts around a variant's zone (line style). Base accents become plain lines. */
export function applyVariantLine(base: Part[], v: VariantDef): Part[] {
  const inside = lineCutTest(v.zone);
  const out: Part[] = [];
  for (const p of base) {
    const { runs, closed } = cut(parsePath(p.d), inside);
    if (!runs.length) continue;
    out.push({ d: runsToD(runs, closed), role: "line" });
  }
  return [...out, ...v.parts];
}

export interface BaseIcon {
  name: string;
  category: string;
  tags: string[];
  parts: Part[];
  variants: string[];
  /** Extra closed silhouettes used only by the solid style. */
  solidFill?: string[];
}

export interface IconDef {
  name: string;
  base: string;
  variant: string | null;
  category: string;
  tags: string[];
  /** Line-style geometry, already cut. */
  parts: Part[];
  /** Uncut base geometry + solid silhouettes (for the solid style). */
  baseParts: Part[];
  solidFill: string[];
}

export function expand(bases: BaseIcon[]): IconDef[] {
  const out: IconDef[] = [];
  const seen = new Set<string>();
  const push = (d: IconDef) => {
    if (seen.has(d.name)) throw new Error(`duplicate icon name: ${d.name}`);
    seen.add(d.name);
    out.push(d);
  };
  for (const b of bases) {
    const common = { baseParts: b.parts, solidFill: b.solidFill ?? [] };
    push({ name: b.name, base: b.name, variant: null, category: b.category, tags: b.tags, parts: b.parts, ...common });
    for (const id of b.variants) {
      const v = variantById.get(id);
      if (!v) throw new Error(`${b.name}: unknown variant ${id}`);
      push({
        name: `${b.name}-${id}`,
        base: b.name,
        variant: id,
        category: b.category,
        tags: [...b.tags, id, v.label.toLowerCase()],
        parts: applyVariantLine(b.parts, v),
        ...common,
      });
    }
  }
  return out;
}
