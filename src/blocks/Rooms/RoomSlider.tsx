'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { getOptimizedImageUrl } from '@/utils/getOptimizedImageUrl'

type RoomImage = {
  image: any
  alt?: string
}

type Props = {
  images: RoomImage[]
  roomTitle: string
  badges?: Array<{ text?: string }>
}

export const RoomSlider: React.FC<Props> = ({ images, roomTitle, badges }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])

  const getUrl = (m: any) => getOptimizedImageUrl(m, { widthHint: 1200, aspect: 'portrait34' })

  const nextSlide = () => {
    if (isAnimating || images.length <= 1) return
    setIsAnimating(true)
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
  }

  const prevSlide = () => {
    if (isAnimating || images.length <= 1) return
    setIsAnimating(true)
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
  }

  // Animate image transitions
  useEffect(() => {
    if (imageRefs.current[currentIndex]) {
      const currentImg = imageRefs.current[currentIndex]
      if (currentImg) {
        gsap.fromTo(
          currentImg,
          { opacity: 0, scale: 1.1 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => setIsAnimating(false),
          },
        )
      }
    }
  }, [currentIndex])

  // Initialize first image
  useEffect(() => {
    if (imageRefs.current[0]) {
      gsap.set(imageRefs.current[0], { opacity: 1, scale: 1 })
    }
  }, [])

  // Safety check for empty images
  if (!images || images.length === 0) {
    return (
      <div className="room-slider room-slider-empty">
        <div className="room-slider-placeholder">No images available</div>
      </div>
    )
  }

  return (
    <div className="room-slider" ref={sliderRef}>
      <div className="room-slider-container">
        {images.map((roomImage, index) => (
          <div key={index} className={`room-slide ${index === currentIndex ? 'active' : ''}`}>
            <img
              ref={(el) => {
                imageRefs.current[index] = el
              }}
              src={getUrl(roomImage.image)}
              alt={roomImage.alt || roomTitle}
              className="room-slide-image"
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="room-slider-nav room-slider-prev"
              onClick={prevSlide}
              disabled={isAnimating}
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="room-slider-nav room-slider-next"
              onClick={nextSlide}
              disabled={isAnimating}
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="room-slider-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`room-slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentIndex(index)
                  }
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badges overlay */}
        {badges && badges.length > 0 && (
          <div className="room-badges">
            {badges.map((badge, i) => (
              <span key={i} className="room-badge">
                {badge.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
