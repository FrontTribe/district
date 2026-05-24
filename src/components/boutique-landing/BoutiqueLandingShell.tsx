'use client'

import React, { useEffect, useRef } from 'react'
import { ScrollTrigger, LENIS_READY_EVENT } from '@/lib/gsap'
import { initBoutiqueAnimations, killBoutiqueAnimations } from './boutiqueAnimations'
import { BoutiqueBookingProvider } from './BoutiqueBookingContext'
import { realEstateLandingSerifFont } from '@/components/real-estate-landing/landingFonts'

type Props = {
  children: React.ReactNode
  locale?: string
}

export function BoutiqueLandingShell({ children, locale = 'hr' }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const run = () => initBoutiqueAnimations(root)

    const onLenisReady = () => run()
    window.addEventListener(LENIS_READY_EVENT, onLenisReady)
    if ((window as Window & { lenis?: unknown }).lenis) {
      run()
    } else {
      run()
      window.setTimeout(run, 200)
    }

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener(LENIS_READY_EVENT, onLenisReady)
      window.removeEventListener('resize', onResize)
      killBoutiqueAnimations(root)
    }
  }, [children])

  return (
    <BoutiqueBookingProvider locale={locale}>
      <div
        ref={rootRef}
        className={`boutique-tenant-root boutique-landing-shell ${realEstateLandingSerifFont.variable}`}
      >
        {children}
      </div>
    </BoutiqueBookingProvider>
  )
}
