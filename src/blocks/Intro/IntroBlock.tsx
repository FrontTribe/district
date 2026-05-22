'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'
import { MomentoIntro } from '@/components/momento-landing'

type Props = {
  content: string
  sectionId?: string
  tenantVisualTheme?: TenantVisualTheme
}

export const IntroBlock: React.FC<Props> = ({ content, sectionId, tenantVisualTheme = 'default' }) => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (tenantVisualTheme === 'momento' || typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
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
  }, [tenantVisualTheme])

  if (tenantVisualTheme === 'momento') {
    return <MomentoIntro content={content} sectionId={sectionId} />
  }

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

