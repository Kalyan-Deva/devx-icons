# @devx-icons/font

DevX Icons as web fonts: regular, thin, light, bold and solid, plus a bulk mode. The accent colour is included.

```html
<link rel="stylesheet" href="node_modules/@devx-icons/font/devx-icons.css" />
<i class="devx devx-home"></i>
<i class="devx-thin devx-home"></i>   <!-- devx-light, devx-bold -->
<i class="devx-solid devx-bell-dot"></i>
<i class="devx-bulk devx-shield-check"></i>
```

Each icon's accent is a second glyph overlaid via `::after` in `var(--devx-accent, currentColor)`.
Code points are stable across versions (`codepoints.json`). MIT
