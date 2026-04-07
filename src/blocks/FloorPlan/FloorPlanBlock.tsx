'use client'

import React, { useId, useState } from 'react'
import { getUnitCentroidPercent } from '@/components/floor-plan/getUnitCentroidPercent'
import {
  FLOOR_PLAN_VIEWBOX,
  HOVER_LABEL_FONT_SIZE_U,
  HOVER_LABEL_STROKE_WIDTH_U,
  polygonPointsAttr,
  STROKE_W_HOVER,
  STROKE_W_IDLE,
} from '@/components/floor-plan/floorPlanSvg'

type Point = { x: number; y: number }

type UnitShape =
  | { points: Point[] }
  | { x: number; y: number; width: number; height: number }

type Unit = {
  label: string
  detailPageNumber: number
  shape: UnitShape
}

type Building = {
  id: string
  title?: string
  floorPlanImage?:
    | { url: string; alt?: string }
    | number
    | null
  unitDetailsPdf?: { url?: string; id?: string | number } | number | null
  units?: Unit[] | null
}

type Props = {
  title?: string | null
  building: Building | number | null
  sectionId?: string | null
}

function isPolygonShape(shape: UnitShape): shape is { points: Point[] } {
  return 'points' in shape && Array.isArray(shape.points) && shape.points.length >= 3
}

const FILL_IDLE = 'rgba(37, 99, 235, 0.16)'
const FILL_HOVER = 'rgba(37, 99, 235, 0.52)'
const STROKE_IDLE = 'rgba(59, 130, 246, 0.95)'
const STROKE_HOVER = 'rgb(30, 64, 175)'

export const FloorPlanBlock: React.FC<Props> = ({ title, building, sectionId }) => {
  const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null)
  const labelShadowFilterId = `fp-lbl-${useId().replace(/:/g, '')}`

  if (!building || typeof building === 'number') {
    return null
  }

  const floorPlanImage =
    typeof building.floorPlanImage === 'object' && building.floorPlanImage?.url
      ? building.floorPlanImage.url
      : null
  const detailsPdfUrl =
    typeof building.unitDetailsPdf === 'object' && building.unitDetailsPdf?.url
      ? building.unitDetailsPdf.url
      : null
  const detailsPdfId =
    typeof building.unitDetailsPdf === 'number' || typeof building.unitDetailsPdf === 'string'
      ? String(building.unitDetailsPdf)
      : typeof building.unitDetailsPdf === 'object' &&
          building.unitDetailsPdf &&
          'id' in building.unitDetailsPdf &&
          building.unitDetailsPdf.id != null
        ? String(building.unitDetailsPdf.id)
        : null
  const units = Array.isArray(building.units) ? building.units : []

  if (!floorPlanImage) {
    return null
  }

  const getDetailLink = (unit: Unit) => {
    if (detailsPdfId) {
      return `/api/pdf-file/${detailsPdfId}?page=${unit.detailPageNumber}`
    }
    if (!detailsPdfUrl) return undefined
    return `${detailsPdfUrl}#page=${unit.detailPageNumber}`
  }

  return (
    <section
      id={sectionId ?? undefined}
      className="floor-plan"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      {title && (
        <h2
          className="floor-plan__title"
          style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}
        >
          {title}
        </h2>
      )}

      <div
        className="floor-plan__container"
        style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}
      >
        <img
          src={floorPlanImage}
          alt={building.title ? `Floor plan – ${building.title}` : 'Floor plan'}
          style={{ display: 'block', maxWidth: '100%', height: 'auto', verticalAlign: 'middle' }}
        />
        <svg
          className="floor-plan__overlay"
          viewBox={FLOOR_PLAN_VIEWBOX}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          preserveAspectRatio="none"
          aria-hidden
        >
          {units.map((unit, i) => {
            const s = unit.shape
            if (!s) return null
            if (isPolygonShape(s)) {
              const pts = polygonPointsAttr(s.points)
              return (
                <polygon
                  key={i}
                  points={pts}
                  fill={hoveredUnit === unit ? FILL_HOVER : FILL_IDLE}
                  stroke={hoveredUnit === unit ? STROKE_HOVER : STROKE_IDLE}
                  strokeWidth={hoveredUnit === unit ? STROKE_W_HOVER : STROKE_W_IDLE}
                  vectorEffect="nonScalingStroke"
                />
              )
            }
            if ('x' in s && 'y' in s && 'width' in s && 'height' in s) {
              return (
                <rect
                  key={i}
                  x={s.x}
                  y={s.y}
                  width={s.width}
                  height={s.height}
                  fill={hoveredUnit === unit ? FILL_HOVER : FILL_IDLE}
                  stroke={hoveredUnit === unit ? STROKE_HOVER : STROKE_IDLE}
                  strokeWidth={hoveredUnit === unit ? STROKE_W_HOVER : STROKE_W_IDLE}
                  vectorEffect="nonScalingStroke"
                />
              )
            }
            return null
          })}
        </svg>
        {/* Clickable overlay: one polygon/rect per unit so hover and click work */}
        <svg
          viewBox={FLOOR_PLAN_VIEWBOX}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            cursor: 'pointer',
            zIndex: 2,
          }}
          preserveAspectRatio="none"
        >
          {units.map((unit, i) => {
            const s = unit.shape
            if (!s) return null
            const link = getDetailLink(unit)
            const hoverProps = {
              onMouseEnter: () => setHoveredUnit(unit),
              onMouseLeave: () => setHoveredUnit(null),
            }
            const linkTitle = link
              ? `${unit.label} – open unit details (PDF, page ${unit.detailPageNumber})`
              : `${unit.label} – unit details not linked`
            const linkAriaLabel = linkTitle
            const hitFill = 'rgba(0, 0, 0, 0.02)'
            if (isPolygonShape(s)) {
              const pts = polygonPointsAttr(s.points)
              const poly = (
                <polygon
                  points={pts}
                  fill={hitFill}
                  stroke="none"
                  pointerEvents="visiblePainted"
                  style={{ cursor: link ? 'pointer' : 'default' }}
                  {...hoverProps}
                />
              )
              return (
                <g key={i}>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" title={linkTitle} aria-label={linkAriaLabel}>
                      {poly}
                    </a>
                  ) : (
                    poly
                  )}
                </g>
              )
            }
            if ('x' in s && 'y' in s && 'width' in s && 'height' in s) {
              const rect = (
                <rect
                  x={s.x}
                  y={s.y}
                  width={s.width}
                  height={s.height}
                  fill={hitFill}
                  stroke="none"
                  pointerEvents="visiblePainted"
                  style={{ cursor: link ? 'pointer' : 'default' }}
                  {...hoverProps}
                />
              )
              return (
                <g key={i}>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" title={linkTitle} aria-label={linkAriaLabel}>
                      {rect}
                    </a>
                  ) : (
                    rect
                  )}
                </g>
              )
            }
            return null
          })}
        </svg>
        {hoveredUnit && (() => {
          const pos = getUnitCentroidPercent(hoveredUnit.shape)
          if (!pos) return null
          return (
            <svg
              className="floor-plan__hover-label-layer"
              viewBox={FLOOR_PLAN_VIEWBOX}
              aria-hidden
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 3,
              }}
              preserveAspectRatio="none"
            >
              <defs>
                <filter id={labelShadowFilterId} x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="0.5"
                    stdDeviation="1.2"
                    floodColor="#0f172a"
                    floodOpacity="0.28"
                  />
                </filter>
              </defs>
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={HOVER_LABEL_FONT_SIZE_U}
                strokeWidth={HOVER_LABEL_STROKE_WIDTH_U}
                className="floor-plan__hover-label-text"
                filter={`url(#${labelShadowFilterId})`}
              >
                {hoveredUnit.label}
              </text>
            </svg>
          )
        })()}
      </div>

      {hoveredUnit && (
        <div
          className="floor-plan__tooltip"
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: '#f1f5f9',
            borderRadius: 6,
            fontSize: '0.875rem',
          }}
        >
          <strong>{hoveredUnit.label}</strong>
          {getDetailLink(hoveredUnit) ? (
            <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
              Click to open unit details PDF (page {hoveredUnit.detailPageNumber})
            </span>
          ) : (
            <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>Unit details PDF not linked</span>
          )}
        </div>
      )}
    </section>
  )
}
