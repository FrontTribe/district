'use client'

import React from 'react'
import { getTranslation } from '@/utils/translations'

function parseBoutiqueSubheading(raw?: string | null): {
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
function parseBoutiqueHeadingEmphasis(text: string): React.ReactNode[] {
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
/** Multi-line headings (e.g. rooms) — preserves line breaks like the redesign prototype. */
export function renderBoutiqueHeadingWithBreaks(heading: string): React.ReactNode {
  if (!heading.includes('\n')) return renderBoutiqueHeroHeading(heading)

  return heading.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line.trim() ? renderBoutiqueHeroHeading(line.trim()) : null}
    </React.Fragment>
  ))
}

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

  return (
    <div className="boutique-hero__inner">
      <aside className="boutique-hero__meta" aria-label="Location">
        <div>{getTranslation('boutiqueHeroMeta1', locale)}</div>
        <div>{getTranslation('boutiqueHeroMeta2', locale)}</div>
        <div>{getTranslation('boutiqueHeroMeta3', locale)}</div>
      </aside>
      <div className="boutique-hero__content">
        {eyebrow ? (
          <div className="boutique-hero__eyebrow" data-reveal="fade-up">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="boutique-hero__title" data-reveal="lines">
          {renderBoutiqueHeroHeading(heading)}
        </h1>
        {body ? (
          <p className="boutique-hero__sub" data-reveal="fade-up" data-delay="0.15">
            {body}
          </p>
        ) : null}
        <div className="boutique-hero__cta-row" data-reveal="fade-up" data-delay="0.25">
          <a href="#sobe" className="boutique-ghost-btn">
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
      <div className="boutique-hero__scroll" role="presentation" data-reveal="fade-up" data-delay="0.35">
        <span>{getTranslation('scrollToExplore', locale)}</span>
        <div className="boutique-hero__scroll-line" aria-hidden />
      </div>
    </div>
  )
}
