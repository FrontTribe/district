'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type RealEstateAboutUsProps = {
  eyebrow?: string
  heading: string
  body: string
  sectionId?: string
}

export function RealEstateAboutUs({
  eyebrow,
  heading,
  body,
  sectionId = 'about-us',
}: RealEstateAboutUsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(q('.re-about__eyebrow, .re-about__heading, .re-about__body'), {
        opacity: 0,
        y: 28,
      })
      gsap.to(q('.re-about__eyebrow, .re-about__heading, .re-about__body'), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 82%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} className="re-about">
      <div className="re-about__container">
        {eyebrow && <p className="re-about__eyebrow">{eyebrow}</p>}
        <h2 className="re-about__heading">{heading}</h2>
        <div
          className="re-about__body"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </section>
  )
}
