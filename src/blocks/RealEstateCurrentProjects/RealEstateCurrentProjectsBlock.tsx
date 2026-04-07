'use client'

import React from 'react'
import { RealEstateCurrentProjects } from '@/components/real-estate-page'
import type { CurrentProjectItem, FloorPlanUnitShape } from '@/components/real-estate-page'

type Media = { url?: string } | string | number | null
type UnitShape =
  | { points?: Array<{ x: number; y: number }> }
  | { x?: number; y?: number; width?: number; height?: number }
type BuildingRow = {
  id?: string
  title?: string | null
  floorPlanImage?: Media | null
  unitDetailsPdf?: { id?: string | number; url?: string } | number | string | null
  units?: Array<{
    label: string
    detailPageNumber: number
    shape?: UnitShape
  }> | null
} | number | null
type ProjectRow = {
  title: string
  description?: string | null
  image?: Media | null
  status?: string | null
  building?: BuildingRow
  ctaText?: string | null
  ctaUrl?: string | null
}

function getMediaUrl(m: Media | undefined | null): string | undefined {
  if (!m || typeof m !== 'object' || !('url' in m)) return undefined
  return (m as { url?: string }).url
}

/** Payload may store points as array or as object with "0","1",… keys (same as UnitRegionsField). */
function pointsArrayFromPayload(raw: unknown): Array<{ x: number; y: number }> | null {
  if (raw == null) return null
  let list: unknown[] = []
  if (Array.isArray(raw)) list = raw
  else if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    const keys = Object.keys(o)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
    list = keys.map((k) => o[k])
  }
  const points: Array<{ x: number; y: number }> = []
  for (const p of list) {
    if (p != null && typeof p === 'object' && 'x' in p && 'y' in p) {
      const x = Number((p as { x: unknown }).x)
      const y = Number((p as { y: unknown }).y)
      if (Number.isFinite(x) && Number.isFinite(y)) points.push({ x, y })
    }
  }
  return points.length >= 3 ? points : null
}

function normalizeUnitShape(shape: UnitShape | undefined): UnitShape | undefined {
  if (!shape || typeof shape !== 'object') return undefined
  if ('points' in shape && shape.points != null) {
    const pts = pointsArrayFromPayload(shape.points)
    if (pts) return { points: pts }
  }
  if (
    typeof (shape as { x?: number }).x === 'number' &&
    typeof (shape as { y?: number }).y === 'number' &&
    typeof (shape as { width?: number }).width === 'number' &&
    typeof (shape as { height?: number }).height === 'number'
  ) {
    const r = shape as { x: number; y: number; width: number; height: number }
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }
  return undefined
}

function getUnitDetailsPdfMeta(b: BuildingRow): { id?: string; url?: string } {
  if (b == null || typeof b === 'number') return {}
  const u = b.unitDetailsPdf
  if (u != null && typeof u === 'object' && !Array.isArray(u)) {
    const id = u.id != null ? String(u.id) : undefined
    const url = 'url' in u && typeof u.url === 'string' ? u.url : undefined
    return { id, url }
  }
  if (typeof u === 'number' || typeof u === 'string') {
    return { id: String(u) }
  }
  return {}
}

function normalizeBuilding(b: BuildingRow): CurrentProjectItem['building'] {
  if (!b || typeof b === 'number') return undefined
  const floorPlanImageUrl = getMediaUrl(b.floorPlanImage)
  const { id: unitDetailsPdfId, url: pdfUrlFromRelation } = getUnitDetailsPdfMeta(b)
  const unitDetailsPdfUrl =
    pdfUrlFromRelation ||
    (typeof b.unitDetailsPdf === 'object' && b.unitDetailsPdf && 'url' in b.unitDetailsPdf
      ? (b.unitDetailsPdf as { url?: string }).url
      : undefined)
  const units = Array.isArray(b.units)
    ? b.units
        .filter((u) => u?.label != null && u?.detailPageNumber != null && u?.shape)
        .map((u) => {
          const shape = normalizeUnitShape(u.shape)
          if (!shape) return null
          return {
            label: u.label,
            detailPageNumber: u.detailPageNumber,
            shape: shape as FloorPlanUnitShape,
          }
        })
        .filter((row): row is NonNullable<typeof row> => row != null)
    : []
  if (!floorPlanImageUrl && units.length === 0) return undefined
  return {
    title: b.title ?? undefined,
    floorPlanImageUrl,
    unitDetailsPdfId,
    unitDetailsPdfUrl,
    units,
  }
}

type Props = {
  blockType: 'real-estate-current-projects'
  eyebrow?: string | null
  heading: string
  subtitle?: string | null
  projects: ProjectRow[]
  sectionId?: string | null
}

export const RealEstateCurrentProjectsBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subtitle,
  projects,
  sectionId,
}) => {
  const items: CurrentProjectItem[] = (projects ?? []).map((p) => ({
    title: p.title,
    description: p.description ?? undefined,
    imageUrl: getMediaUrl(p.image),
    status: p.status ?? undefined,
    building: p.building != null ? normalizeBuilding(p.building) : undefined,
    ctaText: p.ctaText ?? undefined,
    ctaUrl: p.ctaUrl ?? undefined,
  }))

  return (
    <RealEstateCurrentProjects
      eyebrow={eyebrow ?? undefined}
      heading={heading}
      subtitle={subtitle ?? undefined}
      projects={items}
      sectionId={sectionId ?? undefined}
    />
  )
}
