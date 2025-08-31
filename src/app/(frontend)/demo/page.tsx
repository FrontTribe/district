'use client'

import { useState, useEffect, useRef } from 'react'
import { Space_Grotesk } from 'next/font/google'
import EnhancedLanguageSwitcher from '@/components/EnhancedLanguageSwitcher'
import { gsap } from 'gsap'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export default function DemoPage() {
  const [currentLocale, setCurrentLocale] = useState('en')
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const loadingRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleLanguageChange = (newLocale: string) => {
    setCurrentLocale(newLocale)
  }

  useEffect(() => {
    // Initialize GSAP line animations
    lineRefs.current.forEach((lineRef, index) => {
      if (lineRef) {
        gsap.set(lineRef, { scaleX: 0, transformOrigin: 'left' })
      }
    })

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

    // Start hero column animations when overlay is 40% down
    tl.to(
      loadingRef.current,
      {
        y: '40%',
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '<+=0.3',
    ) // Start 0.3s after slide down begins

    // Trigger hero column animations
    tl.add(() => {
      // Animate hero columns in sequence
      gsap.to('.hero-column', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      })

      // Animate social links
      gsap.to('.social-links', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.4,
        ease: 'power2.out',
      })
    }, '<+=0.1')

    // Complete the slide down and hide overlay
    tl.to(loadingRef.current, {
      y: '100%',
      duration: 0.7,
      ease: 'power2.inOut',
    }).call(() => setIsLoading(false))
  }, [])

  const handleColumnHover = (index: number) => {
    const lineRef = lineRefs.current[index]
    if (lineRef) {
      gsap.to(lineRef, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }

  const handleColumnLeave = (index: number) => {
    const lineRef = lineRefs.current[index]
    if (lineRef) {
      gsap.to(lineRef, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  }

  return (
    <div className={`demo-page ${spaceGrotesk.variable}`}>
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

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>district.</h1>
          </div>
          <div className="language-switcher-wrapper">
            <EnhancedLanguageSwitcher
              currentLocale={currentLocale}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </header>

      {/* Hero Section - 3 Column Grid */}
      <section className="hero">
        <div className="hero-video">
          <video autoPlay muted loop playsInline preload="none" className="u-video-embed">
            <source
              src="https://room-studio.b-cdn.net/MAIN%20PAGE_final_2%20(1).mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="hero-text-overlay">
          <div className="hero-text-container">
            <div
              className="hero-column"
              onMouseEnter={() => handleColumnHover(0)}
              onMouseLeave={() => handleColumnLeave(0)}
            >
              <h2 className="hero-title">Boutique</h2>
              <div className="social-links">
                <span className="social-text">instagram</span>
                <div className="social-divider"></div>
                <span className="social-text">facebook</span>
              </div>
              <div className="see-more-container">
                <a href="#" className="see-more-link">
                  See more
                </a>
              </div>
              <div
                ref={(el) => {
                  lineRefs.current[0] = el
                }}
                className="hover-line"
              ></div>
            </div>
            <div
              className="hero-column"
              onMouseEnter={() => handleColumnHover(1)}
              onMouseLeave={() => handleColumnLeave(1)}
            >
              <h2 className="hero-title">Concept Bar</h2>
              <div className="social-links">
                <span className="social-text">instagram</span>
                <div className="social-divider"></div>
                <span className="social-text">facebook</span>
              </div>
              <div className="see-more-container">
                <a href="#" className="see-more-link">
                  See more
                </a>
              </div>
              <div
                ref={(el) => {
                  lineRefs.current[1] = el
                }}
                className="hover-line"
              ></div>
            </div>
            <div
              className="hero-column"
              onMouseEnter={() => handleColumnHover(2)}
              onMouseLeave={() => handleColumnLeave(2)}
            >
              <h2 className="hero-title">Real Estate</h2>
              <div className="social-links">
                <span className="social-text">instagram</span>
                <div className="social-divider"></div>
                <span className="social-text">facebook</span>
              </div>
              <div className="see-more-container">
                <a href="#" className="see-more-link">
                  See more
                </a>
              </div>
              <div
                ref={(el) => {
                  lineRefs.current[2] = el
                }}
                className="hover-line"
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
