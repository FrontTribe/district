'use client'

import React from 'react'

export default function RealEstateHero() {
  return (
    <section className="re-hero">
      <div className="re-hero__background">
        <div className="re-hero__background-placeholder">
          <span>Building Image/Video</span>
        </div>
        <div className="re-hero__overlay"></div>
      </div>
      <div className="re-hero__content">
        <h1 className="re-hero__title">
          <span className="re-hero__title-line">DISTRICT</span>
          <span className="re-hero__title-line">REAL ESTATE</span>
        </h1>
        <p className="re-hero__subtitle">Modern living spaces designed for comfort and luxury</p>
      </div>
      <div className="re-hero__scroll-indicator">
        <span className="re-hero__scroll-text">Scroll to explore</span>
        <span className="re-hero__scroll-dot"></span>
      </div>
    </section>
  )
}
