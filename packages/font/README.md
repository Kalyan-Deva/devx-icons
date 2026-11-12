# @devx-icons/font

DevX Icons as web fonts (line and solid), accent colour included.

```html
<link rel="stylesheet" href="node_modules/@devx-icons/font/devx-icons.css" />
<i class="devx devx-home"></i>
<i class="devx-solid devx-bell-dot"></i>
```

Each icon's accent is a second glyph overlaid via `::after` in `var(--devx-accent, currentColor)`.
Code points are stable across versions (`codepoints.json`). MIT
