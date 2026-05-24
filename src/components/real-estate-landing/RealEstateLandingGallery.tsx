'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'

export type GalSlide = {
  imageUrl: string
  name: string
  location: string
  imageAlt?: string
  credit?: string
  linkUrl?: string
  linkOpenInNewTab?: boolean
}

export function RealEstateLandingGallery({
  sectionId = 'galerija',
  eyebrow,
  headingParts,
  intro,
  introHtml,
  slides,
}: {
  sectionId?: string
  eyebrow: string
  headingParts: { text: string; italic?: boolean }[]
  intro: string
  introHtml?: string | null
  slides: GalSlide[]
}) {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progRef = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger || !pinRef.current || !trackRef.current) return
    const ctx = gsap.context(() => {
      const distance = () => (trackRef.current ? trackRef.current.scrollWidth - window.innerWidth + 72 : 0)
      gsap.to(trackRef.current!, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progRef.current) progRef.current.style.transform = `scaleX(${self.progress})`
            if (counterRef.current) {
              const total = slides.length
              const idx = Math.min(total, Math.floor(self.progress * total) + 1)
              counterRef.current.textContent = `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
            }
          },
        },
      })
      if (introRef.current) revealWordsIn(introRef.current, { trigger: introRef.current, start: 'top 75%' })
    })
    return () => ctx.revert()
  }, [slides.length])

  const introBlock =
    introHtml?.trim() ? (
      <div className="galerija__intro-html" dangerouslySetInnerHTML={{ __html: introHtml }} />
    ) : (
      <p>{intro}</p>
    )

  const renderSlide = (g: GalSlide, i: number) => {
    const alt = g.imageAlt?.trim() || g.name
    const inner = (
      <>
        <div className="gphoto__img">
          <img src={g.imageUrl} alt={alt} />
          <div className="gphoto__index">
            — {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>
        </div>
        <div className="gphoto__caption">
          <div className="gphoto__name serif">{i % 2 ? <span className="it">{g.name}</span> : g.name}</div>
          <div className="gphoto__loc">{g.location}</div>
          {g.credit?.trim() ? <div className="gphoto__credit mono">{g.credit}</div> : null}
        </div>
      </>
    )

    if (g.linkUrl?.trim()) {
      return (
        <article key={i} className="gphoto gphoto--linked">
          <a
            href={g.linkUrl}
            className="gphoto__link"
            {...(g.linkOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {inner}
          </a>
        </article>
      )
    }

    return (
      <article key={i} className="gphoto">
        {inner}
      </article>
    )
  }

  return (
    <section id={sectionId} className="galerija">
      <div ref={introRef} className="galerija__intro">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="serif">
          {headingParts.map((p, i) =>
            p.italic ? (
              <span key={i} className="it">
                <SplitWords text={p.text} />
                <br />
              </span>
            ) : (
              <span key={i}>
                <SplitWords text={p.text} />{' '}
              </span>
            ),
          )}
        </h2>
        {introBlock}
      </div>
      <div ref={pinRef} className="galerija__pin">
        <div ref={trackRef} className="galerija__track">
          {slides.map((g, i) => renderSlide(g, i))}
          <div style={{ flex: '0 0 auto', width: 80 }} />
        </div>
        <div className="galerija__progress">
          <i ref={progRef} />
        </div>
        <div ref={counterRef} className="galerija__counter">
          01 / {String(slides.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  )
}
