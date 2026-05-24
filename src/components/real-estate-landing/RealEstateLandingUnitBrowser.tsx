'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import type {
  ReLandingPdfModalCopy,
  ReLandingUnitBrowserCopy,
  ReLandingLocale,
} from '@/data/reLandingSeedDefaults'
import { getReLandingLocalePack, UNIT_TYPE_LABELS_BY_LOCALE } from '@/data/realEstateLandingLocales'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'
import { RealEstateLandingPdfModal, type PdfModalUnit } from './RealEstateLandingPdfModal'

type BuildingUnit = {
  label: string
  detailPageNumber: number
  dilatacija?: string | null
  floor?: number | null
  unitType?: string | null
  netArea?: number | null
  grossArea?: number | null
  status?: 'available' | 'reserved' | 'sold' | null
}

type Building = {
  id?: string | number
  title?: string
  unitDetailsPdf?: { id?: string | number; url?: string } | string | number | null
  units?: BuildingUnit[] | null
}

function resolveUiLocale(raw: string | null | undefined): ReLandingLocale {
  const lc = (raw || 'hr').slice(0, 2).toLowerCase()
  if (lc === 'en') return 'en'
  if (lc === 'de') return 'de'
  return 'hr'
}

function mergeUnitBrowserCopy(
  base: ReLandingUnitBrowserCopy,
  partial?: Partial<ReLandingUnitBrowserCopy> | null,
): ReLandingUnitBrowserCopy {
  if (!partial) return base
  const o = { ...base }
  for (const k of Object.keys(partial) as (keyof ReLandingUnitBrowserCopy)[]) {
    const v = partial[k]
    if (v != null && String(v).trim() !== '') (o as Record<string, string>)[k] = String(v)
  }
  return o
}

function mergePdfModalCopy(
  base: ReLandingPdfModalCopy,
  partial?: Partial<ReLandingPdfModalCopy> | null,
): ReLandingPdfModalCopy {
  if (!partial) return base
  const o = { ...base }
  for (const k of Object.keys(partial) as (keyof ReLandingPdfModalCopy)[]) {
    const v = partial[k]
    if (v != null && String(v).trim() !== '') (o as Record<string, string>)[k] = String(v)
  }
  return o
}

/**
 * Grupiranje u pregledu: prvo CMS polje `dilatacija`, inače slovo bloka iz oznake
 * tipa „… STAN D.1.2“ (ne početak tipa „DVOSOBNI“).
 */
function inferDilatacija(u: BuildingUnit): string {
  if (u.dilatacija && String(u.dilatacija).trim()) return String(u.dilatacija).trim()
  const label = u.label.trim()
  const stan = /\bSTAN\s+([A-Za-z0-9]+)\.\d+\.\d+/i.exec(label)
  if (stan?.[1]) return stan[1].toUpperCase()
  const m = /^([A-Za-z0-9]+)[.\s_-]/.exec(label)
  return m ? m[1].toUpperCase() : '—'
}

function normalizeUnitStatus(raw: string | null | undefined): 'available' | 'reserved' | 'sold' {
  if (raw === 'reserved' || raw === 'sold') return raw
  return 'available'
}

function normalizePdfPage(n: number | undefined | null): number {
  const v = Math.floor(Number(n))
  if (!Number.isFinite(v) || v < 1) return 1
  return v
}

export function RealEstateLandingUnitBrowser({
  sectionId = 'kat',
  eyebrow,
  headingParts,
  introHtml,
  legendHtml,
  detailPanelNoteHtml,
  building,
  pdfMetaLine,
  browserCopy: browserCopyProp,
  pdfModalCopy: pdfModalCopyProp,
  locale,
}: {
  sectionId?: string
  eyebrow: string
  headingParts: { text: string; italic?: boolean }[]
  introHtml: string
  legendHtml?: string | null
  detailPanelNoteHtml?: string | null
  building: Building | number | null
  pdfMetaLine?: string | null
  browserCopy?: Partial<ReLandingUnitBrowserCopy> | null
  pdfModalCopy?: Partial<ReLandingPdfModalCopy> | null
  locale?: string | null
}) {
  const ref = useRef<HTMLElement>(null)
  const [dil, setDil] = useState('')
  const [kat, setKat] = useState('')
  const [open, setOpen] = useState<PdfModalUnit | null>(null)
  const [fetchedBuilding, setFetchedBuilding] = useState<Building | null>(null)
  const [fetchHttpStatus, setFetchHttpStatus] = useState<number | null>(null)
  const [fetchPlainError, setFetchPlainError] = useState<'unexpected' | 'network' | null>(null)

  const uiLocale = resolveUiLocale(locale)
  const localePack = useMemo(() => getReLandingLocalePack(uiLocale), [uiLocale])
  const ui = useMemo(
    () => mergeUnitBrowserCopy(localePack.unitBrowserCopy, browserCopyProp),
    [localePack.unitBrowserCopy, browserCopyProp],
  )

  /** CMS može ostaviti prazno; isti fallback na SSR i klijentu (izbjegava hydration mismatch). */
  const introResolved = useMemo(() => {
    const raw = (introHtml ?? '').trim()
    if (raw) return introHtml ?? ''
    return localePack.unitBrowser.introHtml
  }, [introHtml, localePack.unitBrowser.introHtml])

  const legendResolved = useMemo(() => {
    const raw = (legendHtml ?? '').trim()
    if (raw) return legendHtml ?? ''
    return localePack.unitBrowser.legendHtml ?? ''
  }, [legendHtml, localePack.unitBrowser.legendHtml])
  const pdfCopy = useMemo(
    () => mergePdfModalCopy(localePack.pdfModalCopy, pdfModalCopyProp),
    [localePack.pdfModalCopy, pdfModalCopyProp],
  )
  const typeLabels = UNIT_TYPE_LABELS_BY_LOCALE[uiLocale]

  const buildingId = typeof building === 'number' ? building : null

  useEffect(() => {
    if (buildingId == null) {
      setFetchedBuilding(null)
      setFetchHttpStatus(null)
      setFetchPlainError(null)
      return
    }
    const ac = new AbortController()
    setFetchHttpStatus(null)
    setFetchPlainError(null)
    setFetchedBuilding(null)
    ;(async () => {
      try {
        const res = await fetch(`/api/buildings/${buildingId}?depth=3`, { signal: ac.signal })
        if (!res.ok) {
          setFetchHttpStatus(res.status)
          return
        }
        const json: unknown = await res.json()
        let doc: Building | null = null
        if (json && typeof json === 'object') {
          if ('doc' in json && json.doc && typeof json.doc === 'object') {
            doc = json.doc as Building
          } else if ('id' in json && ('units' in json || 'unitDetailsPdf' in json)) {
            doc = json as Building
          }
        }
        if (!doc) {
          setFetchPlainError('unexpected')
          return
        }
        setFetchedBuilding(doc)
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        setFetchPlainError('network')
      }
    })()
    return () => ac.abort()
  }, [buildingId])

  const effectiveBuilding: Building | null = useMemo(() => {
    if (building && typeof building === 'object') return building as Building
    return fetchedBuilding
  }, [building, fetchedBuilding])

  const resolved = useMemo(() => {
    if (!effectiveBuilding) return null
    const units = Array.isArray(effectiveBuilding.units) ? effectiveBuilding.units : []
    const pdf = effectiveBuilding.unitDetailsPdf
    const pdfId =
      typeof pdf === 'number' || typeof pdf === 'string'
        ? String(pdf)
        : typeof pdf === 'object' &&
            pdf &&
            'id' in pdf &&
            (pdf as { id?: string | number }).id != null
          ? String((pdf as { id: string | number }).id)
          : null

    const byDil: Record<string, { total: number; byKat: Record<string, BuildingUnit[]> }> = {}
    for (const u of units) {
      const d = inferDilatacija(u)
      if (!byDil[d]) byDil[d] = { total: 0, byKat: {} }
      byDil[d].total++
      const fl = u.floor != null && Number.isFinite(Number(u.floor)) ? String(u.floor) : '0'
      if (!byDil[d].byKat[fl]) byDil[d].byKat[fl] = []
      byDil[d].byKat[fl].push(u)
    }
    for (const d of Object.values(byDil)) {
      for (const k of Object.keys(d.byKat)) {
        d.byKat[k].sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
      }
    }
    const totalBuildUnits = units.length
    return { byDil, pdfId, totalBuildUnits }
  }, [effectiveBuilding])

  const dilKeys = useMemo(() => Object.keys(resolved?.byDil ?? {}).sort(), [resolved])
  const currentDil = resolved?.byDil[dil] ?? { total: 0, byKat: {} as Record<string, BuildingUnit[]> }
  const katKeys = useMemo(() => Object.keys(currentDil.byKat).sort((a, b) => Number(a) - Number(b)), [currentDil.byKat])

  useLayoutEffect(() => {
    if (dilKeys.length && !dilKeys.includes(dil)) setDil(dilKeys[0])
  }, [dilKeys, dil])

  useLayoutEffect(() => {
    if (katKeys.length && !katKeys.includes(kat)) setKat(katKeys[0] ?? '')
  }, [katKeys, kat])

  const unitsOnFloor = (currentDil.byKat[kat] ?? []).map((u) => ({
    u,
    status: normalizeUnitStatus(u.status),
  }))

  const stats = useMemo(() => {
    const sold = unitsOnFloor.filter((x) => x.status === 'sold').length
    const reserved = unitsOnFloor.filter((x) => x.status === 'reserved').length
    const available = unitsOnFloor.filter((x) => x.status === 'available').length
    return { sold, reserved, available, total: unitsOnFloor.length }
  }, [unitsOnFloor])

  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const head = ref.current?.querySelector('.kat__head')
      if (head) revealWordsIn(head as HTMLElement, { trigger: head, start: 'top 80%' })
      gsap.from('.kat__dil-btn, .kat__btn', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '.kat__nav', start: 'top 80%', once: true },
      })
      gsap.from('.kat__plot', {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.kat__stage', start: 'top 75%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!gsap || !ref.current) return
    const units = ref.current.querySelectorAll('.kat__unit')
    if (!units.length) return
    gsap.fromTo(units, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.025 })
  }, [kat, dil])

  const loadStatusMessage = useMemo(() => {
    if (fetchHttpStatus != null) return ui.loadingErrorTemplate.replaceAll('{status}', String(fetchHttpStatus))
    if (fetchPlainError === 'unexpected') return ui.unexpectedResponse
    if (fetchPlainError === 'network') return ui.networkFailure
    return ui.loadingInProgress
  }, [fetchHttpStatus, fetchPlainError, ui])

  if (buildingId != null && !effectiveBuilding) {
    return (
      <section ref={ref} id={sectionId} className="kat">
        <div className="kat__head">
          <div className="eyebrow">{eyebrow}</div>
          <p className="mono" style={{ opacity: 0.65 }}>
            {loadStatusMessage}
          </p>
        </div>
      </section>
    )
  }

  if (!resolved || !effectiveBuilding) return null

  const onUnitClick = (u: BuildingUnit) => {
    if (normalizeUnitStatus(u.status) === 'sold') return
    const ut = (u.unitType ?? 'other') as keyof typeof typeLabels
    const typeLabel = typeLabels[ut] ?? typeLabels.other ?? u.unitType ?? '—'
    setOpen({
      id: u.label,
      dilatacija: u.dilatacija ?? inferDilatacija(u),
      floor: u.floor ?? Number(kat),
      typeLabel,
      neto: u.netArea ?? null,
      obr: u.grossArea ?? null,
      page: normalizePdfPage(u.detailPageNumber),
    })
  }

  const pageRangeFragment = (() => {
    const a = unitsOnFloor[0]?.u.detailPageNumber
    const b = unitsOnFloor[unitsOnFloor.length - 1]?.u.detailPageNumber
    if (a == null || b == null) return null
    return ui.pagesRangeTemplate
      .replaceAll('{from}', String(normalizePdfPage(a)))
      .replaceAll('{to}', String(normalizePdfPage(b)))
  })()

  return (
    <section ref={ref} id={sectionId} className="kat">
      <div className="kat__head">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="serif">
          {headingParts.map((p, i) =>
            p.italic ? (
              <span key={i} className="it">
                <SplitWords text={p.text} />
                <br />
              </span>
            ) : (
              <span key={i}>
                <SplitWords text={p.text} />{' '}
              </span>
            ),
          )}
        </h2>
        {/* div: introHtml iz CMS-a često sadrži <p> — ugniježđeni <p> u <p> lomi hydration */}
        <div className="kat__intro sans" dangerouslySetInnerHTML={{ __html: introResolved }} />
        {legendResolved.trim() ? (
          <div className="kat__legend mono" dangerouslySetInnerHTML={{ __html: legendResolved }} />
        ) : null}
      </div>

      <div className="kat__layout">
        <aside className="kat__side">
          <div className="kat__group">
            <div className="kat__group-lbl mono">{ui.dilatationLabel}</div>
            <div className="kat__dil">
              {dilKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`kat__dil-btn ${dil === k ? 'active' : ''}`}
                  onClick={() => setDil(k)}
                >
                  <span className="kat__dil-letter serif">{k}</span>
                  <span className="kat__dil-count mono">{resolved.byDil[k]?.total ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="kat__group">
            <div className="kat__group-lbl mono">{ui.floorLabel}</div>
            <div className="kat__nav">
              {katKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`kat__btn ${kat === k ? 'active' : ''}`}
                  onClick={() => setKat(k)}
                >
                  <span className="kat__btn-idx mono">{k}.</span>
                  <span className="kat__btn-name serif">{ui.floorButtonWord}</span>
                  <span className="kat__btn-count mono">{currentDil.byKat[k]?.length ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="kat__stats">
            <div className="kat__stat">
              <span className="kat__stat-num serif">{stats.available}</span>
              <span className="kat__stat-lbl">{ui.statusAvailable}</span>
            </div>
            <div className="kat__stat">
              <span className="kat__stat-num serif">{stats.reserved}</span>
              <span className="kat__stat-lbl">{ui.statusReserved}</span>
            </div>
            <div className="kat__stat">
              <span className="kat__stat-num serif">{stats.sold}</span>
              <span className="kat__stat-lbl">{ui.statusSold}</span>
            </div>
          </div>
          <p className="kat__cms-hint mono">{ui.adminHint.replaceAll('{count}', String(resolved.totalBuildUnits))}</p>
        </aside>

        <div className="kat__stage">
          <div className="kat__stage-head">
            <div className="kat__stage-title">
              <span className="serif kat__stage-num">{kat}.</span>
              <span className="serif it kat__stage-word">{ui.stageFloorWord}</span>
              <span className="mono kat__stage-dil">
                {ui.dilatationStagePrefix}
                {dil}
              </span>
            </div>
            <div className="mono kat__stage-meta">
              {stats.total} {ui.unitsTotalSuffix}
            </div>
          </div>

          <div className="kat__plot">
            <div className="kat__floor">
              {unitsOnFloor.map(({ u, status }) => (
                <button
                  key={u.label}
                  type="button"
                  className={`kat__unit kat__unit--${status}`}
                  onClick={() => onUnitClick(u)}
                >
                  <span className="kat__unit-head">
                    <span className="kat__unit-id mono">{u.label}</span>
                    <span className="kat__unit-pdf mono">{ui.pdfCardBadge}</span>
                  </span>
                  <span className="kat__unit-type">
                    {typeLabels[(u.unitType ?? 'other') as keyof typeof typeLabels] ??
                      typeLabels.other ??
                      u.unitType ??
                      '—'}
                  </span>
                  <span className="kat__unit-sqm serif">
                    {u.netArea != null ? u.netArea.toFixed(1) : '—'} <small>m²</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="kat__detail">
            <div className="kat__detail-empty mono">
              {detailPanelNoteHtml?.trim() ? (
                <span dangerouslySetInnerHTML={{ __html: detailPanelNoteHtml }} />
              ) : (
                <>
                  {ui.defaultDetailLead}{' '}
                  {pageRangeFragment}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <RealEstateLandingPdfModal
        stan={open}
        pdfDocumentId={resolved.pdfId}
        pdfMetaLine={pdfMetaLine}
        copy={pdfCopy}
        onClose={() => setOpen(null)}
      />
    </section>
  )
}
