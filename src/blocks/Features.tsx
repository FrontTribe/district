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
      label: 'Features List',
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
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
