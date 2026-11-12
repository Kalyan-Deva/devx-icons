# DevX Icons — design

Date: 2026-11-09, revised 2026-11-12 (full pack)
Status: v1.0.0 built — 6,354 icons, all formats packed in release/, not published

## History

1. 2026-11-09: cozy hand-drawn set via a seeded "wobble" generator — rejected as
   unprofessional at UI sizes.
2. Three professional directions (line / duotone / solid) — line chosen.
3. 2026-11-12: references (Hugeicons-like) set the details; then the brief "4000+ icons,
   categorised, finish the whole pack, all formats, no questions" with three choices:
   - signature = **accent element** (second colour via `--devx-accent`)
   - styles = **line + solid**
   - formats = **SVG + sprite, icon font, React, PNG + ICO**

## House style

- 24×24 grid, 2px padding (stroke centrelines within 1.5–22.5), stroke 1.75, round caps/joins.
- Containers ~3px radius. Flat bases under objects. Corner brackets for scan icons.
- **Accent:** every multi-part icon marks one element with `a()` / `af()`; rendered with
  `stroke|fill: var(--devx-accent, currentColor)`. Single-stroke icons may have none.
- **Open gaps:** variant badges (and the off-slash, dot) cut the base with an exact
  1.25px visible gap (`GAP`), computed by splitting Béziers, not by masking.

## Scale: bases × variants

521 hand-drawn bases in `source/<category>.ts` (DSL in `packages/core/src/dsl.ts`).
16 variants (plus, minus, check, x, alert, clock, lock, search, star, heart, upload,
download, edit, bolt, off, dot) applied per category (`ALL`, `SOME`, `NONE`) → 6,354.
Name collisions between a base and a generated variant fail the build.

## Solid style (scripts/lib/solid.ts, Skia PathKit)

- Outermost closed shapes (+ optional `sf` silhouettes) are filled bodies.
- Nested closed shapes: small → holes, large → knock-out outlines (1.5).
- Open strokes mostly inside a body → knock-outs; otherwise added as strokes.
- No body at all → bold strokes (2.25).
- Accent sits in its own gap ring; variants cut the solid base (disc badges with the
  glyph knocked out, or the slash/dot).
- Every boolean normalises operands with `simplify()` first (PathKit otherwise returned
  empty results after chained ops — found on flame-off).
- Outlines are refitted to cubics (Schneider, tol 0.03) — solid sprite 32 MB → 6.5 MB.

## Formats

| Package / file | Contents |
|---|---|
| `packages/svg` → `devx-icons` | line/, solid/, sprite/, icons.json |
| `packages/font` → `@devx-icons/font` | woff2 + ttf (line, solid), css, codepoints.json |
| `packages/react` → `@devx-icons/react` | `<Name>Icon` / `<Name>SolidIcon`, typed, tree-shakeable |
| `dist/raster` | PNG 16–256, ICO (all sizes per file) |
| `release/` | zips + npm tarballs |

Font: base glyphs U+E000…, accent glyphs U+F0000… overlaid by `::after`. Contours are
re-oriented for the non-zero rule. `codepoints.json` is committed for stability.

## Quality gates

- Generator validation: names, accents, safe area, non-empty solid.
- Contact sheets (`pnpm sheets`) reviewed per category in both styles; font rendered
  from the TTFs with resvg.
- `pnpm check`: tsc + vitest (parser, geometry, gap cut, variants, rendering, the whole
  set, codepoints, React rendering).

## Not done (needs Kalyan)

- Publishing to npm (`devx-icons`, `@devx-icons/font`, `@devx-icons/react`), GitHub repo,
  docs-site deploy.
