'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

  // Create marquee animation for mobile
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)

      // Desktop grid animations
      if (window.innerWidth > 768) {
        // Set initial states for content
        gsap.set(q('.image-grid__content'), { opacity: 0, y: 30 })

        // Left-to-right reveal animation for images
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

        // Apply reveal animation to all images
        const imageElements = q('.image-grid__img') as HTMLImageElement[]
        imageElements.forEach((img: HTMLImageElement) => {
          revealImage(img)
        })

        // Animate content
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
      } else {
        // Mobile marquee animation
        const createMarquee = () => {
          if (!marqueeRef.current) {
            return
          }

          const track = marqueeRef.current
          const cards = track.querySelectorAll('.image-grid__card')

          if (cards.length === 0) {
            return
          }

          // Clear any existing animation
          marqueeTween.current?.kill()

          // Set up the track for horizontal scrolling
          gsap.set(track, {
            display: 'flex',
            width: 'max-content',
            x: 0,
          })

          // Calculate total width needed
          const cardWidth = cards[0].getBoundingClientRect().width
          const gap = 16
          const totalWidth = (cardWidth + gap) * cards.length

          // Duplicate cards for seamless loop
          const cloneCards = Array.from(cards).map((card) => card.cloneNode(true) as HTMLElement)
          cloneCards.forEach((clone) => track.appendChild(clone))

          // Create infinite scroll animation with proper loop
          marqueeTween.current = gsap.fromTo(
            track,
            { x: 0 },
            {
              x: -totalWidth,
              duration: 20,
              ease: 'none',
              repeat: -1,
              immediateRender: true,
            },
          )
        }

        // Wait for images to load
        const imgs = Array.from(
          marqueeRef.current?.querySelectorAll('img') || [],
        ) as HTMLImageElement[]
        const pending = imgs.filter((img) => !img.complete).length

        if (pending === 0) {
          requestAnimationFrame(() => requestAnimationFrame(createMarquee))
        } else {
          let remaining = pending
          const onLoad = () => {
            remaining -= 1
            if (remaining <= 0) requestAnimationFrame(() => requestAnimationFrame(createMarquee))
          }
          imgs.forEach((img) => img.addEventListener('load', onLoad, { once: true }))
        }

        // Animate content for mobile
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

        // Handle resize for marquee
        const handleResize = () => {
          if (window.innerWidth <= 768 && marqueeRef.current) {
            createMarquee()
          }
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }
    }, sectionRef)

    return () => {
      ctx.revert()
      marqueeTween.current?.kill()
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
