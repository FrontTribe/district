'use client'

import React from 'react'
import Link from 'next/link'
import { MomentoSplit } from './shared/MomentoSplit'
import { resolveMediaUrl, splitCareerHeading } from './utils'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'

type Props = {
  title: string
  subtitle?: string | null
  description: string
  buttonText: string
  buttonUrl: string
  badgeText: string
  features?: { featureText: string }[] | null
  ctaNote: string
  backgroundImage?: unknown
  sectionId?: string
  locale?: string
}

function DotIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MomentoCareer({
  title,
  subtitle,
  description,
  buttonText,
  buttonUrl,
  badgeText,
  features,
  ctaNote,
  backgroundImage,
  sectionId = 'karijera',
  locale = 'hr',
}: Props) {
  const ui = getMomentoUiCopy(locale)
  const imageUrl = resolveMediaUrl(backgroundImage)
  const { lead, accent } = splitCareerHeading(title)

  return (
    <section className="section section--career" id={sectionId}>
      <div className="career">
        <div className="career-text">
          <div className="career-text-inner">
            <div className="num reveal">{badgeText || ui.career.sectionFallback}</div>
            <h2>
              {lead ? <MomentoSplit>{lead}</MomentoSplit> : null}
              {accent ? (
                <>
                  {lead ? ' ' : null}
                  <MomentoSplit>
                    <em>{accent}</em>
                  </MomentoSplit>
                </>
              ) : null}
              {!lead && !accent ? <MomentoSplit>{title}</MomentoSplit> : null}
              {subtitle ? (
                <>
                  <br />
                  <MomentoSplit>{subtitle}</MomentoSplit>
                </>
              ) : null}
            </h2>
            <p className="reveal" data-delay="1">
              {description}
            </p>
            <div className="perk-row reveal" data-delay="2">
              {(features ?? []).map((f) => (
                <span className="perk" key={f.featureText}>
                  <DotIcon /> {f.featureText}
                </span>
              ))}
            </div>
            <Link className="btn-dark reveal" data-delay="3" href={buttonUrl}>
              {buttonText}
              <span className="arr">↗</span>
            </Link>
            <div
              className="reveal"
              data-delay="4"
              style={{
                marginTop: 18,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
              }}
            >
              {ctaNote}
            </div>
          </div>
        </div>
        <div className="career-card reveal-clip">
          {imageUrl ? <img src={imageUrl} alt="" /> : null}
          <div className="quote">
            <em>&quot;{ui.career.quote}&quot;</em>
            <span className="who">{ui.career.quoteAuthor}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
