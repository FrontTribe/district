'use client'

import React from 'react'
import { MomentoSplit } from './shared/MomentoSplit'
import { MomentoMap } from './MomentoMap'
import { dayLabel } from './utils'
import { googleMapsSearchUrl } from '@/utils/googleMapsLoader'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'

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
  mapSubline,
}: Props) {
  const ui = getMomentoUiCopy(locale)
  const subline = mapSubline ?? ui.location.mapSubline
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
  const titleWords = title.split(' ')
  const titleLead = titleWords.slice(0, 2).join(' ') || title
  const titleTail = titleWords.slice(2).join(' ') || ui.location.titleTail

  return (
    <section className="section" id={sectionId}>
      <div className="shell">
        <div className="section-head">
          <div className="num reveal">{ui.location.sectionLabel}</div>
          <h2>
            <MomentoSplit>{titleLead}</MomentoSplit>
            <br />
            <MomentoSplit>
              <em>{titleTail}</em>
            </MomentoSplit>
          </h2>
        </div>

        <div className="loc">
          <div className="loc-info">
            {description ? <p className="reveal">{description}</p> : null}
            <div className="info-stack">
              <div className="info-block reveal" data-delay="1">
                <div className="lbl">{ui.location.addressLabel}</div>
                <div className="val">{streetLine}</div>
                <div className="sub">{cityLine}</div>
              </div>
              <div className="info-block reveal" data-delay="2">
                <div className="lbl">{ui.location.contactLabel}</div>
                <div className="val">
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>{contactPhone}</a>
                </div>
                <div className="sub">
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
              </div>
              <div className="info-block reveal" data-delay="3">
                <div className="lbl">{ui.location.hoursLabel}</div>
                <div className="hours-grid">
                  {(workingHours ?? []).map((h) => {
                    const i = dayIndex[h.day] ?? -1
                    const time =
                      h.isOpen === false
                        ? ui.location.closed
                        : `${h.openTime ?? ''}${h.openTime && h.closeTime ? ' – ' : ''}${h.closeTime ?? ''}`
                    return (
                      <React.Fragment key={h.day}>
                        <div className={`day ${i === today ? 'today' : ''}`}>
                          {dayLabel(h.day, locale)}
                          {i === today ? ui.location.today : ''}
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
              aria-label={ui.location.mapsAria(streetLine)}
            >
              <div className="txt">{streetLine}</div>
              <div className="sub">{subline}</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
