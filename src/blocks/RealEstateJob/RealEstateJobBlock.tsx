'use client'

import React from 'react'

type Feature = {
  id?: string
  featureText: string
}

export const RealEstateJobBlock: React.FC<{
  badgeText?: string
  title: string
  subtitle: string
  description?: string
  features?: Feature[]
  email: string
  ctaNote?: string
  sectionId?: string
}> = ({ badgeText, title, subtitle, description, features = [], email, ctaNote, sectionId }) => {
  return (
    <section className="re-job" id={sectionId}>
      <div className="re-job__container">
        {badgeText && <div className="re-job__badge">{badgeText}</div>}
        <h2 className="re-job__title">
          <span className="re-job__title-line">{title}</span>
        </h2>
        <h3 className="re-job__subtitle">
          <span className="re-job__subtitle-line">{subtitle}</span>
        </h3>
        {description && <p className="re-job__description">{description}</p>}
        {features.length > 0 && (
          <div className="re-job__features">
            {features.map((feature, index) => (
              <div key={feature.id || index} className="re-job__feature">
                <span className="re-job__feature-icon">✓</span>
                <span className="re-job__feature-text">{feature.featureText}</span>
              </div>
            ))}
          </div>
        )}
        <div className="re-job__cta">
          <a href={`mailto:${email}`} className="re-job__button">
            <span className="re-job__button-text">KONTAKT NA MAIL</span>
            <span className="re-job__button-icon">→</span>
          </a>
          {ctaNote && <p className="re-job__cta-note">{ctaNote}</p>}
        </div>
      </div>
    </section>
  )
}
