'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface MainPageLoaderProps {
  children: React.ReactNode
}

// Utility function to reset loader (for testing/debugging)
export const resetLoader = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('district-loader-shown')
    console.log('Loader reset - will show on next page load')
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  ;(window as any).resetDistrictLoader = resetLoader
}

export const MainPageLoader: React.FC<MainPageLoaderProps> = ({ children }) => {
  const loadingRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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

      // Simulate loading progress
      const progressBar = document.querySelector('.loading-progress')
      if (progressBar) {
        gsap.to(progressBar, {
          width: '100%',
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.5,
        })
      }

      // After loading completes, slide overlay down
      tl.to(loadingRef.current, {
        y: '100%',
        duration: 1,
        ease: 'power2.inOut',
        delay: 2.5,
      })

      // Complete the slide down and hide overlay
      tl.to(loadingRef.current, {
        y: '100%',
        duration: 0.7,
        ease: 'power2.inOut',
      }).call(() => setIsLoading(false))
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
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}
    </>
  )
}
