// Renders glyphs from the built TTFs (base + accent overlay) to check orientation/holes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { ROOT } from "./lib/load.ts";

const cps: Record<string, number> = JSON.parse(readFileSync(new URL("packages/font/codepoints.json", ROOT), "utf8"));
const names = (process.argv[2] ?? "home,settings,eye,lock,folder-plus,bell-dot,camera-off,user-heart,trash,cloud-upload,shield-check,laptop,gift,map-pin,chart-pie,flame-off").split(",");
const OFF = 0xf0000 - 0xe000;

for (const [style, family, file] of [
  ["line", "DevX Icons", "devx-icons"],
  ["solid", "DevX Icons Solid", "devx-icons-solid"],
] as const) {
  const S = 56;
  const W = names.length * (S + 16) + 16;
  const ch = (n: number) => `&#x${n.toString(16)};`;
  const text = names
    .map((n, i) => {
      const x = 16 + i * (S + 16);
      return `<text x="${x}" y="${16 + S}" font-family="${family}" font-size="${S}" fill="#111">${ch(cps[n]!)}</text>` +
        `<text x="${x}" y="${16 + S}" font-family="${family}" font-size="${S}" fill="#ff5a1f">${ch(cps[n]! + OFF)}</text>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${S + 32}"><rect width="100%" height="100%" fill="#fff"/>${text}</svg>`;
  const fontFile = fileURLToPath(new URL(`packages/font/fonts/${file}.ttf`, ROOT));
  const png = new Resvg(svg, { font: { fontFiles: [fontFile], loadSystemFonts: false, defaultFontFamily: family } }).render().asPng();
  mkdirSync(new URL("build/sheets/", ROOT), { recursive: true });
  writeFileSync(new URL(`build/sheets/font-${style}.png`, ROOT), png);
  console.log(`build/sheets/font-${style}.png`);
}
