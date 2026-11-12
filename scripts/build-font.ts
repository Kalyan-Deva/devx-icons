// Icon fonts (line + solid), woff2 + ttf + CSS.
// Each icon has a base glyph (U+E000…) and, when it has an accent, an accent
// glyph (U+F0000…) that the CSS overlays via ::after in var(--devx-accent).
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { parsePath } from "../packages/core/src/path.ts";
import { polygons, pointInPolygon, runsToD, transformD } from "../packages/core/src/geom.ts";
import type { Part } from "../packages/core/src/dsl.ts";
import type { SolidPart } from "../packages/core/src/render.ts";
import { STROKE } from "../packages/core/src/variants.ts";
import { ROOT } from "./lib/load.ts";
import { fromD, pathkit, strokeOf, toD, union, type PK } from "./lib/pathkit.ts";

const require = createRequire(import.meta.url);
const svg2ttf = require("svg2ttf");
const wawoff2 = require("wawoff2");

const VERSION = JSON.parse(readFileSync(new URL("packages/font/package.json", ROOT), "utf8")).version as string;
type Geo = { name: string; line: Part[]; solid: SolidPart[] };
const geo: Geo[] = JSON.parse(readFileSync(new URL("build/geometry.json", ROOT), "utf8"));
const PKi = await pathkit();

// ---- stable codepoints -----------------------------------------------------
const cpFile = new URL("packages/font/codepoints.json", ROOT);
const codepoints: Record<string, number> = existsSync(cpFile) ? JSON.parse(readFileSync(cpFile, "utf8")) : {};
let next = Math.max(0xe000 - 1, ...Object.values(codepoints)) + 1;
for (const g of geo) if (!(g.name in codepoints)) codepoints[g.name] = next++;
if (next > 0xf8ff) throw new Error("ran out of BMP private-use codepoints");
const ACCENT_OFFSET = 0xf0000 - 0xe000; // accent glyph = base + offset (plane 15 PUA)

// ---- geometry → font units -------------------------------------------------
const UPM = 1000;
const k = UPM / 24;

/** Re-orient contours for the non-zero rule: outer clockwise, holes counter-clockwise (y-up). */
function fontPath(d: string): string {
  if (!d) return "";
  const subs = parsePath(d).filter((s) => s.segs.length);
  const polys = subs.map((s) => polygons(runsToD([s.segs], [true]))[0] ?? []);
  const area = (poly: { x: number; y: number }[]) => {
    let s = 0;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) s += (poly[j]!.x - poly[i]!.x) * (poly[j]!.y + poly[i]!.y);
    return s / 2; // y-down space: > 0 means clockwise on screen
  };
  const out: string[] = [];
  subs.forEach((sp, i) => {
    const poly = polys[i]!;
    if (poly.length < 3) return;
    const probe = poly[0]!;
    const depth = polys.filter((o, j) => j !== i && o.length > 2 && pointInPolygon(probe, o)).length;
    const cwScreen = area(poly) > 0;
    // Screen clockwise becomes counter-clockwise once y is flipped.
    // Want (in y-up): outer = clockwise  → screen counter-clockwise.
    const wantScreenCw = depth % 2 === 1;
    let segs = sp.segs;
    if (cwScreen !== wantScreenCw) {
      segs = [...segs].reverse().map((s) =>
        s.kind === "L" ? { kind: "L" as const, a: s.b, b: s.a } : { kind: "C" as const, a: s.b, c1: s.c2, c2: s.c1, b: s.a },
      );
    }
    out.push(runsToD([segs], [true]));
  });
  return transformD(out.join(""), (p) => ({ x: Math.round(p.x * k * 10) / 10, y: Math.round((24 - p.y) * k * 10) / 10 }));
}

function lineGlyphs(PK: PK, parts: Part[]): { base: string; accent: string } {
  const outline = (ps: Part[]) =>
    ps.length ? toD(union(PK, ps.map((p) => (p.role === "accent-fill" ? fromD(PK, p.d) : strokeOf(PK, p.d, STROKE)))), 3) : "";
  return { base: outline(parts.filter((p) => p.role === "line")), accent: outline(parts.filter((p) => p.role !== "line")) };
}

function solidGlyphs(parts: SolidPart[]): { base: string; accent: string } {
  return {
    base: parts.filter((p) => !p.accent).map((p) => p.d).join(""),
    accent: parts.filter((p) => p.accent).map((p) => p.d).join(""),
  };
}

const hex = (n: number) => n.toString(16);
const xmlEsc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

async function buildFont(style: "line" | "solid", family: string, file: string) {
  const glyphs: string[] = [];
  const hasAccent: Record<string, boolean> = {};
  for (const g of geo) {
    const { base, accent } = style === "line" ? lineGlyphs(PKi, g.line) : solidGlyphs(g.solid);
    const cp = codepoints[g.name]!;
    glyphs.push(`<glyph glyph-name="${g.name}" unicode="&#x${hex(cp)};" horiz-adv-x="${UPM}" d="${xmlEsc(fontPath(base))}"/>`);
    if (accent) {
      hasAccent[g.name] = true;
      glyphs.push(`<glyph glyph-name="${g.name}.accent" unicode="&#x${hex(cp + ACCENT_OFFSET)};" horiz-adv-x="${UPM}" d="${xmlEsc(fontPath(accent))}"/>`);
    }
  }
  const svgFont =
    `<?xml version="1.0" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<font id="${file}" horiz-adv-x="${UPM}"><font-face font-family="${family}" units-per-em="${UPM}" ascent="${UPM}" descent="0"/>` +
    `<missing-glyph horiz-adv-x="${UPM}"/>${glyphs.join("")}</font></defs></svg>`;
  const ttf = Buffer.from(svg2ttf(svgFont, { copyright: "DevX Icons — MIT License", description: `${family} ${VERSION}`, url: "https://github.com/devx-icons", version: `Version ${VERSION.split(".").slice(0, 2).join(".")}` }).buffer);
  const woff2 = Buffer.from(await wawoff2.compress(ttf));
  writeFileSync(new URL(`packages/font/fonts/${file}.ttf`, ROOT), ttf);
  writeFileSync(new URL(`packages/font/fonts/${file}.woff2`, ROOT), woff2);
  console.log(`  ${file}: ${glyphs.length} glyphs, ttf ${(ttf.length / 1024).toFixed(0)} KB, woff2 ${(woff2.length / 1024).toFixed(0)} KB`);
  return hasAccent;
}

rmSync(new URL("packages/font/fonts/", ROOT), { recursive: true, force: true });
mkdirSync(new URL("packages/font/fonts/", ROOT), { recursive: true });
console.log("building fonts…");
const accLine = await buildFont("line", "DevX Icons", "devx-icons");
const accSolid = await buildFont("solid", "DevX Icons Solid", "devx-icons-solid");

// ---- CSS -------------------------------------------------------------------
const esc = (n: number) => `"\\${hex(n)}"`;
let css = `/*! DevX Icons ${VERSION} | MIT | icon font */
@font-face {
  font-family: "DevX Icons";
  src: url("./fonts/devx-icons.woff2") format("woff2"), url("./fonts/devx-icons.ttf") format("truetype");
  font-display: block;
}
@font-face {
  font-family: "DevX Icons Solid";
  src: url("./fonts/devx-icons-solid.woff2") format("woff2"), url("./fonts/devx-icons-solid.ttf") format("truetype");
  font-display: block;
}
.devx, .devx-solid {
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: -0.125em;
  speak: never;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.devx { font-family: "DevX Icons" !important; }
.devx-solid { font-family: "DevX Icons Solid" !important; }
.devx::after, .devx-solid::after {
  position: absolute;
  left: 0;
  top: 0;
  color: var(--devx-accent, currentColor);
}
`;
for (const g of geo) {
  const cp = codepoints[g.name]!;
  css += `.devx-${g.name}::before { content: ${esc(cp)}; }\n`;
  if (accLine[g.name]) css += `.devx.devx-${g.name}::after { content: ${esc(cp + ACCENT_OFFSET)}; }\n`;
  if (accSolid[g.name]) css += `.devx-solid.devx-${g.name}::after { content: ${esc(cp + ACCENT_OFFSET)}; }\n`;
}
writeFileSync(new URL("packages/font/devx-icons.css", ROOT), css);
writeFileSync(cpFile, JSON.stringify(Object.fromEntries(Object.entries(codepoints).sort((a, b) => a[1] - b[1])), null, 1) + "\n");
console.log(`  devx-icons.css (${(css.length / 1024).toFixed(0)} KB), codepoints.json (${Object.keys(codepoints).length})`);
