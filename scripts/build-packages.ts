// SVG sprites (packages/svg/sprite) and the React package (packages/react/dist).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import type { Part } from "../packages/core/src/dsl.ts";
import type { SolidPart } from "../packages/core/src/render.ts";
import { ROOT } from "./lib/load.ts";

type Geo = { name: string; line: Part[]; solid: SolidPart[] };
const geo: Geo[] = JSON.parse(readFileSync(new URL("build/geometry.json", ROOT), "utf8"));
const ACC = "var(--devx-accent,currentColor)";

// ---- sprites -----------------------------------------------------------------
const spriteDir = new URL("packages/svg/sprite/", ROOT);
rmSync(spriteDir, { recursive: true, force: true });
mkdirSync(spriteDir, { recursive: true });
const lineSymbols = geo
  .map(
    (g) =>
      `<symbol id="devx-${g.name}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--devx-stroke-width,1.75)">${g.line
        .map((p) =>
          p.role === "line"
            ? `<path d="${p.d}"/>`
            : p.role === "accent"
              ? `<path d="${p.d}" style="stroke:${ACC}"/>`
              : `<path d="${p.d}" style="fill:${ACC};stroke:none"/>`,
        )
        .join("")}</g></symbol>`,
  )
  .join("\n");
const solidSymbols = geo
  .map(
    (g) =>
      `<symbol id="devx-${g.name}" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd">${g.solid
        .filter((p) => p.d)
        .map((p) => (p.accent ? `<path d="${p.d}" style="fill:${ACC}"/>` : `<path d="${p.d}"/>`))
        .join("")}</g></symbol>`,
  )
  .join("\n");
const wrap = (s: string) => `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${s}\n</svg>\n`;
writeFileSync(new URL("devx-line.svg", spriteDir), wrap(lineSymbols));
writeFileSync(new URL("devx-solid.svg", spriteDir), wrap(solidSymbols));
console.log(`sprites: devx-line.svg ${(lineSymbols.length / 1024 / 1024).toFixed(1)} MB, devx-solid.svg ${(solidSymbols.length / 1024 / 1024).toFixed(1)} MB`);

// ---- React -------------------------------------------------------------------
const pascal = (n: string) => n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
const dist = new URL("packages/react/dist/", ROOT);
rmSync(dist, { recursive: true, force: true });
mkdirSync(new URL("icons/", dist), { recursive: true });

writeFileSync(
  new URL("base.js", dist),
  `import { createElement as h, forwardRef } from "react";

const ACCENT = "${ACC}";

/** Shared renderer. kind 0 = line, 1 = accent stroke, 2 = accent fill (line style); solid uses 0 / 1. */
export const DevxSvg = /*#__PURE__*/ forwardRef(function DevxSvg(props, ref) {
  const { size = 24, color = "currentColor", strokeWidth = 1.75, accent, title, style, className, iconName, paths, solid, ...rest } = props;
  const children = title ? [h("title", { key: "t" }, title)] : [];
  for (let i = 0; i < paths.length; i++) {
    const k = paths[i][0];
    const d = paths[i][1];
    let s;
    if (k === 1) s = solid ? { fill: ACCENT } : { stroke: ACCENT };
    else if (k === 2) s = { fill: ACCENT, stroke: "none" };
    children.push(h("path", s ? { key: i, d, style: s, className: "devx-accent" } : { key: i, d }));
  }
  const look = solid
    ? { fill: color, fillRule: "evenodd" }
    : { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  return h(
    "svg",
    {
      ref,
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      ...look,
      "aria-hidden": title ? undefined : true,
      role: title ? "img" : undefined,
      className: "devx devx-" + iconName + (className ? " " + className : ""),
      style: accent ? { ...style, "--devx-accent": accent } : style,
      ...rest,
    },
    children,
  );
});
`,
);

const BASE_DTS = `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export interface DevxIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Width and height (default 24). */
  size?: number | string;
  /** Ink colour (default currentColor). */
  color?: string;
  /** Stroke width for line icons (default 1.75). Ignored by solid icons. */
  strokeWidth?: number | string;
  /** Accent colour; sets --devx-accent on the icon (default: inherited, else currentColor). */
  accent?: string;
  /** Accessible title. Without it the icon is aria-hidden. */
  title?: string;
}

export type DevxIcon = ForwardRefExoticComponent<DevxIconProps & RefAttributes<SVGSVGElement>>;
`;
writeFileSync(new URL("types.d.ts", dist), BASE_DTS);

const kindLine = (p: Part) => (p.role === "line" ? 0 : p.role === "accent" ? 1 : 2);
const exportsJs: string[] = [];
const exportsDts: string[] = [];
const names: string[] = [];
for (const g of geo) {
  for (const solid of [false, true]) {
    const comp = `${pascal(g.name)}${solid ? "Solid" : ""}Icon`;
    const paths = solid ? g.solid.filter((p) => p.d).map((p) => [p.accent ? 1 : 0, p.d]) : g.line.map((p) => [kindLine(p), p.d]);
    writeFileSync(
      new URL(`icons/${comp}.js`, dist),
      `import { createElement as h, forwardRef } from "react";
import { DevxSvg } from "../base.js";
const p = ${JSON.stringify(paths)};
const ${comp} = /*#__PURE__*/ forwardRef((props, ref) => h(DevxSvg, { ...props, ref, iconName: "${g.name}", paths: p${solid ? ", solid: true" : ""} }));
${comp}.displayName = "${comp}";
export { ${comp} };
export default ${comp};
`,
    );
    writeFileSync(
      new URL(`icons/${comp}.d.ts`, dist),
      `import type { DevxIcon } from "../types";\ndeclare const ${comp}: DevxIcon;\nexport { ${comp} };\nexport default ${comp};\n`,
    );
    exportsJs.push(`export { ${comp} } from "./icons/${comp}.js";`);
    exportsDts.push(`export { ${comp} } from "./icons/${comp}";`);
    names.push(comp);
  }
}
writeFileSync(new URL("index.js", dist), exportsJs.join("\n") + "\n");
writeFileSync(new URL("index.d.ts", dist), `export type { DevxIcon, DevxIconProps } from "./types";\n` + exportsDts.join("\n") + "\n");
writeFileSync(
  new URL("meta.js", dist),
  `export const iconNames = ${JSON.stringify(geo.map((g) => g.name))};\n`,
);
writeFileSync(new URL("meta.d.ts", dist), `export declare const iconNames: string[];\n`);
console.log(`react: ${names.length} components (${geo.length} icons × line/solid)`);
