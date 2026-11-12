import { readdirSync } from "node:fs";
import { expand, type BaseIcon, type IconDef } from "../../packages/core/src/variants.ts";

export const ROOT = new URL("../../", import.meta.url);

/** All base icons from source/*.ts (one file per category). */
export async function loadBases(): Promise<BaseIcon[]> {
  const dir = new URL("source/", ROOT);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_"))
    .sort();
  const bases: BaseIcon[] = [];
  for (const f of files) {
    const url = new URL(f, dir);
    // Vite (vitest) wants a plain path; Node/tsx wants a file URL. "Code Projects" has a space.
    const mod = await import(process.env.VITEST ? decodeURIComponent(url.pathname).replace(/^\/([A-Za-z]:)/, "$1") : url.href);
    bases.push(...(mod.default as BaseIcon[]));
  }
  return bases;
}

export async function loadIcons(): Promise<IconDef[]> {
  return expand(await loadBases());
}
