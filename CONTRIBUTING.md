# Contributing to DevX Icons

Thanks for helping. Icon requests and new icons are the most useful contributions.

## Request an icon

Open an [icon request](https://github.com/Kalyan-Deva/devx-icons/issues/new?template=icon-request.yml).
Search the [icon browser](https://kalyan-deva.github.io/devx-icons/) first: many icons
already exist as a variant (`-plus`, `-check`, `-off`, `-dot`, …).

## Draw an icon

1. `pnpm install`, then `pnpm dev` (http://localhost:3100).
2. Add an entry to the right file in `source/`:

   ```ts
   ["webhook-off", "event trigger disabled", [C(12, 6, 2.5), "M10.75 8.2 7.2 14.9", a("M8.5 17h7")]],
   ```

   `C` circle, `R` rect, `P` polyline, `G` polygon, `D` dot, `a()` marks the accent
   element, `{ sf: [...] }` adds a solid-only silhouette, `{ v: NONE }` disables variants.
3. `pnpm build` — the generator rejects name collisions, missing accents, empty solids
   and anything outside the safe area.
4. Look at it in both styles (`pnpm dev`, and `pnpm sheets` for PNG contact sheets).

### House style

- 24 × 24 grid, keep stroke centrelines within 1.5–22.5
- 1.75 stroke, round caps and joins, ~3px corner radius on containers
- One accent element (the detail that carries meaning), drawn with `a()`
- Where inner elements meet an outline, leave a clean gap instead of overlapping
- Draw from scratch. Don't trace or copy other icon sets.

## Code

`pnpm check` runs the type check and tests. Keep `packages/font/codepoints.json`
committed: it keeps font code points stable between releases.

By contributing you agree your work is released under the MIT license.
