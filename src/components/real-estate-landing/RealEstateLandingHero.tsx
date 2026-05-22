'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'

export type RealEstateLandingHeroProps = {
  layout?: 'default' | 'split' | 'centered'
  heroSectionId?: string
  topLeftLines: string[]
  topRightLines: string[]
  eyebrow: string
  titleLine1: string
  titleLine2Html?: string
  mediaUrl: string
  mediaAlt?: string
  mediaCaption: string
  lead: string
  metaRows: { label: string; value: string }[]
  showScrollCue?: boolean
  scrollCueLabel?: string
}

export function RealEstateLandingHero({
  layout = 'default',
  heroSectionId = 'top',
  topLeftLines,
  topRightLines,
  eyebrow,
  titleLine1,
  titleLine2Html = '',
  mediaUrl,
  mediaAlt = '',
  mediaCaption,
  lead,
  metaRows,
  showScrollCue = true,
  scrollCueLabel = 'Scroll to explore',
}: RealEstateLandingHeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  const layoutClass = layout === 'split' ? 'hero--split' : layout === 'centered' ? 'hero--centered' : ''

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !gsap) return
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll('.word > i')
      if (words?.length) {
        gsap.fromTo(words, { yPercent: 102 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, delay: 0.2 })
      }
      if (mediaRef.current) {
        gsap.fromTo(mediaRef.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.out', delay: 0.4 })
        const img = mediaRef.current.querySelector('img')
        if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1.05, duration: 2.2, ease: 'expo.out', delay: 0.4 })
      }
      gsap.from('.hero__top > *, .hero__bottom > *', { y: 16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 1 })
      const line = cueRef.current?.querySelector('.scroll-cue__line')
      if (line && showScrollCue) {
        gsap.to(line, { scaleY: 0, transformOrigin: 'top', duration: 1.6, ease: 'power2.inOut', yoyo: true, repeat: -1 })
      }
      if (ScrollTrigger && mediaRef.current?.querySelector('img')) {
        gsap.to(mediaRef.current.querySelector('img'), {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            yPercent: -20,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      }
    }, heroRef)
    return () => ctx.revert()
  }, [layout, showScrollCue])

  return (
    <section ref={heroRef} id={heroSectionId} className={`hero ${layoutClass}`.trim()}>
      <div className="hero__top">
        <div className="l">
          {topLeftLines.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
        <div className="r">
          {topRightLines.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="hero__inner">
        <div className="hero__eyebrow">
          <SplitWords text={eyebrow} />
        </div>
        <h1 ref={titleRef} className="hero__title">
          <span className="row">
            <SplitWords text={titleLine1} />
          </span>
          {titleLine2Html.trim() ? (
            <span className="row tr">
              <span className="it" dangerouslySetInnerHTML={{ __html: titleLine2Html }} />
            </span>
          ) : null}
        </h1>
      </div>

      <div ref={mediaRef} className="hero__media">
        <img src={mediaUrl} alt={mediaAlt} />
        <div className="cap">{mediaCaption}</div>
      </div>

      <div className="hero__bottom">
        <p className="hero__lead">{lead}</p>
        {showScrollCue ? (
          <div ref={cueRef} className="scroll-cue" role="presentation">
            <span>{scrollCueLabel}</span>
            <span className="scroll-cue__line" />
          </div>
        ) : null}
        <div className="hero__meta">
          {metaRows.map((row) => (
            <div key={row.label}>
              <span className="lbl">{row.label}</span>
              <span className="v">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
