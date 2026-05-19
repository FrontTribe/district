import { Block } from 'payload'
import React from 'react'
import HeroAnimated from '@/blocks/HeroAnimated'
import { BoutiqueHeroContent } from '@/blocks/BoutiqueHeroContent'
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'

function boutiqueFilmGradient(overlay?: string | null): string {
  switch (overlay) {
    case 'light':
      return 'linear-gradient(180deg, rgba(244,239,231,0.28) 0%, rgba(26,23,20,0.18) 42%, rgba(26,23,20,0.55) 100%)'
    case 'medium':
      return 'linear-gradient(180deg, rgba(26,23,20,0.4) 0%, rgba(26,23,20,0.22) 38%, rgba(26,23,20,0.72) 100%)'
    case 'dark':
      return 'linear-gradient(180deg, rgba(26,23,20,0.7) 0%, rgba(26,23,20,0.48) 38%, rgba(26,23,20,0.9) 100%)'
    default:
      return 'linear-gradient(180deg, rgba(26,23,20,0.45) 0%, rgba(26,23,20,0.15) 35%, rgba(26,23,20,0.65) 100%)'
  }
}

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
      admin: {
        description: {
          en: 'Boutique hero: optional eyebrow, then a line with only ---, then body text. Heading: word *Boutique* is auto-accented; use *like this* for other italics.',
          hr: 'Boutique hero: eyebrow, zatim ---, zatim tekst. Naslov: riječ Boutique automatski dobije akcent; ostalo kurziv s *ovako*.',
        },
      },
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
  subheading?: string | null
  sectionId?: string
  locale?: string
  backgroundMedia?: {
    type: 'none' | 'image' | 'video'
    image?: string | any
    video?: string | any
    overlay?: 'none' | 'light' | 'medium' | 'dark'
  }
  tenantVisualTheme?: TenantVisualTheme
}> = ({
  heading,
  subheading,
  sectionId,
  backgroundMedia,
  locale,
  tenantVisualTheme = 'default',
}) => {
  const isBoutique = tenantVisualTheme === 'boutique'

  const renderBoutiqueBackground = () => {
    const filmStyle: React.CSSProperties = {
      backgroundImage: boutiqueFilmGradient(backgroundMedia?.overlay),
    }

    if (!backgroundMedia || backgroundMedia.type === 'none') {
      return (
        <div className="boutique-hero__media">
          <div className="boutique-hero__media-fill boutique-hero__media-fill--placeholder" />
          <div className="boutique-hero__media-film" style={filmStyle} />
        </div>
      )
    }

    if (backgroundMedia.type === 'image' && backgroundMedia.image) {
      const imageUrl =
        typeof backgroundMedia.image === 'string'
          ? backgroundMedia.image
          : backgroundMedia.image.url

      return (
        <div className="boutique-hero__media">
          <img className="boutique-hero__media-img" src={imageUrl} alt="" />
          <div className="boutique-hero__media-film" style={filmStyle} />
        </div>
      )
    }

    if (backgroundMedia.type === 'video' && backgroundMedia.video) {
      const videoUrl =
        typeof backgroundMedia.video === 'string'
          ? backgroundMedia.video
          : backgroundMedia.video.url

      return (
        <div className="boutique-hero__media">
          <video className="boutique-hero__media-video" autoPlay muted loop playsInline>
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="boutique-hero__media-film" style={filmStyle} />
        </div>
      )
    }

    return null
  }

  if (isBoutique) {
    return (
      <section id={sectionId || undefined} className="boutique-hero">
        {renderBoutiqueBackground()}
        <BoutiqueHeroContent heading={heading} subheading={subheading} locale={locale} />
      </section>
    )
  }

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
      <HeroAnimated heading={heading} subheading={subheading ?? undefined} locale={locale} />
    </section>
  )
}

export default Hero
