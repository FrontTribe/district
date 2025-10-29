'use client'

import React from 'react'

export const RealEstateAboutBlock: React.FC<{
  headingLine1: string
  headingLine2: string
  headingLine3: string
  paragraph1?: string
  paragraph2?: string
  sectionId?: string
}> = ({ headingLine1, headingLine2, headingLine3, paragraph1, paragraph2, sectionId }) => {
  return (
    <section className="re-about" id={sectionId}>
      <div className="re-about__container">
        <div className="re-about__grid">
          <div className="re-about__left">
            <div className="re-about__eyebrow">O NAMA</div>
            <h2 className="re-about__heading">
              <span className="re-about__heading-line">{headingLine1}</span>
              <span className="re-about__heading-line">{headingLine2}</span>
              <span className="re-about__heading-line">{headingLine3}</span>
            </h2>
          </div>
          <div className="re-about__right">
            {paragraph1 && <p className="re-about__text">{paragraph1}</p>}
            {paragraph2 && <p className="re-about__text">{paragraph2}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
