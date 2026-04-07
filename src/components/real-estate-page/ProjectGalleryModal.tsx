'use client'

import React, { useEffect, useState } from 'react'

export type ProjectGalleryProject = {
  title: string
  galleryImages: string[]
}

type Props = {
  isOpen: boolean
  onClose: () => void
  project: ProjectGalleryProject | null
}

export function ProjectGalleryModal({ isOpen, onClose, project }: Props) {
  const [index, setIndex] = useState(0)

  const images = project?.galleryImages ?? []
  const current = images[index]

  useEffect(() => {
    if (project) setIndex(0)
  }, [project])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, images.length, onClose])

  const goPrev = () => {
    if (images.length <= 1) return
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }

  const goNext = () => {
    if (images.length <= 1) return
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }

  if (!isOpen) return null

  return (
    <div
      className="re-gallery"
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery: ${project?.title ?? ''}`}
    >
      <div className="re-gallery__backdrop" onClick={onClose} aria-hidden />

      <header className="re-gallery__header">
        <h2 className="re-gallery__title">{project?.title ?? ''}</h2>
        <button
          type="button"
          className="re-gallery__close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="re-gallery__stage">
        {images.length === 0 ? (
          <p className="re-gallery__empty">No images in this gallery.</p>
        ) : (
          <>
            <button
              type="button"
              className="re-gallery__nav re-gallery__nav--prev"
              onClick={goPrev}
              aria-label="Previous image"
              disabled={images.length <= 1}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="re-gallery__frame">
              <img
                key={index}
                src={current}
                alt={`${project?.title ?? 'Project'} – image ${index + 1} of ${images.length}`}
                className="re-gallery__img"
              />
            </div>

            <button
              type="button"
              className="re-gallery__nav re-gallery__nav--next"
              onClick={goNext}
              aria-label="Next image"
              disabled={images.length <= 1}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 0 && (
        <footer className="re-gallery__footer">
          <span className="re-gallery__counter">
            {index + 1} <span className="re-gallery__counter-sep">/</span> {images.length}
          </span>
          <div className="re-gallery__thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`re-gallery__thumb ${i === index ? 're-gallery__thumb--active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </footer>
      )}
    </div>
  )
}
