'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface MainPageLoaderProps {
  children: React.ReactNode
  isMainDomain?: boolean
}

// Utility function to reset loader (for testing/debugging)
export const resetLoader = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('district-loader-shown')
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  ;(window as any).resetDistrictLoader = resetLoader
}

export const MainPageLoader: React.FC<MainPageLoaderProps> = ({
  children,
  isMainDomain = true,
}) => {
  const loadingRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only show loader on main domain
    if (!isMainDomain) {
      setIsLoading(false)
      return
    }

    // Check if loader has already been shown in this session
    const hasShownLoader =
      typeof window !== 'undefined' ? sessionStorage.getItem('district-loader-shown') : null

    if (!hasShownLoader) {
      // Show loader only on first visit
      setIsLoading(true)

      // Mark loader as shown in session storage (only if available)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('district-loader-shown', 'true')
      }

      // Loading animation
      const tl = gsap.timeline()

      // Simulate loading progress - small delay to ensure DOM is ready
      setTimeout(() => {
        const progressBar = progressBarRef.current || document.querySelector('.loading-progress')
        if (progressBar) {
          gsap.to(progressBar, {
            width: '100%',
            duration: 2,
            ease: 'power2.inOut',
            delay: 0.5,
          })
        } else {
        }
      }, 50)

      // After loading completes, slide overlay down
      setTimeout(() => {
        if (loadingRef.current) {

          // Set initial transform
          gsap.set(loadingRef.current, { y: 0 })

          // Animate slide down using timeline
          tl.to(loadingRef.current, {
            y: '100%',
            duration: 1,
            ease: 'power2.inOut',
            delay: 2.5,
          }).call(() => {
            setIsLoading(false)
          })
        } else {
          // Fallback: just hide the loader after delay
          setTimeout(() => setIsLoading(false), 3500)
        }
      }, 100)
    } else {
      // Loader already shown, don't show it again
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      {/* Loading Animation */}
      {isLoading && (
        <div ref={loadingRef} className="loading-overlay">
          <div className="loading-content">
            <div className="loading-logo">district</div>
            <div className="loading-bar">
              <div ref={progressBarRef} className="loading-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}
    </>
  )
}
