'use client'

import React from 'react'

type ApartmentStatus = 'slobodno' | 'rezervirano' | 'prodano'

interface Apartment {
  id: number
  name: string
  area: string
  rooms: string
  price?: string
  status: ApartmentStatus
  image: string
}

const apartments: Apartment[] = [
  {
    id: 1,
    name: 'Stan 2.5+1',
    area: '68 m²',
    rooms: '2 sobe, kuhinja, dnevni boravak',
    price: '€185,000',
    status: 'slobodno',
    image: '/placeholder-apt-1.jpg',
  },
  {
    id: 2,
    name: 'Stan 3+1',
    area: '85 m²',
    rooms: '3 sobe, kuhinja, dnevni boravak',
    price: '€225,000',
    status: 'slobodno',
    image: '/placeholder-apt-2.jpg',
  },
  {
    id: 3,
    name: 'Stan 2+1',
    area: '62 m²',
    rooms: '2 sobe, kuhinja, dnevni boravak',
    price: '€165,000',
    status: 'rezervirano',
    image: '/placeholder-apt-3.jpg',
  },
  {
    id: 4,
    name: 'Stan 3.5+1',
    area: '92 m²',
    rooms: '3 sobe, kuhinja, dnevni boravak, terasa',
    price: '€265,000',
    status: 'slobodno',
    image: '/placeholder-apt-4.jpg',
  },
  {
    id: 5,
    name: 'Stan 2+1',
    area: '58 m²',
    rooms: '2 sobe, kuhinja, dnevni boravak',
    price: '€155,000',
    status: 'prodano',
    image: '/placeholder-apt-5.jpg',
  },
  {
    id: 6,
    name: 'Stan 4+1',
    area: '110 m²',
    rooms: '4 sobe, kuhinja, dnevni boravak, balkon',
    price: '€325,000',
    status: 'slobodno',
    image: '/placeholder-apt-6.jpg',
  },
]

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

export default function RealEstateOffers() {
  return (
    <section className="re-offers">
      <div className="re-offers__container">
        <div className="re-offers__header">
          <div className="re-offers__eyebrow">PONUDA</div>
          <h2 className="re-offers__heading">
            <span className="re-offers__heading-line">Aktualne</span>
            <span className="re-offers__heading-line">Ponude</span>
          </h2>
          <p className="re-offers__subtitle">
            Pronađite savršen prostor za sebe u našim novim projektima
          </p>
        </div>
        <div className="re-offers__grid">
          {apartments.map((apt) => (
            <div key={apt.id} className="re-offers__card">
              <div className="re-offers__image">
                <div className="re-offers__image-placeholder">{apt.name}</div>
                <div className={`re-offers__badge ${getStatusClass(apt.status)}`}>
                  {getStatusText(apt.status)}
                </div>
              </div>
              <div className="re-offers__content">
                <h3 className="re-offers__name">{apt.name}</h3>
                <div className="re-offers__details">
                  <span className="re-offers__detail">{apt.area}</span>
                  <span className="re-offers__detail-separator">•</span>
                  <span className="re-offers__detail">{apt.rooms}</span>
                </div>
                {apt.price && <div className="re-offers__price">{apt.price}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
