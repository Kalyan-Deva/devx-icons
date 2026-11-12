// Renders QA contact sheets: build/sheets/<category>-<style>.png
//   --variants=<base>  sheet of one base with all its variants
//   --all              include variants (default: bases only)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { ROOT } from "./lib/load.ts";

type Geo = { name: string; line: { d: string; role: string }[]; solid: { d: string; accent: boolean }[] };
const geo: Geo[] = JSON.parse(readFileSync(new URL("build/geometry.json", ROOT), "utf8"));
const meta: Record<string, { category: string; variant: string | null; base: string }> = JSON.parse(
  readFileSync(new URL("packages/svg/icons.json", ROOT), "utf8"),
);

const INK = "#111111";
const ACC = "#ff5a1f";
const arg = (k: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const all = process.argv.includes("--all");
const onlyBase = arg("variants");
const onlyCat = arg("cat");

const COLS = 10;
const CELL = 96;
const ICON = 40;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function icon(g: Geo, style: "line" | "solid", x: number, y: number): string {
  const k = ICON / 24;
  const t = `translate(${x} ${y}) scale(${k})`;
  if (style === "line")
    return `<g transform="${t}" fill="none" stroke="${INK}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${g.line
      .map((p) =>
        p.role === "line" ? `<path d="${p.d}"/>` : p.role === "accent" ? `<path d="${p.d}" stroke="${ACC}"/>` : `<path d="${p.d}" fill="${ACC}" stroke="none"/>`,
      )
      .join("")}</g>`;
  return `<g transform="${t}" fill="${INK}" fill-rule="evenodd">${g.solid
    .map((p) => (p.accent ? `<path d="${p.d}" fill="${ACC}"/>` : `<path d="${p.d}"/>`))
    .join("")}</g>`;
}

function sheet(items: Geo[], style: "line" | "solid", file: string) {
  const rows = Math.ceil(items.length / COLS);
  const W = COLS * CELL;
  const H = rows * CELL;
  const cells = items
    .map((g, i) => {
      const cx = (i % COLS) * CELL;
      const cy = Math.floor(i / COLS) * CELL;
      return (
        `<rect x="${cx + 0.5}" y="${cy + 0.5}" width="${CELL - 1}" height="${CELL - 1}" fill="#fff" stroke="#e6e8ec"/>` +
        icon(g, style, cx + (CELL - ICON) / 2, cy + 14) +
        `<text x="${cx + CELL / 2}" y="${cy + CELL - 12}" font-family="Segoe UI, Arial" font-size="10" fill="#6b7280" text-anchor="middle">${esc(g.name.length > 17 ? g.name.slice(0, 16) + "…" : g.name)}</text>`
      );
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#f5f6f8"/>${cells}</svg>`;
  const png = new Resvg(svg, { font: { loadSystemFonts: true }, fitTo: { mode: "width", value: W } }).render().asPng();
  writeFileSync(new URL(`build/sheets/${file}.png`, ROOT), png);
  console.log(`build/sheets/${file}.png (${items.length})`);
}

mkdirSync(new URL("build/sheets/", ROOT), { recursive: true });
if (onlyBase) {
  const items = geo.filter((g) => meta[g.name]?.base === onlyBase);
  sheet(items, "line", `${onlyBase}-variants-line`);
  sheet(items, "solid", `${onlyBase}-variants-solid`);
} else {
  const cats = [...new Set(Object.values(meta).map((m) => m.category))].filter((c) => !onlyCat || c === onlyCat);
  for (const c of cats) {
    const items = geo.filter((g) => meta[g.name]?.category === c && (all || meta[g.name]?.variant === null));
    sheet(items, "line", `${c}-line`);
    sheet(items, "solid", `${c}-solid`);
  }
}
