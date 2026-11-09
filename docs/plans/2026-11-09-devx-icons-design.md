# DevX Icons — design

Date: 2026-11-09
Status: approved in brainstorming, not started

## What it is

An open-source, general-purpose icon set with a cozy hand-drawn style. Icons are
drawn as clean geometric bases and a build-time generator gives them a seeded,
deterministic hand-drawn wobble. v1 ships ~200 icons.

## v1 scope

- Raw SVGs (`devx-icons`)
- React components (`@devx-icons/react`)
- Searchable docs site (Astro, Cloudflare Pages)

Later (v2+): Vue, Svelte, web component, icon font (woff2), Figma community file.

## Style generation

Chosen approach: **build-time path wobble**.

1. Base icon: clean SVG on a 24×24 grid, stroke 2, round caps/joins, `currentColor`.
2. Generator flattens each path to points, offsets them perpendicular to the path
   with seeded low-frequency noise (seed = hash of icon name), then re-fits smooth
   Béziers.
3. Hand-drawn cues: slight overshoot at corners/line ends, closed shapes with a
   tiny overlap instead of a perfect join.
4. Output stays a *stroked* path, so `strokeWidth` and `color` remain adjustable.

Rejected:
- Outlined variable-width ink: loses adjustable stroke width, bigger files.
- Runtime `feTurbulence` filter: blurry at small sizes, inconsistent across browsers.

All style parameters (amplitude, frequency, overshoot, smoothing) live in one
config file; a contact-sheet page previews changes across the whole set.
Wobble levels: `none`, `soft` (default), `sketchy` — each precomputed.

## Icon list (~200)

Arrows & navigation ~25 · Actions ~35 · Files ~20 · Communication ~15 ·
People ~10 · Media ~20 · Status ~15 · Interface ~35 · Time & weather ~15 ·
Cozy extras ~10.

Each icon has a metadata file: name, tags, category, version added.

## React API

```tsx
import { Coffee } from "@devx-icons/react";
<Coffee size={24} strokeWidth={2} color="currentColor" wobble="soft" />
```

- One component per icon, tree-shakeable, `sideEffects: false`.
- Wobble levels are separate exports so unused variants aren't bundled.
- TypeScript types; `aria-hidden` by default, `title` prop makes it labelled.

## Docs site

Grid with search (from metadata), category filters, live size / stroke / wobble /
colour controls; click to copy SVG or JSX, or download.

## Repo layout

```
icons/         base SVGs + metadata JSON
generator/     wobble + optimisation (Node/TS, svgo)
packages/svg/  devx-icons
packages/react/@devx-icons/react
site/          Astro docs site
```

## Quality gates

- Snapshot tests: generator output is deterministic per seed.
- Lint: 24px grid, stroke 2, round caps, no fills, viewBox `0 0 24 24`.
- CI fails if an icon lacks metadata.

## Licensing

Code: MIT. Icons: ISC (like Lucide). npm names `devx-icons` and
`@devx-icons/react` were unclaimed on 2026-11-09.

## Open items

- Pick exact default wobble values by eye on the contact sheet.
- GitHub repo name/visibility (public at launch).
