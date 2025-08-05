import { Block } from 'payload'
import React from 'react'

const Features: Block = {
  slug: 'features',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Features',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for this section (used for menu navigation)',
      },
    },
  ],
}

// React component to render the Features block
export const FeaturesBlock: React.FC<{
  features: Array<{
    title: string
    description: string
  }>
  heading?: string
  sectionId?: string
}> = ({ features, heading = 'Features', sectionId }) => {
  return (
    <section id={sectionId} className="features-block">
      <div className="features-content">
        <h2 className="features-heading">{heading}</h2>
        <div className="features-grid">
          {features?.map((feature, index) => (
            <div key={index} className="feature-item">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
