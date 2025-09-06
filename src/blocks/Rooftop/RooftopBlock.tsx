'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type RooftopImage = {
  media: any
  alt?: string
  caption?: string
}

export const RooftopBlock: React.FC<{
  heading: string
  images: RooftopImage[]
  baseDuration?: number
  sectionId?: string
}> = ({ heading, images = [], baseDuration = 20, sectionId }) => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const marqueeTween = useRef<gsap.core.Tween | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Duplicate images for seamless loop
  const loopImages = useMemo(() => [...images, ...images], [images])

  useEffect(() => {
    if (!trackRef.current) return

    // Register once in case not already
    if ((gsap as any).registeredScrollTrigger !== true) {
      gsap.registerPlugin(ScrollTrigger)
      ;(gsap as any).registeredScrollTrigger = true
    }

    const track = trackRef.current

    const createTween = () => {
      if (!track) return
      // kill previous
      marqueeTween.current?.kill()
      gsap.set(track, { x: 0 })

      const width = track.scrollWidth / 2
      if (!width || !isFinite(width) || width < 10) {
        // try again shortly if layout isn't ready yet
        gsap.delayedCall(0.25, createTween)
        return
      }

      const xWrap = gsap.utils.wrap(-width, 0)

      marqueeTween.current = gsap.to(track, {
        x: -width,
        ease: 'none',
        duration: baseDuration,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => xWrap(parseFloat(x))),
        },
      })
    }

    // Ensure images are loaded before measuring widths
    const imgs = Array.from(track.querySelectorAll('img')) as HTMLImageElement[]
    const pending = imgs.filter((img) => !img.complete).length
    if (pending === 0) {
      // allow a tick for layout/css settling
      requestAnimationFrame(() => requestAnimationFrame(createTween))
    } else {
      let remaining = pending
      const onLoad = () => {
        remaining -= 1
        if (remaining <= 0) requestAnimationFrame(() => requestAnimationFrame(createTween))
      }
      imgs.forEach((img) => img.addEventListener('load', onLoad, { once: true }))
    }

    // also try once when window fully loaded (fonts, etc.)
    const onWindowLoad = () => requestAnimationFrame(() => requestAnimationFrame(createTween))
    window.addEventListener('load', onWindowLoad, { once: true })

    // Speed control with scroll velocity
    let timeoutId: any
    const st = ScrollTrigger.create({
      trigger: containerRef.current!,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity())
        const mapped = gsap.utils.clamp(1, 4, gsap.utils.mapRange(0, 4000, 1, 4, velocity))
        marqueeTween.current?.timeScale(mapped)
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          gsap.to(marqueeTween.current, { timeScale: 1, duration: 0.6, ease: 'power2.out' })
        }, 400)
      },
    })

    // Recreate on resize
    const ro = new ResizeObserver(() => createTween())
    ro.observe(track)

    return () => {
      marqueeTween.current?.kill()
      st.kill()
      ro.disconnect()
      window.removeEventListener('load', onWindowLoad)
    }
  }, [images, baseDuration])

  return (
    <section id={sectionId} className="rooftop-block" ref={containerRef}>
      <div className="rooftop-inner">
        <h2 className="rooftop-heading">{heading}</h2>

        <div className="rooftop-marquee">
          <div className="rooftop-track" ref={trackRef}>
            {loopImages.map((item, index) => {
              const src = typeof item.media === 'string' ? item.media : item.media?.url
              return (
                <figure className="rooftop-card" key={index}>
                  {src && <img src={src} alt={item.alt || ''} loading="lazy" />}
                  {item.caption && (
                    <figcaption className="rooftop-card__caption">{item.caption}</figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RooftopBlock
