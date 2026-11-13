# Changelog

## 1.2.0 — 2026-11-12

Security icons, five new styles and five new formats.

- **63 new security icons** in three new categories — threats, cryptography,
  infrastructure — with all variants: 1,064 more icons, 7,418 in total.
- **Styles:** line in thin (1), light (1.25), regular (1.75) and bold (2.25); duotone
  (line over a 20 % accent tint); bulk (35 % body, full accent); animated (rule-based
  motion: spin, swing, beat, nudge, pulse, pop, draw; honours reduced motion).
- **Formats:** `@devx-icons/vue`, `@devx-icons/svelte`, `@devx-icons/elements`
  (`<devx-icon>`), `@devx-icons/iconify` (7 sets), Android vector drawables.
- React: `<Name>DuotoneIcon`, `<Name>BulkIcon`, `weight` and `animate` props.
- Fonts: thin, light and bold families, plus a `devx-bulk` class. Code points now continue
  into Plane 15 (existing ones unchanged); accent glyphs moved to Plane 16.
- PNG/ICO now also in duotone and bulk. Sprites for duotone and bulk.
- The open-loop cut now applies to outlines only; accents stay whole.
- Fixed: the curve fitter could produce a runaway control point on near-parallel tangents.

## 1.1.0 — 2026-11-12

The DevX signature: **open loop**.

- Every closed outline (≥ 14 units around) now opens at 1 o'clock with a 1.5 px gap,
  computed exactly on the Bézier geometry. Dots, keyholes and variant badges stay closed.
- Solid icons carry the matching notch at the same spot.
- Applies everywhere: SVG, sprites, icon font, React, PNG and ICO.
- Icon browser on GitHub Pages, README showcase, icon-request issue template.

## 1.0.0 — 2026-11-12

First release.

- 521 hand-drawn base icons, 16 systematic variants → 6,354 icons in 20 categories.
- Line style (1.75 stroke, adjustable) and solid style generated from the same geometry.
- Signature accent element in every multi-part icon, driven by `--devx-accent`.
- Variant badges cut a clean 1.25 px gap into the base icon.
- Formats: SVG, SVG sprites, icon font with accent overlay (woff2/ttf), React components,
  PNG (16–256 px), ICO.
