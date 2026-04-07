'use client'

import React, { useEffect, useId, useState } from 'react'
import { getUnitCentroidPercent } from '@/components/floor-plan/getUnitCentroidPercent'
import {
  FLOOR_PLAN_VIEWBOX,
  HOVER_LABEL_FONT_SIZE_U,
  HOVER_LABEL_STROKE_WIDTH_U,
  polygonPointsAttr,
  STROKE_W_HOVER,
  STROKE_W_IDLE,
} from '@/components/floor-plan/floorPlanSvg'
import type { CurrentProjectItem } from './CurrentProjects'

const FILL_IDLE = 'rgba(37, 99, 235, 0.16)'
const FILL_HOVER = 'rgba(37, 99, 235, 0.52)'
const STROKE_IDLE = 'rgba(59, 130, 246, 0.95)'
const STROKE_HOVER = 'rgb(30, 64, 175)'

type Point = { x: number; y: number }
type UnitShape =
  | { points: Point[] }
  | { x: number; y: number; width: number; height: number }

type FloorPlanUnit = {
  label: string
  detailPageNumber: number
  shape: UnitShape
}

function isPolygonShape(shape: UnitShape): shape is { points: Point[] } {
  return 'points' in shape && Array.isArray(shape.points) && shape.points.length >= 3
}

type Props = {
  isOpen: boolean
  onClose: () => void
  project: CurrentProjectItem | null
}

/**
 * Bottom drawer for current project details.
 * Step 1: Shows project title, description and full floor plan with unit regions (polygons).
 * Step 2: When user clicks a polygon, opens a second sheet with the unit's PDF page.
 */
export function CurrentProjectDrawer({ isOpen, onClose, project }: Props) {
  const labelShadowFilterId = `re-fp-lbl-${useId().replace(/:/g, '')}`
  const [view, setView] = useState<'plan' | 'unit'>('plan')
  const [selectedUnit, setSelectedUnit] = useState<{
    unit: FloorPlanUnit
  } | null>(null)
  const [hoveredUnit, setHoveredUnit] = useState<FloorPlanUnit | null>(null)

  const building = project?.building
  const hasFloorPlanImage = Boolean(building?.floorPlanImageUrl)
  const units = (building?.units ?? []) as FloorPlanUnit[]
  const hasUnits = units.length > 0

  const openUnitDetail = (unit: FloorPlanUnit) => {
    if (!building?.unitDetailsPdfUrl && !building?.unitDetailsPdfId) return
    setSelectedUnit({ unit })
    setView('unit')
  }

  const closeUnitDetail = () => {
    setSelectedUnit(null)
    setView('plan')
  }

  const handleClose = () => {
    closeUnitDetail()
    setView('plan')
    onClose()
  }

  const getDetailLink = (unit: FloorPlanUnit) => {
    if (building?.unitDetailsPdfId) {
      return `/api/pdf-file/${building.unitDetailsPdfId}?page=${unit.detailPageNumber}`
    }
    const base = building?.unitDetailsPdfUrl
    return base ? `${base}#page=${unit.detailPageNumber}` : undefined
  }

  /** Lock page scroll behind the sheet; restore on close (iOS-safe). */
  useEffect(() => {
    if (!isOpen) return

    const html = document.documentElement
    const body = document.body
    const scrollY = window.scrollY

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    }

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      html.style.overscrollBehavior = prev.htmlOverscroll
      body.style.overscrollBehavior = prev.bodyOverscroll
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.width = prev.bodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Second sheet: unit PDF page
  if (view === 'unit' && selectedUnit) {
    const { unit } = selectedUnit
    const pdfIframeSrc = building?.unitDetailsPdfId
      ? `/api/pdf-file/${building.unitDetailsPdfId}?page=${unit.detailPageNumber}`
      : building?.unitDetailsPdfUrl
        ? `${building.unitDetailsPdfUrl}#page=${unit.detailPageNumber}`
        : ''

    return (
      <div
        className="re-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Unit details: ${unit.label}`}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="re-drawer__backdrop" onClick={handleClose} aria-hidden />
        <div className="re-drawer__panel re-drawer__panel--unit">
          <div className="re-drawer__handle" aria-hidden />
          <header className="re-drawer__header">
            <div className="re-drawer__header-inner">
              <button
                type="button"
                className="re-drawer__back"
                onClick={closeUnitDetail}
                aria-label="Back to floor plan"
              >
                ← <span className="re-drawer__back-text">Tlocrt</span>
              </button>
              <h2 className="re-drawer__title">{unit.label}</h2>
            </div>
            <button
              type="button"
              className="re-drawer__close"
              onClick={handleClose}
              aria-label="Close"
            >
              <span aria-hidden>×</span>
            </button>
          </header>
          <div className="re-drawer__body re-drawer__body--pdf">
            <div className="re-drawer__pdf-frame-wrap">
              {pdfIframeSrc ? (
                <iframe
                  title={`PDF – ${unit.label}, stranica ${unit.detailPageNumber}`}
                  src={pdfIframeSrc}
                  className="re-drawer__pdf-iframe"
                  tabIndex={-1}
                />
              ) : (
                <p className="re-drawer__pdf-fallback">PDF nije dostupan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main sheet: project + floor plan
  return (
    <div
      className="re-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={project ? `Details: ${project.title}` : 'Project details'}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="re-drawer__backdrop" onClick={handleClose} aria-hidden />
      <div className="re-drawer__panel">
        <div className="re-drawer__handle" aria-hidden />
        <header className="re-drawer__header">
          <div className="re-drawer__header-inner">
            <h2 className="re-drawer__title">{project?.title ?? ''}</h2>
            {project?.status && (
              <span className="re-drawer__status">{project.status}</span>
            )}
          </div>
          <button
            type="button"
            className="re-drawer__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <span aria-hidden>×</span>
          </button>
        </header>
        <div className="re-drawer__body">
          {project?.description && (
            <p className="re-drawer__description">{project.description}</p>
          )}
          <section className="re-drawer__floor-plan">
            <h3 className="re-drawer__floor-plan-title">
              {building?.title ? `Tlocrt – ${building.title}` : 'Tlocrt'}
            </h3>
            {hasFloorPlanImage ? (
              <>
                <div className="re-drawer__floor-plan-container">
                  <img
                    src={building!.floorPlanImageUrl!}
                    alt={building!.title ? `Tlocrt – ${building!.title}` : 'Tlocrt'}
                    className="re-drawer__floor-plan-img"
                    style={{ position: 'relative', zIndex: 0 }}
                  />
                  {/* Visual overlay (polygons/rects) — same viewBox 0..100 as CMS UnitRegionsField */}
                  {hasUnits && (
                  <svg
                    className="re-drawer__floor-plan-overlay"
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
                  )}
                  {/* Clickable overlay */}
                  {hasUnits && (
                  <svg
                    className="re-drawer__floor-plan-hit"
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
                      const canOpen = Boolean(link)
                      const hoverProps = {
                        onMouseEnter: () => setHoveredUnit(unit),
                        onMouseLeave: () => setHoveredUnit(null),
                        onClick: () => canOpen && openUnitDetail(unit),
                      }
                      const hitFill = 'rgba(0, 0, 0, 0.02)'
                      if (isPolygonShape(s)) {
                        const pts = polygonPointsAttr(s.points)
                        return (
                          <polygon
                            key={i}
                            points={pts}
                            fill={hitFill}
                            stroke="none"
                            pointerEvents="visiblePainted"
                            style={{ cursor: canOpen ? 'pointer' : 'default' }}
                            {...hoverProps}
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
                            fill={hitFill}
                            stroke="none"
                            pointerEvents="visiblePainted"
                            style={{ cursor: canOpen ? 'pointer' : 'default' }}
                            {...hoverProps}
                          />
                        )
                      }
                      return null
                    })}
                  </svg>
                  )}
                  {hasUnits && hoveredUnit && (() => {
                    const pos = getUnitCentroidPercent(hoveredUnit.shape)
                    if (!pos) return null
                    return (
                      <svg
                        className="re-drawer__floor-plan-hover-label-layer"
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
                          className="re-drawer__floor-plan-hover-label-text"
                          filter={`url(#${labelShadowFilterId})`}
                        >
                          {hoveredUnit.label}
                        </text>
                      </svg>
                    )
                  })()}
                </div>
                {hasUnits && hoveredUnit && (
                  <p className="re-drawer__floor-plan-tooltip">
                    <strong>{hoveredUnit.label}</strong>
                    {getDetailLink(hoveredUnit) ? (
                      <span> – Klikni za stranicu PDF-a (stranica {hoveredUnit.detailPageNumber})</span>
                    ) : (
                      <span> – PDF nije povezan</span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <div className="re-drawer__floor-plan-placeholder">
                <p className="re-drawer__floor-plan-note">
                  {building
                    ? 'Za ovaj projekt nije odabrana zgrada s tlocrdom ili zgrada nema jedinica.'
                    : 'U CMS-u odaberi zgradu (tlocrt) za ovaj projekt da se prikaže interaktivni tlocrt i jedinice.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
