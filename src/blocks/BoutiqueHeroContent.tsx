'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { getTranslation } from '@/utils/translations'

export function parseBoutiqueSubheading(raw?: string | null): {
  eyebrow?: string
  body?: string
} {
  if (!raw?.trim()) return {}
  const normalized = raw.replace(/\r\n/g, '\n')
  const marker = '\n---\n'
  const idx = normalized.indexOf(marker)
  if (idx === -1) return { body: normalized.trim() }
  const eyebrow = normalized.slice(0, idx).trim()
  const body = normalized.slice(idx + marker.length).trim()
  return { eyebrow: eyebrow || undefined, body: body || undefined }
}

/** Wrap segments in *like this* as <em> for hero titles. */
export function parseBoutiqueHeadingEmphasis(text: string): React.ReactNode[] {
  const segments = text.split(/(\*[^*]+\*)/g)
  return segments.map((seg, i) => {
    if (seg.startsWith('*') && seg.endsWith('*') && seg.length >= 2) {
      return <em key={i}>{seg.slice(1, -1)}</em>
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>
  })
}

function headingHasAsteriskMarks(text: string): boolean {
  return /\*[^*]+\*/.test(text)
}

/**
 * CMS `*italic*` segments, otherwise auto-wrap word "Boutique" for accent styling.
 */
export function renderBoutiqueHeroHeading(heading: string): React.ReactNode {
  if (headingHasAsteriskMarks(heading)) {
    return parseBoutiqueHeadingEmphasis(heading)
  }

  if (/\bBoutique\b/i.test(heading)) {
    const parts: React.ReactNode[] = []
    const re = /\b(Boutique)\b/gi
    let last = 0
    let m: RegExpExecArray | null
    let key = 0
    while ((m = re.exec(heading)) !== null) {
      if (m.index > last) {
        parts.push(heading.slice(last, m.index))
      }
      parts.push(<em key={`boutique-accent-${key++}`}>{m[1]}</em>)
      last = m.index + m[0].length
    }
    if (last < heading.length) {
      parts.push(heading.slice(last))
    }
    return parts
  }

  return parseBoutiqueHeadingEmphasis(heading)
}

type BoutiqueHeroContentProps = {
  heading: string
  subheading?: string | null
  locale?: string
}

export function BoutiqueHeroContent({
  heading,
  subheading,
  locale = 'hr',
}: BoutiqueHeroContentProps) {
  const { eyebrow, body } = parseBoutiqueSubheading(subheading)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const eyebrowRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLParagraphElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { opacity: 0, y: 18 })
        tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0)
      }
      if (bodyRef.current) {
        gsap.set(bodyRef.current, { opacity: 0, y: 20 })
        tl.to(bodyRef.current, { opacity: 1, y: 0, duration: 0.85 }, 0.18)
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 16 })
        tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0.28)
      }
      if (scrollRef.current) {
        gsap.set(scrollRef.current, { opacity: 0, y: 10 })
        tl.to(scrollRef.current, { opacity: 0.75, y: 0, duration: 0.7 }, 0.55)
      }
    }, rootRef)

    return () => ctx.revert()
  }, [eyebrow, body, heading])

  return (
    <div ref={rootRef} className="boutique-hero__inner">
      <aside className="boutique-hero__meta" aria-label="Location">
        <div>{getTranslation('boutiqueHeroMeta1', locale)}</div>
        <div>{getTranslation('boutiqueHeroMeta2', locale)}</div>
        <div>{getTranslation('boutiqueHeroMeta3', locale)}</div>
      </aside>
      <div className="boutique-hero__content">
        {eyebrow ? (
          <div ref={eyebrowRef} className="boutique-hero__eyebrow">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="boutique-hero__title">{renderBoutiqueHeroHeading(heading)}</h1>
        {body ? (
          <p ref={bodyRef} className="boutique-hero__sub">
            {body}
          </p>
        ) : null}
        <div ref={ctaRef} className="boutique-hero__cta-row">
          <a href="#kontakt" className="boutique-ghost-btn">
            <span className="boutique-ghost-btn__label">
              {getTranslation('boutiqueReserve', locale)}
            </span>
            <span className="boutique-ghost-btn__arrow" aria-hidden>
              →
            </span>
          </a>
          <a href="#sobe" className="boutique-hero__link">
            {getTranslation('boutiqueDiscoverRooms', locale)}
          </a>
        </div>
      </div>
      <div ref={scrollRef} className="boutique-hero__scroll" role="presentation">
        <span>{getTranslation('scrollToExplore', locale)}</span>
        <div className="boutique-hero__scroll-line" aria-hidden />
      </div>
    </div>
  )
}
