# @kalyan-dev/devx-icons-elements

DevX Icons as a web component. Works in any framework, or none.

```html
<script type="module">
  import { register, dxHome, dxShieldCheck } from "@kalyan-dev/devx-icons-elements";
  register(dxHome, dxShieldCheck);
</script>

<devx-icon icon="home"></devx-icon>
<devx-icon icon="shield-check" variant="duotone" weight="bold" accent="#16a34a" animate></devx-icon>
```

Attributes: `icon`, `variant`, `weight`, `size`, `color`, `stroke-width`, `accent`, `label` (accessible name), `animate`.
`import "@kalyan-dev/devx-icons-elements/all"` registers all 7,418 icons at once (large).

[Browse all icons](https://kalyan-deva.github.io/devx-icons/) · [GitHub](https://github.com/Kalyan-Deva/devx-icons) · MIT
