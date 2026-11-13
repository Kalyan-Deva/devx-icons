// Builds every distribution from build/geometry.json:
//   packages/svg/sprite/*.svg            sprites (line, solid, duotone, bulk)
//   packages/react/dist                  <Name>Icon, <Name>SolidIcon, <Name>DuotoneIcon, <Name>BulkIcon
//   packages/vue/dist                    <DevxIcon :icon="dxHome" variant="duotone" />
//   packages/svelte/dist                 <DevxIcon icon={dxHome} />
//   packages/elements/dist               <devx-icon icon="home"> web component
//   packages/iconify/json/*.json         Iconify icon sets (one per style/weight)
//   dist/android/{line,solid}/*.xml      Android vector drawables
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import type { Part } from "../packages/core/src/dsl.ts";
import type { SolidPart } from "../packages/core/src/render.ts";
import { ANIM_CSS, type Anim } from "../packages/core/src/anim.ts";
import { ROOT } from "./lib/load.ts";

type Geo = { name: string; line: Part[]; solid: SolidPart[]; anim: Anim };
const geo: Geo[] = JSON.parse(readFileSync(new URL("build/geometry.json", ROOT), "utf8"));
const meta: Record<string, { category: string; tags: string[] }> = JSON.parse(readFileSync(new URL("packages/svg/icons.json", ROOT), "utf8"));
const VERSION = JSON.parse(readFileSync(new URL("packages/svg/package.json", ROOT), "utf8")).version as string;

const pascal = (n: string) => n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
const dataName = (n: string) => `dx${pascal(n)}`;
const fresh = (p: string) => {
  const u = new URL(p, ROOT);
  rmSync(u, { recursive: true, force: true });
  mkdirSync(u, { recursive: true });
  return u;
};
const write = (base: URL, rel: string, text: string) => writeFileSync(new URL(rel, base), text);

// ---- shared runtime ------------------------------------------------------------
const runtimeSrc = readFileSync(new URL("scripts/lib/runtime.js", ROOT), "utf8").replace("__ANIM_CSS__", JSON.stringify(ANIM_CSS));
mkdirSync(new URL("build/", ROOT), { recursive: true });
writeFileSync(new URL("build/runtime.mjs", ROOT), runtimeSrc);
const runtime = (await import(pathToFileURL(fileURLToPath(new URL("build/runtime.mjs", ROOT))).href)) as {
  devxSpec: (i: unknown, o?: Record<string, unknown>) => { svg: Record<string, string | number>; paths: Record<string, string | number>[]; css: string | null; group: boolean };
  devxSvg: (i: unknown, o?: Record<string, unknown>) => string;
};
const RUNTIME_DTS = `export interface DevxIconData { name: string; line: [0 | 1 | 2, string][]; solid: [0 | 1, string][]; anim: [string, number?, number?] }
export type DevxVariant = "line" | "solid" | "duotone" | "bulk";
export type DevxWeight = "thin" | "light" | "regular" | "bold";
export interface DevxOptions { variant?: DevxVariant; weight?: DevxWeight; strokeWidth?: number | string; size?: number | string; color?: string; accent?: string; title?: string; animate?: boolean }
export declare const ACCENT: string;
export declare const WEIGHTS: Record<DevxWeight, number>;
export declare const VARIANTS: DevxVariant[];
export declare const ANIM_CSS: string;
export declare function devxSpec(icon: DevxIconData, o?: DevxOptions): { svg: Record<string, string | number>; paths: Record<string, string | number>[]; css: string | null; group: boolean };
export declare function devxSvg(icon: DevxIconData, o?: DevxOptions): string;
`;

const dataJs = (g: Geo) =>
  `export default ${JSON.stringify({
    name: g.name,
    line: g.line.map((p) => [p.role === "line" ? 0 : p.role === "accent" ? 1 : 2, p.d]),
    solid: g.solid.filter((p) => p.d).map((p) => [p.accent ? 1 : 0, p.d]),
    anim: g.anim.kind === "nudge" ? [g.anim.kind, g.anim.dx, g.anim.dy] : [g.anim.kind],
  })};\n`;
const plain = (g: Geo) => ({
  name: g.name,
  line: g.line.map((p) => [p.role === "line" ? 0 : p.role === "accent" ? 1 : 2, p.d]),
  solid: g.solid.filter((p) => p.d).map((p) => [p.accent ? 1 : 0, p.d]),
  anim: g.anim.kind === "nudge" ? [g.anim.kind, g.anim.dx, g.anim.dy] : [g.anim.kind],
});

/** icons/<dxName>.js + index of named exports, shared layout for vue/svelte/elements. */
function writeDataSet(dist: URL) {
  mkdirSync(new URL("icons/", dist), { recursive: true });
  const idx: string[] = [];
  const dts: string[] = [];
  for (const g of geo) {
    const id = dataName(g.name);
    write(dist, `icons/${id}.js`, dataJs(g));
    write(dist, `icons/${id}.d.ts`, `import type { DevxIconData } from "../runtime";\ndeclare const icon: DevxIconData;\nexport default icon;\n`);
    idx.push(`export { default as ${id} } from "./${id}.js";`);
    dts.push(`export declare const ${id}: DevxIconData;`);
  }
  write(dist, "icons/index.js", idx.join("\n") + "\n");
  write(dist, "icons/index.d.ts", `import type { DevxIconData } from "../runtime";\n${dts.join("\n")}\n`);
  write(dist, "runtime.js", runtimeSrc);
  write(dist, "runtime.d.ts", RUNTIME_DTS);
}

// ---- sprites -------------------------------------------------------------------
{
  const dir = fresh("packages/svg/sprite/");
  for (const variant of ["line", "solid", "duotone", "bulk"]) {
    const symbols = geo
      .map((g) => {
        const s = runtime.devxSpec(plain(g), { variant });
        const keep = Object.entries(s.svg).filter(([k]) => !["xmlns", "width", "height", "viewBox", "class", "aria-hidden", "role"].includes(k));
        const gAttrs = keep
          .map(([k, v]) => (k === "stroke-width" ? ` style="stroke-width:var(--devx-stroke-width,${v})"` : ` ${k}="${v}"`))
          .join("");
        const body = s.paths.map((p) => `<path${Object.entries(p).map(([k, v]) => ` ${k}="${v}"`).join("")}/>`).join("");
        return `<symbol id="devx-${g.name}" viewBox="0 0 24 24"><g${gAttrs}>${body}</g></symbol>`;
      })
      .join("\n");
    write(dir, `devx-${variant}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}\n</svg>\n`);
  }
  console.log("sprites: line, solid, duotone, bulk");
}

// ---- React ---------------------------------------------------------------------
{
  const dist = fresh("packages/react/dist/");
  mkdirSync(new URL("icons/", dist), { recursive: true });
  mkdirSync(new URL("data/", dist), { recursive: true });
  write(dist, "runtime.js", runtimeSrc);
  write(dist, "runtime.d.ts", RUNTIME_DTS);
  write(
    dist,
    "base.js",
    `import { createElement as h, forwardRef } from "react";
import { devxSpec } from "./runtime.js";

const camel = (k) => (k.startsWith("aria-") || k.startsWith("data-") ? k : k === "class" ? "className" : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
const styleObj = (s) =>
  Object.fromEntries(
    String(s)
      .split(";")
      .filter(Boolean)
      .map((x) => {
        const i = x.indexOf(":");
        const k = x.slice(0, i).trim();
        return [k.startsWith("--") ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), x.slice(i + 1).trim()];
      }),
  );
const conv = (a) => {
  const o = {};
  for (const [k, v] of Object.entries(a)) o[k === "style" ? "style" : camel(k)] = k === "style" ? styleObj(v) : v;
  return o;
};

/** Shared renderer for every DevX React component. */
export const DevxSvg = /*#__PURE__*/ forwardRef(function DevxSvg(props, ref) {
  const { icon, variant, size, color, strokeWidth, weight, accent, title, animate, className, style, ...rest } = props;
  const s = devxSpec(icon, { variant, size, color, strokeWidth, weight, accent, title, animate });
  const svg = conv(s.svg);
  if (className) svg.className += " " + className;
  if (style) svg.style = { ...(svg.style || {}), ...style };
  const kids = s.paths.map((p, i) => h("path", { key: i, ...conv(p) }));
  return h(
    "svg",
    { ref, ...svg, ...rest },
    title ? h("title", { key: "t" }, title) : null,
    s.css ? h("style", { key: "c" }, s.css) : null,
    s.group ? h("g", { key: "g", className: "dx-g" }, kids) : kids,
  );
});
`,
  );
  write(
    dist,
    "types.d.ts",
    `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import type { DevxWeight } from "./runtime";

export interface DevxIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Width and height (default 24). */
  size?: number | string;
  /** Ink colour (default currentColor). */
  color?: string;
  /** Line weight: thin 1, light 1.25, regular 1.75 (default), bold 2.25. Line and duotone only. */
  weight?: DevxWeight;
  /** Exact stroke width; overrides weight. Line and duotone only. */
  strokeWidth?: number | string;
  /** Accent colour; sets --devx-accent on the icon (default: inherited, else currentColor). */
  accent?: string;
  /** Accessible title. Without it the icon is aria-hidden. */
  title?: string;
  /** Play the icon's built-in animation (line and duotone). Honours prefers-reduced-motion. */
  animate?: boolean;
}

export type DevxIcon = ForwardRefExoticComponent<DevxIconProps & RefAttributes<SVGSVGElement>>;
`,
  );
  const STYLES: [string, string][] = [
    ["", "line"],
    ["Solid", "solid"],
    ["Duotone", "duotone"],
    ["Bulk", "bulk"],
  ];
  // One module per icon holding its data and all four style components. (One file per
  // component meant 66k files, which the npm registry rejects as "Too many files".)
  const js: string[] = [];
  const dts: string[] = [];
  for (const g of geo) {
    const P = pascal(g.name);
    const comps = STYLES.map(([suffix, variant]) => [`${P}${suffix}Icon`, variant] as const);
    write(
      dist,
      `icons/${P}.js`,
      `import { createElement as h, forwardRef } from "react";
import { DevxSvg } from "../base.js";
const d = ${JSON.stringify(plain(g))};
` +
        comps
          .map(
            ([c, variant]) =>
              `export const ${c} = /*#__PURE__*/ forwardRef((props, ref) => h(DevxSvg, { ...props, ref, icon: d, variant: "${variant}" }));\n${c}.displayName = "${c}";`,
          )
          .join("\n") +
        `\nexport default ${comps[0]![0]};\n`,
    );
    write(
      dist,
      `icons/${P}.d.ts`,
      `import type { DevxIcon } from "../types";\n${comps.map(([c]) => `export declare const ${c}: DevxIcon;`).join("\n")}\nexport default ${comps[0]![0]};\n`,
    );
    js.push(`export { ${comps.map(([c]) => c).join(", ")} } from "./icons/${P}.js";`);
    dts.push(`export { ${comps.map(([c]) => c).join(", ")} } from "./icons/${P}";`);
  }
  write(dist, "index.js", `export { DevxSvg } from "./base.js";\n` + js.join("\n") + "\n");
  write(dist, "index.d.ts", `export type { DevxIcon, DevxIconProps } from "./types";\n` + dts.join("\n") + "\n");
  write(dist, "meta.js", `export const iconNames = ${JSON.stringify(geo.map((g) => g.name))};\n`);
  write(dist, "meta.d.ts", `export declare const iconNames: string[];\n`);
  console.log(`react: ${geo.length * STYLES.length} components`);
}

// ---- Vue -----------------------------------------------------------------------
{
  const dist = fresh("packages/vue/dist/");
  writeDataSet(dist);
  write(
    dist,
    "DevxIcon.js",
    `import { defineComponent, h } from "vue";
import { devxSpec } from "./runtime.js";

export const DevxIcon = defineComponent({
  name: "DevxIcon",
  props: {
    icon: { type: Object, required: true },
    variant: { type: String, default: "line" },
    size: { type: [Number, String], default: 24 },
    color: String,
    weight: String,
    strokeWidth: [Number, String],
    accent: String,
    title: String,
    animate: Boolean,
  },
  setup(props) {
    return () => {
      const s = devxSpec(props.icon, props);
      const kids = s.paths.map((p) => h("path", p));
      return h("svg", s.svg, [
        props.title ? h("title", props.title) : null,
        s.css ? h("style", s.css) : null,
        ...(s.group ? [h("g", { class: "dx-g" }, kids)] : kids),
      ]);
    };
  },
});
export default DevxIcon;
`,
  );
  write(dist, "DevxIcon.d.ts", `import type { DefineComponent } from "vue";\nimport type { DevxIconData, DevxOptions } from "./runtime";\nexport declare const DevxIcon: DefineComponent<DevxOptions & { icon: DevxIconData }>;\nexport default DevxIcon;\n`);
  write(dist, "index.js", `export { DevxIcon } from "./DevxIcon.js";\nexport * from "./icons/index.js";\nexport { devxSvg, devxSpec, WEIGHTS } from "./runtime.js";\n`);
  write(dist, "index.d.ts", `export { DevxIcon } from "./DevxIcon";\nexport * from "./icons/index";\nexport { devxSvg, devxSpec, WEIGHTS } from "./runtime";\nexport type { DevxIconData, DevxOptions, DevxVariant, DevxWeight } from "./runtime";\n`);
  console.log("vue: DevxIcon + data");
}

// ---- Svelte --------------------------------------------------------------------
{
  const dist = fresh("packages/svelte/dist/");
  writeDataSet(dist);
  write(
    dist,
    "DevxIcon.svelte",
    `<script>
  import { devxSpec } from "./runtime.js";
  export let icon;
  export let variant = "line";
  export let size = 24;
  export let color = undefined;
  export let weight = undefined;
  export let strokeWidth = undefined;
  export let accent = undefined;
  export let title = undefined;
  export let animate = false;
  $: s = devxSpec(icon, { variant, size, color, weight, strokeWidth, accent, title, animate });
</script>

<svg {...s.svg} {...$$restProps}>
  {#if title}<title>{title}</title>{/if}
  {#if s.css}{@html "<style>" + s.css + "</style>"}{/if}
  {#if s.group}
    <g class="dx-g">{#each s.paths as p}<path {...p} />{/each}</g>
  {:else}
    {#each s.paths as p}<path {...p} />{/each}
  {/if}
</svg>
`,
  );
  write(dist, "index.js", `export { default as DevxIcon } from "./DevxIcon.svelte";\nexport * from "./icons/index.js";\nexport { devxSvg, devxSpec, WEIGHTS } from "./runtime.js";\n`);
  write(dist, "index.d.ts", `import type { SvelteComponent } from "svelte";\nimport type { DevxIconData, DevxOptions } from "./runtime";\nexport declare class DevxIcon extends SvelteComponent<DevxOptions & { icon: DevxIconData }> {}\nexport * from "./icons/index";\nexport { devxSvg, devxSpec, WEIGHTS } from "./runtime";\nexport type { DevxIconData, DevxOptions } from "./runtime";\n`);
  console.log("svelte: DevxIcon + data");
}

// ---- Web component -------------------------------------------------------------
{
  const dist = fresh("packages/elements/dist/");
  writeDataSet(dist);
  write(
    dist,
    "index.js",
    `import { devxSvg } from "./runtime.js";

const registry = new Map();
const live = new Set();

/** Make icons available to <devx-icon icon="name">. */
export function register(...icons) {
  for (const i of icons.flat()) registry.set(i.name, i);
  for (const el of live) el.render();
}

const Base = typeof HTMLElement === "undefined" ? class {} : HTMLElement;
export class DevxIconElement extends Base {
  static get observedAttributes() {
    return ["icon", "variant", "size", "color", "weight", "stroke-width", "accent", "label", "animate"];
  }
  connectedCallback() { live.add(this); this.render(); }
  disconnectedCallback() { live.delete(this); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const icon = registry.get(this.getAttribute("icon"));
    const a = (k) => this.getAttribute(k) ?? undefined;
    this.style.display = "inline-flex";
    this.style.lineHeight = "0";
    this.innerHTML = icon
      ? devxSvg(icon, { variant: a("variant"), size: a("size") ?? 24, color: a("color"), weight: a("weight"), strokeWidth: a("stroke-width"), accent: a("accent"), title: a("label"), animate: this.hasAttribute("animate") })
      : "";
  }
}
if (typeof customElements !== "undefined" && !customElements.get("devx-icon")) customElements.define("devx-icon", DevxIconElement);

export * from "./icons/index.js";
export { devxSvg, devxSpec, WEIGHTS } from "./runtime.js";
`,
  );
  write(dist, "index.d.ts", `import type { DevxIconData } from "./runtime";\nexport declare function register(...icons: (DevxIconData | DevxIconData[])[]): void;\nexport declare class DevxIconElement extends HTMLElement { render(): void }\nexport * from "./icons/index";\nexport { devxSvg, devxSpec, WEIGHTS } from "./runtime";\nexport type { DevxIconData, DevxOptions } from "./runtime";\n`);
  write(dist, "all.js", `// Registers every icon (large: prefer importing only the icons you use).\nimport { register } from "./index.js";\nimport * as all from "./icons/index.js";\nregister(Object.values(all));\nexport * from "./index.js";\n`);
  write(dist, "all.d.ts", `export * from "./index";\n`);
  console.log("elements: <devx-icon> + register()");
}

// ---- Iconify -------------------------------------------------------------------
{
  const dir = fresh("packages/iconify/json/");
  const sets: [string, string, Record<string, unknown>][] = [
    ["devx", "DevX Icons", { variant: "line" }],
    ["devx-thin", "DevX Icons Thin", { variant: "line", weight: "thin" }],
    ["devx-light", "DevX Icons Light", { variant: "line", weight: "light" }],
    ["devx-bold", "DevX Icons Bold", { variant: "line", weight: "bold" }],
    ["devx-solid", "DevX Icons Solid", { variant: "solid" }],
    ["devx-duotone", "DevX Icons Duotone", { variant: "duotone" }],
    ["devx-bulk", "DevX Icons Bulk", { variant: "bulk" }],
  ];
  const categories: Record<string, string[]> = {};
  for (const g of geo) (categories[meta[g.name]!.category] ??= []).push(g.name);
  for (const [prefix, title, opts] of sets) {
    const icons: Record<string, { body: string }> = {};
    for (const g of geo) {
      const s = runtime.devxSpec(plain(g), opts);
      const keep = Object.entries(s.svg).filter(([k]) => !["xmlns", "width", "height", "viewBox", "class", "aria-hidden", "role"].includes(k));
      const body = s.paths.map((p) => `<path${Object.entries(p).map(([k, v]) => ` ${k}="${v}"`).join("")}/>`).join("");
      icons[g.name] = { body: `<g${keep.map(([k, v]) => ` ${k}="${v}"`).join("")}>${body}</g>` };
    }
    const json = {
      prefix,
      info: {
        name: title,
        total: geo.length,
        version: VERSION,
        author: { name: "Kalyan Gopalam", url: "https://github.com/Kalyan-Deva/devx-icons" },
        license: { title: "MIT", spdx: "MIT", url: "https://github.com/Kalyan-Deva/devx-icons/blob/main/LICENSE" },
        height: 24,
        category: "General",
        palette: false,
      },
      categories,
      icons,
      width: 24,
      height: 24,
    };
    write(dir, `${prefix}.json`, JSON.stringify(json));
  }
  console.log(`iconify: ${sets.length} sets`);
}

// ---- Android vector drawables --------------------------------------------------
{
  const dir = fresh("dist/android/");
  for (const style of ["line", "solid"]) mkdirSync(new URL(`${style}/`, dir), { recursive: true });
  const res = (n: string) => `ic_devx_${n.replace(/-/g, "_")}`;
  const head = `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">`;
  for (const g of geo) {
    const line = g.line
      .map((p) =>
        p.role === "accent-fill"
          ? `  <path android:pathData="${p.d}" android:fillColor="?attr/colorAccent"/>`
          : `  <path android:pathData="${p.d}" android:strokeColor="${p.role === "accent" ? "?attr/colorAccent" : "?attr/colorControlNormal"}" android:strokeWidth="1.75" android:strokeLineCap="round" android:strokeLineJoin="round" android:fillColor="#00000000"/>`,
      )
      .join("\n");
    write(dir, `line/${res(g.name)}.xml`, `${head}\n${line}\n</vector>\n`);
    const solid = g.solid
      .filter((p) => p.d)
      .map((p) => `  <path android:pathData="${p.d}" android:fillType="evenOdd" android:fillColor="${p.accent ? "?attr/colorAccent" : "?attr/colorControlNormal"}"/>`)
      .join("\n");
    write(dir, `solid/${res(g.name)}.xml`, `${head}\n${solid}\n</vector>\n`);
  }
  console.log(`android: ${geo.length * 2} vector drawables`);
}
