import type { Part } from "./dsl.js";

export const ACCENT_VAR = "--devx-accent";
const ACCENT = `var(${ACCENT_VAR},currentColor)`;

export interface SvgOptions {
  size?: number;
  strokeWidth?: number;
  color?: string;
  /** Concrete accent colour (raster export). Default: the CSS variable with currentColor fallback. */
  accent?: string;
}

export interface SolidPart {
  d: string;
  accent: boolean;
}

/** Line style: real strokes, so stroke width stays adjustable. */
export function renderLineSvg(parts: Part[], o: SvgOptions = {}): string {
  const size = o.size ?? 24;
  const color = o.color ?? "currentColor";
  const acc = o.accent ?? ACCENT;
  const body = parts
    .map((p) => {
      if (p.role === "accent") return `<path d="${p.d}" class="devx-accent" style="stroke:${acc}"/>`;
      if (p.role === "accent-fill") return `<path d="${p.d}" class="devx-accent" style="fill:${acc};stroke:none"/>`;
      return `<path d="${p.d}"/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
    `stroke="${color}" stroke-width="${o.strokeWidth ?? 1.75}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  );
}

/** Solid style: filled outlines (stroke width does not apply). */
export function renderSolidSvg(parts: SolidPart[], o: SvgOptions = {}): string {
  const size = o.size ?? 24;
  const color = o.color ?? "currentColor";
  const acc = o.accent ?? ACCENT;
  const body = parts
    .filter((p) => p.d)
    .map((p) => (p.accent ? `<path d="${p.d}" class="devx-accent" style="fill:${acc}"/>` : `<path d="${p.d}"/>`))
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="${color}" fill-rule="evenodd">${body}</svg>`
  );
}
