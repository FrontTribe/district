'use client'

import React from 'react'
import { getOptimizedImageUrl } from '@/utils/getOptimizedImageUrl'
import { renderBoutiqueHeroHeading } from '@/blocks/BoutiqueHeroContent'

type Feature = {
  romanNumeral?: string | null
  tag?: string | null
  title: string
  description?: string | null
  media?: unknown
  reverseLayout?: boolean | null
}

export const RooftopFeaturesBlock: React.FC<{
  heading?: string | null
  features: Feature[]
  sectionId?: string
}> = ({ heading, features = [], sectionId }) => {
  return (
    <section
      className="rooftop rooftop--features"
      aria-label={heading || 'Rooftop features'}
      {...(sectionId ? { id: sectionId } : {})}
    >
      {heading ? <h3 className="sr-only">{heading}</h3> : null}
      <div className="rooftop-features">
      {features.map((f, i) => {
        const src = getOptimizedImageUrl(f.media, { widthHint: 900 })
        const reverse = f.reverseLayout ?? i % 2 === 1
        return (
          <article key={f.title} className={`rooftop-feature${reverse ? ' reverse' : ''}`}>
            <div className="curtain rooftop-feat-image" data-reveal="curtain">
              {src ? <div className="curtain-inner" style={{ backgroundImage: `url(${src})` }} /> : null}
              {f.tag ? <span className="rooftop-feat-tag">{f.tag}</span> : null}
            </div>
            <div className="rooftop-feat-copy">
              {f.romanNumeral ? <span className="rooftop-feat-num">{f.romanNumeral}</span> : null}
              <h3 data-reveal="lines">{renderBoutiqueHeroHeading(f.title)}</h3>
              {f.description ? (
                <p data-reveal="fade-up" data-delay="0.1">
                  {f.description}
                </p>
              ) : null}
            </div>
          </article>
        )
        })}
      </div>
    </section>
  )
}

export default RooftopFeaturesBlock
