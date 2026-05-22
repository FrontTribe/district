'use client'

import React from 'react'
import { RealEstateLandingHero } from '@/components/real-estate-landing/RealEstateLandingHero'
import { resolveMediaUrl } from '@/blocks/real-estate-landing-media'

type Media = { url?: string | null } | number | null | undefined

type Props = {
  blockType: 'real-estate-landing-hero'
  heroSectionId?: string | null
  layout?: 'default' | 'split' | 'centered' | null
  topLeftLines?: { line: string; id?: string }[] | null
  topRightLines?: { line: string; id?: string }[] | null
  eyebrow: string
  titleLine1: string
  titleLine2Html?: string | null
  heroImage: Media
  imageAlt?: string | null
  mediaCaption?: string | null
  lead: string
  showScrollCue?: boolean | null
  scrollCueLabel?: string | null
  metaRows?: { label: string; value: string; id?: string }[] | null
}

export const RealEstateLandingHeroBlock: React.FC<Props> = ({
  heroSectionId,
  layout,
  topLeftLines,
  topRightLines,
  eyebrow,
  titleLine1,
  titleLine2Html,
  heroImage,
  imageAlt,
  mediaCaption,
  lead,
  showScrollCue,
  scrollCueLabel,
  metaRows,
}) => {
  const mediaUrl = resolveMediaUrl(heroImage)
  if (!mediaUrl) return null

  return (
    <RealEstateLandingHero
      heroSectionId={heroSectionId ?? undefined}
      layout={(layout ?? 'default') as 'default' | 'split' | 'centered'}
      topLeftLines={(topLeftLines ?? []).map((r) => r.line)}
      topRightLines={(topRightLines ?? []).map((r) => r.line)}
      eyebrow={eyebrow}
      titleLine1={titleLine1}
      titleLine2Html={titleLine2Html ?? ''}
      mediaUrl={mediaUrl}
      mediaAlt={imageAlt ?? ''}
      mediaCaption={mediaCaption ?? ''}
      lead={lead}
      showScrollCue={showScrollCue !== false}
      scrollCueLabel={scrollCueLabel ?? undefined}
      metaRows={(metaRows ?? []).map((r) => ({ label: r.label, value: r.value }))}
    />
  )
}
