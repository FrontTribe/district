'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'
import { RealEstateLandingProjectGallery, type ProjectGallerySlide } from './RealEstateLandingProjectGallery'

export type PastProjectRow = {
  name: string
  subtitle?: string | null
  location: string
  year: string
  statusLabel: string
  statusActive?: boolean
  summaryHtml?: string | null
  previewImageUrl?: string | null
  previewImageAlt?: string | null
  externalUrl?: string | null
  externalOpenInNewTab?: boolean
  gallery: ProjectGallerySlide[]
}

export function RealEstateLandingPastProjects({
  sectionId = 'projekti',
  layout = 'rows',
  eyebrow,
  headingParts,
  introHtml,
  projects,
}: {
  sectionId?: string
  layout?: 'rows' | 'grid'
  eyebrow: string
  headingParts: { text: string; italic?: boolean }[]
  introHtml: string
  projects: PastProjectRow[]
}) {
  const ref = useRef<HTMLElement>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryProject, setGalleryProject] = useState<PastProjectRow | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const openGallery = (p: PastProjectRow, startIndex = 0) => {
    if (!p.gallery?.length) return
    setGalleryProject(p)
    setGalleryIndex(startIndex)
    setGalleryOpen(true)
  }

  const galleryMeta = (p: PastProjectRow) =>
    [p.subtitle?.trim(), p.location, p.year].filter(Boolean).join(' · ')

  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const head = ref.current?.querySelector('.dp__head')
      if (head) revealWordsIn(head as HTMLElement, { trigger: head, start: 'top 80%' })
      gsap.from('.dp__row, .dp__card', {
        y: 24,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id={sectionId} className={`dp dp--${layout}`}>
      <div className="dp__head">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="serif">
            {headingParts.map((p, i) =>
              p.italic ? (
                <span key={i} className="it">
                  <SplitWords text={p.text} />{' '}
                </span>
              ) : (
                <span key={i}>
                  <SplitWords text={p.text} />{' '}
                </span>
              ),
            )}
          </h2>
        </div>
        {/* Use div, not p: introHtml often contains <p>…</p> — nested <p> breaks SSR/client DOM parity */}
        <div className="dp__intro" dangerouslySetInnerHTML={{ __html: introHtml }} />
      </div>

      <div className="dp__list">
        {projects.map((p, idx) => (
          <div
            key={`${p.name}-${idx}`}
            role="button"
            tabIndex={0}
            className="dp__row"
            onClick={() => openGallery(p, 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openGallery(p, 0)
              }
            }}
          >
            <span className="dp__idx mono">{String(idx + 1).padStart(2, '0')}</span>
            <span className="dp__name serif">
              <span className="dp__name-text">{p.name}</span>
              {p.subtitle?.trim() ? <span className="dp__sub">{p.subtitle}</span> : null}
              {p.externalUrl?.trim() ? (
                <span className="dp__row-link">
                  <a
                    href={p.externalUrl}
                    onClick={(e) => e.stopPropagation()}
                    {...(p.externalOpenInNewTab !== false ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    Web
                  </a>
                </span>
              ) : null}
            </span>
            <span className="dp__loc">{p.location}</span>
            <span className="dp__year mono">{p.year}</span>
            <span className={`dp__status ${p.statusActive ? 'active' : ''}`}>
              <i className="dp__status-dot" />
              {p.statusLabel}
            </span>
            <span className="dp__arrow mono">↗</span>
            {p.previewImageUrl ? (
              <div className="dp__preview" aria-hidden>
                <img src={p.previewImageUrl} alt={p.previewImageAlt ?? ''} />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="dp__grid-wrap">
        {projects.map((p, idx) => (
          <article
            key={`card-${p.name}-${idx}`}
            className="dp__card"
            role="button"
            tabIndex={0}
            onClick={() => openGallery(p, 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openGallery(p, 0)
              }
            }}
          >
            <div className="dp__card-img">
              {p.previewImageUrl ? <img src={p.previewImageUrl} alt={p.previewImageAlt ?? ''} /> : null}
              <span className="dp__card-year mono">{p.year}</span>
            </div>
            <div className="dp__card-meta">
              <span className="dp__card-name">{p.name}</span>
              <span className="dp__card-loc">{p.location}</span>
            </div>
            {p.summaryHtml?.trim() ? (
              <div className="dp__card-desc" dangerouslySetInnerHTML={{ __html: p.summaryHtml }} />
            ) : (
              <p className="dp__card-desc">{p.statusLabel}</p>
            )}
          </article>
        ))}
      </div>

      <RealEstateLandingProjectGallery
        open={galleryOpen && !!galleryProject?.gallery?.length}
        title={galleryProject?.name ?? ''}
        metaLine={galleryProject ? galleryMeta(galleryProject) : null}
        slides={galleryProject?.gallery ?? []}
        index={galleryIndex}
        onClose={() => {
          setGalleryOpen(false)
          setGalleryProject(null)
        }}
        onIndexChange={setGalleryIndex}
      />
    </section>
  )
}
