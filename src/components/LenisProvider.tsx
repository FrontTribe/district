'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'

type Props = {
  children?: React.ReactNode
}

// Initializes Lenis smooth scroll on the client side.
// It renders no DOM and simply mounts/unmounts the Lenis instance.
export default function LenisProvider({ children }: Props) {
  const pathname = usePathname()

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

    // Expose Lenis instance globally for route change handling
    ;(window as any).lenis = lenis

    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Force scroll to top immediately on initialization
    window.scrollTo(0, 0)
    lenis.scrollTo(0, { immediate: true })

    // Ensure scroll to top after Lenis is fully ready
    const ensureScrollToTop = () => {
      window.scrollTo(0, 0)
      lenis.scrollTo(0, { immediate: true })
    }

    // Try multiple times to ensure it works
    ensureScrollToTop()
    setTimeout(ensureScrollToTop, 100)
    setTimeout(ensureScrollToTop, 300)

    // Also ensure scroll to top when window is fully loaded
    window.addEventListener('load', ensureScrollToTop)

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
      window.removeEventListener('load', ensureScrollToTop)
      if (typeof (lenis as any)?.destroy === 'function') (lenis as any).destroy()
      // Don't kill all ScrollTriggers as it might interfere with other components
      // ScrollTrigger.killAll()
    }
  }, [])

  // Handle scroll to top on route changes
  // Handle route changes - use Lenis for smooth scrolling
  useEffect(() => {
    // Scroll to top when pathname changes (navigation)
    if (typeof window !== 'undefined' && (window as any).lenis) {
      ;(window as any).lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  return <>{children}</>
}
