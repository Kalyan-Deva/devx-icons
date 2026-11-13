import { loadBases } from "./lib/load.ts";
const bases = await loadBases();
const gen = new Map<string, string>();
const dups: string[] = [];
for (const b of bases) for (const n of [b.name, ...b.variants.map((v) => `${b.name}-${v}`)]) {
  if (gen.has(n)) dups.push(`${n} (${gen.get(n)} vs ${b.name})`); else gen.set(n, b.name);
}
console.log(dups.length ? dups.join("\n") : "no collisions", "\nbases:", bases.length, "icons:", gen.size);
