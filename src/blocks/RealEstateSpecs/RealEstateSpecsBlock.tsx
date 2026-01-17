'use client'

import React from 'react'

type SpecItem = {
  id?: string
  label: string
  value: string
}

type FeatureItem = {
  id?: string
  text: string
}

export const RealEstateSpecsBlock: React.FC<{
  headingLine1: string
  headingLine2: string
  descriptionParagraph1?: string
  descriptionParagraph2?: string
  specItems?: SpecItem[]
  featureList?: FeatureItem[]
  sectionId?: string
}> = ({
  headingLine1,
  headingLine2,
  descriptionParagraph1,
  descriptionParagraph2,
  specItems = [],
  featureList = [],
  sectionId,
}) => {
  return (
    <section className="re-specs" id={sectionId}>
      <div className="re-specs__container">
        <div className="re-specs__header">
          <div className="re-specs__eyebrow">SPECIFIKACIJE</div>
          <h2 className="re-specs__heading">
            <span className="re-specs__heading-line">{headingLine1}</span>
            <span className="re-specs__heading-line">{headingLine2}</span>
          </h2>
        </div>
        <div className="re-specs__grid">
          <div className="re-specs__left">
            <h3 className="re-specs__subheading">Opis</h3>
            {descriptionParagraph1 && <p className="re-specs__text">{descriptionParagraph1}</p>}
            {descriptionParagraph2 && <p className="re-specs__text">{descriptionParagraph2}</p>}
            {featureList.length > 0 && (
              <ul className="re-specs__list">
                {featureList.map((feature, index) => (
                  <li key={feature.id || index}>{feature.text}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="re-specs__right">
            <h3 className="re-specs__subheading">Specifikacija</h3>
            {specItems.length > 0 && (
              <div className="re-specs__table">
                {specItems.map((item, index) => (
                  <div key={item.id || index} className="re-specs__table-row">
                    <div className="re-specs__table-label">{item.label}</div>
                    <div className="re-specs__table-value">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
