'use client'

import React, { useCallback, useState, useEffect } from 'react'
import {
  useForm,
  useFormFields,
  useDocumentInfo,
  useField,
  ArrayField,
  FieldLabel,
  FieldDescription,
} from '@payloadcms/ui'
import type { ArrayFieldClientComponent } from 'payload'

type Point = { x: number; y: number }

function getImageUrl(data: unknown): string | null {
  if (data == null || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  const url = d.url ?? d.thumbnailURL
  if (typeof url === 'string' && url) return url
  const sizes = d.sizes as Record<string, { url?: string }> | undefined
  if (sizes?.md?.url) return sizes.md.url
  if (sizes?.lg?.url) return sizes.lg.url
  return null
}

function getImageId(data: unknown): string | number | null {
  if (typeof data === 'number' || (typeof data === 'string' && data !== '')) return data as string | number
  if (typeof data === 'object' && data !== null && 'id' in data) {
    const id = (data as { id?: unknown }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

/** Normalize Payload array field value (can be real array or object with "0","1",... keys) */
function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw != null && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    const keys = Object.keys(obj).filter((k) => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b))
    if (keys.length) return keys.map((k) => obj[k]) as T[]
  }
  return []
}

/** Get polygon points from shape; Payload may store points as array or as object with "0","1",... */
function getShapePoints(shape: unknown): Point[] | null {
  if (shape == null || typeof shape !== 'object' || !('points' in shape)) return null
  const raw = (shape as { points?: unknown }).points
  const arr = toArray<{ x?: number; y?: number }>(raw)
  const points: Point[] = []
  for (const p of arr) {
    if (p != null && typeof p.x === 'number' && typeof p.y === 'number') {
      points.push({ x: p.x, y: p.y })
    }
  }
  return points.length >= 3 ? points : null
}

/**
 * Custom field for building units: floor plan with polygon drawing.
 * Click points to outline each unit, then "Complete unit". Set label and PDF page in the list below.
 */
export const UnitRegionsField: ArrayFieldClientComponent = (props) => {
  const { path, field, ...rest } = props
  const { value: fieldValue, setValue } = useField<{ label: string; detailPageNumber: number; shape: { points: Point[] } }[]>({ path })
  const form = useForm()
  /** Prefer form getData for units so we see the same structure the form actually has (including nested shape.points) */
  const valueFromForm = useFormFields(([fields]) => {
    const getData = form?.getData
    const data = typeof getData === 'function' ? getData() : undefined
    const units = data && typeof data === 'object' && path in data ? (data as Record<string, unknown>)[path] : undefined
    return toArray(units)
  }) as { shape?: { points?: unknown; x?: number; y?: number; width?: number; height?: number }; label?: string; detailPageNumber?: number }[]
  const value = (valueFromForm != null && valueFromForm.length > 0 ? valueFromForm : toArray(fieldValue)) as {
    label?: string
    detailPageNumber?: number
    shape?: { points?: Point[]; x?: number; y?: number; width?: number; height?: number }
  }[]
  const docInfo = useDocumentInfo()
  const [drawing, setDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [previewPoint, setPreviewPoint] = useState<Point | null>(null)
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)
  /** When set, we're editing this unit's polygon (points in currentPoints) */
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null)
  /** Polygon we just completed; show it until form state includes shape.points (Payload nested state can lag) */
  const lastCompletedPolygonRef = React.useRef<Point[] | null>(null)
  const overlayClickTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const floorPlanImageFromForm = useFormFields(([fields]) => {
    const getData = form?.getData
    const data = typeof getData === 'function' ? getData() : undefined
    const image = data?.floorPlanImage ?? (fields && typeof fields === 'object' && (fields as Record<string, { value?: unknown }>)['floorPlanImage']?.value)
    const url = getImageUrl(image)
    if (url) return url
    const fromDoc = docInfo?.data?.floorPlanImage ?? docInfo?.initialData?.floorPlanImage
    return getImageUrl(fromDoc) ?? null
  }) as string | null

  const floorPlanImageId = useFormFields(([fields]) => {
    const getData = form?.getData
    const data = typeof getData === 'function' ? getData() : undefined
    const image = data?.floorPlanImage ?? (fields && typeof fields === 'object' && (fields as Record<string, { value?: unknown }>)['floorPlanImage']?.value)
    return getImageId(image) ?? null
  }) as string | number | null

  useEffect(() => {
    if (floorPlanImageFromForm) {
      setResolvedUrl(floorPlanImageFromForm)
      return
    }
    const rawId = floorPlanImageId
    const id = rawId == null || rawId === '' ? null : String(rawId)
    if (!id) {
      setResolvedUrl(null)
      return
    }
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch(`/api/_media-url/${encodeURIComponent(id)}`, { credentials: 'include' })
        const json = await res.json().catch(() => ({}))
        if (cancelled) return
        const url = typeof json?.url === 'string' && json.url ? json.url : null
        setResolvedUrl(url)
        if (url) return
        const mediaRes = await fetch(`/api/media/${encodeURIComponent(id)}`, { credentials: 'include' })
        const mediaJson = await mediaRes.json().catch(() => ({}))
        if (cancelled) return
        const doc = (mediaJson as { doc?: unknown }).doc ?? mediaJson
        setResolvedUrl(getImageUrl(doc) ?? null)
      } catch {
        if (!cancelled) setResolvedUrl(null)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [floorPlanImageFromForm, floorPlanImageId])

  const floorPlanImage = floorPlanImageFromForm || resolvedUrl

  const containerRef = React.useRef<HTMLDivElement>(null)
  const arrayContainerRef = React.useRef<HTMLDivElement>(null)

  const isAddingPoints = drawing || editingUnitIndex !== null

  const toPercent = useCallback(
    (clientX: number, clientY: number): Point => {
      const el = containerRef.current
      if (!el) return { x: 0, y: 0 }
      const rect = el.getBoundingClientRect()
      return {
        x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
      }
    },
    [],
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isAddingPoints || !floorPlanImage) return
      e.preventDefault()
      const p = toPercent(e.clientX, e.clientY)
      setCurrentPoints((prev) => [...prev, p])
    },
    [isAddingPoints, floorPlanImage, toPercent],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isAddingPoints) return
      setPreviewPoint(toPercent(e.clientX, e.clientY))
    },
    [isAddingPoints, toPercent],
  )

  const handleCompleteUnit = useCallback(() => {
    const points = currentPoints
    if (points.length < 3) return
    const existing = value
    const nextPage = Math.max(1, ...existing.map((u) => u.detailPageNumber ?? 0)) + 1
    // New unit with polygon shape: points as array of { x, y } for Payload shape.points schema
    const newUnit = {
      label: `Unit ${existing.length + 1}`,
      detailPageNumber: nextPage,
      shape: {
        points: points.map((p) => ({ x: p.x, y: p.y })),
      },
    }
    setValue([...existing, newUnit])
    lastCompletedPolygonRef.current = points.map((p) => ({ x: p.x, y: p.y }))
    setCurrentPoints([])
    setPreviewPoint(null)
    // Scroll to the units list so the new row is visible for editing label and page number
    setTimeout(() => {
      arrayContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }, [currentPoints, value, setValue])

  const handleCancelCurrent = useCallback(() => {
    setCurrentPoints([])
    setPreviewPoint(null)
    setEditingUnitIndex(null)
  }, [])

  const handleRemoveLastPoint = useCallback(() => {
    setCurrentPoints((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
  }, [])

  const handleApplyEdit = useCallback(() => {
    const idx = editingUnitIndex
    if (idx == null || currentPoints.length < 3) return
    const next = [...value]
    const unit = next[idx]
    if (!unit) return
    next[idx] = { ...unit, shape: { points: currentPoints.map((p) => ({ x: p.x, y: p.y })) } }
    setValue(next)
    setCurrentPoints([])
    setPreviewPoint(null)
    setEditingUnitIndex(null)
  }, [editingUnitIndex, currentPoints, value, setValue])

  const handleRemovePointAt = useCallback((pointIndex: number) => {
    setCurrentPoints((prev) => {
      if (prev.length <= 3) return prev
      return prev.filter((_, i) => i !== pointIndex)
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Backspace' || !isAddingPoints || currentPoints.length === 0) return
      if ((e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable]')) return
      e.preventDefault()
      handleRemoveLastPoint()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isAddingPoints, currentPoints.length, handleRemoveLastPoint])

  /** Scroll to Units section and expand the accordion for the row at index (Payload uses id "path-row-index" and Collapsible toggle button) */
  const openUnitAccordion = useCallback((index: number) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const pathSegment = path.replace(/\./g, '-')
        const rowId = `${pathSegment}-row-${index}`
        let rowEl = document.getElementById(rowId) as HTMLElement | null
        if (!rowEl && arrayContainerRef.current) {
          rowEl = arrayContainerRef.current.querySelector(`[id$="-row-${index}"]`) as HTMLElement
        }
        const toggle = rowEl?.querySelector?.('.collapsible__toggle') as HTMLButtonElement | null
        const wasCollapsed = rowEl?.querySelector?.('.collapsible--collapsed')
        if (toggle && wasCollapsed) {
          toggle.click()
          // Scroll after expand animation so the full row height is used for centering
          setTimeout(() => {
            rowEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 350)
        } else {
          rowEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 150)
    })
  }, [path])

  const steps = (
    <div
      style={{
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        fontSize: 14,
      }}
    >
      <strong style={{ display: 'block', marginBottom: 6 }}>Workflow</strong>
      <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
        <li>Upload the <strong>Floor plan image</strong> above and select the <strong>Unit details PDF</strong> (e.g. STANOVI.pdf). Visitors who click a unit on the plan will open this PDF at the page number you set.</li>
        <li>Turn on <strong>Draw mode</strong>, then <strong>click on the plan</strong> to place points. Use <strong>Remove last point</strong> or <strong>Backspace</strong> to undo. Click <strong>Complete unit</strong> when the outline is ready (min 3 points).</li>
        <li>For each unit, set <strong>Label</strong> (e.g. A.1.1) and <strong>Detail page number</strong> (the PDF page for that unit). Open the PDF in another tab to confirm page numbers.</li>
        <li><strong>Edit a polygon:</strong> double‑click a unit polygon to edit it. Add points by clicking, remove by clicking a green point or <strong>Remove last point</strong>. <strong>Apply</strong> to save.</li>
      </ol>
    </div>
  )

  const pointsForPolygon = [...currentPoints]
  if (previewPoint && pointsForPolygon.length > 0) pointsForPolygon.push(previewPoint)

  return (
    <div className="unit-regions-field">
      <FieldLabel label={field?.label} path={path} required={field?.required} />
      <FieldDescription description={field?.admin?.description} path={path} />

      {steps}

      {!floorPlanImage && floorPlanImageId && (
        <div style={{ marginBottom: '1rem', color: 'var(--theme-elevation-600)', fontSize: 13 }}>
          Loading floor plan image…
        </div>
      )}

      {!floorPlanImage && !floorPlanImageId && (
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--theme-elevation-100)',
            borderRadius: 8,
            marginBottom: '1rem',
            border: '1px dashed var(--theme-elevation-250)',
          }}
        >
          <p style={{ margin: 0, color: 'var(--theme-elevation-700)' }}>
            No floor plan image yet. Upload an image in <strong>Floor plan image</strong> above, then <strong>Save</strong> this document.
          </p>
        </div>
      )}

      {floorPlanImage && (
        <div className="unit-regions-field__draw-area" style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => { setDrawing((d) => !d); setEditingUnitIndex(null); setCurrentPoints([]) }}
              disabled={editingUnitIndex !== null}
              style={{
                padding: '10px 20px',
                borderRadius: 6,
                border: 'none',
                background: drawing ? 'var(--theme-success-500)' : 'var(--theme-elevation-200)',
                color: drawing ? 'white' : 'var(--theme-elevation-900)',
                fontWeight: 600,
                cursor: editingUnitIndex === null ? 'pointer' : 'not-allowed',
                fontSize: 14,
              }}
            >
              {drawing ? '✓ Draw mode ON — click to add points' : '✏️ Turn on Draw mode'}
            </button>
            {editingUnitIndex !== null && (
              <>
                <button
                  type="button"
                  onClick={handleApplyEdit}
                  disabled={currentPoints.length < 3}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 6,
                    border: 'none',
                    background: currentPoints.length >= 3 ? 'var(--theme-success-600)' : 'var(--theme-elevation-150)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: currentPoints.length >= 3 ? 'pointer' : 'not-allowed',
                    fontSize: 14,
                  }}
                >
                  Apply ({currentPoints.length} points)
                </button>
                <button type="button" onClick={handleCancelCurrent} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--theme-elevation-250)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>
                  Cancel edit
                </button>
                {currentPoints.length > 0 && (
                  <button type="button" onClick={handleRemoveLastPoint} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--theme-elevation-250)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>
                    Remove last point
                  </button>
                )}
              </>
            )}
            {drawing && editingUnitIndex === null && (
              <>
                <button
                  type="button"
                  onClick={handleCompleteUnit}
                  disabled={currentPoints.length < 3}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 6,
                    border: 'none',
                    background: currentPoints.length >= 3 ? 'var(--theme-success-600)' : 'var(--theme-elevation-150)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: currentPoints.length >= 3 ? 'pointer' : 'not-allowed',
                    fontSize: 14,
                  }}
                >
                  Complete unit ({currentPoints.length} points)
                </button>
                {currentPoints.length > 0 && (
                  <>
                    <button type="button" onClick={handleCancelCurrent} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--theme-elevation-250)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>
                      Cancel current
                    </button>
                    <button type="button" onClick={handleRemoveLastPoint} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--theme-elevation-250)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>
                      Remove last point
                    </button>
                  </>
                )}
              </>
            )}
            <span style={{ fontSize: 13, color: 'var(--theme-elevation-600)' }}>
              {editingUnitIndex !== null
                ? 'Editing polygon: click to add points, click a green point to delete it (min 3), or Remove last point. Apply to save.'
                : drawing
                  ? 'Click on the plan to add points. Backspace = remove last point. Use Complete unit when ready (min 3 points).'
                  : 'Turn on Draw mode, or double‑click a unit polygon to edit it.'}
            </span>
          </div>
          <div
            ref={containerRef}
            className="unit-regions-field__canvas"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setPreviewPoint(null)}
            style={{
              position: 'relative',
              maxWidth: '100%',
              display: 'inline-block',
              cursor: isAddingPoints ? 'crosshair' : 'default',
              border: isAddingPoints ? '2px solid var(--theme-success-500)' : '1px solid var(--theme-elevation-200)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <img
              src={floorPlanImage}
              alt="Floor plan"
              style={{ display: 'block', maxWidth: '100%', height: 'auto', pointerEvents: 'none' }}
            />
            <svg
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              preserveAspectRatio="none"
            >
              {/* Existing units: polygons or legacy rectangles (skip unit being edited — it's shown as currentPoints) */}
              {value.map((unit: { shape?: { points?: Point[]; x?: number; y?: number; width?: number; height?: number } }, i: number) => {
                if (i === editingUnitIndex) return null
                const s = unit?.shape
                if (!s || typeof s !== 'object') return null
                let polygonPoints = getShapePoints(s)
                // If form state hasn't synced shape.points yet, use the polygon we just completed for the last row
                if (!polygonPoints && i === value.length - 1 && lastCompletedPolygonRef.current && lastCompletedPolygonRef.current.length >= 3) {
                  polygonPoints = lastCompletedPolygonRef.current
                }
                if (polygonPoints && polygonPoints.length >= 3) {
                  if (getShapePoints(s)) lastCompletedPolygonRef.current = null
                  const pts = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ')
                  return (
                    <polygon
                      key={i}
                      points={pts}
                      fill="rgba(59, 130, 246, 0.25)"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="0.5"
                    />
                  )
                }
                if (typeof s.x === 'number' && typeof s.y === 'number' && typeof s.width === 'number' && typeof s.height === 'number') {
                  return (
                    <rect
                      key={i}
                      x={s.x}
                      y={s.y}
                      width={s.width}
                      height={s.height}
                      fill="rgba(59, 130, 246, 0.25)"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="0.5"
                    />
                  )
                }
                return null
              })}
              {/* Current drawing: blue filled polygon when 3+ points (completed shape preview) */}
              {currentPoints.length >= 3 && (
                <polygon
                  points={currentPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="rgba(59, 130, 246, 0.35)"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="0.5"
                />
              )}
              {/* Current drawing: polyline (edges) and next edge to preview point */}
              {pointsForPolygon.length >= 2 && (
                <polyline
                  points={pointsForPolygon.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="0.4"
                  strokeDasharray="1 1"
                />
              )}
              {currentPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="0.8" fill="rgb(34, 197, 94)" stroke="white" strokeWidth="0.3" />
              ))}
              {/* When editing: clickable point handles to delete a point (min 3) */}
              {editingUnitIndex !== null && (
                <g pointerEvents="none">
                  {currentPoints.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="1.4"
                      fill="rgba(34, 197, 94, 0.9)"
                      stroke="white"
                      strokeWidth="0.35"
                      pointerEvents="auto"
                      style={{ cursor: currentPoints.length > 3 ? 'pointer' : 'default' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (currentPoints.length > 3) handleRemovePointAt(i)
                      }}
                    />
                  ))}
                </g>
              )}
              {previewPoint && (
                <circle cx={previewPoint.x} cy={previewPoint.y} r="0.6" fill="rgba(34, 197, 94, 0.7)" stroke="rgb(34, 197, 94)" strokeWidth="0.3" />
              )}
            </svg>
            {/* Clickable overlay: single-click = open accordion, double-click = edit polygon (only when not drawing/editing) */}
            {!isAddingPoints && value.length > 0 && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  const el = e.target as SVGElement
                  const idx = el.getAttribute?.('data-unit-index')
                  if (idx == null) return
                  e.preventDefault()
                  e.stopPropagation()
                  if (overlayClickTimeoutRef.current) return
                  overlayClickTimeoutRef.current = setTimeout(() => {
                    overlayClickTimeoutRef.current = null
                    openUnitAccordion(Number(idx))
                  }, 250)
                }}
                onDoubleClick={(e) => {
                  const el = e.target as SVGElement
                  const idx = el.getAttribute?.('data-unit-index')
                  if (idx == null) return
                  e.preventDefault()
                  e.stopPropagation()
                  if (overlayClickTimeoutRef.current) {
                    clearTimeout(overlayClickTimeoutRef.current)
                    overlayClickTimeoutRef.current = null
                  }
                  const unit = value[Number(idx)]
                  const points = unit?.shape ? getShapePoints(unit.shape) : null
                  if (points && points.length >= 3) {
                    setCurrentPoints(points.map((p) => ({ x: p.x, y: p.y })))
                    setEditingUnitIndex(Number(idx))
                  }
                }}
              >
                {value.map((unit: { shape?: { points?: Point[]; x?: number; y?: number; width?: number; height?: number } }, i: number) => {
                  const s = unit?.shape
                  if (!s || typeof s !== 'object') return null
                  let polygonPoints = getShapePoints(s)
                  if (!polygonPoints && i === value.length - 1 && lastCompletedPolygonRef.current && lastCompletedPolygonRef.current.length >= 3) {
                    polygonPoints = lastCompletedPolygonRef.current
                  }
                  if (polygonPoints && polygonPoints.length >= 3) {
                    const pts = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ')
                    return (
                      <polygon
                        key={i}
                        data-unit-index={i}
                        points={pts}
                        fill="transparent"
                        stroke="none"
                        style={{ cursor: 'pointer' }}
                      />
                    )
                  }
                  if (typeof s.x === 'number' && typeof s.y === 'number' && typeof s.width === 'number' && typeof s.height === 'number') {
                    return (
                      <rect
                        key={i}
                        data-unit-index={i}
                        x={s.x}
                        y={s.y}
                        width={s.width}
                        height={s.height}
                        fill="transparent"
                        stroke="none"
                        style={{ cursor: 'pointer' }}
                      />
                    )
                  }
                  return null
                })}
              </svg>
            )}
          </div>
        </div>
      )}

      <div ref={arrayContainerRef} className="unit-regions-field__array">
        <ArrayField {...props} />
      </div>
    </div>
  )
}
