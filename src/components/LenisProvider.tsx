'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  children?: React.ReactNode
}

// Initializes Lenis smooth scroll on the client side.
// It renders no DOM and simply mounts/unmounts the Lenis instance.
export default function LenisProvider({ children }: Props) {
  useEffect(() => {
    // Register GSAP plugin once
    if (typeof window !== 'undefined' && (gsap as any).registeredScrollTrigger !== true) {
      gsap.registerPlugin(ScrollTrigger)
      ;(gsap as any).registeredScrollTrigger = true
    }

    const lenis = new Lenis({
      // Defaults that feel close to design expectations; adjustable later
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    // Expose Lenis instance globally for drawer control
    ;(window as any).lenis = lenis

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value as number) : window.scrollY
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      // pinType detects if body uses transform for scrolling (it doesn't with Lenis on body)
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      // Clean up global reference
      ;(window as any).lenis = null

      if (typeof (lenis as any)?.destroy === 'function') (lenis as any).destroy()
      // Don't kill all ScrollTriggers as it might interfere with other components
      // ScrollTrigger.killAll()
    }
  }, [])

  return <>{children}</>
}
