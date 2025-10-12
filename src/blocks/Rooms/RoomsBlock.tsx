'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RoomSlider } from './RoomSlider'
import BookingDrawer from '@/components/BookingDrawer'

type Badge = { text?: string }
type RoomImage = {
  image: any
  alt?: string
}
type Room = {
  title: string
  description?: string
  images?: RoomImage[]
  image?: any // For backward compatibility
  badges?: Badge[]
  rentlioUnitTypeId?: string
  rentlioPropertyId?: string
  rentlioSalesChannelId?: string
}

type Props = {
  eyebrow?: string
  heading: string
  subheading?: string
  cta?: { label?: string; href?: string }
  rooms?: Room[]
  sectionId?: string
  locale?: string
}

export const RoomsBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  cta,
  rooms = [],
  sectionId,
  locale,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedRoom(null)
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase)
    const listeners: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(q('.rooms-eyebrow, .rooms-heading .line, .rooms-subheading, .rooms-cta'), {
        opacity: 0,
        y: 20,
      })
      gsap.to(q('.rooms-eyebrow, .rooms-heading .line, .rooms-subheading, .rooms-cta'), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 80%' },
      })

      const roomEase = CustomEase.create('roomCubic', '0.22,1,0.36,1')

      q('.room-card').forEach((el) => {
        const element = el as HTMLElement
        const slider = element.querySelector('.room-slider')
        const overlay = element.querySelector('.room-overlay')
        const bookNow = element.querySelector('.room-book-now')
        const titleBase = element.querySelector('.room-title .title-base')
        const titleOverlay = element.querySelector('.room-title .title-overlay')

        if (slider) {
          const img = slider.querySelector('.room-slide-image')
          if (img)
            gsap.set(img, {
              clipPath: 'inset(0 100% 0 0)',
              scale: 1.12,
              transformOrigin: '50% 50%',
              willChange: 'clip-path, transform',
            })
        }

        if (overlay) gsap.set(overlay, { autoAlpha: 0 })
        if (bookNow) gsap.set(bookNow, { autoAlpha: 1, y: 0 }) // Always visible
        if (titleOverlay) gsap.set(titleOverlay, { yPercent: 100 })
        if (titleBase) gsap.set(titleBase, { yPercent: 0 })
        const titleEl = element.querySelector('.room-title')
        const badgeEls = element.querySelectorAll('.room-badge')
        if (titleEl) gsap.set(titleEl, { opacity: 1, y: 0 }) // Always visible
        if (badgeEls && badgeEls.length) gsap.set(badgeEls, { opacity: 1, y: 0 }) // Always visible

        const slideImage = slider?.querySelector('.room-slide-image')
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: element, start: 'top 85%', once: true },
        })

        timeline.to(element, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)

        if (slideImage) {
          timeline
            .to(slideImage, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out' }, 0)
            .to(slideImage, { scale: 1, duration: 1.1, ease: 'power3.out' }, 0)
        }

        timeline
          .to(titleEl, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.9)
          .to(badgeEls, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.0)

        const hoverTl = gsap.timeline({ paused: true })
        const hoverImage = slider?.querySelector('.room-slide-image')
        if (hoverImage) hoverTl.to(hoverImage, { scale: 1.06, duration: 0.6, ease: roomEase }, 0)
        if (overlay) hoverTl.to(overlay, { autoAlpha: 1, duration: 0.35, ease: roomEase }, 0)
        // Remove bookNow and title animations from hover since they're always visible now

        const onEnter = () => hoverTl.play()
        const onLeave = () => hoverTl.reverse()
        element.addEventListener('mouseenter', onEnter)
        element.addEventListener('mouseleave', onLeave)
        listeners.push({ el: element, enter: onEnter, leave: onLeave })
      })
    }, sectionRef)
    return () => {
      listeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} className="rooms-block">
      <div className="rooms-inner">
        <div className="rooms-heading-wrap">
          {eyebrow && <div className="rooms-eyebrow">{eyebrow}</div>}
          <h2 className="rooms-heading">
            {heading.split('\n').map((line, i) => (
              <span key={i} className="line">
                {line}
              </span>
            ))}
          </h2>
          {subheading && <p className="rooms-subheading">{subheading}</p>}

          {cta?.label && cta?.href && (
            <a className="rooms-cta" href={cta.href}>
              {cta.label}
            </a>
          )}
        </div>

        <div className="rooms-grid">
          {rooms.map((room, idx) => {
            // Backward compatibility: convert old single image to new images array
            const roomImages = room.images || (room.image ? [{ image: room.image }] : [])

            return (
              <article
                key={idx}
                className="room-card"
                style={{ opacity: 0, transform: 'translateY(20px)' }}
              >
                <div className="room-media">
                  <RoomSlider images={roomImages} roomTitle={room.title} badges={room.badges} />
                  <div className="room-overlay" />
                  <h3 className="room-title">
                    <span className="title-mask">
                      <span className="title-base">{room.title}</span>
                      <span className="title-overlay">{room.title}</span>
                    </span>
                  </h3>
                  <button
                    className="room-book-now"
                    onClick={() => handleBookNow(room)}
                    type="button"
                  >
                    Book now
                  </button>
                </div>
                <div className="room-info">
                  {room.description && <p className="room-desc">{room.description}</p>}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <BookingDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        roomData={selectedRoom}
        locale={locale}
        salesChannelId={
          selectedRoom?.rentlioSalesChannelId
            ? parseInt(selectedRoom.rentlioSalesChannelId, 10)
            : 45
        }
      />
    </section>
  )
}
