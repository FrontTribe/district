import React from 'react'

type Feature = {
  icon?: string
  title: string
  description?: string
}

export const RooftopFeaturesBlock: React.FC<{
  heading: string
  features: Feature[]
  sectionId?: string
}> = ({ heading, features = [], sectionId }) => {
  return (
    <section id={sectionId} className="rooftop-features-block">
      <div className="rooftop-features__inner">
        <h3 className="rooftop-features__heading">{heading}</h3>

        <div className="rooftop-features__grid">
          {features.map((f, i) => (
            <div className="rf-item" key={i}>
              {f.icon && (
                <div className="rf-icon" aria-hidden>
                  {f.icon}
                </div>
              )}
              <h4 className="rf-title">{f.title}</h4>
              {f.description && <p className="rf-desc">{f.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RooftopFeaturesBlock
