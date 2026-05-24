'use client'

import { type RefObject, useLayoutEffect } from 'react'
import { ScrollTrigger, LENIS_READY_EVENT } from '@/lib/gsap'
import { setupMomentoAnimations } from './setupMomentoAnimations'

export function useMomentoAnimations(
  rootRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useLayoutEffect(() => {
    if (!active || typeof window === 'undefined') return

    const root = rootRef.current
    if (!root) return

    const cleanup = setupMomentoAnimations(root)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener(LENIS_READY_EVENT, refresh)

    if ((window as Window & { lenis?: unknown }).lenis) {
      refresh()
    }

    // Payload live preview iframe may mount before layout height is final.
    requestAnimationFrame(refresh)
    const refreshTimer = window.setTimeout(refresh, 250)

    return () => {
      window.clearTimeout(refreshTimer)
      window.removeEventListener(LENIS_READY_EVENT, refresh)
      cleanup()
    }
  }, [active, rootRef])
}
