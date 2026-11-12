// Minimal parser for DevX base icons. The base format is tightly controlled
// (see scripts/lint-icons.ts), so a small regex parser is enough and keeps the
// core dependency-free and browser-safe.

export interface Shape {
  tag: string;
  attrs: Record<string, string>;
}

export const SHAPE_TAGS = ["path", "circle", "ellipse", "line", "rect", "polyline", "polygon"] as const;

export function parseAttrs(src: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of src.matchAll(/([a-zA-Z][\w:-]*)\s*=\s*"([^"]*)"/g)) attrs[m[1]!] = m[2]!;
  return attrs;
}

export function parseSvg(src: string): { root: Record<string, string>; shapes: Shape[] } {
  const rootMatch = /<svg\b([^>]*)>/.exec(src);
  if (!rootMatch) throw new Error("No <svg> root element");
  const shapes: Shape[] = [];
  const re = /<([a-zA-Z]+)\b([^>]*?)\/?>/g;
  for (const m of src.matchAll(re)) {
    const tag = m[1]!;
    if (tag === "svg") continue;
    shapes.push({ tag, attrs: parseAttrs(m[2]!) });
  }
  return { root: parseAttrs(rootMatch[1]!), shapes };
}

const n = (attrs: Record<string, string>, k: string, def = 0): number => {
  const v = attrs[k];
  return v === undefined ? def : Number(v);
};

const f = (v: number) => String(Math.round(v * 1000) / 1000);

/** Convert one base shape to SVG path data. */
export function shapeToD(shape: Shape): string {
  const a = shape.attrs;
  switch (shape.tag) {
    case "path":
      return (a.d ?? "").trim();
    case "line":
      return `M${f(n(a, "x1"))} ${f(n(a, "y1"))}L${f(n(a, "x2"))} ${f(n(a, "y2"))}`;
    case "polyline":
    case "polygon": {
      const nums = (a.points ?? "").trim().split(/[\s,]+/).map(Number);
      let d = "";
      for (let i = 0; i + 1 < nums.length; i += 2) d += `${i ? "L" : "M"}${f(nums[i]!)} ${f(nums[i + 1]!)}`;
      return shape.tag === "polygon" ? d + "Z" : d;
    }
    case "circle":
    case "ellipse": {
      const cx = n(a, "cx");
      const cy = n(a, "cy");
      const rx = shape.tag === "circle" ? n(a, "r") : n(a, "rx");
      const ry = shape.tag === "circle" ? n(a, "r") : n(a, "ry");
      return (
        `M${f(cx + rx)} ${f(cy)}` +
        `A${f(rx)} ${f(ry)} 0 0 1 ${f(cx)} ${f(cy + ry)}` +
        `A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)}` +
        `A${f(rx)} ${f(ry)} 0 0 1 ${f(cx)} ${f(cy - ry)}` +
        `A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy)}Z`
      );
    }
    case "rect": {
      const x = n(a, "x");
      const y = n(a, "y");
      const w = n(a, "width");
      const h = n(a, "height");
      let rx = a.rx !== undefined ? n(a, "rx") : n(a, "ry");
      let ry = a.ry !== undefined ? n(a, "ry") : rx;
      rx = Math.min(rx, w / 2);
      ry = Math.min(ry, h / 2);
      if (rx <= 0 || ry <= 0) return `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
      const arc = (ex: number, ey: number) => `A${f(rx)} ${f(ry)} 0 0 1 ${f(ex)} ${f(ey)}`;
      return (
        `M${f(x + rx)} ${f(y)}H${f(x + w - rx)}${arc(x + w, y + ry)}` +
        `V${f(y + h - ry)}${arc(x + w - rx, y + h)}` +
        `H${f(x + rx)}${arc(x, y + h - ry)}` +
        `V${f(y + ry)}${arc(x + rx, y)}Z`
      );
    }
    default:
      throw new Error(`Unsupported element <${shape.tag}>`);
  }
}
