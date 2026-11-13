# @kalyan-dev/devx-icons-vue

7,418 DevX Icons for Vue 3: line in four weights, solid, duotone, bulk, and built-in animation.
Every outline opens at 1 o'clock (the DevX signature) and one detail per icon follows `--devx-accent`.

```vue
<script setup>
import { DevxIcon, dxHome, dxShieldCheck } from "@kalyan-dev/devx-icons-vue";
</script>
<template>
  <DevxIcon :icon="dxHome" />
  <DevxIcon :icon="dxShieldCheck" variant="duotone" weight="light" accent="#16a34a" animate />
</template>
```

Props: `icon`, `variant` (`line` | `solid` | `duotone` | `bulk`), `weight` (`thin` | `light` | `regular` | `bold`),
`size`, `color`, `strokeWidth`, `accent`, `title`, `animate`. Icons are tree-shakeable named exports (`dx` + PascalCase name).

[Browse all icons](https://kalyan-deva.github.io/devx-icons/) · [GitHub](https://github.com/Kalyan-Deva/devx-icons) · MIT
