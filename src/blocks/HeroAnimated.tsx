'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  heading: string
  subheading?: string
}

export default function HeroAnimated({ heading, subheading }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if ((gsap as any).registeredScrollTrigger !== true) {
      gsap.registerPlugin(ScrollTrigger)
      ;(gsap as any).registeredScrollTrigger = true
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const h = headingRef.current
    const s = subRef.current
    const sc = scrollRef.current

    // Split heading characters for a wave-in
    if (h) {
      if (!(h as any).dataset?.split) {
        const text = h.textContent || ''
        h.textContent = ''
        const frag = document.createDocumentFragment()
        for (const ch of text) {
          const span = document.createElement('span')
          span.textContent = ch === ' ' ? '\u00A0' : ch
          span.setAttribute('data-char', '1')
          span.style.display = 'inline-block'
          span.style.willChange = 'transform, filter, opacity'
          frag.appendChild(span)
        }
        h.appendChild(frag)
        ;(h as any).dataset.split = '1'
      }

      const chars = Array.from(h.querySelectorAll('span[data-char]'))
      // Fallback: avoid clip-path conflicts by revealing purely via characters
      gsap.set(h, { opacity: 1 })
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: 15, filter: 'blur(8px)' })
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
        <h1 ref={headingRef} className="hero-heading">
          {heading}
        </h1>
        {subheading && (
          <p ref={subRef} className="hero-subheading">
            {subheading}
          </p>
        )}
      </div>
      <div className="hero-scroll-indicator" role="presentation" ref={scrollRef}>
        <span className="scroll-text">Scroll to explore</span>
        <span className="scroll-dot" />
      </div>
    </>
  )
}
