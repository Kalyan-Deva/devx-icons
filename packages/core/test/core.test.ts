import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  C,
  STROKE,
  GAP,
  VARIANTS,
  applyVariantLine,
  cut,
  expand,
  parsePath,
  pointAt,
  renderLineSvg,
  renderSolidSvg,
  rot,
  runsToD,
  samplePoints,
  shapeToD,
  type BaseIcon,
} from "../src/index.ts";
import { loadBases } from "../../../scripts/lib/load.ts";
import { validateIcon } from "../../../scripts/lib/validate.ts";
import { fitD } from "../../../scripts/lib/fit.ts";

const end = (d: string) => parsePath(d).at(-1)!.segs.at(-1)!.b;

describe("path parser", () => {
  it("handles implicit lineto after relative moveto", () => {
    expect(parsePath("m16 16 4.5 4.5")[0]!.segs[0]!.b).toEqual({ x: 20.5, y: 20.5 });
  });
  it("lands arcs exactly on their end point", () => {
    const p = end("M4 9.5A4.5 4.5 0 0 1 12 7");
    expect(p.x).toBeCloseTo(12, 6);
    expect(p.y).toBeCloseTo(7, 6);
  });
  it("reads arc flags written without separators", () => {
    expect(end("M5 5a1 1 0 011 1")).toEqual({ x: 6, y: 6 });
  });
  it("converts quadratics", () => {
    const s = parsePath("M0 0Q5 10 10 0")[0]!.segs[0]!;
    expect(s.kind).toBe("C");
    expect(pointAt(s, 0.5).y).toBeCloseTo(5, 6);
  });
});

describe("geometry", () => {
  it("cut leaves an exact gap around a circle", () => {
    const { runs } = cut(parsePath("M2 12H22"), (p) => Math.hypot(p.x - 12, p.y - 12) < 3);
    expect(runs).toHaveLength(2);
    expect(runs[0]!.at(-1)!.b.x).toBeCloseTo(9, 4);
    expect(runs[1]![0]!.a.x).toBeCloseTo(15, 4);
  });
  it("cut re-joins a closed loop that wraps its start point", () => {
    const { runs } = cut(parsePath(C(12, 12, 9)), (p) => p.y > 18);
    expect(runs).toHaveLength(1);
  });
  it("rotation keeps points on the grid", () => {
    expect(rot("M12 4L12 8", 90)).toBe("M20 12L16 12");
  });
  it("curve fitting stays within tolerance", () => {
    // Like Skia's stroker output: a circle as 72 tiny quads.
    const N = 72;
    const at = (k: number, r = 9) => [12 + r * Math.cos((2 * Math.PI * k) / N), 12 + r * Math.sin((2 * Math.PI * k) / N)].map((v) => v.toFixed(3)).join(" ");
    const ctrl = (k: number) => at(k + 0.5, 9 / Math.cos(Math.PI / N));
    let raw = `M${at(0)}`;
    for (let k = 0; k < N; k++) raw += `Q${ctrl(k)} ${at(k + 1)}`;
    raw += "Z";
    const fit = fitD(raw, 0.03);
    expect(fit.length).toBeLessThan(raw.length / 4);
    for (const p of samplePoints(fit, 16)) expect(Math.abs(Math.hypot(p.x - 12, p.y - 12) - 9)).toBeLessThan(0.25);
  });
});

describe("variants", () => {
  const base: BaseIcon = { name: "doc", category: "files", tags: ["doc"], parts: [{ d: shapeToD({ tag: "rect", attrs: { x: "4", y: "3", width: "16", height: "18", rx: "2" } }), role: "line" }, { d: "M8 8h8", role: "accent" }], variants: ["plus", "off"] };
  it("names variants base-variant and keeps names unique", () => {
    expect(expand([base]).map((i) => i.name)).toEqual(["doc", "doc-plus", "doc-off"]);
  });
  it("demotes the base accent and adds the badge as the accent", () => {
    const parts = applyVariantLine(base.parts, VARIANTS.find((v) => v.id === "plus")!);
    const accents = parts.filter((p) => p.role !== "line");
    expect(accents.map((p) => p.d)).toEqual(["M18 15v6M15 18h6"]);
  });
  it("keeps the base clear of the badge by the visible gap", () => {
    const v = VARIANTS.find((x) => x.id === "plus")!;
    const parts = applyVariantLine(base.parts, v);
    const clear = 3 + STROKE + GAP - 0.01;
    for (const p of parts.filter((q) => q.role === "line")) for (const pt of samplePoints(p.d, 16)) expect(Math.hypot(pt.x - 18, pt.y - 18)).toBeGreaterThan(clear);
  });
});

describe("rendering", () => {
  it("line svg keeps strokes and wires the accent variable", () => {
    const svg = renderLineSvg([{ d: "M1 1h2", role: "line" }, { d: "M3 3h2", role: "accent" }]);
    expect(svg).toContain('stroke-width="1.75"');
    expect(svg).toContain("stroke:var(--devx-accent,currentColor)");
  });
  it("solid svg fills and supports a concrete accent", () => {
    const svg = renderSolidSvg([{ d: "M1 1h2v2z", accent: false }, { d: "M5 5h2v2z", accent: true }], { accent: "#f00" });
    expect(svg).toContain('fill="currentColor"');
    expect(svg).toContain("fill:#f00");
  });
});

describe("the icon set", async () => {
  const bases = await loadBases();
  const icons = expand(bases);
  it("has 4000+ uniquely named icons across categories", () => {
    expect(icons.length).toBeGreaterThan(4000);
    expect(new Set(icons.map((i) => i.name)).size).toBe(icons.length);
    expect(new Set(icons.map((i) => i.category)).size).toBeGreaterThanOrEqual(15);
  });
  it("every icon passes the line-style checks", () => {
    const bad = icons.flatMap((i) => validateIcon(i, [{ d: "M1 1h1v1z", accent: false }]).map((p) => `${i.name}: ${p}`));
    expect(bad).toEqual([]);
  });
  it("generated manifest matches the sources", () => {
    const f = new URL("../../svg/icons.json", import.meta.url);
    if (!existsSync(f)) return;
    expect(Object.keys(JSON.parse(readFileSync(f, "utf8"))).sort()).toEqual(icons.map((i) => i.name).sort());
  });
  it("font codepoints are unique private-use code points", () => {
    const f = new URL("../../font/codepoints.json", import.meta.url);
    if (!existsSync(f)) return;
    const cps = Object.values(JSON.parse(readFileSync(f, "utf8")) as Record<string, number>);
    expect(new Set(cps).size).toBe(cps.length);
    for (const c of cps) expect(c >= 0xe000 && c <= 0xf8ff).toBe(true);
  });
});

void runsToD;
