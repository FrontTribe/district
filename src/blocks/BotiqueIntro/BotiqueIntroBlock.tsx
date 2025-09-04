'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  eyebrow?: string
  heading: string
  body?: string
  cta?: { label?: string; href?: string }
  mediaTopRight?: any
  mediaBottomLeft?: any
  mediaBottomRight?: any
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
  const img = (m: any) => {
    if (!m) return undefined
    if (typeof m === 'string') return m
    return m.url
  }

  const topRightRef = useRef<HTMLDivElement | null>(null)
  const bottomLeftRef = useRef<HTMLDivElement | null>(null)
  const bottomRightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const animations: gsap.core.Tween[] = []

    if (topRightRef.current) {
      animations.push(
        gsap.to(topRightRef.current, {
          yPercent: typeof parallax?.topRight === 'number' ? parallax.topRight : -15,
          ease: 'none',
          scrollTrigger: {
            trigger: topRightRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }) as any,
      )
    }

    if (bottomLeftRef.current) {
      animations.push(
        gsap.to(bottomLeftRef.current, {
          yPercent: typeof parallax?.bottomLeft === 'number' ? parallax.bottomLeft : 10,
          ease: 'none',
          scrollTrigger: {
            trigger: bottomLeftRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }) as any,
      )
    }

    if (bottomRightRef.current) {
      animations.push(
        gsap.to(bottomRightRef.current, {
          yPercent: typeof parallax?.bottomRight === 'number' ? parallax.bottomRight : -8,
          ease: 'none',
          scrollTrigger: {
            trigger: bottomRightRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }) as any,
      )
    }

    return () => {
      animations.forEach((a) => a.kill())
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section id={sectionId} className="botique-intro">
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
            <img src={img(mediaTopRight)} alt="" />
          </div>
        )}

        {img(mediaBottomLeft) && (
          <div
            ref={bottomLeftRef}
            className="botique-intro__media botique-intro__media--bottom-left"
          >
            <img src={img(mediaBottomLeft)} alt="" />
          </div>
        )}

        {img(mediaBottomRight) && (
          <div
            ref={bottomRightRef}
            className="botique-intro__media botique-intro__media--bottom-right"
          >
            <img src={img(mediaBottomRight)} alt="" />
          </div>
        )}
      </div>
    </section>
  )
}
