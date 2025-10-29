'use client'

import React from 'react'

export const RealEstateHeroBlock: React.FC<{
  title: string
  titleLine2: string
  subtitle?: string
  backgroundMedia?: {
    type: 'none' | 'image' | 'video'
    image?: string | any
    video?: string | any
  }
  sectionId?: string
}> = ({ title, titleLine2, subtitle, backgroundMedia, sectionId }) => {
  const renderBackgroundMedia = () => {
    if (!backgroundMedia || backgroundMedia.type === 'none') {
      return (
        <div className="re-hero__background-placeholder">
          <span>Building Image/Video</span>
        </div>
      )
    }

    if (backgroundMedia.type === 'image' && backgroundMedia.image) {
      const imageUrl =
        typeof backgroundMedia.image === 'string'
          ? backgroundMedia.image
          : backgroundMedia.image.url

      return <img src={imageUrl} alt="" className="re-hero__background-image" />
    }

    if (backgroundMedia.type === 'video' && backgroundMedia.video) {
      const videoUrl =
        typeof backgroundMedia.video === 'string'
          ? backgroundMedia.video
          : backgroundMedia.video.url

      return (
        <video autoPlay muted loop playsInline className="re-hero__background-video">
          <source src={videoUrl} type="video/mp4" />
        </video>
      )
    }

    return null
  }

  return (
    <section id={sectionId} className="re-hero">
      <div className="re-hero__background">
        {renderBackgroundMedia()}
        <div className="re-hero__overlay"></div>
      </div>
      <div className="re-hero__content">
        <h1 className="re-hero__title">
          <span className="re-hero__title-line">{title}</span>
          <span className="re-hero__title-line">{titleLine2}</span>
        </h1>
        {subtitle && <p className="re-hero__subtitle">{subtitle}</p>}
      </div>
      <div className="re-hero__scroll-indicator">
        <span className="re-hero__scroll-text">Scroll to explore</span>
        <span className="re-hero__scroll-dot"></span>
      </div>
    </section>
  )
}
