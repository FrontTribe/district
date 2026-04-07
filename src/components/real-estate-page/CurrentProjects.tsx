'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CurrentProjectDrawer } from './CurrentProjectDrawer'

export type FloorPlanUnitShape =
  | { points: Array<{ x: number; y: number }> }
  | { x: number; y: number; width: number; height: number }

export type CurrentProjectBuilding = {
  title?: string
  floorPlanImageUrl?: string
  /** Payload documents id — use /api/pdf-file/:id for PDF.js (same-origin) */
  unitDetailsPdfId?: string
  unitDetailsPdfUrl?: string
  units: Array<{
    label: string
    detailPageNumber: number
    shape: FloorPlanUnitShape
  }>
}

export type CurrentProjectItem = {
  title: string
  description?: string
  imageUrl?: string
  status?: string
  building?: CurrentProjectBuilding
  ctaText?: string
  ctaUrl?: string
}

export type RealEstateCurrentProjectsProps = {
  eyebrow?: string
  heading: string
  subtitle?: string
  projects: CurrentProjectItem[]
  sectionId?: string
}

export function RealEstateCurrentProjects({
  eyebrow,
  heading,
  subtitle,
  projects,
  sectionId = 'current-projects',
}: RealEstateCurrentProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [drawerProject, setDrawerProject] = useState<CurrentProjectItem | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(q('.re-current__header'), { opacity: 0, y: 24 })
      gsap.set(q('.re-current__card'), { opacity: 0, y: 36 })
      gsap.to(q('.re-current__header'), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 82%' },
      })
      gsap.to(q('.re-current__card'), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [projects.length])

  return (
    <section ref={sectionRef} id={sectionId} className="re-current">
      <div className="re-current__container">
        <div className="re-current__header">
          {eyebrow && <p className="re-current__eyebrow">{eyebrow}</p>}
          <h2 className="re-current__heading">{heading}</h2>
          {subtitle && <p className="re-current__subtitle">{subtitle}</p>}
        </div>
        <div className="re-current__grid">
          {projects.map((project, i) => (
            <article
              key={i}
              className="re-current__card"
              role="button"
              tabIndex={0}
              onClick={() => setDrawerProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setDrawerProject(project)
                }
              }}
            >
              {project.imageUrl && (
                <div className="re-current__card-media">
                  <img src={project.imageUrl} alt={project.title} />
                  {project.status && (
                    <span className="re-current__card-status">{project.status}</span>
                  )}
                </div>
              )}
              <div className="re-current__card-content">
                <h3 className="re-current__card-title">{project.title}</h3>
                {project.description && (
                  <p className="re-current__card-desc">{project.description}</p>
                )}
                {project.ctaText && (
                  <span
                    className="re-current__card-cta"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDrawerProject(project)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        setDrawerProject(project)
                      }
                    }}
                  >
                    {project.ctaText}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
      <CurrentProjectDrawer
        isOpen={!!drawerProject}
        onClose={() => setDrawerProject(null)}
        project={drawerProject}
      />
    </section>
  )
}
