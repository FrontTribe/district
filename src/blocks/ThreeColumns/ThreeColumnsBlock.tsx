'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ThreeColumnsBlockProps } from './types'
import { generateTenantUrl } from '@/utils/generateTenantUrl'

export const ThreeColumnsBlock: React.FC<ThreeColumnsBlockProps> = ({ columns, sectionId }) => {
  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

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

  console.log(`[ThreeColumnsBlock] Rendering with columns:`, columns)

  return (
    <section ref={sectionRef} id={sectionId} className="hero">
      {/* Hero Section - 3 Column Grid Layout (Full Width) */}
      <div className="hero-text-overlay">
        <div className="hero-text-container grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns?.map((column, index) => (
            <div
              key={index}
              className="hero-column relative p-4"
              onMouseEnter={() => handleColumnHover(index)}
              onMouseLeave={() => handleColumnLeave(index)}
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

              <h2 className="hero-title mt-4">{column.title}</h2>
              <p className="hero-subtitle">{column.subtitle}</p>

              <div className="social-links">
                {column.socialNetworks?.instagram && <span className="social-text">instagram</span>}
                {column.socialNetworks?.instagram && column.socialNetworks?.facebook && (
                  <div className="social-divider"></div>
                )}
                {column.socialNetworks?.facebook && <span className="social-text">facebook</span>}
              </div>

              <div className="see-more-container mt-2">
                <a
                  href={generateTenantUrl(column.link.tenant.subdomain)}
                  className="see-more-link"
                  target={column.link.openInNewTab ? '_blank' : undefined}
                  rel={column.link.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {column.link.text}
                </a>
              </div>

              <div
                ref={(el) => {
                  lineRefs.current[index] = el
                }}
                className="hover-line"
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
