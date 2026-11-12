// Generates the canonical SVG pack from source/:
//   packages/svg/line/*.svg, packages/svg/solid/*.svg, packages/svg/icons.json
//   build/geometry.json (shared by font / react / raster builds)
//   playground/public/data.json (preview site)
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { renderLineSvg, renderSolidSvg, type SolidPart } from "../packages/core/src/render.ts";
import { validateIcon } from "./lib/validate.ts";
import { loadIcons, ROOT } from "./lib/load.ts";
import { pathkit } from "./lib/pathkit.ts";
import { solidIcon } from "./lib/solid.ts";

const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

const PK = await pathkit();
let icons = await loadIcons();
if (only) icons = icons.filter((i) => i.name.startsWith(only) || i.base === only);

const svgDir = new URL("packages/svg/", ROOT);
for (const sub of ["line", "solid"]) {
  rmSync(new URL(sub + "/", svgDir), { recursive: true, force: true });
  mkdirSync(new URL(sub + "/", svgDir), { recursive: true });
}
mkdirSync(new URL("build/", ROOT), { recursive: true });
mkdirSync(new URL("playground/public/", ROOT), { recursive: true });

const t0 = Date.now();
const problems: string[] = [];
const geometry: { name: string; line: typeof icons[number]["parts"]; solid: SolidPart[] }[] = [];
const manifest: Record<string, { category: string; tags: string[]; base: string; variant: string | null }> = {};

icons.forEach((icon, i) => {
  let solid: SolidPart[];
  try {
    solid = solidIcon(PK, icon.baseParts, icon.variant, icon.solidFill);
  } catch (e) {
    problems.push(`${icon.name}: solid failed: ${(e as Error).message}`);
    solid = [];
  }
  problems.push(...validateIcon(icon, solid).map((p) => `${icon.name}: ${p}`));
  writeFileSync(new URL(`line/${icon.name}.svg`, svgDir), renderLineSvg(icon.parts) + "\n");
  writeFileSync(new URL(`solid/${icon.name}.svg`, svgDir), renderSolidSvg(solid) + "\n");
  geometry.push({ name: icon.name, line: icon.parts, solid });
  manifest[icon.name] = { category: icon.category, tags: icon.tags, base: icon.base, variant: icon.variant };
  if ((i + 1) % 500 === 0) console.log(`  ${i + 1}/${icons.length}…`);
});

writeFileSync(new URL("icons.json", svgDir), JSON.stringify(manifest, null, 1) + "\n");
writeFileSync(new URL("build/geometry.json", ROOT), JSON.stringify(geometry));
writeFileSync(
  new URL("playground/public/data.json", ROOT),
  JSON.stringify(
    icons.map((i, k) => ({
      n: i.name,
      c: i.category,
      t: i.tags.join(" "),
      v: i.variant,
      l: i.parts.map((p) => [p.role === "line" ? 0 : p.role === "accent" ? 1 : 2, p.d]),
      s: geometry[k]!.solid.map((p) => [p.accent ? 1 : 0, p.d]),
    })),
  ),
);

const bases = new Set(icons.map((i) => i.base)).size;
const cats = new Set(icons.map((i) => i.category)).size;
console.log(`generated ${icons.length} icons (${bases} bases, ${cats} categories) × 2 styles in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (problems.length) {
  console.error(`\n${problems.length} problems:\n  ${problems.slice(0, 60).join("\n  ")}`);
  process.exit(1);
}
