'use client'

import React, { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { realEstateLandingSerifFont } from './landingFonts'
import './real-estate-landing.scss'

export function RealEstateLandingShell({
  children,
  footer,
}: {
  children: React.ReactNode
  /** Tamno podnožje dolazi iz layout bloka „RE Landing — Footer”. */
  footer?: React.ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]')
      if (!a || !root.contains(a)) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const id = href.slice(1)
      const el = document.getElementById(id)
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o: object) => void } }).lenis
      if (el && lenis) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -30, duration: 1.4 })
      }
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div ref={rootRef} className={`real-estate-landing ${realEstateLandingSerifFont.variable}`}>
      {children}
      {footer}
    </div>
  )
}
