// DevX Icons core: path parsing, exact geometry, the drawing DSL, variant
// badges and SVG rendering. Browser-safe; the solid style, fonts and rasters
// are built by scripts/ (they need Skia PathKit and resvg).

export { parsePath, arcToCubics, type Pt, type Seg, type Subpath } from "./path.js";
export { parseSvg, shapeToD, SHAPE_TAGS, type Shape } from "./svg.js";
export * from "./geom.js";
export * from "./dsl.js";
export * from "./variants.js";
export * from "./render.js";
export * from "./anim.js";

/** DevX house style: 24px grid, 1.75 stroke, round caps and joins. */
export const DEFAULTS = { size: 24, strokeWidth: 1.75 } as const;
