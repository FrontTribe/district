'use client'

import React, { useState } from 'react'
import { Media } from '@/payload-types'

type ApartmentStatus = 'slobodno' | 'rezervirano' | 'prodano'

type Apartment = {
  id?: string
  name: string
  area?: string
  rooms?: string
  floor?: string
  price?: string
  status: ApartmentStatus
  positionX?: number
  positionY?: number
  floorPlanImage?: Media | string | null
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

const getStatusClass = (status: ApartmentStatus) => {
  switch (status) {
    case 'slobodno':
      return 're-interactive__status--available'
    case 'rezervirano':
      return 're-interactive__status--reserved'
    case 'prodano':
      return 're-interactive__status--sold'
    default:
      return ''
  }
}

export const RealEstateInteractiveBlock: React.FC<{
  headingLine1: string
  headingLine2: string
  subtitle?: string
  floorPlanImage?: Media | string | null
  apartments?: Apartment[]
  sectionId?: string
}> = ({ headingLine1, headingLine2, subtitle, floorPlanImage, apartments = [], sectionId }) => {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)
  const [showModal, setShowModal] = useState(false)

  const getImageUrl = (image: Media | string | null | undefined) => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url
  }

  const handleApartmentClick = (apt: Apartment) => {
    setSelectedApartment(apt)
    setShowModal(true)
  }

  const handleReserveClick = () => {
    alert('Rezervacija termina sastanka za: ' + selectedApartment?.name)
  }

  const floorPlanUrl = getImageUrl(floorPlanImage)

  return (
    <>
      <section className="re-interactive" id={sectionId}>
        <div className="re-interactive__container">
          <div className="re-interactive__header">
            <h2 className="re-interactive__heading">
              <span className="re-interactive__heading-line">{headingLine1}</span>
              <span className="re-interactive__heading-line">{headingLine2}</span>
            </h2>
            {subtitle && <p className="re-interactive__subtitle">{subtitle}</p>}
          </div>
          <div className="re-interactive__building">
            <div className="re-interactive__floorplan">
              {floorPlanUrl ? (
                <img
                  src={floorPlanUrl}
                  alt="Floor Plan"
                  className="re-interactive__floorplan-image"
                />
              ) : (
                <div className="re-interactive__floorplan-placeholder">
                  <div className="re-interactive__floorplan-text">Slika Tlocrt Zgrade</div>
                </div>
              )}
              <div className="re-interactive__apartments">
                {apartments.map((apt, index) => (
                  <button
                    key={apt.id || index}
                    className={`re-interactive__apt-button ${
                      apt.status === 'slobodno'
                        ? 're-interactive__apt-button--available'
                        : apt.status === 'rezervirano'
                          ? 're-interactive__apt-button--reserved'
                          : 're-interactive__apt-button--sold'
                    }`}
                    onClick={() => handleApartmentClick(apt)}
                    style={{
                      left: `${apt.positionX || 20}%`,
                      top: `${apt.positionY || 20}%`,
                    }}
                    aria-label={`Stan ${apt.name} - ${apt.status}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && selectedApartment && (
        <div className="re-interactive__modal-overlay" onClick={() => setShowModal(false)}>
          <div className="re-interactive__modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="re-interactive__modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Zatvori"
            >
              ×
            </button>
            <div className="re-interactive__modal-content">
              <div className="re-interactive__modal-header">
                <h3 className="re-interactive__modal-title">{selectedApartment.name}</h3>
                <div
                  className={`re-interactive__modal-status ${getStatusClass(selectedApartment.status)}`}
                >
                  {getStatusText(selectedApartment.status)}
                </div>
              </div>
              <div className="re-interactive__modal-details">
                {selectedApartment.area && (
                  <div className="re-interactive__modal-detail">
                    <strong>Kvadratura:</strong> {selectedApartment.area}
                  </div>
                )}
                {selectedApartment.rooms && (
                  <div className="re-interactive__modal-detail">
                    <strong>Površina:</strong> {selectedApartment.rooms}
                  </div>
                )}
                {selectedApartment.floor && (
                  <div className="re-interactive__modal-detail">
                    <strong>Kat:</strong> {selectedApartment.floor}
                  </div>
                )}
                {selectedApartment.price && (
                  <div className="re-interactive__modal-detail">
                    <strong>Cijena:</strong> {selectedApartment.price}
                  </div>
                )}
              </div>
              <div className="re-interactive__modal-floorplan">
                {getImageUrl(selectedApartment.floorPlanImage) ? (
                  <img
                    src={getImageUrl(selectedApartment.floorPlanImage) || ''}
                    alt={`Floor plan ${selectedApartment.name}`}
                  />
                ) : (
                  <div className="re-interactive__modal-floorplan-placeholder">
                    Tlocrt {selectedApartment.name}
                  </div>
                )}
              </div>
              {selectedApartment.status === 'slobodno' && (
                <button className="re-interactive__modal-reserve" onClick={handleReserveClick}>
                  REZERVIRAJ TERMIN SASTANKA
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
