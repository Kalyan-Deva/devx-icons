# DevX Icons

**6,354 open-source icons in line and solid, with a signature accent colour.**

- 24 × 24 grid, 2 px padding, 1.75 stroke, round caps and joins, ~3 px corner radius
- **Accent element:** every multi-part icon has one detail drawn in `var(--devx-accent)`,
  falling back to `currentColor` — set one CSS variable and every icon gets a second colour
- **Open gaps:** where a badge or inner element meets an outline, the outline stops short
  with a clean 1.25 px gap instead of colliding
- **Line + solid** from the same geometry, so both styles always match
- Formats: SVG files, SVG sprites, icon font (woff2/ttf), React components, PNG (16–256), ICO
- MIT licensed

## Icons

521 hand-drawn base icons × systematic variants (`-plus`, `-minus`, `-check`, `-x`,
`-alert`, `-clock`, `-lock`, `-search`, `-star`, `-heart`, `-upload`, `-download`,
`-edit`, `-bolt`, `-off`, `-dot`) = **6,354 icons** in 20 categories:

| Category | Bases | Icons | | Category | Bases | Icons |
|---|---:|---:|---|---|---:|---:|
| actions | 18 | 146 | | health | 16 | 272 |
| arrows | 62 | 62 | | interface | 41 | 537 |
| business | 27 | 459 | | maps | 26 | 435 |
| communication | 23 | 391 | | media | 26 | 298 |
| development | 25 | 425 | | objects | 27 | 459 |
| devices | 36 | 612 | | people | 15 | 255 |
| editor | 32 | 48 | | security | 25 | 425 |
| files | 30 | 510 | | shapes | 14 | 126 |
| food | 10 | 170 | | status | 27 | 27 |
| time | 12 | 204 | | weather | 29 | 493 |

Browse them: `pnpm dev` → http://localhost:3100 (search, line/solid, size, stroke, ink and accent colour, click to copy).

## Use

### React — `@devx-icons/react`

```tsx
import { BellDotIcon, HomeIcon, HomeSolidIcon } from "@devx-icons/react";

<HomeIcon />                                   // 24px, currentColor, 1.75 stroke
<HomeIcon size={20} strokeWidth={1.5} />
<HomeSolidIcon color="#111" accent="#ff5a1f" />
<BellDotIcon title="New notifications" />      // accessible; otherwise aria-hidden
```

One component per icon and style (`<Name>Icon`, `<Name>SolidIcon`), tree-shakeable,
typed. Deep import: `@devx-icons/react/icons/HomeIcon`.

### SVG — `devx-icons`

```html
<img src="node_modules/devx-icons/line/home.svg" width="24" height="24" alt="" />
```

Inline the SVG to get `currentColor` and the accent variable. `icons.json` lists every
icon with its category, tags, base and variant.

**Sprite** (one request for all icons):

```html
<svg width="24" height="24"><use href="devx-icons/sprite/devx-line.svg#devx-home" /></svg>
```

The line sprite reads `--devx-stroke-width` (default 1.75).

### Icon font — `@devx-icons/font`

```html
<link rel="stylesheet" href="@devx-icons/font/devx-icons.css" />
<i class="devx devx-home"></i>          <!-- line -->
<i class="devx-solid devx-home"></i>    <!-- solid -->
```

The font keeps the signature: each icon's accent is a second glyph layered on top via
`::after` in `var(--devx-accent)`.

### Accent colour (all formats)

```css
:root { --devx-accent: #ff5a1f; }            /* everywhere */
.danger { --devx-accent: #e11d48; }          /* per area */
:root { --devx-accent: currentColor; }       /* single-colour icons */
```

### PNG and ICO

`release/devx-icons-<v>-png.zip` has every icon at 16, 24, 32, 48, 64, 128 and 256 px;
`…-ico.zip` has one multi-size `.ico` per icon. Default ink `#111111`, accent `#ff5a1f`;
re-render with your colours:

```bash
pnpm build:raster --ink=#ffffff --accent=#22d3ee
```

## Build

```bash
pnpm install
pnpm build          # generate SVGs (line + solid), fonts, sprites, React package
pnpm build:raster   # PNG + ICO
pnpm release        # zips + npm tarballs in release/ (nothing is published)
pnpm check          # typecheck + tests
pnpm sheets         # QA contact sheets in build/sheets/
```

### How it works

- `source/<category>.ts` — the hand-drawn base icons in a small DSL (`C` circle, `R` rect,
  `P` polyline, `a()` accent, `dirs()` four rotations, `mirror()`).
- `packages/core` — exact path geometry (arc → cubic, Bézier splitting), the variant
  badges and the gap cut, SVG rendering. Browser-safe, no dependencies.
- `scripts/generate.ts` — expands bases × variants, builds the **solid** style with Skia
  PathKit booleans (bodies filled, inner details knocked out, accent in its own gap ring),
  refits outlines to compact cubics, validates every icon.
- `scripts/build-font.ts` — two fonts with stable code points (`packages/font/codepoints.json`,
  keep it committed): base glyphs at U+E000…, accent glyphs at U+F0000….

## Adding an icon

Add an entry to the right `source/*.ts` file, run `pnpm build`, check it in the preview
and in `pnpm sheets`. The generator fails on name collisions, empty shapes and anything
outside the safe area.

## License

MIT © 2026 Kalyan Gopalam
