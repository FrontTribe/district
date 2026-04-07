'use client'

import React from 'react'
import { RealEstateHero } from '@/components/real-estate-page'

type Media = { url?: string } | string | number | null

type Props = {
  blockType: 'real-estate-hero'
  heading: string
  subheading?: string | null
  backgroundImage?: Media | null
  sectionId?: string | null
}

export const RealEstateHeroBlock: React.FC<Props> = ({
  heading,
  subheading,
  backgroundImage,
  sectionId,
}) => {
  const backgroundImageUrl =
    backgroundImage && typeof backgroundImage === 'object' && 'url' in backgroundImage
      ? backgroundImage.url
      : undefined

  return (
    <RealEstateHero
      heading={heading}
      subheading={subheading ?? undefined}
      backgroundImageUrl={backgroundImageUrl}
      sectionId={sectionId ?? undefined}
    />
  )
}
