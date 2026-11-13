// PNG + ICO export.
//   dist/raster/png/<style>/<size>/<name>.png   (16 24 32 48 64 128 256)
//   dist/raster/ico/<style>/<name>.ico          (all sizes in one .ico, PNG-compressed entries)
// Options: --ink=#111111 --accent=#ff5a1f --limit=N --workers=N
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { fileURLToPath } from "node:url";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { Resvg } from "@resvg/resvg-js";
import { renderBulkSvg, renderDuotoneSvg, renderLineSvg, renderSolidSvg, type SolidPart } from "../packages/core/src/render.ts";
import type { Part } from "../packages/core/src/dsl.ts";

const SIZES = [16, 24, 32, 48, 64, 128, 256];
const STYLES = ["line", "solid", "duotone", "bulk"] as const;
type Geo = { name: string; line: Part[]; solid: SolidPart[] };
type Job = { root: string; ink: string; accent: string; items: Geo[] };

function ico(pngs: { size: number; data: Buffer }[]): Buffer {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach((p, i) => {
    const o = i * 16;
    dir.writeUInt8(p.size >= 256 ? 0 : p.size, o);
    dir.writeUInt8(p.size >= 256 ? 0 : p.size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(p.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += p.data.length;
  });
  return Buffer.concat([head, dir, ...pngs.map((p) => p.data)]);
}

function work(job: Job): number {
  let n = 0;
  for (const g of job.items) {
    for (const style of STYLES) {
      const o = { color: job.ink, accent: job.accent };
      const svg =
        style === "line"
          ? renderLineSvg(g.line, o)
          : style === "solid"
            ? renderSolidSvg(g.solid, o)
            : style === "duotone"
              ? renderDuotoneSvg(g.line, g.solid, o)
              : renderBulkSvg(g.solid, o);
      const pngs = SIZES.map((size) => ({
        size,
        data: Buffer.from(new Resvg(svg, { fitTo: { mode: "width", value: size }, shapeRendering: 2, font: { loadSystemFonts: false } }).render().asPng()),
      }));
      for (const p of pngs) writeFileSync(`${job.root}/dist/raster/png/${style}/${p.size}/${g.name}.png`, p.data);
      writeFileSync(`${job.root}/dist/raster/ico/${style}/${g.name}.ico`, ico(pngs));
      n++;
    }
  }
  return n;
}

if (!isMainThread) {
  parentPort!.postMessage(work(workerData as Job));
} else {
  const root = fileURLToPath(new URL("../", import.meta.url)).replace(/[\\/]$/, "");
  const arg = (k: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
  const ink = arg("ink") ?? "#111111";
  const accent = arg("accent") ?? "#ff5a1f";
  let geo: Geo[] = JSON.parse(readFileSync(`${root}/build/geometry.json`, "utf8"));
  if (arg("limit")) geo = geo.slice(0, Number(arg("limit")));
  rmSync(`${root}/dist/raster`, { recursive: true, force: true });
  for (const style of STYLES) {
    for (const s of SIZES) mkdirSync(`${root}/dist/raster/png/${style}/${s}`, { recursive: true });
    mkdirSync(`${root}/dist/raster/ico/${style}`, { recursive: true });
  }
  const W = Number(arg("workers") ?? 1);
  const t0 = Date.now();
  const chunks = Array.from({ length: W }, (_, i) => geo.filter((_, k) => k % W === i));
  const done = await Promise.all(
    chunks.map(
      (items) =>
        new Promise<number>((res, rej) => {
          const w = new Worker(new URL(import.meta.url), {
            workerData: { root, ink, accent, items } satisfies Job,
            execArgv: ["--import", "tsx"],
          });
          w.on("message", res);
          w.on("error", rej);
        }),
    ),
  );
  const icons = done.reduce((a, b) => a + b, 0);
  console.log(`raster: ${icons} icon×style → ${icons * SIZES.length} PNGs + ${icons} ICOs with ${W} workers in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
