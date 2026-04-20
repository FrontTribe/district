'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { getTranslation } from '@/utils/translations'

type Props = {
  heading: string
  subheading?: string
  locale?: string
}

export default function HeroAnimated({ heading, subheading, locale = 'hr' }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const h = headingRef.current
    const s = subRef.current
    const sc = scrollRef.current

    // Split heading characters for a wave-in.
    // IMPORTANT: each character is wrapped in `display: inline-block` so it
    // can animate independently, but Safari will then happily break a line
    // *between any two characters* (e.g. "Momento b" / "y District"). To keep
    // words intact we wrap each word in its own inline-block with
    // `white-space: nowrap`, and only the actual spaces between words remain
    // as legitimate line-break opportunities.
    if (h) {
      if (!(h as any).dataset?.split) {
        const text = h.textContent || ''
        h.textContent = ''
        const frag = document.createDocumentFragment()
        const words = text.split(/(\s+)/) // keep whitespace tokens

        for (const token of words) {
          if (token.length === 0) continue

          if (/^\s+$/.test(token)) {
            // Real whitespace = breakable opportunity between words.
            frag.appendChild(document.createTextNode(' '))
            continue
          }

          const wordSpan = document.createElement('span')
          wordSpan.setAttribute('data-word', '1')
          wordSpan.style.display = 'inline-block'
          wordSpan.style.whiteSpace = 'nowrap'

          for (const ch of token) {
            const charSpan = document.createElement('span')
            charSpan.textContent = ch
            charSpan.setAttribute('data-char', '1')
            charSpan.style.display = 'inline-block'
            charSpan.style.willChange = 'transform, filter, opacity'
            wordSpan.appendChild(charSpan)
          }

          frag.appendChild(wordSpan)
        }

        h.appendChild(frag)
        ;(h as any).dataset.split = '1'
      }

      const chars = Array.from(h.querySelectorAll('span[data-char]'))
      // Set initial hidden state for heading and characters
      gsap.set(h, { opacity: 0 })
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: 15, filter: 'blur(8px)' })
      // Animate heading container first
      tl.to(h, { opacity: 1, duration: 0.1 }, 0)
      tl.to(
        chars,
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.02,
        },
        0.05,
      )
    }
    if (s) {
      gsap.set(s, { opacity: 0, y: 16 })
      tl.to(s, { opacity: 1, y: 0, duration: 0.9 }, 0.25)
    }
    if (sc) {
      gsap.set(sc, { opacity: 0, y: 10 })
      tl.to(sc, { opacity: 1, y: 0, duration: 0.8 }, 0.9)
    }

    // Subtle parallax as you scroll down the hero
    if (wrapRef.current && h && s) {
      try {
        const parTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top',
            end: '+=60%',
            scrub: true,
          },
        })
        parTl.to(h, { yPercent: -8, scale: 0.985, ease: 'none' }, 0)
        parTl.to(s, { yPercent: -6, ease: 'none' }, 0)
      } catch (error) {}
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === wrapRef.current) st.kill()
      })
    }
  }, [])

  return (
    <>
      <div className="hero-content" style={{ position: 'relative', zIndex: 10 }} ref={wrapRef}>
        <h1 ref={headingRef} className="hero-heading" style={{ opacity: 0 }}>
          {heading}
        </h1>
        {subheading && (
          <p
            ref={subRef}
            className="hero-subheading"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            {subheading}
          </p>
        )}
      </div>
      <div
        className="hero-scroll-indicator"
        role="presentation"
        ref={scrollRef}
        style={{ opacity: 0 }}
      >
        <span className="scroll-text">{getTranslation('scrollToExplore', locale)}</span>
        <span className="scroll-dot" />
      </div>
    </>
  )
}
