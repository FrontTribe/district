'use client'

import React from 'react'
import { RealEstateLookingForJob } from '@/components/real-estate-page'

type Props = {
  blockType: 'real-estate-looking-for-job'
  badge?: string | null
  heading: string
  subtitle?: string | null
  description: string
  features?: Array<{ text?: string | null }> | null
  buttonText: string
  buttonUrl: string
  ctaNote?: string | null
  sectionId?: string | null
}

export const RealEstateLookingForJobBlock: React.FC<Props> = ({
  badge,
  heading,
  subtitle,
  description,
  features,
  buttonText,
  buttonUrl,
  ctaNote,
  sectionId,
}) => (
  <RealEstateLookingForJob
    badge={badge ?? undefined}
    heading={heading}
    subtitle={subtitle ?? undefined}
    description={description}
    features={(features ?? []).map((f) => f.text ?? '').filter(Boolean)}
    buttonText={buttonText}
    buttonUrl={buttonUrl}
    ctaNote={ctaNote ?? undefined}
    sectionId={sectionId ?? undefined}
  />
)
