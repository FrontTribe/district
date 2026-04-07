export type UnitShapeForCentroid =
  | { points: Array<{ x: number; y: number }> }
  | { x: number; y: number; width: number; height: number }

/**
 * Centroid of polygon (average of vertices) or center of rect, in same % space as CMS shapes.
 */
export function getUnitCentroidPercent(shape: UnitShapeForCentroid | undefined | null): {
  x: number
  y: number
} | null {
  if (!shape) return null
  if ('points' in shape && Array.isArray(shape.points) && shape.points.length >= 3) {
    const pts = shape.points
    const x = pts.reduce((a, p) => a + p.x, 0) / pts.length
    const y = pts.reduce((a, p) => a + p.y, 0) / pts.length
    return { x, y }
  }
  if ('x' in shape && 'y' in shape && 'width' in shape && 'height' in shape) {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    }
  }
  return null
}
