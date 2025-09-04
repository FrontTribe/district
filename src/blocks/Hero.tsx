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
      name: 'backgroundMedia',
      type: 'group',
      label: 'Background Media',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Media Type',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'image',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'video',
          },
        },
        {
          name: 'overlay',
          type: 'select',
          label: 'Overlay',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light', value: 'light' },
            { label: 'Medium', value: 'medium' },
            { label: 'Dark', value: 'dark' },
          ],
          defaultValue: 'none',
          admin: {
            condition: (data, siblingData) => siblingData?.type !== 'none',
          },
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

export const HeroBlock: React.FC<{
  heading: string
  subheading?: string
  sectionId?: string
  backgroundMedia?: {
    type: 'none' | 'image' | 'video'
    image?: string | any
    video?: string | any
    overlay?: 'none' | 'light' | 'medium' | 'dark'
  }
}> = ({ heading, subheading, sectionId, backgroundMedia }) => {
  const renderBackgroundMedia = () => {
    if (!backgroundMedia || backgroundMedia.type === 'none') {
      return null
    }

    if (backgroundMedia.type === 'image' && backgroundMedia.image) {
      const imageUrl =
        typeof backgroundMedia.image === 'string'
          ? backgroundMedia.image
          : backgroundMedia.image.url

      return (
        <div className="hero-background-image">
          <img
            src={imageUrl}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          />
        </div>
      )
    }

    if (backgroundMedia.type === 'video' && backgroundMedia.video) {
      const videoUrl =
        typeof backgroundMedia.video === 'string'
          ? backgroundMedia.video
          : backgroundMedia.video.url

      return (
        <div className="hero-background-video">
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )
    }

    return null
  }

  const sectionClasses = ['hero-block']
  if (backgroundMedia?.overlay && backgroundMedia.overlay !== 'none') {
    sectionClasses.push(`hero-overlay--${backgroundMedia.overlay}`)
  }

  return (
    <section id={sectionId} className={sectionClasses.join(' ')}>
      {renderBackgroundMedia()}
      <div className="hero-bottom-gradient" aria-hidden="true" />
      <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="hero-heading">{heading}</h1>
        {subheading && <p className="hero-subheading">{subheading}</p>}
      </div>
      <div className="hero-scroll-indicator" role="presentation">
        <span className="scroll-text">Scroll to explore</span>
        <span className="scroll-dot" />
      </div>
    </section>
  )
}

export default Hero
