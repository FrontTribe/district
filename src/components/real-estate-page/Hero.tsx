'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export type RealEstateHeroProps = {
  heading: string
  subheading?: string
  backgroundImageUrl?: string
  sectionId?: string
}

export function RealEstateHero({
  heading,
  subheading,
  backgroundImageUrl,
  sectionId = 'hero',
}: RealEstateHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const h = headingRef.current
    const s = subRef.current
    const sc = scrollRef.current

    if (h) {
      gsap.set(h, { opacity: 0, y: 40 })
      tl.to(h, { opacity: 1, y: 0, duration: 0.9 }, 0)
    }
    if (s) {
      gsap.set(s, { opacity: 0, y: 24 })
      tl.to(s, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
    }
    if (sc) {
      gsap.set(sc, { opacity: 0 })
      tl.to(sc, { opacity: 1, duration: 0.6 }, 0.5)
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (wrapRef.current && st.trigger === wrapRef.current) st.kill()
      })
    }
  }, [])

  return (
    <section id={sectionId} className="re-hero">
      {backgroundImageUrl && (
        <div className="re-hero__bg" aria-hidden>
          <img src={backgroundImageUrl} alt="" />
        </div>
      )}
      <div className="re-hero__gradient" aria-hidden />
      <div className="re-hero__content" ref={wrapRef}>
        <h1 ref={headingRef} className="re-hero__heading">
          {heading}
        </h1>
        {subheading && (
          <p ref={subRef} className="re-hero__subheading">
            {subheading}
          </p>
        )}
      </div>
      <div className="re-hero__scroll" ref={scrollRef} role="presentation">
        <span className="re-hero__scroll-text">Scroll to explore</span>
        <span className="re-hero__scroll-dot" />
      </div>
    </section>
  )
}
