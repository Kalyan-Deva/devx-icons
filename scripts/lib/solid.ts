// Solid style, derived from line geometry:
//   bodies (outermost closed shapes) are filled,
//   inner details become knock-out lines,
//   outside details are added as strokes,
//   the accent sits in its own gap ring,
//   variant badges cut a gap into the solid base.

import { parsePath } from "../../packages/core/src/path.ts";
import { loopGap, polygonArea, polygons, pointInPolygon, runsToD, samplePoints, scaleAbout, transformD } from "../../packages/core/src/geom.ts";
import { C } from "../../packages/core/src/dsl.ts";
import type { Part } from "../../packages/core/src/dsl.ts";
import type { SolidPart } from "../../packages/core/src/render.ts";
import { GAP, LOOP_GAP, STROKE, variantById } from "../../packages/core/src/variants.ts";
import { diff, empty, fromD, isEmpty, strokeOf, toD, union, type PK, type SkPath } from "./pathkit.ts";

const KNOCK = 1.5; // knock-out line width inside filled bodies
const BOLD = 2.25; // width used when an icon has no fillable body
const DISC_R = 4.5;
const NOTCH_DEPTH = 2.25; // how far the open-loop notch cuts into a solid body

interface Sub {
  d: string;
  closed: boolean;
}

function subpaths(d: string): Sub[] {
  return parsePath(d).map((sp) => ({
    d: sp.segs.length ? runsToD([sp.segs], [sp.closed]) : `M${sp.start.x} ${sp.start.y}h.01`,
    closed: sp.closed && sp.segs.length > 0,
  }));
}

/** Solid geometry for a base icon (accents kept as accents unless demoted). */
export function solidBase(PK: PK, parts: Part[], solidFill: string[] = [], demoteAccent = false): { body: SkPath; accent: SkPath } {
  const lines: Sub[] = [];
  const accents: Part[] = [];
  for (const p of parts) {
    if (p.role !== "line" && !demoteAccent) accents.push(p);
    else if (p.role === "accent-fill") lines.push({ d: p.d, closed: true });
    else lines.push(...subpaths(p.d));
  }

  // Candidate bodies: closed subpaths with real area, plus explicit solid fills.
  const closed = [
    ...lines.filter((s) => s.closed).map((s) => ({ s, poly: polygons(s.d)[0]!, explicit: false })),
    ...solidFill.flatMap((d) => polygons(d).map((poly) => ({ s: { d, closed: true }, poly, explicit: true }))),
  ].filter((c) => c.poly && polygonArea(c.poly) > 3);

  const containedBy = (inner: (typeof closed)[number], outer: (typeof closed)[number]) =>
    inner !== outer && samplePoints(inner.s.d, 4).every((p) => pointInPolygon(p, outer.poly)) && polygonArea(outer.poly) > polygonArea(inner.poly);

  const depth = (c: (typeof closed)[number]) => closed.filter((o) => containedBy(c, o)).length;

  const bodies: SkPath[] = [];
  const holes: SkPath[] = [];
  const knock: string[] = [];
  const used = new Set<Sub>();
  for (const c of closed) {
    const dep = depth(c);
    if (dep % 2 === 0) {
      bodies.push(fromD(PK, c.s.d));
      used.add(c.s);
    } else {
      const parent = closed.find((o) => containedBy(c, o));
      const small = parent && polygonArea(c.poly) < 0.3 * polygonArea(parent.poly);
      if (small && !c.explicit) holes.push(fromD(PK, c.s.d));
      else if (!c.explicit) knock.push(c.s.d);
      used.add(c.s);
    }
  }

  const bodyPolys = closed.filter((c) => depth(c) % 2 === 0).map((c) => c.poly);
  const insideBody = (d: string) => {
    const pts = samplePoints(d, 6);
    if (!bodyPolys.length) return 0;
    return pts.filter((p) => bodyPolys.some((poly) => pointInPolygon(p, poly))).length / pts.length;
  };

  const additive: SkPath[] = [];
  for (const s of lines) {
    if (used.has(s)) continue;
    // an explicit solid fill replaces the outline that traces it
    if (insideBody(s.d) > 0.6) knock.push(s.d);
    else additive.push(strokeOf(PK, s.d, bodies.length ? STROKE : BOLD));
  }
  // Explicit-fill icons: outlines of the drawn shapes that lie on the fill edge are already covered.

  let body: SkPath;
  if (bodies.length) {
    body = diff(PK, union(PK, bodies), union(PK, holes));
    if (knock.length) body = diff(PK, body, union(PK, knock.map((d) => strokeOf(PK, d, KNOCK))));
    body = union(PK, [body, ...additive]);
  } else {
    body = union(PK, [...additive, ...knock.map((d) => strokeOf(PK, d, BOLD))]);
  }

  // Open loop, solid edition: a notch at 1 o'clock into each body, where the line style opens.
  // With explicit silhouettes, only those get notched (the drawn outlines sit on their edge).
  const hasExplicit = closed.some((c) => c.explicit);
  const notches = closed
    .filter((c) => depth(c) % 2 === 0 && (!hasExplicit || c.explicit))
    .flatMap((c) => {
      const g = loopGap(parsePath(c.s.d)[0]!);
      if (!g) return [];
      const out = { x: g.p.x + g.n.x * 1.5, y: g.p.y + g.n.y * 1.5 };
      const inn = { x: g.p.x - g.n.x * NOTCH_DEPTH, y: g.p.y - g.n.y * NOTCH_DEPTH };
      return [strokeOf(PK, `M${out.x} ${out.y}L${inn.x} ${inn.y}`, LOOP_GAP)];
    });
  if (notches.length) body = diff(PK, body, union(PK, notches));

  // Accent: its own outline, with a gap ring cut out of the body around it.
  let accent = empty(PK);
  if (accents.length) {
    const outlines = accents.map((p) => (p.role === "accent-fill" ? fromD(PK, p.d) : strokeOf(PK, p.d, STROKE)));
    accent = union(PK, outlines);
    const ring = union(
      PK,
      accents.map((p) =>
        p.role === "accent-fill"
          ? union(PK, [fromD(PK, p.d), strokeOf(PK, p.d, GAP * 2)])
          : strokeOf(PK, p.d, STROKE + GAP * 2),
      ),
    );
    body = diff(PK, body, ring);
  }
  return { body, accent };
}

/** Full solid icon: base solid, optionally cut by a variant badge. */
export function solidIcon(PK: PK, baseParts: Part[], variant: string | null, solidFill: string[] = []): SolidPart[] {
  if (!variant) {
    const { body, accent } = solidBase(PK, baseParts, solidFill);
    return [
      { d: toD(body), accent: false },
      ...(isEmpty(accent) ? [] : [{ d: toD(accent), accent: true }]),
    ];
  }
  const v = variantById.get(variant)!;
  const { body } = solidBase(PK, baseParts, solidFill, true);
  let cutBody: SkPath;
  let badge: SkPath;
  if (v.solid === "disc" && v.zone.kind === "circle") {
    cutBody = diff(PK, body, fromD(PK, C(v.zone.cx, v.zone.cy, DISC_R + GAP)));
    const glyph = union(
      PK,
      v.parts.map((p) => strokeOf(PK, transformD(p.d, scaleAbout(18, 18, 0.72)), 1.4)),
    );
    badge = diff(PK, fromD(PK, C(v.zone.cx, v.zone.cy, DISC_R)), glyph);
  } else if (v.zone.kind === "band") {
    const z = v.zone;
    cutBody = diff(PK, body, strokeOf(PK, `M${z.a.x} ${z.a.y}L${z.b.x} ${z.b.y}`, STROKE + GAP * 2));
    badge = union(PK, v.parts.map((p) => strokeOf(PK, p.d, STROKE)));
  } else {
    const z = v.zone as { cx: number; cy: number; r: number };
    const dotR = z.r + STROKE / 2;
    cutBody = diff(PK, body, fromD(PK, C(z.cx, z.cy, dotR + GAP)));
    badge = fromD(PK, C(z.cx, z.cy, dotR));
  }
  return [
    { d: toD(cutBody), accent: false },
    { d: toD(badge), accent: true },
  ];
}

/** Single-colour outline for the icon font (line style). */
export function lineGlyph(PK: PK, parts: Part[]): string {
  return toD(
    union(
      PK,
      parts.map((p) => (p.role === "accent-fill" ? fromD(PK, p.d) : strokeOf(PK, p.d, STROKE))),
    ),
  );
}

export function solidGlyph(PK: PK, parts: SolidPart[]): string {
  return toD(union(PK, parts.filter((p) => p.d).map((p) => fromD(PK, p.d))));
}

export { empty };
