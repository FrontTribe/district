'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export type RealEstateLandingMarqueeItem = { text: string; italic?: boolean }

export function RealEstateLandingMarquee({
  items,
  durationSeconds = 60,
  separator = '·',
  ariaLabel,
}: {
  items: RealEstateLandingMarqueeItem[]
  durationSeconds?: number
  separator?: string
  ariaLabel?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!gsap || !trackRef.current) return
    const track = trackRef.current
    const dur = Math.min(240, Math.max(10, durationSeconds))
    const tween = gsap.to(track, { xPercent: -50, duration: dur, ease: 'none', repeat: -1 })
    return () => {
      tween.kill()
    }
  }, [durationSeconds, items.length])

  const content = (
    <span>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i % 2 ? <em className="it">{it.text}</em> : it.text}
          <span className="marquee__sep" aria-hidden>
            {separator}
          </span>
        </React.Fragment>
      ))}
    </span>
  )

  return (
    <div className="marquee" role="region" aria-label={ariaLabel || 'Marquee'}>
      <div ref={trackRef} className="marquee__track serif">
        {content}
        {content}
      </div>
    </div>
  )
}
