'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Feature = {
  icon?: string
  title: string
  description?: string
}

export const RooftopFeaturesBlock: React.FC<{
  heading: string
  features: Feature[]
  sectionId?: string
}> = ({ heading, features = [], sectionId }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if ((gsap as any).registeredScrollTrigger !== true) {
      gsap.registerPlugin(ScrollTrigger)
      ;(gsap as any).registeredScrollTrigger = true
    }

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        })
      }

      if (wrapRef.current) {
        const items = wrapRef.current.querySelectorAll('.rf-item')
        gsap.set(items, { opacity: 0, y: 12 })
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 90%', once: true },
        })
        requestAnimationFrame(() => ScrollTrigger.refresh())
      }
    }, wrapRef.current || undefined)

    return () => ctx.revert()
  }, [])
  return (
    <section id={sectionId} className="rooftop-features-block">
      <div className="rooftop-features__inner" ref={wrapRef}>
        <h3 className="rooftop-features__heading" ref={headingRef}>
          {heading}
        </h3>

        <div className="rooftop-features__grid">
          {features.map((f, i) => (
            <div className="rf-item" key={i}>
              {f.icon && (
                <div className="rf-icon" aria-hidden>
                  {f.icon}
                </div>
              )}
              <h4 className="rf-title">{f.title}</h4>
              {f.description && <p className="rf-desc">{f.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RooftopFeaturesBlock
