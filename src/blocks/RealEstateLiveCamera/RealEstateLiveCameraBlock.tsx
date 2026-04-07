'use client'

import React from 'react'
import { RealEstateLiveCameraView } from '@/components/real-estate-page'

type Media = { url?: string } | string | number | null

type Props = {
  blockType: 'real-estate-live-camera'
  heading: string
  subtitle?: string | null
  streamUrl?: string | null
  fallbackImage?: Media | null
  sectionId?: string | null
}

export const RealEstateLiveCameraBlock: React.FC<Props> = ({
  heading,
  subtitle,
  streamUrl,
  fallbackImage,
  sectionId,
}) => {
  const fallbackImageUrl =
    fallbackImage && typeof fallbackImage === 'object' && 'url' in fallbackImage
      ? fallbackImage.url
      : undefined

  return (
    <RealEstateLiveCameraView
      heading={heading}
      subtitle={subtitle ?? undefined}
      streamUrl={streamUrl ?? undefined}
      fallbackImageUrl={fallbackImageUrl}
      sectionId={sectionId ?? undefined}
    />
  )
}
