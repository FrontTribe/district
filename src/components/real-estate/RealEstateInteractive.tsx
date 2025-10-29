'use client'

import React, { useState } from 'react'

interface ApartmentDetail {
  id: number
  name: string
  area: string
  rooms: string
  status: 'slobodno' | 'rezervirano' | 'prodano'
  price?: string
  floor: string
  floorPlan: string
}

const apartments: ApartmentDetail[] = [
  {
    id: 1,
    name: 'Stan 2.5+1',
    area: '68 m²',
    rooms: '2 sobe, kuhinja, dnevni boravak',
    status: 'slobodno',
    price: '€185,000',
    floor: '2. kat',
    floorPlan: '/placeholder-floorplan-1.jpg',
  },
  {
    id: 2,
    name: 'Stan 3+1',
    area: '85 m²',
    rooms: '3 sobe, kuhinja, dnevni boravak',
    status: 'slobodno',
    price: '€225,000',
    floor: '3. kat',
    floorPlan: '/placeholder-floorplan-2.jpg',
  },
  {
    id: 3,
    name: 'Stan 2+1',
    area: '62 m²',
    rooms: '2 sobe, kuhinja, dnevni boravak',
    status: 'rezervirano',
    price: '€165,000',
    floor: '1. kat',
    floorPlan: '/placeholder-floorplan-3.jpg',
  },
]

const getStatusText = (status: string) => {
  switch (status) {
    case 'slobodno':
      return 'SLOBODNO'
    case 'rezervirano':
      return 'REZERVIRANO'
    case 'prodano':
      return 'PRODANO'
    default:
      return status.toUpperCase()
  }
}

const getStatusClass = (status: string) => {
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

export default function RealEstateInteractive() {
  const [selectedApartment, setSelectedApartment] = useState<ApartmentDetail | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleApartmentClick = (apt: ApartmentDetail) => {
    setSelectedApartment(apt)
    setShowModal(true)
  }

  const handleReserveClick = () => {
    alert('Rezervacija termina sastanka za: ' + selectedApartment?.name)
    // Here would open a form or navigate to booking page
  }

  return (
    <>
      <section className="re-interactive">
        <div className="re-interactive__container">
          <div className="re-interactive__header">
            <h2 className="re-interactive__heading">
              <span className="re-interactive__heading-line">Interaktivni</span>
              <span className="re-interactive__heading-line">Pregled Zgrade</span>
            </h2>
            <p className="re-interactive__subtitle">
              Kliknite na stan u tlocrta da vidite detalje i opcije rezervacije
            </p>
          </div>
          <div className="re-interactive__building">
            <div className="re-interactive__floorplan">
              <div className="re-interactive__floorplan-placeholder">
                <div className="re-interactive__floorplan-text">Slika Tlocrt Zgrade</div>
                <div className="re-interactive__apartments">
                  {apartments.map((apt) => (
                    <button
                      key={apt.id}
                      className={`re-interactive__apt-button ${
                        apt.status === 'slobodno'
                          ? 're-interactive__apt-button--available'
                          : apt.status === 'rezervirano'
                            ? 're-interactive__apt-button--reserved'
                            : 're-interactive__apt-button--sold'
                      }`}
                      onClick={() => handleApartmentClick(apt)}
                      aria-label={`Stan ${apt.name} - ${apt.status}`}
                    >
                      {apt.id}
                    </button>
                  ))}
                </div>
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
                <div className="re-interactive__modal-detail">
                  <strong>Kvadratura:</strong> {selectedApartment.area}
                </div>
                <div className="re-interactive__modal-detail">
                  <strong>Površina:</strong> {selectedApartment.rooms}
                </div>
                <div className="re-interactive__modal-detail">
                  <strong>Kat:</strong> {selectedApartment.floor}
                </div>
                {selectedApartment.price && (
                  <div className="re-interactive__modal-detail">
                    <strong>Cijena:</strong> {selectedApartment.price}
                  </div>
                )}
              </div>
              <div className="re-interactive__modal-floorplan">
                <div className="re-interactive__modal-floorplan-placeholder">
                  Tlocrt {selectedApartment.name}
                </div>
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
