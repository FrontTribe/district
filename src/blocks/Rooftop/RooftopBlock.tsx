'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { getOptimizedImageUrl } from '@/utils/getOptimizedImageUrl'
import { renderBoutiqueHeroHeading } from '@/blocks/BoutiqueHeroContent'
import { BoutiqueChapterLabel } from '@/components/boutique-landing/BoutiqueChapterLabel'

type RooftopImage = { media: unknown; alt?: string; caption?: string }
type MetaRow = { text: string }
type ManifestItem = { key: string; value: string }
type StackImage = { media: unknown; alt?: string }

function mediaBg(m: unknown): string | undefined {
  const src = getOptimizedImageUrl(m as Parameters<typeof getOptimizedImageUrl>[0], { widthHint: 1400 })
  return src ? `url(${src})` : undefined
}

export const RooftopBlock: React.FC<{
  layoutVariant?: 'editorial' | 'marquee' | null
  chapterNum?: string | null
  chapterLabel?: string | null
  eyebrow?: string | null
  heading: string
  mastheadMedia?: unknown
  metaRows?: MetaRow[] | null
  manifestEyebrow?: string | null
  manifestHeading?: string | null
  manifestItems?: ManifestItem[] | null
  stackImages?: StackImage[] | null
  cta?: { label?: string; href?: string } | null
  images?: RooftopImage[]
  baseDuration?: number
  sectionId?: string
}> = ({
  layoutVariant = 'editorial',
  chapterNum,
  chapterLabel,
  heading,
  mastheadMedia,
  metaRows,
  manifestEyebrow,
  manifestHeading,
  manifestItems,
  stackImages,
  cta,
  images = [],
  baseDuration = 20,
  sectionId = 'krov',
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const marqueeTween = useRef<gsap.core.Tween | null>(null)

  const isMarquee = layoutVariant === 'marquee' || (!mastheadMedia && images.length >= 3)

  const loopImages = useMemo(() => [...images, ...images], [images])

  useEffect(() => {
    if (!isMarquee || !trackRef.current) return
    const track = trackRef.current
    const createTween = () => {
      marqueeTween.current?.kill()
      gsap.set(track, { x: 0 })
      const width = track.scrollWidth / 2
      if (!width || width < 10) return
      const xWrap = gsap.utils.wrap(-width, 0)
      marqueeTween.current = gsap.to(track, {
        x: -width,
        ease: 'none',
        duration: baseDuration,
        repeat: -1,
        modifiers: { x: gsap.utils.unitize((x) => xWrap(parseFloat(x))) },
      })
    }
    requestAnimationFrame(createTween)
    return () => {
      marqueeTween.current?.kill()
    }
  }, [isMarquee, images, baseDuration])

  if (isMarquee) {
    return (
      <section id={sectionId} className="rooftop-block rooftop-block--marquee">
        <div className="rooftop-inner">
          <h2 className="rooftop-heading">{heading}</h2>
          <div className="rooftop-marquee">
            <div className="rooftop-track" ref={trackRef}>
              {loopImages.map((item, index) => {
                const src = getOptimizedImageUrl(item.media as Parameters<typeof getOptimizedImageUrl>[0], {
                  widthHint: 560,
                  aspect: 'portrait34',
                })
                return (
                  <figure className="rooftop-card" key={index}>
                    {src && <img src={src} alt={item.alt || ''} loading="lazy" />}
                    {item.caption ? (
                      <figcaption className="rooftop-card__caption">{item.caption}</figcaption>
                    ) : null}
                  </figure>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const mastBg = mediaBg(mastheadMedia)
  const ctaHref = cta?.href || '#kontakt'
  const ctaLabel = cta?.label || 'Pošalji upit za rooftop →'

  return (
    <section id={sectionId} className="rooftop">
      <div className="rooftop-mast">
        <div
          className="rooftop-mast-image"
          data-parallax="0.3"
          style={{
            backgroundImage: mastBg
              ? `linear-gradient(180deg, rgba(26,23,20,0.35) 0%, rgba(26,23,20,0.2) 50%, rgba(26,23,20,0.7) 100%), ${mastBg}`
              : undefined,
          }}
        />
        <div className="rooftop-mast-inner">
          <BoutiqueChapterLabel chapterNum={chapterNum} chapterLabel={chapterLabel} data-reveal="fade-up" />
          <h2 className="rooftop-headline" data-reveal="lines">
            {renderBoutiqueHeroHeading(heading)}
          </h2>
          {metaRows && metaRows.length > 0 ? (
            <div className="rooftop-mast-meta">
              {metaRows.map((row, i) => (
                <span key={row.text} data-reveal="fade-up" data-delay={String(0.1 + i * 0.06)}>
                  {row.text}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rooftop-manifest-section">
        <div className="rooftop-manifest" data-reveal="fade-up">
          {manifestEyebrow ? <span className="rooftop-manifest-eyebrow">{manifestEyebrow}</span> : null}
          {manifestHeading ? (
            <h3 data-reveal="lines">{renderBoutiqueHeroHeading(manifestHeading)}</h3>
          ) : null}
          {manifestItems && manifestItems.length > 0 ? (
            <dl className="rooftop-manifest-list">
              {manifestItems.map((item) => (
                <div key={item.key} className="rooftop-manifest-row">
                  <dt>{item.key}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <a className="btn btn-light rooftop-btn" href={ctaHref}>
            <span className="btn__label">{ctaLabel.replace(/\s*→\s*$/, '')}</span>
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
        </div>

        <div className="rooftop-stack">
          {stackImages?.map((item, i) => {
            const bg = mediaBg(item.media)
            if (!bg) return null
            return (
              <div
                key={i}
                className={`curtain rooftop-stack-img rooftop-stack-${i + 1}`}
                data-reveal="curtain"
              >
                <div className="curtain-inner" style={{ backgroundImage: bg }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RooftopBlock
