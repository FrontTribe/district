'use client'

import React from 'react'
import { Media } from '@/payload-types'

type ApartmentStatus = 'slobodno' | 'rezervirano' | 'prodano'

type Apartment = {
  id?: string
  name: string
  area?: string
  rooms?: string
  price?: string
  status: ApartmentStatus
  image?: Media | string | null
}

const getStatusClass = (status: ApartmentStatus) => {
  switch (status) {
    case 'slobodno':
      return 're-offers__badge--available'
    case 'rezervirano':
      return 're-offers__badge--reserved'
    case 'prodano':
      return 're-offers__badge--sold'
    default:
      return ''
  }
}

const getStatusText = (status: ApartmentStatus) => {
  switch (status) {
    case 'slobodno':
      return 'SLOBODNO'
    case 'rezervirano':
      return 'REZERVIRANO'
    case 'prodano':
      return 'PRODANO'
    default:
      return String(status).toUpperCase()
  }
}

export const RealEstateOffersBlock: React.FC<{
  headingLine1: string
  headingLine2: string
  subtitle?: string
  apartments?: Apartment[]
  sectionId?: string
}> = ({ headingLine1, headingLine2, subtitle, apartments = [], sectionId }) => {
  const getImageUrl = (image: Media | string | null | undefined) => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url
  }

  return (
    <section className="re-offers" id={sectionId}>
      <div className="re-offers__container">
        <div className="re-offers__header">
          <div className="re-offers__eyebrow">PONUDA</div>
          <h2 className="re-offers__heading">
            <span className="re-offers__heading-line">{headingLine1}</span>
            <span className="re-offers__heading-line">{headingLine2}</span>
          </h2>
          {subtitle && <p className="re-offers__subtitle">{subtitle}</p>}
        </div>
        <div className="re-offers__grid">
          {apartments.map((apt, index) => {
            const imageUrl = getImageUrl(apt.image)
            return (
              <div key={apt.id || index} className="re-offers__card">
                <div className="re-offers__image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={apt.name} />
                  ) : (
                    <div className="re-offers__image-placeholder">{apt.name}</div>
                  )}
                  <div className={`re-offers__badge ${getStatusClass(apt.status)}`}>
                    {getStatusText(apt.status)}
                  </div>
                </div>
                <div className="re-offers__content">
                  <h3 className="re-offers__name">{apt.name}</h3>
                  <div className="re-offers__details">
                    {apt.area && <span className="re-offers__detail">{apt.area}</span>}
                    {apt.area && apt.rooms && (
                      <span className="re-offers__detail-separator">•</span>
                    )}
                    {apt.rooms && <span className="re-offers__detail">{apt.rooms}</span>}
                  </div>
                  {apt.price && <div className="re-offers__price">{apt.price}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
