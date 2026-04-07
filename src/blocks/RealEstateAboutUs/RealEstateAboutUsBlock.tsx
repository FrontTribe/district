'use client'

import React from 'react'
import { RealEstateAboutUs } from '@/components/real-estate-page'

type Props = {
  blockType: 'real-estate-about-us'
  eyebrow?: string | null
  heading: string
  body: string
  sectionId?: string | null
}

export const RealEstateAboutUsBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  body,
  sectionId,
}) => (
  <RealEstateAboutUs
    eyebrow={eyebrow ?? undefined}
    heading={heading}
    body={body}
    sectionId={sectionId ?? undefined}
  />
)
