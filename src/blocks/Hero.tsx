import { Block } from 'payload'
import React from 'react'

const Hero: Block = {
  slug: 'hero',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
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

export const HeroBlock: React.FC<{
  heading: string
  subheading?: string
  sectionId?: string
}> = ({ heading, subheading, sectionId }) => {
  return (
    <section id={sectionId} className="hero-block">
      <div className="hero-content">
        <h1 className="hero-heading">{heading}</h1>
        {subheading && <p className="hero-subheading">{subheading}</p>}
      </div>
    </section>
  )
}

export default Hero
