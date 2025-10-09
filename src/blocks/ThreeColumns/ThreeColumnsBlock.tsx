'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ThreeColumnsBlockProps } from './types'
import { generateTenantUrl } from '@/utils/generateTenantUrl'
import './ThreeColumns.scss'

export const ThreeColumnsBlock: React.FC<ThreeColumnsBlockProps> = ({ columns, sectionId }) => {
  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Initialize GSAP line animations
    lineRefs.current.forEach((lineRef, _index) => {
      if (lineRef) {
        gsap.set(lineRef, { scaleX: 0, transformOrigin: 'left' })
      }
    })

    // Set initial states for animations
    gsap.set('.hero-column', { opacity: 0, y: 30 })
    gsap.set('.social-links', { opacity: 0, y: 20 })

    // Animate hero columns in sequence
    gsap.to('.hero-column', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.5,
    })

    // Animate social links
    gsap.to('.social-links', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      delay: 0.9,
      ease: 'power2.out',
    })
  }, [columns])

  const handleColumnHover = (index: number) => {
    if (isMobile) return // Disable hover on mobile
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
    if (isMobile) return // Disable hover on mobile
    const lineRef = lineRefs.current[index]
    if (lineRef) {
      gsap.to(lineRef, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  }

  const handleColumnClick = (index: number) => {
    if (!isMobile) return // Only handle clicks on mobile

    if (activeColumn === index) {
      // Collapse if already active
      setActiveColumn(null)
      const lineRef = lineRefs.current[index]
      if (lineRef) {
        gsap.to(lineRef, { scaleX: 0, duration: 0.4, ease: 'power2.in' })
      }
    } else {
      // Collapse previous active
      if (activeColumn !== null) {
        const prevLineRef = lineRefs.current[activeColumn]
        if (prevLineRef) {
          gsap.to(prevLineRef, { scaleX: 0, duration: 0.4, ease: 'power2.in' })
        }
      }

      // Expand new active
      setActiveColumn(index)
      const lineRef = lineRefs.current[index]
      if (lineRef) {
        gsap.to(lineRef, { scaleX: 1, duration: 0.6, ease: 'power2.out' })
      }
    }
  }

  console.log(`[ThreeColumnsBlock] Rendering with columns:`, columns)

  return (
    <section ref={sectionRef} id={sectionId} className="hero three-columns-section">
      {/* Hero Section - 3 Column Grid Layout (Full Width) */}
      <div className="hero-text-overlay">
        <div className="hero-text-container three-columns-grid">
          {columns?.map((column, index) => {
            const isComingSoon = column.comingSoon === true

            return (
              <div
                key={index}
                className={`hero-column three-column ${activeColumn === index ? 'active' : ''} ${isComingSoon ? 'coming-soon' : ''}`}
                onMouseEnter={() => !isComingSoon && handleColumnHover(index)}
                onMouseLeave={() => !isComingSoon && handleColumnLeave(index)}
                onClick={() => !isComingSoon && handleColumnClick(index)}
                role="button"
                tabIndex={isComingSoon ? -1 : 0}
                aria-disabled={isComingSoon}
                onKeyDown={(e) => {
                  if (!isComingSoon && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleColumnClick(index)
                  }
                }}
              >
                {/* Background Image */}
                {column.backgroundImage && (
                  <div className="hero-video w-full h-64 overflow-hidden rounded">
                    <img
                      src={column.backgroundImage.url}
                      alt={column.backgroundImage.alt || column.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {isComingSoon && <span className="coming-soon-badge">Coming Soon</span>}

                <h2 className="hero-title mt-4">{column.title}</h2>
                <p className="hero-subtitle">{column.subtitle}</p>

                <div className="social-links">
                  {column.socialNetworks?.instagram && (
                    <span className="social-text">instagram</span>
                  )}
                  {column.socialNetworks?.instagram && column.socialNetworks?.facebook && (
                    <div className="social-divider"></div>
                  )}
                  {column.socialNetworks?.facebook && <span className="social-text">facebook</span>}
                </div>

                {!isComingSoon && column.link && (
                  <div className="see-more-container mt-2">
                    {column.link.tenant?.subdomain ? (
                      <a
                        href={generateTenantUrl(column.link.tenant.subdomain)}
                        className="see-more-link"
                        target={column.link.openInNewTab ? '_blank' : undefined}
                        rel={column.link.openInNewTab ? 'noopener noreferrer' : undefined}
                      >
                        {column.link.text}
                      </a>
                    ) : (
                      <span className="see-more-link">{column.link.text}</span>
                    )}
                  </div>
                )}

                <div
                  ref={(el) => {
                    lineRefs.current[index] = el
                  }}
                  className="hover-line"
                ></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
