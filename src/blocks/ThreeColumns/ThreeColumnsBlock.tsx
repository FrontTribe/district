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
    gsap.set('.column-title', { opacity: 0, y: 100 })
    gsap.set('.column-subtitle', { opacity: 0, y: 100 })
    gsap.set('.column-link', { opacity: 0, y: 100, scale: 0.8 })
    gsap.set('.column', { y: 100, opacity: 0 })

    // Background image reveal animation - start with scale and blur
    if (columns?.some((col) => col.backgroundImage)) {
      gsap.set('.column-background-image', {
        scale: 1.3,
        filter: 'blur(8px)',
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

    // First: Animate background images reveal with scale down and blur removal
    if (columns?.some((col) => col.backgroundImage)) {
      tl.to(
        '.column-background-image',
        {
          scale: 1,
          filter: 'blur(0px)',
          duration: 2,
          stagger: 0.2,
          ease: 'power2.out',
        },
        0,
      )
    }

    // Second: Animate columns entrance with stagger
    tl.to(
      '.column',
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power3.out',
      },
      0.3,
    )

    // Third: Animate content elements sliding up from bottom with stagger
    tl.to(
      '.column-title',
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: { each: 0.2, from: 'start' },
        ease: 'power2.out',
      },
      0.8,
    )

    tl.to(
      '.column-subtitle',
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: { each: 0.2, from: 'start' },
        ease: 'power2.out',
      },
      1.0,
    )

    tl.to(
      '.column-link',
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: { each: 0.2, from: 'start' },
        ease: 'back.out(1.7)',
      },
      1.2,
    )

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
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

            {/* Gradient Overlay */}
            {column.gradient?.enabled && <div className="column-gradient-overlay" />}

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
