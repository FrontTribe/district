// blocks/Hero.tsx
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
  ],
}

// React component to render the Hero block
export const HeroBlock: React.FC<{
  heading: string
  subheading?: string
}> = ({ heading, subheading }) => {
  return (
    <section className="hero-block">
      <div className="hero-content">
        <h1 className="hero-heading">{heading}</h1>
        {subheading && <p className="hero-subheading">{subheading}</p>}
      </div>
    </section>
  )
}

export default Hero
