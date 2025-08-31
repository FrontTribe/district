'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ThreeColumnsBlockProps } from './types'

export const ThreeColumnsBlock: React.FC<ThreeColumnsBlockProps> = ({ columns, sectionId }) => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null)
  const columnRefs = useRef<(HTMLDivElement | null)[]>([])

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  useEffect(() => {
    if (!sectionRef.current) return

    // Set initial states for animations
    gsap.set('.column-title', { opacity: 0, x: -100 })
    gsap.set('.column-subtitle', { opacity: 0, x: -100 })
    gsap.set('.column-link', { opacity: 0, x: -100, scale: 0.8 })
    gsap.set('.column', { x: -100, opacity: 0 })

    // Background image reveal animation - start with left offset and scale
    if (columns?.some((col) => col.backgroundImage)) {
      gsap.set('.column-background-image', {
        x: -100,
        scale: 1.1,
      })
    }

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    })

    // First: Animate background images sliding in from left with scale
    if (columns?.some((col) => col.backgroundImage)) {
      tl.to(
        '.column-background-image',
        {
          x: 0,
          scale: 1,
          duration: 1.5,
          stagger: 0.3,
          ease: 'power2.out',
        },
        0,
      )
    }

    // Second: Animate columns sliding in from left with stagger
    tl.to(
      '.column',
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.4,
        ease: 'power3.out',
      },
      0.2,
    )

    // Third: Animate content elements sliding in from left with stagger
    tl.to(
      '.column-title',
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: { each: 0.3, from: 'start' },
        ease: 'power2.out',
      },
      0.8,
    )

    tl.to(
      '.column-subtitle',
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        stagger: { each: 0.3, from: 'start' },
        ease: 'power2.out',
      },
      1.0,
    )

    tl.to(
      '.column-link',
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        stagger: { each: 0.3, from: 'start' },
        ease: 'back.out(1.7)',
      },
      1.2,
    )

    // Add hover animations for columns
    columnRefs.current.forEach((column, index) => {
      if (column) {
        const columnTitle = column.querySelector('.column-title')
        const columnSubtitle = column.querySelector('.column-subtitle')
        const columnLink = column.querySelector('.column-link')
        const columnBackground = column.querySelector('.column-background-image')
        const socialLinks = column.querySelectorAll('.social-link')

        // Create hover timeline
        const hoverTl = gsap.timeline({ paused: true })

        // Background image scale on hover
        if (columnBackground) {
          hoverTl.to(
            columnBackground,
            {
              scale: 1.1,
              duration: 0.6,
              ease: 'power2.out',
            },
            0,
          )
        }

        // Text reveal animations
        if (columnTitle) {
          hoverTl.to(
            columnTitle,
            {
              y: -10,
              duration: 0.4,
              ease: 'power2.out',
            },
            0,
          )
        }

        if (columnSubtitle) {
          hoverTl.to(
            columnSubtitle,
            {
              y: -10,
              opacity: 0.9,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.1,
          )
        }

        if (columnLink) {
          hoverTl.to(
            columnLink,
            {
              y: -15,
              scale: 1.05,
              duration: 0.4,
              ease: 'back.out(1.7)',
            },
            0.2,
          )
        }

        // Social network animations
        if (socialLinks.length > 0) {
          hoverTl.to(
            socialLinks,
            {
              y: -8,
              scale: 1.1,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.1,
            },
            0.3,
          )
        }

        // Column hover events
        column.addEventListener('mouseenter', () => {
          hoverTl.play()
        })

        column.addEventListener('mouseleave', () => {
          hoverTl.reverse()
        })
      }
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      // Remove hover event listeners
      columnRefs.current.forEach((column) => {
        if (column) {
          column.removeEventListener('mouseenter', () => {})
          column.removeEventListener('mouseleave', () => {})
        }
      })
    }
  }, [columns])

  return (
    <section ref={sectionRef} id={sectionId} className="three-columns-block">
      <div className="three-columns-content">
        {columns?.map((column, index) => (
          <div
            key={index}
            ref={(el) => {
              columnRefs.current[index] = el
            }}
            className={`column ${column.fullHeight ? 'column-full-height' : ''} ${
              column.gradient?.enabled
                ? `has-gradient gradient-${column.gradient.type || 'linear'} ${
                    column.gradient.type === 'linear'
                      ? `direction-${column.gradient.direction || 'to-bottom'}`
                      : `position-${column.gradient.position || 'center'}`
                  }`
                : ''
            }`}
            style={{
              ...(column.gradient?.enabled
                ? ({
                    '--gradient-start': column.gradient.startColor || '#000000',
                    '--gradient-end': column.gradient.endColor || '#ffffff',
                    '--gradient-opacity': column.gradient.opacity || 0.7,
                  } as React.CSSProperties)
                : {}),
            }}
          >
            {/* Background Image */}
            {column.backgroundImage && (
              <div className="column-background">
                <img
                  src={column.backgroundImage.url}
                  alt={column.backgroundImage.alt}
                  className="column-background-image"
                />
              </div>
            )}

            {/* Gradient Overlay - Now handled by CSS ::after pseudo-element */}

            <div className="column-content">
              <h2 className="column-title">{column.title}</h2>
              {column.subtitle && <p className="column-subtitle">{column.subtitle}</p>}
              <a
                href={column.link.url}
                className="column-link"
                target={column.link.openInNewTab ? '_blank' : undefined}
                rel={column.link.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {column.link.text}
              </a>

              {/* Social Networks */}
              {(column.socialNetworks?.facebook || column.socialNetworks?.instagram) && (
                <div className="column-social-networks">
                  {column.socialNetworks.facebook && (
                    <a
                      href={column.socialNetworks.facebook}
                      className="social-link social-facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit Facebook page"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {column.socialNetworks.instagram && (
                    <a
                      href={column.socialNetworks.instagram}
                      className="social-link social-instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit Instagram profile"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
