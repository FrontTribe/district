'use client'

import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import type { ReLandingPdfModalCopy } from '@/data/reLandingSeedDefaults'

export type PdfModalUnit = {
  id: string
  dilatacija?: string | null
  floor?: number | null
  typeLabel: string
  neto?: number | null
  obr?: number | null
  page: number
}

export function RealEstateLandingPdfModal({
  stan,
  pdfDocumentId,
  pdfMetaLine,
  copy,
  onClose,
}: {
  stan: PdfModalUnit | null
  /** Payload `documents` id — obavezno za jednu stranicu (`/api/pdf-file/:id?page=`). */
  pdfDocumentId?: string | number | null
  /** e.g. "— Projekt · Dilatacija A · 3. kat" */
  pdfMetaLine?: string | null
  /** Tekstovi modala (iz CMS bloka / seed paketa). */
  copy: ReLandingPdfModalCopy
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!stan) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [stan])

  useLayoutEffect(() => {
    if (!stan || !gsap) return
    const tl = gsap.timeline()
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    tl.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: 'expo.out' }, '<0.05')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stan?.id])

  const handleClose = () => {
    if (!gsap) {
      onClose()
      return
    }
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { xPercent: 100, duration: 0.55, ease: 'expo.in' })
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2')
  }

  if (!stan) return null

  const dil = stan.dilatacija ?? '—'
  const kat = stan.floor != null ? String(stan.floor) : '—'
  const meta =
    pdfMetaLine?.trim() ||
    copy.metaTemplate.replaceAll('{dil}', dil).replaceAll('{floor}', kat)

  const hasDocId = pdfDocumentId != null && String(pdfDocumentId).length > 0
  const page = Math.max(1, Math.floor(Number(stan.page)) || 1)
  const viewerSrc = hasDocId ? `/api/pdf-file/${String(pdfDocumentId)}?page=${page}` : ''
  const tabHref = hasDocId ? `/api/pdf-file/${String(pdfDocumentId)}?page=${page}` : undefined

  const embedTitle = copy.embedTitleTemplate.replaceAll('{id}', stan.id)

  return (
    <div ref={overlayRef} className="pdfm" onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div ref={panelRef} className="pdfm__panel">
        <header className="pdfm__head">
          <div className="pdfm__head-l">
            <div className="pdfm__meta-row mono">{meta}</div>
            <h3 className="pdfm__title serif">
              {copy.modalUnitWord} <span className="it">{stan.id}</span>
            </h3>
            <div className="pdfm__meta-row pdfm__specs">
              <span>{stan.typeLabel}</span>
              <span className="dot">·</span>
              <span>
                {stan.neto != null ? `${stan.neto.toFixed(2)} m²` : '—'} {copy.netLabel}
              </span>
              {stan.obr != null ? (
                <>
                  <span className="dot">·</span>
                  <span>
                    {stan.obr.toFixed(2)} m² {copy.grossLabel}
                  </span>
                </>
              ) : null}
              <span className="dot">·</span>
              <span className="mono">
                {copy.pdfPagePrefix}
                {page}
              </span>
            </div>
          </div>
          <button type="button" className="pdfm__close" onClick={handleClose} aria-label={copy.closeLabel}>
            <span>{copy.closeLabel}</span>
            <i>×</i>
          </button>
        </header>

        <div className="pdfm__viewer">
          {viewerSrc ? (
            <embed
              key={`${String(pdfDocumentId)}-${page}`}
              type="application/pdf"
              src={viewerSrc}
              title={embedTitle}
              className="pdfm__embed"
            />
          ) : (
            <div className="pdfm__empty mono">{copy.emptyDocumentMessage}</div>
          )}
        </div>

        <footer className="pdfm__foot">
          <a
            className="pdfm__cta"
            href={tabHref ?? '#'}
            target={tabHref ? '_blank' : undefined}
            rel={tabHref ? 'noopener noreferrer' : undefined}
            aria-disabled={!tabHref}
            onClick={(e) => {
              if (!tabHref) e.preventDefault()
            }}
          >
            <span>{copy.openInNewTab}</span>
            <i>↗</i>
          </a>
          <a className="pdfm__cta pdfm__cta--alt" href="#kontakt" onClick={() => handleClose()}>
            <span>{copy.sendInquiryCta}</span>
            <i>→</i>
          </a>
        </footer>
      </div>
    </div>
  )
}
