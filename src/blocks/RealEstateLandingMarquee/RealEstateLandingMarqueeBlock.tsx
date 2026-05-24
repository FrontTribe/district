'use client'

import React from 'react'
import { RealEstateLandingMarquee } from '@/components/real-estate-landing/RealEstateLandingMarquee'

type Props = {
  blockType: 'real-estate-landing-marquee'
  durationSeconds?: number | null
  separator?: string | null
  ariaLabel?: string | null
  items?: { text: string; italic?: boolean | null; id?: string }[] | null
}

export const RealEstateLandingMarqueeBlock: React.FC<Props> = ({ durationSeconds, separator, ariaLabel, items }) => (
  <RealEstateLandingMarquee
    durationSeconds={durationSeconds ?? undefined}
    separator={separator ?? undefined}
    ariaLabel={ariaLabel ?? undefined}
    items={(items ?? []).map((it) => ({
      text: it.text,
      italic: it.italic ?? undefined,
    }))}
  />
)
