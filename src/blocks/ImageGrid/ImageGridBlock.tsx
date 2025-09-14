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

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)

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
      const imageElements = q('.image-grid__img')
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Group images by position
  const imagesByPosition = images.reduce(
    (acc, image) => {
      acc[image.position] = image
      return acc
    },
    {} as Record<string, ImageItem>,
  )

  return (
    <section ref={sectionRef} id={sectionId} className="image-grid">
      <div className="image-grid__container">
        {/* Top Left Image (16:9) */}
        {imagesByPosition['top-left'] && (
          <div className="image-grid__image image-grid__image--top-left">
            <img
              src={imagesByPosition['top-left'].image.url}
              alt={imagesByPosition['top-left'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Top Right Image (9:16) */}
        {imagesByPosition['top-right'] && (
          <div className="image-grid__image image-grid__image--top-right">
            <img
              src={imagesByPosition['top-right'].image.url}
              alt={imagesByPosition['top-right'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Bottom Left Image (9:16) */}
        {imagesByPosition['bottom-left'] && (
          <div className="image-grid__image image-grid__image--bottom-left">
            <img
              src={imagesByPosition['bottom-left'].image.url}
              alt={imagesByPosition['bottom-left'].image.alt || ''}
              className="image-grid__img"
            />
          </div>
        )}

        {/* Bottom Right Image (16:9) */}
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
    </section>
  )
}
