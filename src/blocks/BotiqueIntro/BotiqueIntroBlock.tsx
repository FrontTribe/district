'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Media } from '@/payload-types'

type Props = {
  eyebrow?: string
  heading: string
  body?: string
  cta?: { label?: string; href?: string }
  mediaTopRight?: Media | string | null
  mediaBottomLeft?: Media | string | null
  mediaBottomRight?: Media | string | null
  sectionId?: string
  parallax?: {
    topRight?: number
    bottomLeft?: number
    bottomRight?: number
  }
}

export const BotiqueIntroBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  body,
  cta,
  mediaTopRight,
  mediaBottomLeft,
  mediaBottomRight,
  sectionId,
  parallax,
}) => {
  const img = (m: Media | string | null | undefined) => {
    if (!m) return undefined
    if (typeof m === 'string') return m
    return m.url
  }

  const sectionRef = useRef<HTMLElement | null>(null)
  const topRightRef = useRef<HTMLDivElement | null>(null)
  const bottomLeftRef = useRef<HTMLDivElement | null>(null)
  const bottomRightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)

      // Text fade-in
      const textTargets = q(
        '.botique-intro__eyebrow, .botique-intro__heading-line, .botique-intro__body, .botique-intro__cta',
      )
      gsap.set(textTargets, { opacity: 0, y: 20 })
      gsap.to(textTargets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Image reveal helpers
      const reveal = (wrap: HTMLDivElement | null) => {
        if (!wrap) return
        const imgEl = wrap.querySelector('img')
        if (!imgEl) return
        gsap.set(imgEl, { clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' })
        gsap.to(imgEl, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 85%',
            once: true,
          },
        })
      }

      // Parallax + reveal for each image
      if (topRightRef.current) {
        gsap.to(topRightRef.current, {
          yPercent: typeof parallax?.topRight === 'number' ? parallax.topRight : -15,
          ease: 'none',
          scrollTrigger: {
            trigger: topRightRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
        reveal(topRightRef.current)
      }

      if (bottomLeftRef.current) {
        gsap.to(bottomLeftRef.current, {
          yPercent: typeof parallax?.bottomLeft === 'number' ? parallax.bottomLeft : 10,
          ease: 'none',
          scrollTrigger: {
            trigger: bottomLeftRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
        reveal(bottomLeftRef.current)
      }

      if (bottomRightRef.current) {
        gsap.to(bottomRightRef.current, {
          yPercent: typeof parallax?.bottomRight === 'number' ? parallax.bottomRight : -8,
          ease: 'none',
          scrollTrigger: {
            trigger: bottomRightRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
        reveal(bottomRightRef.current)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} className="botique-intro">
      <div className="botique-intro__grid">
        <div className="botique-intro__text">
          {eyebrow && <span className="botique-intro__eyebrow">{eyebrow}</span>}
          <h2 className="botique-intro__heading">
            {heading?.split('\n').map((line, i) => (
              <span key={i} className="botique-intro__heading-line">
                {line}
              </span>
            ))}
          </h2>
          {body && <p className="botique-intro__body">{body}</p>}
          {cta?.label && cta?.href && (
            <a className="botique-intro__cta" href={cta.href}>
              {cta.label}
            </a>
          )}
        </div>

        {img(mediaTopRight) && (
          <div ref={topRightRef} className="botique-intro__media botique-intro__media--top-right">
            <img src={img(mediaTopRight) || ''} alt="" />
          </div>
        )}

        {img(mediaBottomLeft) && (
          <div
            ref={bottomLeftRef}
            className="botique-intro__media botique-intro__media--bottom-left"
          >
            <img src={img(mediaBottomLeft) || ''} alt="" />
          </div>
        )}

        {img(mediaBottomRight) && (
          <div
            ref={bottomRightRef}
            className="botique-intro__media botique-intro__media--bottom-right"
          >
            <img src={img(mediaBottomRight) || ''} alt="" />
          </div>
        )}
      </div>
    </section>
  )
}
