'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
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
        const img = element.querySelector('img')
        const overlay = element.querySelector('.room-overlay')
        const bookNow = element.querySelector('.room-book-now')
        const titleBase = element.querySelector('.room-title .title-base')
        const titleOverlay = element.querySelector('.room-title .title-overlay')
        if (img) gsap.set(img, { clipPath: 'inset(0 0 0 100%)' })
        if (overlay) gsap.set(overlay, { autoAlpha: 0 })
        if (bookNow) gsap.set(bookNow, { autoAlpha: 0, y: 12 })
        if (titleOverlay) gsap.set(titleOverlay, { yPercent: 100 })
        if (titleBase) gsap.set(titleBase, { yPercent: 0 })
        gsap
          .timeline({
            scrollTrigger: { trigger: element, start: 'top 85%', once: true },
          })
          .to(element, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
          .to(img, { clipPath: 'inset(0 0 0 0)', duration: 1, ease: 'power2.out' }, 0)

        const hoverTl = gsap.timeline({ paused: true })
        if (img) hoverTl.to(img, { scale: 1.06, duration: 0.6, ease: roomEase }, 0)
        if (overlay) hoverTl.to(overlay, { autoAlpha: 1, duration: 0.35, ease: roomEase }, 0)
        if (bookNow)
          hoverTl.to(bookNow, { autoAlpha: 1, y: 0, duration: 0.45, ease: roomEase }, 0.05)
        if (titleOverlay)
          hoverTl.to(titleOverlay, { yPercent: 0, duration: 0.6, ease: roomEase }, 0)
        if (titleBase) hoverTl.to(titleBase, { yPercent: -100, duration: 0.6, ease: roomEase }, 0)

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
              <div className="room-overlay" />
              <div className="room-book-now">Book now</div>
            </div>
            <div className="room-info">
              <h3 className="room-title">
                <span className="title-mask">
                  <span className="title-base">{room.title}</span>
                  <span className="title-overlay">{room.title}</span>
                </span>
              </h3>
              {room.description && <p className="room-desc">{room.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
