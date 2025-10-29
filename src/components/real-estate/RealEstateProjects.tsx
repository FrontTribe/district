'use client'

import React from 'react'

const projects = [
  {
    id: 1,
    name: 'Sunset Residences',
    description: 'Moderan stambeni kompleks u srcu grada',
    image: '/placeholder-project-1.jpg',
  },
  {
    id: 2,
    name: 'Riverside Apartments',
    description: 'Luksuzni stanovi s pogledom na rijeku',
    image: '/placeholder-project-2.jpg',
  },
  {
    id: 3,
    name: 'Green Valley Estate',
    description: 'Eko-friendly projekat u zelenoj zoni',
    image: '/placeholder-project-3.jpg',
  },
  {
    id: 4,
    name: 'City Center Towers',
    description: 'Visokostambeni kompleks u poslovnom centru',
    image: '/placeholder-project-4.jpg',
  },
]

export default function RealEstateProjects() {
  return (
    <section className="re-projects">
      <div className="re-projects__container">
        <div className="re-projects__header">
          <div className="re-projects__eyebrow">PROJEKTI</div>
          <h2 className="re-projects__heading">
            <span className="re-projects__heading-line">Dosadašnji</span>
            <span className="re-projects__heading-line">Projekti</span>
          </h2>
        </div>
        <div className="re-projects__grid">
          {projects.map((project) => (
            <div key={project.id} className="re-projects__card">
              <div className="re-projects__image">
                <div className="re-projects__image-placeholder">{project.name}</div>
              </div>
              <div className="re-projects__content">
                <h3 className="re-projects__name">{project.name}</h3>
                <p className="re-projects__description">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
