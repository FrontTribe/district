'use client'

import React from 'react'
import { MomentoSplit } from './shared/MomentoSplit'
import { resolveMediaUrl } from './utils'

const MARQUEE_WORDS = [
  { t: 'Espresso' },
  { t: 'Matcha latte', em: true },
  { t: 'Fresh sokovi' },
  { t: 'Slastice', em: true },
  { t: 'Craft pivo' },
  { t: 'Vina', em: true },
  { t: 'Kroasani' },
  { t: 'Aperitiv', em: true },
]

/** Redoslijed i naslovi kao u `Momento by District.html` (6 pločica). */
const GALLERY_TILE_SPECS = [
  { cls: 't1', cap: 'Lounge', imageIndex: 0 },
  { cls: 't2', cap: 'Bar', imageIndex: 1 },
  { cls: 't3', cap: 'Terasa', imageIndex: 3 },
  { cls: 't4', cap: 'Detalji', imageIndex: 2 },
  { cls: 't5', cap: 'Atmosfera', imageIndex: 4 },
  { cls: 't6', cap: 'Enterijer', imageIndex: 5 },
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
  introLine?: string
}

function gallerySrc(images: ImageItem[] | null | undefined, imageIndex: number): string {
  const fromCms = resolveMediaUrl(images?.[imageIndex]?.image)
  if (fromCms) return fromCms
  return GALLERY_FALLBACK_URLS[imageIndex] ?? ''
}

function buildGalleryTiles(images?: ImageItem[] | null) {
  return GALLERY_TILE_SPECS.map((spec) => ({
    cls: spec.cls,
    cap: spec.cap,
    src: gallerySrc(images, spec.imageIndex),
  })).filter((tile) => tile.src)
}

export function MomentoStorySection({ title, subtitle, images, sectionId = 'o-nama', introLine }: Props) {
  const storySrc = gallerySrc(images, 0)
  const galleryTiles = buildGalleryTiles(images)

  return (
    <div className="momento-story-flow">
      <section className="section section--o-nama" id={sectionId}>
        <div className="shell">
          <div className="section-head">
            <div className="num reveal">01 / O nama</div>
            <h2>
              <MomentoSplit>Vaš dnevni ritam</MomentoSplit>
              <br />
              <MomentoSplit>
                <em>u srcu Retfale.</em>
              </MomentoSplit>
            </h2>
          </div>

          <div className="story-grid">
            {storySrc ? (
              <div className="story-img reveal-clip">
                <img src={storySrc} alt="Momento interijer" />
                <div className="badge-open">
                  <span className="pulse" />
                  <span>Otvoreno sada</span>
                </div>
              </div>
            ) : null}

            <div className="story-text">
              <h3 className="reveal">
                {introLine ?? (
                  <>
                    U prizemlju zgrade
                    <br />
                    <em>District Boutique</em>-a.
                  </>
                )}
              </h3>
              <p className="reveal" data-delay="1">
                {subtitle || title}
              </p>
              <div className="tag-row reveal" data-delay="3">
                {['Kava', 'Matcha', 'Fresh sokovi', 'Craft pivo', 'Vina', 'Kroasani', 'Slastice', 'Aperitiv'].map(
                  (tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MomentoMarquee />

      {galleryTiles.length > 0 ? (
        <section className="section section--prostor" id="prostor">
          <div className="shell">
            <div className="section-head section-head--prostor">
              <div className="num">02 / Prostor</div>
              <h2>
                <MomentoSplit>Svjetlo, zelenilo,</MomentoSplit>
                <br />
                <MomentoSplit>
                  <em>i miris kave.</em>
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

function MomentoMarquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1, 2].map((k) => (
          <span key={k}>
            {MARQUEE_WORDS.map((w, i) => (
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
