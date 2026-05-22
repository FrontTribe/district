'use client'

import React, { useEffect, useCallback } from 'react'

export type ProjectGallerySlide = {
  url: string
  alt?: string
  caption?: string | null
  credit?: string | null
}

export function RealEstateLandingProjectGallery({
  open,
  title,
  metaLine,
  slides,
  index,
  onClose,
  onIndexChange,
}: {
  open: boolean
  title: string
  metaLine?: string | null
  slides: ProjectGallerySlide[]
  index: number
  onClose: () => void
  onIndexChange: (i: number) => void
}) {
  const safeIndex = slides.length ? Math.min(Math.max(0, index), slides.length - 1) : 0
  const slide = slides[safeIndex]

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!slides.length) return
      const next = (safeIndex + dir + slides.length) % slides.length
      onIndexChange(next)
    },
    [slides.length, safeIndex, onIndexChange],
  )

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, go])

  if (!open || !slide) return null

  return (
    <div className="pgm" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pgm__panel">
        <header className="pgm__head">
          <div>
            <h2 className="pgm__title">{title}</h2>
            {metaLine ? <div className="pgm__meta mono">{metaLine}</div> : null}
          </div>
          <button type="button" className="pgm__close" onClick={onClose} aria-label="Zatvori">
            <i>×</i>
          </button>
        </header>

        <div className="pgm__stage">
          <img src={slide.url} alt={slide.alt ?? ''} />
          <div className="pgm__nav" aria-hidden>
            <button type="button" onClick={() => go(-1)} aria-label="Prethodna slika">
              ‹
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Sljedeća slika">
              ›
            </button>
          </div>
        </div>

        <footer className="pgm__foot">
          {slide.caption ? <p className="pgm__caption">{slide.caption}</p> : null}
          {slide.credit?.trim() ? <p className="pgm__credit mono">{slide.credit}</p> : null}
          {slides.length > 1 ? (
            <div className="pgm__thumbs">
              {slides.map((s, i) => (
                <button
                  key={`${s.url}-${i}`}
                  type="button"
                  className={`pgm__thumb ${i === safeIndex ? 'active' : ''}`}
                  onClick={() => onIndexChange(i)}
                  aria-label={`Slika ${i + 1}`}
                >
                  <img src={s.url} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </footer>
      </div>
    </div>
  )
}
