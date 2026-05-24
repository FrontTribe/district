'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { animateWordsEntrance } from './shared/revealWords'

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
  const innerRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  const layoutClass = layout === 'split' ? 'hero--split' : layout === 'centered' ? 'hero--centered' : ''

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !gsap || !heroRef.current) return

    const ctx = gsap.context(() => {
      const root = heroRef.current!
      const topSpans = root.querySelectorAll('.hero__top span')
      const cap = root.querySelector('.hero__media .cap')
      const metaRowsEl = root.querySelectorAll('.hero__meta > div')
      const scrollCue = root.querySelector('.scroll-cue')
      const scrollLine = cueRef.current?.querySelector('.scroll-cue__line')
      const mediaImg = mediaRef.current?.querySelector('img')

      gsap.set(topSpans, { y: 14, opacity: 0 })
      const bottomFadeEls = [...metaRowsEl]
      if (scrollCue) bottomFadeEls.unshift(scrollCue)
      gsap.set(bottomFadeEls, { y: 18, opacity: 0 })
      if (cap) gsap.set(cap, { y: 10, opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.to(topSpans, { y: 0, opacity: 1, duration: 0.85, stagger: 0.05 }, 0.05)

      const titleWords = innerRef.current
        ? animateWordsEntrance(innerRef.current, { stagger: 0.07, duration: 1.25 })
        : null
      if (titleWords) tl.add(titleWords, 0.12)

      const leadWords = leadRef.current
        ? animateWordsEntrance(leadRef.current, { stagger: 0.035, duration: 0.95 })
        : null
      if (leadWords) tl.add(leadWords, 0.55)

      if (mediaRef.current) {
        tl.fromTo(
          mediaRef.current,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.out' },
          0.38,
        )
      }
      if (mediaImg) {
        tl.fromTo(mediaImg, { scale: 1.28 }, { scale: 1.05, duration: 2, ease: 'expo.out' }, 0.38)
      }
      if (cap) {
        tl.to(cap, { y: 0, opacity: 1, duration: 0.75 }, 0.95)
      }

      if (metaRowsEl.length) {
        tl.to(metaRowsEl, { y: 0, opacity: 1, duration: 0.85, stagger: 0.07, ease: 'power3.out' }, 0.9)
      }
      if (scrollCue && showScrollCue) {
        tl.to(scrollCue, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.96)
      }

      if (scrollLine && showScrollCue) {
        gsap.to(scrollLine, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.6,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.4,
        })
      }

      if (ScrollTrigger && mediaImg) {
        gsap.to(mediaImg, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        })
        const titleEl = root.querySelector('.hero__title')
        if (titleEl) {
          gsap.to(titleEl, {
            yPercent: -20,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      }
    }, heroRef)

    return () => ctx.revert()
  }, [layout, showScrollCue, titleLine1, titleLine2Html, eyebrow, lead, mediaCaption])

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

      <div ref={innerRef} className="hero__inner">
        <div className="hero__eyebrow">
          <SplitWords text={eyebrow} />
        </div>
        <h1 className="hero__title">
          <span className="row">
            <SplitWords text={titleLine1} />
          </span>
          {titleLine2Html.trim() ? (
            <span className="row tr">
              <SplitWords text={titleLine2Html.trim()} className="it" />
            </span>
          ) : null}
        </h1>
      </div>

      <div ref={mediaRef} className="hero__media">
        <img src={mediaUrl} alt={mediaAlt} />
        <div className="cap">{mediaCaption}</div>
      </div>

      <div className="hero__bottom">
        <p ref={leadRef} className="hero__lead">
          <SplitWords text={lead} />
        </p>
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
