'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export type RealEstateLookingForJobProps = {
  badge?: string
  heading: string
  subtitle?: string
  description: string
  features?: string[]
  buttonText: string
  buttonUrl: string
  ctaNote?: string
  sectionId?: string
}

export function RealEstateLookingForJob({
  badge,
  heading,
  subtitle,
  description,
  features = [],
  buttonText,
  buttonUrl,
  ctaNote,
  sectionId = 'careers',
}: RealEstateLookingForJobProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(
        q(
          '.re-jobs__badge, .re-jobs__heading, .re-jobs__subtitle, .re-jobs__description, .re-jobs__features, .re-jobs__cta',
        ),
        { opacity: 0, y: 24 },
      )
      gsap.to(
        q(
          '.re-jobs__badge, .re-jobs__heading, .re-jobs__subtitle, .re-jobs__description, .re-jobs__features, .re-jobs__cta',
        ),
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current!, start: 'top 80%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} className="re-jobs">
      <div className="re-jobs__container">
        <div className="re-jobs__content">
          {badge && (
            <div className="re-jobs__badge">
              <span className="re-jobs__badge-dot" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="re-jobs__heading">{heading}</h2>
          {subtitle && <p className="re-jobs__subtitle">{subtitle}</p>}
          <p className="re-jobs__description">{description}</p>
          {features.length > 0 && (
            <ul className="re-jobs__features">
              {features.map((text, i) => (
                <li key={i} className="re-jobs__feature">
                  <span className="re-jobs__feature-icon" />
                  {text}
                </li>
              ))}
            </ul>
          )}
          <div className="re-jobs__cta">
            <a
              href={buttonUrl}
              className="re-jobs__button"
              target={buttonUrl.startsWith('mailto:') ? undefined : '_blank'}
              rel={buttonUrl.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            >
              <span>{buttonText}</span>
              <span className="re-jobs__button-arrow">→</span>
            </a>
            {ctaNote && <p className="re-jobs__cta-note">{ctaNote}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
