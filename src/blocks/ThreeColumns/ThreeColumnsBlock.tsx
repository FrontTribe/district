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
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
