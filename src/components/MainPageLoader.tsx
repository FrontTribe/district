'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface MainPageLoaderProps {
  children: React.ReactNode
  isMainDomain?: boolean
  /** Cinematic intro aligned with District hub (three-columns landing). */
  hubTriptychIntro?: boolean
}

// Utility function to reset loader (for testing/debugging)
export const resetLoader = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('district-loader-shown')
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  ;(window as unknown as { resetDistrictLoader?: typeof resetLoader }).resetDistrictLoader =
    resetLoader
}

export const MainPageLoader: React.FC<MainPageLoaderProps> = ({
  children,
  isMainDomain = true,
  hubTriptychIntro = false,
}) => {
  const loadingRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isMainDomain) {
      setIsLoading(false)
      return
    }

    const hasShownLoader =
      typeof window !== 'undefined' ? sessionStorage.getItem('district-loader-shown') : null

    if (hasShownLoader) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    let cancelled = false
    const finish = () => {
      if (cancelled) return
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('district-loader-shown', 'true')
      }
      setIsLoading(false)
    }

    const tidProgress = window.setTimeout(() => {
      if (cancelled) return
      const progressBar = progressBarRef.current
      if (progressBar) {
        gsap.to(progressBar, {
          width: '100%',
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.5,
        })
      }
    }, 50)

    const tidOutro = window.setTimeout(() => {
      if (cancelled) return
      const el = loadingRef.current
      if (!el) {
        finish()
        return
      }

      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set(el, { opacity: 1 })

      if (hubTriptychIntro) {
        const cols = el.querySelectorAll('.district-hub-loader__col')
        const footer = el.querySelector('.district-hub-loader__footer')

        if (reduce || cols.length === 0) {
          gsap.set(el, { pointerEvents: 'none' })
          const targets = footer ? [...cols, footer] : [...cols]
          gsap.to(targets, {
            opacity: 0,
            duration: 0.48,
            stagger: 0.07,
            ease: 'power2.in',
            delay: 2.45,
            onComplete: finish,
          })
          return
        }

        // Reveal real hub: no full-screen curtain — wipe each loader column away (stagger L→R)
        gsap.set(el, { pointerEvents: 'none' })
        gsap.set(cols, { clipPath: 'inset(0 0 0 0)' })

        const exitTl = gsap.timeline({
          delay: 2.45,
          onComplete: finish,
        })

        if (footer) {
          exitTl.to(footer, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' }, 0)
        }
        exitTl.to(
          cols,
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.68,
            stagger: 0.16,
            ease: 'power2.inOut',
          },
          footer ? 0.06 : 0,
        )
        return
      }

      gsap.set(el, { y: 0, opacity: 1 })
      gsap.to(el, {
        y: '100%',
        duration: 1,
        ease: 'power2.inOut',
        delay: 2.5,
        onComplete: finish,
      })
    }, 100)

    return () => {
      cancelled = true
      window.clearTimeout(tidProgress)
      window.clearTimeout(tidOutro)
      const el = loadingRef.current
      if (el) gsap.killTweensOf(el)
      if (progressBarRef.current) gsap.killTweensOf(progressBarRef.current)
    }
  }, [isMainDomain, hubTriptychIntro])

  useLayoutEffect(() => {
    if (!isLoading || !hubTriptychIntro || typeof window === 'undefined') return

    const root = loadingRef.current
    const inners = root?.querySelectorAll('.district-hub-loader__col-inner')
    const wordmark = root?.querySelector('.district-hub-loader__wordmark')
    if (!inners?.length) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.killTweensOf(inners)
    if (wordmark) gsap.killTweensOf(wordmark)

    if (reduceMotion) {
      gsap.set(inners, { scaleY: 1, opacity: 1 })
      if (wordmark) gsap.set(wordmark, { opacity: 1, y: 0 })
      return
    }

    gsap.set(inners, { transformOrigin: '50% 100%', scaleY: 0.08, opacity: 0.35 })
    gsap.to(inners, {
      scaleY: 1,
      opacity: 1,
      duration: 0.9,
      stagger: 0.14,
      ease: 'power3.out',
      delay: 0.06,
    })

    if (wordmark) {
      gsap.fromTo(
        wordmark,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: 0.35 },
      )
    }

    return () => {
      gsap.killTweensOf(inners)
      if (wordmark) gsap.killTweensOf(wordmark)
    }
  }, [isLoading, hubTriptychIntro])

  return (
    <>
      {isLoading && hubTriptychIntro && (
        <div ref={loadingRef} className="district-hub-loader" aria-busy="true" aria-live="polite">
          <div className="district-hub-loader__grid" aria-hidden="true">
            {(['01', '02', '03'] as const).map((num) => (
              <div key={num} className="district-hub-loader__col">
                <div className="district-hub-loader__col-inner">
                  <div className="district-hub-loader__veil" />
                </div>
                <span className="district-hub-loader__num">{num}</span>
              </div>
            ))}
          </div>
          <div className="district-hub-loader__footer">
            <div className="district-hub-loader__wordmark">district</div>
            <div className="district-hub-loader__bar-track">
              <div ref={progressBarRef} className="district-hub-loader__bar-fill" />
            </div>
          </div>
        </div>
      )}

      {isLoading && !hubTriptychIntro && (
        <div ref={loadingRef} className="loading-overlay">
          <div className="loading-content">
            <div className="loading-logo">district</div>
            <div className="loading-bar">
              <div ref={progressBarRef} className="loading-progress"></div>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  )
}
