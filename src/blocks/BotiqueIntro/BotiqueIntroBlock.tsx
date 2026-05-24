'use client'

import React from 'react'
import { Media } from '@/payload-types'
import { renderBoutiqueHeroHeading } from '@/blocks/BoutiqueHeroContent'
import { BoutiqueChapterLabel } from '@/components/boutique-landing/BoutiqueChapterLabel'

type Stat = { value: number; suffix?: string | null; label: string }
type CollageTag = { tag: string }

type Props = {
  chapterNum?: string | null
  chapterLabel?: string | null
  eyebrow?: string
  heading: string
  body?: string
  pullQuote?: string | null
  pullQuoteCite?: string | null
  stats?: Stat[] | null
  collageTags?: CollageTag[] | null
  cta?: { label?: string; href?: string }
  mediaTopRight?: Media | string | null
  mediaBottomLeft?: Media | string | null
  mediaBottomRight?: Media | string | null
  sectionId?: string
  parallax?: { topRight?: number; bottomLeft?: number; bottomRight?: number }
}

function mediaUrl(m: Media | string | null | undefined): string | undefined {
  if (!m) return undefined
  if (typeof m === 'string') return m
  return m.url ?? undefined
}

export const BotiqueIntroBlock: React.FC<Props> = ({
  chapterNum,
  chapterLabel,
  heading,
  body,
  pullQuote,
  pullQuoteCite,
  stats,
  collageTags,
  mediaTopRight,
  mediaBottomLeft,
  mediaBottomRight,
  sectionId = 'o-nama',
}) => {
  const media = [mediaTopRight, mediaBottomLeft, mediaBottomRight]
  const collageClasses = ['collage-1', 'collage-2', 'collage-3']

  return (
    <section id={sectionId} className="section about-section">
      <div className="about-head">
        <BoutiqueChapterLabel chapterNum={chapterNum} chapterLabel={chapterLabel} data-reveal="fade-up" />
        <h2 className="about-title" data-reveal="lines">
          {renderBoutiqueHeroHeading(heading)}
        </h2>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          {body
            ?.split(/\n\n+/)
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} data-reveal="fade-up" data-delay={String(0.05 + i * 0.05)}>
                {para}
              </p>
            ))}
          {pullQuote ? (
            <div className="about-pull" data-reveal="fade-up" data-delay="0.15">
              <span className="pull-mark">“</span>
              <p>{pullQuote}</p>
              {pullQuoteCite ? <cite>{pullQuoteCite}</cite> : null}
            </div>
          ) : null}
        </div>

        <div className="about-collage" data-reveal="stagger">
          {media.map((m, i) => {
            const url = mediaUrl(m)
            if (!url) return null
            return (
              <div key={i} className={`collage-frame ${collageClasses[i]}`}>
                <div className="curtain" data-reveal="curtain">
                  <div className="curtain-inner" style={{ backgroundImage: `url(${url})` }} />
                </div>
                {collageTags?.[i]?.tag ? <span className="collage-tag">{collageTags[i].tag}</span> : null}
              </div>
            )
          })}
        </div>
      </div>

      {stats && stats.length > 0 ? (
        <div className="about-stats" data-reveal="stagger">
          {stats.map((stat) => (
            <div key={stat.label} className="stat">
              <span className="stat-num">
                <span data-count={stat.value} data-suffix={stat.suffix ?? ''}>
                  0
                </span>
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
