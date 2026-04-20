'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

type ImageItem = {
  image: {
    url: string
    alt?: string
  }
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

type Props = {
  title: string
  subtitle: string
  buttonText?: string
  buttonUrl?: string
  images: ImageItem[]
  sectionId?: string
}

export const ImageGridBlock: React.FC<Props> = ({
  title,
  subtitle,
  buttonText,
  buttonUrl,
  images,
  sectionId,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const marqueeRef = useRef<HTMLDivElement | null>(null)
  const marqueeTween = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const MOBILE_BREAKPOINT = 768
    // Constant pixels-per-second velocity so speed stays the same regardless of
    // card count or viewport width.
    const MARQUEE_SPEED_PX_PER_SEC = 50
    const CARD_GAP_PX = 16
    const CLONE_FLAG = 'data-marquee-clone'

    const removeClones = (track: HTMLElement) => {
      track.querySelectorAll(`[${CLONE_FLAG}="true"]`).forEach((node) => node.remove())
    }

    const teardownMarquee = () => {
      marqueeTween.current?.kill()
      marqueeTween.current = null
      const track = marqueeRef.current
      if (!track) return
      removeClones(track)
      gsap.set(track, { clearProps: 'transform,x' })
    }

    const createMarquee = () => {
      const track = marqueeRef.current
      if (!track) return

      // Always reset to a known state before (re)building, otherwise repeated
      // calls would stack clones and accelerate the animation each time.
      teardownMarquee()

      const cards = Array.from(track.querySelectorAll<HTMLElement>('.image-grid__card'))
      if (cards.length === 0) return

      const cardWidth = cards[0].getBoundingClientRect().width
      if (cardWidth === 0) return // layout not ready yet

      const totalWidth = (cardWidth + CARD_GAP_PX) * cards.length

      cards.forEach((card) => {
        const clone = card.cloneNode(true) as HTMLElement
        clone.setAttribute(CLONE_FLAG, 'true')
        clone.setAttribute('aria-hidden', 'true')
        track.appendChild(clone)
      })

      const duration = totalWidth / MARQUEE_SPEED_PX_PER_SEC

      marqueeTween.current = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -totalWidth,
          duration,
          ease: 'none',
          repeat: -1,
          immediateRender: true,
        },
      )
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      const isDesktop = window.innerWidth > MOBILE_BREAKPOINT

      gsap.set(q('.image-grid__content'), { opacity: 0, y: 30 })

      if (isDesktop) {
        const revealImage = (imgElement: HTMLImageElement) => {
          gsap.set(imgElement, { clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' })
          gsap.to(imgElement, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: imgElement.closest('.image-grid__image'),
              start: 'top 85%',
              once: true,
            },
          })
        }

        const desktopImages = sectionRef.current?.querySelectorAll<HTMLImageElement>(
          '.image-grid__container--desktop .image-grid__img',
        )
        desktopImages?.forEach((img) => revealImage(img))
      }

      gsap.to(q('.image-grid__content'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    // --- Mobile marquee setup (kept outside gsap.context so we own cleanup) ---
    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT

    const setupMarquee = () => {
      if (!marqueeRef.current) return
      if (!isMobile()) {
        teardownMarquee()
        return
      }
      createMarquee()
    }

    let imgLoadCleanup: (() => void) | undefined
    if (marqueeRef.current && isMobile()) {
      const imgs = Array.from(
        marqueeRef.current.querySelectorAll<HTMLImageElement>('img:not([' + CLONE_FLAG + '])'),
      )
      const pending = imgs.filter((img) => !img.complete)

      if (pending.length === 0) {
        requestAnimationFrame(() => requestAnimationFrame(setupMarquee))
      } else {
        let remaining = pending.length
        const onLoad = () => {
          remaining -= 1
          if (remaining <= 0) requestAnimationFrame(() => requestAnimationFrame(setupMarquee))
        }
        pending.forEach((img) => img.addEventListener('load', onLoad, { once: true }))
        imgLoadCleanup = () => {
          pending.forEach((img) => img.removeEventListener('load', onLoad))
        }
      }
    }

    // iOS Safari fires `resize` whenever the URL/tab bar collapses during
    // scroll, which used to rebuild the marquee (and double the clones) on
    // every scroll tick. Rebuild only when the *width* actually changes, and
    // debounce to coalesce rapid orientation/resize events.
    let lastWidth = window.innerWidth
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const handleResize = () => {
      const nextWidth = window.innerWidth
      if (nextWidth === lastWidth) return
      lastWidth = nextWidth
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(setupMarquee, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
      imgLoadCleanup?.()
      teardownMarquee()
      ctx.revert()
    }
  }, [images])

  // Group images by position for desktop
  const imagesByPosition = images.reduce(
    (acc, image) => {
      acc[image.position] = image
      return acc
    },
    {} as Record<string, ImageItem>,
  )

  return (
    <section ref={sectionRef} id={sectionId} className="image-grid">
      {/* Desktop Grid Layout */}
      <div className="image-grid__container image-grid__container--desktop">
        {/* Top Left Image */}
        {imagesByPosition['top-left'] && (
          <div className="image-grid__image image-grid__image--top-left">
            <img
              src={imagesByPosition['top-left'].image.url}
              alt={imagesByPosition['top-left'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Top Right Image */}
        {imagesByPosition['top-right'] && (
          <div className="image-grid__image image-grid__image--top-right">
            <img
              src={imagesByPosition['top-right'].image.url}
              alt={imagesByPosition['top-right'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Bottom Left Image */}
        {imagesByPosition['bottom-left'] && (
          <div className="image-grid__image image-grid__image--bottom-left">
            <img
              src={imagesByPosition['bottom-left'].image.url}
              alt={imagesByPosition['bottom-left'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Bottom Right Image */}
        {imagesByPosition['bottom-right'] && (
          <div className="image-grid__image image-grid__image--bottom-right">
            <img
              src={imagesByPosition['bottom-right'].image.url}
              alt={imagesByPosition['bottom-right'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Center Content */}
        <div className="image-grid__content">
          <h2 className="image-grid__title">{title}</h2>
          <p className="image-grid__subtitle">{subtitle}</p>
          {buttonText && buttonUrl && (
            <a href={buttonUrl} className="image-grid__button">
              {buttonText}
            </a>
          )}
        </div>
      </div>

      {/* Mobile Marquee Layout */}
      <div className="image-grid__container image-grid__container--mobile">
        <div className="image-grid__marquee" ref={marqueeRef}>
          {images.map((item, index) => (
            <div key={index} className="image-grid__card">
              <img src={item.image.url} alt={item.image.alt || ''} className="image-grid__img" />
            </div>
          ))}
        </div>

        {/* Content below marquee on mobile */}
        <div className="image-grid__content image-grid__content--mobile">
          <h2 className="image-grid__title">{title}</h2>
          <p className="image-grid__subtitle">{subtitle}</p>
          {buttonText && buttonUrl && (
            <a href={buttonUrl} className="image-grid__button">
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
