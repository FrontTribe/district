'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Badge = { text?: string }
type Room = {
  title: string
  description?: string
  image: any
  badges?: Badge[]
}

type Props = {
  eyebrow?: string
  heading: string
  subheading?: string
  cta?: { label?: string; href?: string }
  rooms?: Room[]
  sectionId?: string
}

export const RoomsBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  cta,
  rooms = [],
  sectionId,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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

      q('.room-card').forEach((el) => {
        const img = (el as HTMLElement).querySelector('img')
        if (img) gsap.set(img, { clipPath: 'inset(0 0 0 100%)' })
        gsap
          .timeline({
            scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%', once: true },
          })
          .to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
          .to(img, { clipPath: 'inset(0 0 0 0)', duration: 1, ease: 'power2.out' }, 0)
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const getUrl = (m: any) => (typeof m === 'string' ? m : m?.url)

  return (
    <section ref={sectionRef} id={sectionId} className="rooms-block">
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
        {rooms.map((room, idx) => (
          <article
            key={idx}
            className="room-card"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <div className="room-media">
              <img src={getUrl(room.image)} alt={room.title} />
              {room.badges && room.badges.length > 0 && (
                <div className="room-badges">
                  {room.badges.map((b, i) => (
                    <span key={i} className="room-badge">
                      {b.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="room-info">
              <h3 className="room-title">{room.title}</h3>
              {room.description && <p className="room-desc">{room.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
