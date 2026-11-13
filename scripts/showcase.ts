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

type St = "line" | "solid" | "duotone" | "bulk";
function icon(g: Geo, style: St, x: number, y: number, size: number, sw = 1.75): string {
  const t = `translate(${x} ${y}) scale(${size / 24})`;
  if (style === "duotone")
    return `<g transform="${t}">${g.solid.filter((p) => !p.accent).map((p) => `<path d="${p.d}" fill="${ACC}" fill-opacity="0.2" fill-rule="evenodd"/>`).join("")}</g>` + icon(g, "line", x, y, size, sw);
  if (style === "bulk")
    return `<g transform="${t}" fill-rule="evenodd">${g.solid.map((p) => (p.accent ? `<path d="${p.d}" fill="${ACC}"/>` : `<path d="${p.d}" fill="${INK}" fill-opacity="0.35"/>`)).join("")}</g>`;
  if (style === "line")
    return `<g transform="${t}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${g.line
      .map((p) => (p.role === "line" ? `<path d="${p.d}"/>` : p.role === "accent" ? `<path d="${p.d}" stroke="${ACC}"/>` : `<path d="${p.d}" fill="${ACC}" stroke="none"/>`))
      .join("")}</g>`;
  return `<g transform="${t}" fill="${INK}" fill-rule="evenodd">${g.solid.map((p) => (p.accent ? `<path d="${p.d}" fill="${ACC}"/>` : `<path d="${p.d}"/>`)).join("")}</g>`;
}

function grid(names: string[], style: St, cols: number, file: string, size = 32, gap = 40) {
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

// Social card 1280×640 (repo social preview + og:image)
{
  const names = ["home", "settings", "bell-dot", "shield-check", "folder-plus", "cloud-upload", "terminal", "git-branch", "rocket", "sparkles", "chart-pie", "lock", "user-heart", "camera-off", "map-pin", "coffee"];
  const items = names.map((n) => geo.get(n)!).filter(Boolean);
  const S = 64, G = 34, cols = 4, x0 = 741, y0 = 141;
  const body = items
    .map((g, i) => icon(g, i % 2 ? "solid" : "line", x0 + (i % cols) * (S + G), y0 + Math.floor(i / cols) * (S + G), S))
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640">
<rect width="1280" height="640" fill="#f5f6f8"/>
<rect x="640" y="70" width="560" height="500" rx="28" fill="#ffffff" stroke="#e6e8ec"/>
<text x="80" y="250" font-family="Segoe UI, Arial" font-weight="700" font-size="84" fill="#111111">DevX Icons</text>
<text x="82" y="318" font-family="Segoe UI, Arial" font-size="34" fill="#6b7280">7,418 open-source icons</text>
<text x="82" y="366" font-family="Segoe UI, Arial" font-size="34" fill="#6b7280">8 styles, open loop, one accent</text>
<rect x="82" y="420" width="16" height="16" rx="8" fill="#ff5a1f"/>
<text x="110" y="434" font-family="Segoe UI, Arial" font-size="22" fill="#111111">SVG · Font · React · Vue · Svelte · Iconify · MIT</text>
${body}</svg>`;
  const png = new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng();
  writeFileSync(new URL("docs/images/social-preview.png", ROOT), png);
  mkdirSync(new URL("playground/public/", ROOT), { recursive: true });
  writeFileSync(new URL("playground/public/social-preview.png", ROOT), png);
  console.log("docs/images/social-preview.png");
}

// Styles comparison: one row per style
{
  const names = ["home", "settings", "bell-dot", "shield-check", "folder-plus", "malware", "key-exchange", "lattice", "cloud-upload", "heart"];
  const rows: [string, St, number][] = [["thin", "line", 1], ["light", "line", 1.25], ["regular", "line", 1.75], ["bold", "line", 2.25], ["solid", "solid", 0], ["duotone", "duotone", 1.75], ["bulk", "bulk", 0]];
  const S = 32, G = 36, L = 130, pad = 32;
  const W = L + names.length * (S + G) - G + pad * 2;
  const H = rows.length * (S + 28) - 28 + pad * 2;
  let body = "";
  rows.forEach(([label, st, sw], r) => {
    const y = pad + r * (S + 28);
    body += `<text x="${pad}" y="${y + 22}" font-family="Segoe UI, Arial" font-size="15" fill="#6b7280">${label}</text>`;
    names.forEach((n, i) => { const g = geo.get(n); if (g) body += icon(g, st, pad + L + i * (S + G), y, S, sw || 1.75); });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" rx="20" fill="#ffffff"/>${body}</svg>`;
  writeFileSync(new URL("docs/images/styles.png", ROOT), new Resvg(svg, { fitTo: { mode: "zoom", value: 2 }, font: { loadSystemFonts: true } }).render().asPng());
  console.log("docs/images/styles.png");
}
// Security showcase
grid(["malware", "ransomware", "phishing", "hacker", "exploit", "payload", "backdoor", "botnet", "ddos", "sql-injection", "xss", "zero-day",
  "encryption", "key-exchange", "digital-signature", "hash-function", "certificate-chain", "lattice", "post-quantum", "quantum-shield", "hsm", "tpm", "secure-boot", "one-time-code",
  "vpn", "proxy", "cluster", "sbom", "supply-chain", "packet", "audit-log", "access-control", "privacy", "siem", "onion-routing", "https"], "line", 12, "security");
