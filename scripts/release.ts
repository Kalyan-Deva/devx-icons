// Packs everything for publishing — nothing is uploaded.
//   release/devx-icons-<v>-svg.zip    line + solid SVGs, sprites, icons.json
//   release/devx-icons-<v>-font.zip   woff2 + ttf + css + codepoints
//   release/devx-icons-<v>-png.zip    PNG 16–256 (line + solid)
//   release/devx-icons-<v>-ico.zip    multi-size ICO (line + solid)
//   release/npm/*.tgz                 npm pack of devx-icons, @devx-icons/font, @devx-icons/react
import { execFileSync, execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url)).replace(/[\\/]$/, "");
const v = JSON.parse(readFileSync(`${root}/packages/svg/package.json`, "utf8")).version as string;
const out = `${root}/release`;
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/npm`, { recursive: true });

const TAR = process.platform === "win32" ? "C:\\Windows\\System32\\tar.exe" : "zip";
function zip(name: string, dir: string, entries: string[]) {
  const file = `${out}/devx-icons-${v}-${name}.zip`;
  if (process.platform === "win32") execFileSync(TAR, ["-a", "-c", "-f", file, "-C", dir, ...entries], { stdio: "inherit" });
  else execFileSync("zip", ["-qr", file, ...entries], { cwd: dir, stdio: "inherit" });
  console.log(`  ${file.slice(root.length + 1)}  ${(statSync(file).size / 1024 / 1024).toFixed(1)} MB`);
}

// A LICENSE + short README goes inside every zip.
const stage = `${root}/build/stage`;
rmSync(stage, { recursive: true, force: true });
const docs = (dir: string, what: string) => {
  mkdirSync(dir, { recursive: true });
  cpSync(`${root}/LICENSE`, `${dir}/LICENSE`);
  writeFileSync(`${dir}/README.txt`, `DevX Icons ${v} — ${what}\nhttps://github.com/Kalyan-Deva/devx-icons\nMIT licensed. See LICENSE.\n`);
};

console.log("packing release…");
docs(`${stage}/svg`, "SVG (line/, solid/, sprite/, icons.json)");
for (const d of ["line", "solid", "sprite"]) cpSync(`${root}/packages/svg/${d}`, `${stage}/svg/${d}`, { recursive: true });
cpSync(`${root}/packages/svg/icons.json`, `${stage}/svg/icons.json`);
zip("svg", `${stage}/svg`, ["."]);

docs(`${stage}/font`, "icon font (fonts/, devx-icons.css, codepoints.json)");
cpSync(`${root}/packages/font/fonts`, `${stage}/font/fonts`, { recursive: true });
for (const f of ["devx-icons.css", "codepoints.json"]) cpSync(`${root}/packages/font/${f}`, `${stage}/font/${f}`);
zip("font", `${stage}/font`, ["."]);

if (existsSync(`${root}/dist/raster/png`)) {
  docs(`${root}/dist/raster/png`, "PNG at 16/24/32/48/64/128/256 (line/, solid/)");
  zip("png", `${root}/dist/raster/png`, ["."]);
  docs(`${root}/dist/raster/ico`, "ICO with 16–256 px in each file (line/, solid/)");
  zip("ico", `${root}/dist/raster/ico`, ["."]);
} else console.log("  (no dist/raster yet — run pnpm build:raster for PNG/ICO zips)");

for (const p of ["svg", "font", "react"]) {
  cpSync(`${root}/LICENSE`, `${root}/packages/${p}/LICENSE`);
  execSync(`pnpm pack --pack-destination "${out}/npm"`, { cwd: `${root}/packages/${p}`, stdio: "ignore" });
}
console.log(`  release/npm: ${readdirSync(`${out}/npm`).join(", ")}`);
rmSync(stage, { recursive: true, force: true });
