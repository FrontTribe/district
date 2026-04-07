'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ProjectGalleryModal } from './ProjectGalleryModal'

export type ProjectItem = {
  title: string
  description?: string
  imageUrl?: string
  location?: string
  year?: string
  /** Gallery images shown when the project card is clicked */
  galleryImages?: string[]
}

export type RealEstateProjectsWeDidProps = {
  eyebrow?: string
  heading: string
  subtitle?: string
  projects: ProjectItem[]
  sectionId?: string
}

export function RealEstateProjectsWeDid({
  eyebrow,
  heading,
  subtitle,
  projects,
  sectionId = 'projects-we-did',
}: RealEstateProjectsWeDidProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [galleryProject, setGalleryProject] = useState<{
    title: string
    galleryImages: string[]
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(q('.re-past__card'), { opacity: 0, y: 40 })
      gsap.to(q('.re-past__card'), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [projects.length])

  return (
    <section ref={sectionRef} id={sectionId} className="re-past">
      <div className="re-past__container">
        {eyebrow && <p className="re-past__eyebrow">{eyebrow}</p>}
        <h2 className="re-past__heading">{heading}</h2>
        {subtitle && <p className="re-past__subtitle">{subtitle}</p>}
        <div className="re-past__grid">
          {projects.map((project, i) => (
            <article
              key={i}
              className="re-past__card"
              role="button"
              tabIndex={0}
              onClick={() => {
                const images = project.galleryImages?.length
                  ? project.galleryImages
                  : project.imageUrl
                    ? [project.imageUrl]
                    : []
                setGalleryProject({ title: project.title, galleryImages: images })
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  const images = project.galleryImages?.length
                    ? project.galleryImages
                    : project.imageUrl
                      ? [project.imageUrl]
                      : []
                  setGalleryProject({ title: project.title, galleryImages: images })
                }
              }}
            >
              {project.imageUrl && (
                <div className="re-past__card-media">
                  <img src={project.imageUrl} alt={project.title} />
                </div>
              )}
              <div className="re-past__card-content">
                {(project.year || project.location) && (
                  <p className="re-past__card-meta">
                    {[project.location, project.year].filter(Boolean).join(' · ')}
                  </p>
                )}
                <h3 className="re-past__card-title">{project.title}</h3>
                {project.description && (
                  <p className="re-past__card-desc">{project.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
      <ProjectGalleryModal
        isOpen={!!galleryProject}
        onClose={() => setGalleryProject(null)}
        project={galleryProject}
      />
    </section>
  )
}
