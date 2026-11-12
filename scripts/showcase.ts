// README images: docs/images/showcase-line.png, showcase-solid.png, variants.png
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { ROOT } from "./lib/load.ts";

type Geo = { name: string; line: { d: string; role: string }[]; solid: { d: string; accent: boolean }[] };
const geo = new Map<string, Geo>((JSON.parse(readFileSync(new URL("build/geometry.json", ROOT), "utf8")) as Geo[]).map((g) => [g.name, g]));
const INK = "#111111";
const ACC = "#ff5a1f";

const PICK = [
  "home", "search", "settings", "bell-dot", "mail", "message-dots", "user", "users", "calendar", "clock", "lock", "shield-check",
  "folder-plus", "file-code", "cloud-upload", "database", "server", "terminal", "code", "git-branch", "laptop", "smartphone", "camera", "headphones",
  "chart-pie", "shopping-cart", "credit-card", "wallet", "gift", "trophy", "rocket", "map-pin", "plane", "car", "globe", "compass",
  "sun", "moon", "cloud-lightning", "flame", "leaf", "sparkles", "heart-pulse", "pill", "coffee", "lightbulb", "image", "music",
  "play", "volume", "video-call", "trash", "edit-box", "download", "eye-off", "scan-face", "qr-code", "fingerprint", "key", "bug",
];

function icon(g: Geo, style: "line" | "solid", x: number, y: number, size: number): string {
  const t = `translate(${x} ${y}) scale(${size / 24})`;
  if (style === "line")
    return `<g transform="${t}" fill="none" stroke="${INK}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${g.line
      .map((p) => (p.role === "line" ? `<path d="${p.d}"/>` : p.role === "accent" ? `<path d="${p.d}" stroke="${ACC}"/>` : `<path d="${p.d}" fill="${ACC}" stroke="none"/>`))
      .join("")}</g>`;
  return `<g transform="${t}" fill="${INK}" fill-rule="evenodd">${g.solid.map((p) => (p.accent ? `<path d="${p.d}" fill="${ACC}"/>` : `<path d="${p.d}"/>`)).join("")}</g>`;
}

function grid(names: string[], style: "line" | "solid", cols: number, file: string, size = 32, gap = 40) {
  const items = names.map((n) => geo.get(n)).filter((g): g is Geo => !!g);
  const missing = names.filter((n) => !geo.has(n));
  if (missing.length) console.warn("missing:", missing.join(", "));
  const cell = size + gap;
  const pad = 36;
  const rows = Math.ceil(items.length / cols);
  const W = cols * cell - gap + pad * 2;
  const H = rows * cell - gap + pad * 2;
  const body = items.map((g, i) => icon(g, style, pad + (i % cols) * cell, pad + Math.floor(i / cols) * cell, size)).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" rx="20" fill="#ffffff"/>${body}</svg>`;
  const png = new Resvg(svg, { fitTo: { mode: "zoom", value: 2 }, font: { loadSystemFonts: false } }).render().asPng();
  writeFileSync(new URL(`docs/images/${file}.png`, ROOT), png);
  console.log(`docs/images/${file}.png`);
}

mkdirSync(new URL("docs/images/", ROOT), { recursive: true });
grid(PICK, "line", 12, "showcase-line");
grid(PICK, "solid", 12, "showcase-solid");
const VAR = ["folder", ...["plus", "minus", "check", "x", "alert", "clock", "lock", "search", "star", "heart", "upload", "download", "edit", "bolt", "off", "dot"].map((v) => `folder-${v}`)];
grid(VAR, "line", 17, "variants-line", 32, 28);
grid(VAR, "solid", 17, "variants-solid", 32, 28);
