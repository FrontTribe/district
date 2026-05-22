'use client'

import React from 'react'
import { MomentoSplit } from './shared/MomentoSplit'
import { MomentoMap } from './MomentoMap'
import { dayLabel } from './utils'
import { googleMapsSearchUrl } from '@/utils/googleMapsLoader'

type WorkingHour = {
  day: string
  isOpen?: boolean | null
  openTime?: string | null
  closeTime?: string | null
}

type Props = {
  title: string
  description?: string | null
  address: string
  coordinates: { lat: number; lng: number }
  workingHours?: WorkingHour[] | null
  sectionId?: string
  locale?: string
  contactPhone?: string
  contactEmail?: string
  mapSubline?: string
}

export function MomentoLocation({
  title,
  description,
  address,
  coordinates,
  workingHours,
  sectionId = 'lokacija',
  locale = 'hr',
  contactPhone = '+385 99 554 4337',
  contactEmail = 'support@district.hr',
  mapSubline = 'Osijek · Retfala',
}: Props) {
  const today = new Date().getDay()
  const dayIndex: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  const addressLines = address.split(',').map((s) => s.trim())
  const streetLine = addressLines[0] ?? address
  const cityLine = addressLines.slice(1).join(', ') || '31000 Osijek, Hrvatska'
  const mapsUrl = googleMapsSearchUrl(coordinates.lat, coordinates.lng, address)

  return (
    <section className="section" id={sectionId}>
      <div className="shell">
        <div className="section-head">
          <div className="num reveal">06 / Lokacija</div>
          <h2>
            <MomentoSplit>{title.split(' ').slice(0, 2).join(' ') || title}</MomentoSplit>
            <br />
            <MomentoSplit>
              <em>{title.split(' ').slice(2).join(' ') || 'pronaći.'}</em>
            </MomentoSplit>
          </h2>
        </div>

        <div className="loc">
          <div className="loc-info">
            {description ? <p className="reveal">{description}</p> : null}
            <div className="info-stack">
              <div className="info-block reveal" data-delay="1">
                <div className="lbl">Adresa</div>
                <div className="val">{streetLine}</div>
                <div className="sub">{cityLine}</div>
              </div>
              <div className="info-block reveal" data-delay="2">
                <div className="lbl">Kontakt</div>
                <div className="val">
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>{contactPhone}</a>
                </div>
                <div className="sub">
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
              </div>
              <div className="info-block reveal" data-delay="3">
                <div className="lbl">Radno vrijeme</div>
                <div className="hours-grid">
                  {(workingHours ?? []).map((h) => {
                    const i = dayIndex[h.day] ?? -1
                    const time =
                      h.isOpen === false
                        ? 'Zatvoreno'
                        : `${h.openTime ?? ''}${h.openTime && h.closeTime ? ' – ' : ''}${h.closeTime ?? ''}`
                    return (
                      <React.Fragment key={h.day}>
                        <div className={`day ${i === today ? 'today' : ''}`}>
                          {dayLabel(h.day, locale)}
                          {i === today ? ' · danas' : ''}
                        </div>
                        <div className={`time ${i === today ? 'today' : ''}`}>{time}</div>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="loc-card reveal-clip">
            <MomentoMap lat={coordinates.lat} lng={coordinates.lng} label={streetLine} />
            <a
              className="overlay-info"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Otvori ${streetLine} u Google Maps`}
            >
              <div className="txt">{streetLine}</div>
              <div className="sub">{mapSubline}</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
