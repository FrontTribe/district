'use client'

import React from 'react'

export default function RealEstateJob() {
  return (
    <section className="re-job">
      <div className="re-job__container">
        <div className="re-job__badge">KARIJERA</div>
        <h2 className="re-job__title">
          <span className="re-job__title-line">Tražiš posao?</span>
        </h2>
        <h3 className="re-job__subtitle">
          <span className="re-job__subtitle-line">Kod nas kao izvođač?</span>
        </h3>
        <p className="re-job__description">
          Tražimo strastvene profesionalce koji dijele našu viziju izvrsnosti u real estate
          projektiranju. Pridružite se našem timu izvođača i uključite se u transformaciju gradskog
          prostora kroz inovativne i kvalitetne projekte.
        </p>
        <div className="re-job__features">
          <div className="re-job__feature">
            <span className="re-job__feature-icon">✓</span>
            <span className="re-job__feature-text">Konkurentne plaće i beneficije</span>
          </div>
          <div className="re-job__feature">
            <span className="re-job__feature-icon">✓</span>
            <span className="re-job__feature-text">Profesionalni razvoj i edukacija</span>
          </div>
          <div className="re-job__feature">
            <span className="re-job__feature-icon">✓</span>
            <span className="re-job__feature-text">Raznolika portfelja projekata</span>
          </div>
        </div>
        <div className="re-job__cta">
          <a href="mailto:careers@district-realestate.com" className="re-job__button">
            <span className="re-job__button-text">KONTAKT NA MAIL</span>
            <span className="re-job__button-icon">→</span>
          </a>
          <p className="re-job__cta-note">Pošaljite nam svoj CV i motivacijsko pismo</p>
        </div>
      </div>
    </section>
  )
}
