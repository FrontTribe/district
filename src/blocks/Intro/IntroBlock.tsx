'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  content: string
  sectionId?: string
}

export const IntroBlock: React.FC<Props> = ({ content, sectionId }) => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)

      // Text fade-in animation
      const textTarget = q('.intro__content')
      gsap.set(textTarget, { opacity: 0, y: 30 })
      gsap.to(textTarget, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} className="intro">
      <div className="intro__container">
        <div className="intro__content">
          {content?.split('\n').map((line, i) => (
            <span key={i} className="intro__line">
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
