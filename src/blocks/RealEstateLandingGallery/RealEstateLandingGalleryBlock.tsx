'use client'

import React from 'react'
import { RealEstateLandingGallery, type GalSlide } from '@/components/real-estate-landing/RealEstateLandingGallery'
import { resolveMediaUrl } from '@/blocks/real-estate-landing-media'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }
type SlideRow = {
  image: unknown
  slideImageAlt?: string | null
  name: string
  location: string
  credit?: string | null
  linkUrl?: string | null
  linkOpenInNewTab?: boolean | null
  id?: string
}

type Props = {
  blockType: 'real-estate-landing-gallery'
  sectionId?: string | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  intro: string
  introHtml?: string | null
  slides?: SlideRow[] | null
}

export const RealEstateLandingGalleryBlock: React.FC<Props> = ({
  sectionId,
  eyebrow,
  headingParts,
  intro,
  introHtml,
  slides,
}) => {
  const galSlides: GalSlide[] = (slides ?? [])
    .map((s) => {
      const imageUrl = resolveMediaUrl(s.image)
      if (!imageUrl) return null
      return {
        imageUrl,
        name: s.name,
        location: s.location,
        imageAlt: s.slideImageAlt ?? undefined,
        credit: s.credit ?? undefined,
        linkUrl: s.linkUrl ?? undefined,
        linkOpenInNewTab: s.linkOpenInNewTab ?? undefined,
      }
    })
    .filter(Boolean) as GalSlide[]

  if (!galSlides.length) return null

  return (
    <RealEstateLandingGallery
      sectionId={sectionId ?? undefined}
      eyebrow={eyebrow}
      headingParts={(headingParts ?? []).map((p) => ({
        text: p.text,
        italic: p.italic ?? undefined,
      }))}
      intro={intro}
      introHtml={introHtml}
      slides={galSlides}
    />
  )
}
