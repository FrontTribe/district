'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { usePathname } from 'next/navigation'

type Props = {
  children?: React.ReactNode
}

export default function LenisProvider({ children }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    // autoRaf: false — we drive Lenis from gsap.ticker to share one frame loop.
    // Without this, Lenis runs its own RAF AND gets ticked by GSAP → double updates.
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    ;(window as any).lenis = lenis

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    lenis.scrollTo(0, { immediate: true })

    // Keep ScrollTrigger in sync with every Lenis scroll event
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's ticker (time is in seconds, lenis.raf expects ms)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Recalculate all ScrollTrigger positions now that Lenis is connected.
    // Child component effects run before parent effects in React, so ScrollTriggers
    // are already registered at this point — they just need a fresh measurement.
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  useEffect(() => {
    const lenis = (window as any).lenis as Lenis | undefined
    if (!lenis) return
    lenis.scrollTo(0, { immediate: true })
    // Refresh triggers after navigation so they recalculate against the new page layout
    ScrollTrigger.refresh()
  }, [pathname])

  return <>{children}</>
}
