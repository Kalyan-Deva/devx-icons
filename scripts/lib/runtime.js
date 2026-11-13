// DevX Icons runtime — shared by the React, Vue, Svelte and web-component packages.
// Turns icon data into a framework-neutral description of the SVG.
//
// icon = { name, line: [[kind, d]], solid: [[kind, d]], anim: [kind, dx?, dy?] }
//   line kinds: 0 line, 1 accent stroke, 2 accent fill;  solid kinds: 0 body, 1 accent

export const ACCENT = "var(--devx-accent,currentColor)";
export const WEIGHTS = { thin: 1, light: 1.25, regular: 1.75, bold: 2.25 };
export const VARIANTS = ["line", "solid", "duotone", "bulk"];
export const ANIM_CSS = __ANIM_CSS__;

/**
 * @param {{name:string,line:Array,solid:Array,anim:Array}} icon
 * @param {{variant?:string,weight?:string,strokeWidth?:number|string,size?:number|string,color?:string,accent?:string,title?:string,animate?:boolean}} [o]
 * @returns {{svg:Record<string,string|number>, paths:Array<Record<string,string|number>>, css:string|null, group:boolean}}
 */
export function devxSpec(icon, o = {}) {
  const variant = VARIANTS.includes(o.variant) ? o.variant : "line";
  const size = o.size ?? 24;
  const color = o.color || "currentColor";
  const sw = o.strokeWidth ?? WEIGHTS[o.weight || "regular"] ?? WEIGHTS.regular;
  const styles = [];
  if (o.accent) styles.push(`--devx-accent:${o.accent}`);
  const svg = { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", class: `devx devx-${icon.name}` };
  if (o.title) svg.role = "img";
  else svg["aria-hidden"] = "true";
  const paths = [];
  const anim = o.animate && (variant === "line" || variant === "duotone") ? icon.anim : null;
  if (variant === "line" || variant === "duotone") {
    Object.assign(svg, { fill: "none", stroke: color, "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round" });
    if (variant === "duotone")
      for (const [k, d] of icon.solid)
        if (!k) paths.push({ d, class: "devx-tint", "fill-rule": "evenodd", style: `fill:${ACCENT};fill-opacity:.2;stroke:none` });
    for (const [k, d] of icon.line) {
      if (k === 0) paths.push({ d });
      else if (k === 1) paths.push(anim && anim[0] === "draw" ? { d, class: "devx-accent", pathLength: 1, style: `stroke:${ACCENT}` } : { d, class: "devx-accent", style: `stroke:${ACCENT}` });
      else paths.push({ d, class: "devx-accent", style: `fill:${ACCENT};stroke:none` });
    }
  } else {
    Object.assign(svg, { fill: color, "fill-rule": "evenodd" });
    for (const [k, d] of icon.solid) {
      if (k) paths.push({ d, class: "devx-accent", style: `fill:${ACCENT}` });
      else paths.push(variant === "bulk" ? { d, class: "devx-body", "fill-opacity": 0.35 } : { d });
    }
  }
  let css = null;
  if (anim) {
    svg.class += ` dx-anim dx-${anim[0]}`;
    if (anim[0] === "nudge") styles.push(`--dx:${anim[1]}px`, `--dy:${anim[2]}px`);
    css = ANIM_CSS;
  }
  if (styles.length) svg.style = styles.join(";");
  return { svg, paths, css, group: !!anim };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const attrs = (a) => Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");

/** Plain SVG string (web component, SSR, anything without a framework). */
export function devxSvg(icon, o = {}) {
  const s = devxSpec(icon, o);
  const body = s.paths.map((p) => `<path${attrs(p)}/>`).join("");
  return (
    `<svg${attrs(s.svg)}>` +
    (o.title ? `<title>${esc(o.title)}</title>` : "") +
    (s.css ? `<style>${s.css}</style>` : "") +
    (s.group ? `<g class="dx-g">${body}</g>` : body) +
    `</svg>`
  );
}
