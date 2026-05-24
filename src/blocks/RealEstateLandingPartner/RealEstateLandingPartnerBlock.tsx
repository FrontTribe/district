'use client'

import React from 'react'
import { RealEstateLandingPartner } from '@/components/real-estate-landing/RealEstateLandingPartner'
import { resolveMediaUrl } from '@/blocks/real-estate-landing-media'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type Props = {
  blockType: 'real-estate-landing-partner'
  sectionId?: string | null
  image: unknown
  imageAlt?: string | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  paragraphs?: { text: string; id?: string }[] | null
  ctaLabel: string
  ctaHref: string
  ctaOpenInNewTab?: boolean | null
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  secondaryCtaOpenInNewTab?: boolean | null
  signatureBold: string
  signatureSub: string
}

export const RealEstateLandingPartnerBlock: React.FC<Props> = ({
  sectionId,
  image,
  imageAlt,
  eyebrow,
  headingParts,
  paragraphs,
  ctaLabel,
  ctaHref,
  ctaOpenInNewTab,
  secondaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaOpenInNewTab,
  signatureBold,
  signatureSub,
}) => {
  const imageUrl = resolveMediaUrl(image)
  if (!imageUrl) return null

  return (
    <RealEstateLandingPartner
      sectionId={sectionId ?? undefined}
      imageUrl={imageUrl}
      imageAlt={imageAlt ?? undefined}
      eyebrow={eyebrow}
      headingParts={(headingParts ?? []).map((p) => ({
        text: p.text,
        italic: p.italic ?? undefined,
        lineBreak: p.lineBreak ?? undefined,
      }))}
      paragraphs={(paragraphs ?? []).map((p) => p.text)}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      ctaOpenInNewTab={ctaOpenInNewTab ?? undefined}
      secondaryCtaLabel={secondaryCtaLabel}
      secondaryCtaHref={secondaryCtaHref}
      secondaryCtaOpenInNewTab={secondaryCtaOpenInNewTab ?? undefined}
      signatureBold={signatureBold}
      signatureSub={signatureSub}
    />
  )
}
