/**
 * CMS UnitRegionsField stores shapes in the same space as viewBox 0 0 100 100 (see UnitRegionsField.tsx).
 * Frontend SVGs must use the same viewBox + numeric coords — NOT percentage strings in points=,
 * or polygons misalign / hover breaks in browsers.
 */
export const FLOOR_PLAN_VIEWBOX = '0 0 100 100'

export function polygonPointsAttr(points: Array<{ x: number; y: number }>): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ')
}

/** Stroke width in user units (0–100), matches admin preview (~0.5) */
export const STROKE_W_IDLE = 0.35
export const STROKE_W_HOVER = 0.65

/**
 * Hover label on polygons: must be in **user units** (same 0–100 space as viewBox).
 * CSS `font-size` in px on SVG `<text>` is applied inconsistently and often renders huge.
 */
export const HOVER_LABEL_FONT_SIZE_U = 3.75
/** Light halo around dark text — readable on both light and dark areas of the plan */
export const HOVER_LABEL_STROKE_WIDTH_U = 0.14
