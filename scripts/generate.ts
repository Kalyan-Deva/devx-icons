// Generates the canonical SVG pack from source/:
//   packages/svg/<style>/*.svg  for line (regular), thin, light, bold, solid, duotone, bulk, animated
//   packages/svg/icons.json     manifest (category, tags, base, variant, animation)
//   build/geometry.json         shared by font / packages / raster builds
//   playground/public/data.json preview site
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import {
  WEIGHTS,
  renderAnimatedSvg,
  renderBulkSvg,
  renderDuotoneSvg,
  renderLineSvg,
  renderSolidSvg,
  type SolidPart,
} from "../packages/core/src/render.ts";
import { ANIM_CSS, animFor, type Anim } from "../packages/core/src/anim.ts";
import { readFileSync } from "node:fs";
import { validateIcon } from "./lib/validate.ts";
import { loadIcons, ROOT } from "./lib/load.ts";
import { pathkit } from "./lib/pathkit.ts";
import { solidIcon } from "./lib/solid.ts";

export const STYLES = ["line", "thin", "light", "bold", "solid", "duotone", "bulk", "animated"] as const;

const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

const PK = await pathkit();
let icons = await loadIcons();
if (only) icons = icons.filter((i) => i.name.startsWith(only) || i.base === only);

const svgDir = new URL("packages/svg/", ROOT);
for (const sub of STYLES) {
  rmSync(new URL(sub + "/", svgDir), { recursive: true, force: true });
  mkdirSync(new URL(sub + "/", svgDir), { recursive: true });
}
mkdirSync(new URL("build/", ROOT), { recursive: true });
mkdirSync(new URL("playground/public/", ROOT), { recursive: true });

const t0 = Date.now();
const problems: string[] = [];
const geometry: { name: string; line: typeof icons[number]["parts"]; solid: SolidPart[]; anim: Anim }[] = [];
const manifest: Record<string, { category: string; tags: string[]; base: string; variant: string | null; animation: string }> = {};
const w = (style: string, name: string, svg: string) => writeFileSync(new URL(`${style}/${name}.svg`, svgDir), svg + "\n");

icons.forEach((icon, i) => {
  let solid: SolidPart[];
  try {
    solid = solidIcon(PK, icon.baseParts, icon.variant, icon.solidFill);
  } catch (e) {
    problems.push(`${icon.name}: solid failed: ${(e as Error).message}`);
    solid = [];
  }
  problems.push(...validateIcon(icon, solid).map((p) => `${icon.name}: ${p}`));
  const anim = animFor(icon.name, icon.base, icon.variant, icon.category);
  w("line", icon.name, renderLineSvg(icon.parts));
  w("thin", icon.name, renderLineSvg(icon.parts, { strokeWidth: WEIGHTS.thin }));
  w("light", icon.name, renderLineSvg(icon.parts, { strokeWidth: WEIGHTS.light }));
  w("bold", icon.name, renderLineSvg(icon.parts, { strokeWidth: WEIGHTS.bold }));
  w("solid", icon.name, renderSolidSvg(solid));
  w("duotone", icon.name, renderDuotoneSvg(icon.parts, solid));
  w("bulk", icon.name, renderBulkSvg(solid));
  w("animated", icon.name, renderAnimatedSvg(icon.parts, anim));
  geometry.push({ name: icon.name, line: icon.parts, solid, anim });
  manifest[icon.name] = { category: icon.category, tags: icon.tags, base: icon.base, variant: icon.variant, animation: anim.kind };
  if ((i + 1) % 1000 === 0) console.log(`  ${i + 1}/${icons.length}…`);
});

writeFileSync(new URL("icons.json", svgDir), JSON.stringify(manifest, null, 1) + "\n");
writeFileSync(new URL("build/geometry.json", ROOT), JSON.stringify(geometry));
writeFileSync(
  new URL("playground/public/data.json", ROOT),
  JSON.stringify(
    icons.map((i, k) => {
      const a = geometry[k]!.anim;
      return {
        n: i.name,
        c: i.category,
        t: i.tags.join(" "),
        v: i.variant,
        a: a.kind === "nudge" ? [a.kind, a.dx, a.dy] : [a.kind],
        l: i.parts.map((p) => [p.role === "line" ? 0 : p.role === "accent" ? 1 : 2, p.d]),
        s: geometry[k]!.solid.map((p) => [p.accent ? 1 : 0, p.d]),
      };
    }),
  ),
);

// Shared runtime for the preview site (same renderer the packages ship).
writeFileSync(
  new URL("playground/src/devx-runtime.js", ROOT),
  readFileSync(new URL("scripts/lib/runtime.js", ROOT), "utf8").replace("__ANIM_CSS__", JSON.stringify(ANIM_CSS)),
);

const bases = new Set(icons.map((i) => i.base)).size;
const cats = new Set(icons.map((i) => i.category)).size;
console.log(
  `generated ${icons.length} icons (${bases} bases, ${cats} categories) × ${STYLES.length} styles = ${icons.length * STYLES.length} SVGs in ${((Date.now() - t0) / 1000).toFixed(1)}s`,
);
if (problems.length) {
  console.error(`\n${problems.length} problems:\n  ${problems.slice(0, 60).join("\n  ")}`);
  process.exit(1);
}
