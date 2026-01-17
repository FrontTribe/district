'use client'

import React from 'react'
import { Media } from '@/payload-types'

type Project = {
  id?: string
  name: string
  description?: string
  image?: Media | string | null
}

export const RealEstateProjectsBlock: React.FC<{
  headingLine1: string
  headingLine2: string
  projects?: Project[]
  sectionId?: string
}> = ({ headingLine1, headingLine2, projects = [], sectionId }) => {
  const getImageUrl = (image: Media | string | null | undefined) => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url
  }

  return (
    <section className="re-projects" id={sectionId}>
      <div className="re-projects__container">
        <div className="re-projects__header">
          <div className="re-projects__eyebrow">PROJEKTI</div>
          <h2 className="re-projects__heading">
            <span className="re-projects__heading-line">{headingLine1}</span>
            <span className="re-projects__heading-line">{headingLine2}</span>
          </h2>
        </div>
        <div className="re-projects__grid">
          {projects.map((project, index) => {
            const imageUrl = getImageUrl(project.image)
            return (
              <div key={project.id || index} className="re-projects__card">
                <div className="re-projects__image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={project.name} />
                  ) : (
                    <div className="re-projects__image-placeholder">{project.name}</div>
                  )}
                </div>
                <div className="re-projects__content">
                  <h3 className="re-projects__name">{project.name}</h3>
                  {project.description && (
                    <p className="re-projects__description">{project.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
