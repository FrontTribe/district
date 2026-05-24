'use client'

import React from 'react'
import { BoutiqueRoomImage } from '@/components/boutique-landing/BoutiqueRoomImage'
import { BoutiqueChapterLabel } from '@/components/boutique-landing/BoutiqueChapterLabel'
import { useBoutiqueBooking } from '@/components/boutique-landing/BoutiqueBookingContext'
import { renderBoutiqueHeadingWithBreaks } from '@/blocks/BoutiqueHeroContent'

type Badge = { text?: string }
type RoomImage = { image: unknown; alt?: string }
type Room = {
  roomNumber?: string | null
  title: string
  description?: string
  displayPrice?: number | null
  displayPriceSuffix?: string | null
  images?: RoomImage[]
  image?: unknown
  badges?: Badge[]
  rentlioUnitTypeId?: string
  rentlioPropertyId?: string
  rentlioSalesChannelId?: string
}

type Props = {
  chapterNum?: string | null
  chapterLabel?: string | null
  eyebrow?: string
  heading: string
  subheading?: string
  cta?: { label?: string; href?: string }
  rooms?: Room[]
  sectionId?: string
  locale?: string
}

export const RoomsBlock: React.FC<Props> = ({
  chapterNum,
  chapterLabel,
  heading,
  subheading,
  rooms = [],
  sectionId = 'sobe',
}) => {
  const booking = useBoutiqueBooking()

  const handleBookNow = (room: Room) => {
    if (booking) {
      booking.openBooking(room)
      return
    }
    document.querySelector('#sobe')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id={sectionId} className="section boutique-rooms">
      <div className="section-head">
        <h2 data-reveal="lines">{renderBoutiqueHeadingWithBreaks(heading)}</h2>
        <div className="head-text">
          <BoutiqueChapterLabel
            className="section-chapter-label"
            chapterNum={chapterNum ?? 'ii.'}
            chapterLabel={chapterLabel ?? 'Capitulum · Sobe'}
            data-reveal="fade-up"
            data-delay="0.1"
          />
          {subheading ? (
            <span data-reveal="fade-up" data-delay="0.1">
              {subheading}
            </span>
          ) : null}
        </div>
      </div>

      <div className="rooms-grid rooms-grid-4">
        {rooms.map((room, idx) => {
          const roomImages = room.images || (room.image ? [{ image: room.image }] : [])
          const sqmBadge = room.badges?.find((b) => b.text?.includes('m²'))
          const metaBadges = room.badges?.filter((b) => !b.text?.includes('m²')) ?? []

          return (
            <article key={idx} className="room-card">
              <BoutiqueRoomImage
                images={roomImages}
                roomNumber={room.roomNumber ?? String(idx + 1).padStart(2, '0')}
                sqmLabel={sqmBadge?.text}
              />
              <div className="room-info">
                <h3>{room.title}</h3>
                {room.displayPrice != null ? (
                  <div className="room-price">
                    od <b>€{room.displayPrice}</b> /{' '}
                    {(room.displayPriceSuffix || 'noć').replace(/^€\/?/, '')}
                  </div>
                ) : null}
              </div>
              {metaBadges.length > 0 ? (
                <div className="room-meta">
                  {metaBadges.map((badge, i) => (
                    <span key={badge.text} className="room-meta-item">
                      {i > 0 ? <span className="dot" /> : null}
                      <span>{badge.text}</span>
                    </span>
                  ))}
                </div>
              ) : null}
              {room.description ? <p className="room-desc">{room.description}</p> : null}
              <button className="room-book" type="button" onClick={() => handleBookNow(room)}>
                Book now <span className="arrow">→</span>
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
