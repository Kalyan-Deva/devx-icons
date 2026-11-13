import type { Part } from "./dsl.js";
import { ANIM_CSS, type Anim } from "./anim.js";

export const ACCENT_VAR = "--devx-accent";
const ACCENT = `var(${ACCENT_VAR},currentColor)`;

/** Stroke widths for the line weights. Regular is the house style. */
export const WEIGHTS = { thin: 1, light: 1.25, regular: 1.75, bold: 2.25 } as const;
export type Weight = keyof typeof WEIGHTS;
/** Duotone tint and bulk body opacities. */
export const DUOTONE_TINT = 0.2;
export const BULK_BODY = 0.35;

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

const head = (o: SvgOptions, attrs: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${o.size ?? 24}" height="${o.size ?? 24}" viewBox="0 0 24 24" ${attrs}>`;

function linePaths(parts: Part[], acc: string, pathLength = false): string {
  const pl = pathLength ? ' pathLength="1"' : "";
  return parts
    .map((p) => {
      if (p.role === "accent") return `<path d="${p.d}" class="devx-accent"${pl} style="stroke:${acc}"/>`;
      if (p.role === "accent-fill") return `<path d="${p.d}" class="devx-accent" style="fill:${acc};stroke:none"/>`;
      return `<path d="${p.d}"/>`;
    })
    .join("");
}

const lineAttrs = (o: SvgOptions) =>
  `fill="none" stroke="${o.color ?? "currentColor"}" stroke-width="${o.strokeWidth ?? WEIGHTS.regular}" stroke-linecap="round" stroke-linejoin="round"`;

/** Line style: real strokes, so stroke width stays adjustable. */
export function renderLineSvg(parts: Part[], o: SvgOptions = {}): string {
  return head(o, lineAttrs(o)) + linePaths(parts, o.accent ?? ACCENT) + `</svg>`;
}

/** Solid style: filled outlines (stroke width does not apply). */
export function renderSolidSvg(parts: SolidPart[], o: SvgOptions = {}): string {
  const acc = o.accent ?? ACCENT;
  const body = parts
    .filter((p) => p.d)
    .map((p) => (p.accent ? `<path d="${p.d}" class="devx-accent" style="fill:${acc}"/>` : `<path d="${p.d}"/>`))
    .join("");
  return head(o, `fill="${o.color ?? "currentColor"}" fill-rule="evenodd"`) + body + `</svg>`;
}

/** Duotone: the line icon over a soft accent-tinted fill of its solid body. */
export function renderDuotoneSvg(line: Part[], solid: SolidPart[], o: SvgOptions = {}): string {
  const acc = o.accent ?? ACCENT;
  const tint = solid
    .filter((p) => p.d && !p.accent)
    .map((p) => `<path d="${p.d}" class="devx-tint" fill-rule="evenodd" style="fill:${acc};fill-opacity:${DUOTONE_TINT};stroke:none"/>`)
    .join("");
  return head(o, lineAttrs(o)) + tint + linePaths(line, acc) + `</svg>`;
}

/** Bulk: the solid body faded, the accent at full strength. */
export function renderBulkSvg(solid: SolidPart[], o: SvgOptions = {}): string {
  const acc = o.accent ?? ACCENT;
  const body = solid
    .filter((p) => p.d)
    .map((p) =>
      p.accent
        ? `<path d="${p.d}" class="devx-accent" style="fill:${acc}"/>`
        : `<path d="${p.d}" class="devx-body" fill-opacity="${BULK_BODY}"/>`,
    )
    .join("");
  return head(o, `fill="${o.color ?? "currentColor"}" fill-rule="evenodd"`) + body + `</svg>`;
}

/** Animated (line): motion chosen by rule, self-contained CSS, respects reduced motion. */
export function renderAnimatedSvg(parts: Part[], anim: Anim, o: SvgOptions = {}): string {
  const vars = anim.kind === "nudge" ? ` style="--dx:${anim.dx ?? 2}px;--dy:${anim.dy ?? 0}px"` : "";
  return (
    head(o, `${lineAttrs(o)} class="dx-anim dx-${anim.kind}"${vars}`) +
    `<style>${ANIM_CSS}</style><g class="dx-g">` +
    linePaths(parts, o.accent ?? ACCENT, anim.kind === "draw") +
    `</g></svg>`
  );
}
