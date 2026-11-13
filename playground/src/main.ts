export {};
// @ts-expect-error generated at build time (pnpm generate)
import { devxSvg } from "./devx-runtime.js";

type Row = { n: string; c: string; t: string; v: string | null; a: [string, number?, number?]; l: [0 | 1 | 2, string][]; s: [0 | 1, string][] };
type Icon = { name: string; line: Row["l"]; solid: Row["s"]; anim: Row["a"] };
type Opts = { variant?: string; weight?: string; size?: number; animate?: boolean; title?: string };
const render = devxSvg as (i: Icon, o?: Opts) => string;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const q = $<HTMLInputElement>("q");
const size = $<HTMLInputElement>("size");
const color = $<HTMLInputElement>("color");
const accent = $<HTMLInputElement>("accent");
const animate = $<HTMLInputElement>("animate");
const baseOnly = $<HTMLInputElement>("base-only");
const grid = $("grid");

const PAGE = 240;
let variant = "line";
let weight = "regular";
let category = "all";
let rows: Row[] = [];
let shown: Row[] = [];
let rendered = 0;

const icon = (r: Row): Icon => ({ name: r.n, line: r.l, solid: r.s, anim: r.a });
const opts = (s: number): Opts => ({ variant, weight, size: s, animate: animate.checked });

function filter() {
  const words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  shown = rows.filter(
    (r) =>
      (category === "all" || r.c === category) &&
      (!baseOnly.checked || r.v === null) &&
      words.every((w) => r.n.includes(w) || r.t.includes(w)),
  );
  grid.innerHTML = "";
  rendered = 0;
  $("result").textContent = `${shown.length.toLocaleString()} icons`;
  $("empty").hidden = shown.length > 0;
  more();
}

function more() {
  const s = Number(size.value);
  const next = shown.slice(rendered, rendered + PAGE);
  grid.insertAdjacentHTML(
    "beforeend",
    next.map((r) => `<button class="cell" data-name="${r.n}" title="${r.n}">${render(icon(r), opts(s))}<span>${r.n}</span></button>`).join(""),
  );
  rendered += next.length;
}

function knobs() {
  $("size-v").textContent = `${size.value}px`;
  document.documentElement.style.setProperty("--icon", color.value);
  document.documentElement.style.setProperty("--devx-accent", accent.value);
  $("weight").classList.toggle("off", variant === "solid" || variant === "bulk");
}

let toastTimer = 0;
function toast(msg: string) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove("show"), 1400);
}

new IntersectionObserver((e) => {
  if (e[0]?.isIntersecting && rendered < shown.length) more();
}, { rootMargin: "800px" }).observe($("sentinel"));

function seg(id: string, key: string, set: (v: string) => void) {
  $(id).addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("button");
    if (!b) return;
    set(b.dataset[key]!);
    document.querySelectorAll(`#${id} button`).forEach((x) => x.classList.toggle("on", x === b));
    knobs();
    filter();
  });
}
seg("style", "s", (v) => (variant = v));
seg("weight", "w", (v) => (weight = v));
seg("cats", "c", (v) => (category = v));

grid.addEventListener("click", async (e) => {
  const cell = (e.target as HTMLElement).closest<HTMLElement>(".cell");
  if (!cell) return;
  const r = rows.find((x) => x.n === cell.dataset.name)!;
  try {
    await navigator.clipboard.writeText(render(icon(r), opts(24)));
    toast(`Copied ${r.n}.svg (${variant}${variant === "line" || variant === "duotone" ? `, ${weight}` : ""}${animate.checked ? ", animated" : ""})`);
  } catch {
    toast("Clipboard not available here");
  }
});
let qTimer = 0;
q.addEventListener("input", () => {
  clearTimeout(qTimer);
  qTimer = window.setTimeout(filter, 120);
});
size.addEventListener("change", filter);
for (const el of [size, color, accent]) el.addEventListener("input", knobs);
animate.addEventListener("change", filter);
baseOnly.addEventListener("change", filter);

const res = await fetch(`${import.meta.env.BASE_URL}data.json`);
rows = await res.json();
const byName = new Map(rows.map((r) => [r.n, r]));
const counts = new Map<string, number>();
for (const r of rows) counts.set(r.c, (counts.get(r.c) ?? 0) + 1);
const cats = [...counts.keys()].sort();
$("cats").innerHTML =
  `<button data-c="all" class="on">all <i>${rows.length.toLocaleString()}</i></button>` +
  cats.map((c) => `<button data-c="${c}">${c} <i>${counts.get(c)!.toLocaleString()}</i></button>`).join("");
$("count").textContent = `${rows.length.toLocaleString()} icons`;
$("hero-count").textContent = rows.length.toLocaleString();
const mark = byName.get("scan-box") ?? rows[0]!;
$("mark").innerHTML = render(icon(mark), { size: 20 });
$("hero-row").innerHTML = (
  [
    ["settings", "line"],
    ["bell-dot", "duotone"],
    ["shield-check", "solid"],
    ["malware", "bulk"],
    ["lattice", "line"],
    ["cloud-upload", "duotone"],
    ["key-exchange", "line"],
    ["heart", "bulk"],
  ] as const
)
  .map(([n, v]) => byName.get(n) && `<span>${render(icon(byName.get(n)!), { size: 32, variant: v, animate: true })}</span>`)
  .filter(Boolean)
  .join("");
knobs();
filter();
