export {};
type Row = { n: string; c: string; t: string; v: string | null; l: [0 | 1 | 2, string][]; s: [0 | 1, string][] };

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const q = $<HTMLInputElement>("q");
const size = $<HTMLInputElement>("size");
const stroke = $<HTMLInputElement>("stroke");
const color = $<HTMLInputElement>("color");
const accent = $<HTMLInputElement>("accent");
const baseOnly = $<HTMLInputElement>("base-only");
const grid = $("grid");

const PAGE = 240;
let style: "line" | "solid" = "line";
let category = "all";
let rows: Row[] = [];
let shown: Row[] = [];
let rendered = 0;

const lineSvg = (r: Row, s: number, w: number) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">` +
  r.l
    .map(([k, d]) =>
      k === 0 ? `<path d="${d}"/>` : k === 1 ? `<path d="${d}" class="ac"/>` : `<path d="${d}" class="acf"/>`,
    )
    .join("") +
  `</svg>`;

const solidSvg = (r: Row, s: number) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">` +
  r.s.map(([k, d]) => (k ? `<path d="${d}" class="acs"/>` : `<path d="${d}"/>`)).join("") +
  `</svg>`;

const svgFor = (r: Row, s: number) => (style === "line" ? lineSvg(r, s, Number(stroke.value)) : solidSvg(r, s));

function exportSvg(r: Row): string {
  const acc = "var(--devx-accent,currentColor)";
  if (style === "solid")
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">${r.s
      .map(([k, d]) => (k ? `<path d="${d}" class="devx-accent" style="fill:${acc}"/>` : `<path d="${d}"/>`))
      .join("")}</svg>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke.value}" stroke-linecap="round" stroke-linejoin="round">${r.l
    .map(([k, d]) =>
      k === 0
        ? `<path d="${d}"/>`
        : k === 1
          ? `<path d="${d}" class="devx-accent" style="stroke:${acc}"/>`
          : `<path d="${d}" class="devx-accent" style="fill:${acc};stroke:none"/>`,
    )
    .join("")}</svg>`;
}

function filter() {
  const term = q.value.trim().toLowerCase();
  const words = term.split(/\s+/).filter(Boolean);
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
    next
      .map((r) => `<button class="cell" data-name="${r.n}" title="${r.n}">${svgFor(r, s)}<span>${r.n}</span></button>`)
      .join(""),
  );
  rendered += next.length;
}

function knobs() {
  $("size-v").textContent = `${size.value}px`;
  $("stroke-v").textContent = Number(stroke.value).toFixed(2);
  document.documentElement.style.setProperty("--icon", color.value);
  document.documentElement.style.setProperty("--devx-accent", accent.value);
  $("stroke-l").classList.toggle("off", style === "solid");
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

$("style").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest("button");
  if (!b) return;
  style = b.dataset.s as "line" | "solid";
  document.querySelectorAll("#style button").forEach((x) => x.classList.toggle("on", x === b));
  knobs();
  filter();
});
$("cats").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest("button");
  if (!b) return;
  category = b.dataset.c!;
  document.querySelectorAll("#cats button").forEach((x) => x.classList.toggle("on", x === b));
  filter();
});
grid.addEventListener("click", async (e) => {
  const cell = (e.target as HTMLElement).closest<HTMLElement>(".cell");
  if (!cell) return;
  const r = rows.find((x) => x.n === cell.dataset.name)!;
  try {
    await navigator.clipboard.writeText(exportSvg(r));
    toast(`Copied ${r.n}.svg (${style})`);
  } catch {
    toast("Clipboard not available here");
  }
});
let qTimer = 0;
q.addEventListener("input", () => {
  clearTimeout(qTimer);
  qTimer = window.setTimeout(filter, 120);
});
for (const el of [size, stroke]) el.addEventListener("change", filter);
for (const el of [size, stroke, color, accent]) el.addEventListener("input", knobs);
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
$("mark").innerHTML = lineSvg(mark, 20, 1.75);
$("hero-row").innerHTML = ["home", "bell-dot", "laptop-check", "folder-plus", "lock", "settings", "user-heart", "cloud-upload"]
  .map((n) => byName.get(n))
  .filter((r): r is Row => !!r)
  .map((r) => `<span>${lineSvg(r, 32, 1.75)}</span>`)
  .join("");
knobs();
filter();
