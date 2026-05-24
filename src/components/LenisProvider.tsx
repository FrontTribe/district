'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { gsap, ScrollTrigger, LENIS_READY_EVENT } from '@/lib/gsap'

type Props = {
  children?: React.ReactNode
}

const SCROLLER = typeof document !== 'undefined' ? document.documentElement : null

export default function LenisProvider({ children }: Props) {
  const pathname = usePathname()
  const isFirstPath = useRef(true)

  useEffect(() => {
    if (!SCROLLER) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    ;(window as Window & { lenis?: Lenis }).lenis = lenis

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    lenis.scrollTo(0, { immediate: true })

    ScrollTrigger.scrollerProxy(SCROLLER, {
      scrollTop(value?: number) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    lenis.on('scroll', ScrollTrigger.update)

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()
    window.dispatchEvent(new Event(LENIS_READY_EVENT))

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      ScrollTrigger.scrollerProxy(SCROLLER, {})
      gsap.ticker.remove(onTick)
      lenis.destroy()
      delete (window as Window & { lenis?: Lenis }).lenis
    }
  }, [])

  useEffect(() => {
    const lenis = (window as Window & { lenis?: Lenis }).lenis
    if (!lenis) return
    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }
    lenis.scrollTo(0, { immediate: true })
    ScrollTrigger.refresh()
    window.dispatchEvent(new Event(LENIS_READY_EVENT))
  }, [pathname])

  return <>{children}</>
}
