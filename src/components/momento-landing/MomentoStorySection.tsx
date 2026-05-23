'use client'

import React from 'react'
import { MomentoSplit } from './shared/MomentoSplit'
import { resolveMediaUrl } from './utils'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'

/** Redoslijed i naslovi kao u `Momento by District.html` (6 pločica). */
const GALLERY_TILE_SPECS = [
  { cls: 't1', imageIndex: 0 },
  { cls: 't2', imageIndex: 1 },
  { cls: 't3', imageIndex: 5 },
  { cls: 't4', imageIndex: 2 },
  { cls: 't5', imageIndex: 4 },
  { cls: 't6', imageIndex: 3 },
] as const

const GALLERY_FALLBACK_URLS = [
  '/momento-landing/interior-1.jpg',
  '/momento-landing/interior-2.jpg',
  '/momento-landing/interior-3.jpg',
  '/momento-landing/terrace.jpg',
  '/momento-landing/hero.jpg',
  '/momento-landing/career.jpg',
] as const

type ImageItem = {
  image?: unknown
  position?: string
}

type Props = {
  title: string
  subtitle: string
  images?: ImageItem[] | null
  sectionId?: string
  locale?: string
}

function gallerySrc(images: ImageItem[] | null | undefined, imageIndex: number): string {
  const fromCms = resolveMediaUrl(images?.[imageIndex]?.image)
  if (fromCms) return fromCms
  return GALLERY_FALLBACK_URLS[imageIndex] ?? ''
}

function buildGalleryTiles(images: ImageItem[] | null | undefined, captions: string[]) {
  return GALLERY_TILE_SPECS.map((spec, i) => ({
    cls: spec.cls,
    cap: captions[i] ?? '',
    src: gallerySrc(images, spec.imageIndex),
  })).filter((tile) => tile.src)
}

function splitStoryTitle(title: string): { line1: string; line2: string } {
  const dash = title.indexOf(' — ')
  if (dash > 0) {
    const after = title.slice(dash + 3).trim()
    const words = after.split(/\s+/)
    if (words.length > 4) {
      const mid = Math.ceil(words.length / 2)
      return {
        line1: words.slice(0, mid).join(' '),
        line2: words.slice(mid).join(' '),
      }
    }
    return { line1: after, line2: '' }
  }
  return { line1: title, line2: '' }
}

export function MomentoStorySection({
  title,
  subtitle,
  images,
  sectionId = 'o-nama',
  locale = 'hr',
}: Props) {
  const ui = getMomentoUiCopy(locale)
  const storySrc = gallerySrc(images, 0)
  const galleryTiles = buildGalleryTiles(images, ui.story.galleryCaptions)
  const { line1, line2 } = splitStoryTitle(title)

  return (
    <div className="momento-story-flow">
      <section className="section section--o-nama" id={sectionId}>
        <div className="shell">
          <div className="section-head">
            <div className="num reveal">{ui.story.sectionAbout}</div>
            <h2>
              {line1 ? <MomentoSplit>{line1}</MomentoSplit> : null}
              {line2 ? (
                <>
                  <br />
                  <MomentoSplit>
                    <em>{line2}</em>
                  </MomentoSplit>
                </>
              ) : null}
            </h2>
          </div>

          <div className="story-grid">
            {storySrc ? (
              <div className="story-img reveal-clip">
                <img src={storySrc} alt={ui.story.interiorAlt} />
                <div className="badge-open">
                  <span className="pulse" />
                  <span>{ui.story.openNow}</span>
                </div>
              </div>
            ) : null}

            <div className="story-text">
              <p className="reveal" data-delay="1">
                {subtitle}
              </p>
              <div className="tag-row reveal" data-delay="3">
                {ui.story.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MomentoMarquee locale={locale} />

      {galleryTiles.length > 0 ? (
        <section className="section section--prostor" id="prostor">
          <div className="shell">
            <div className="section-head section-head--prostor">
              <div className="num">{ui.story.sectionSpace}</div>
              <h2>
                <MomentoSplit>{ui.story.spaceHeadingLine1}</MomentoSplit>
                <br />
                <MomentoSplit>
                  <em>{ui.story.spaceHeadingLine2}</em>
                </MomentoSplit>
              </h2>
            </div>
            <div className="gallery">
              {galleryTiles.map((t, i) => (
                <div key={`${t.cls}-${i}`} className={`g-tile ${t.cls}`} data-delay={(i % 6) + 1}>
                  <img src={t.src} alt={t.cap} loading="lazy" />
                  {t.cap ? <span className="cap">{t.cap}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function MomentoMarquee({ locale }: { locale: string }) {
  const ui = getMomentoUiCopy(locale)
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1, 2].map((k) => (
          <span key={k}>
            {ui.story.marquee.map((w, i) => (
              <React.Fragment key={`${k}-${i}`}>
                {w.em ? <em>{w.t}</em> : <span>{w.t}</span>}
                <span className="star">✦</span>
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
