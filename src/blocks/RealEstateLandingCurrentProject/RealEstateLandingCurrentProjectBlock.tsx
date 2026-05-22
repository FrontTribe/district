'use client'

import React from 'react'
import { RealEstateLandingCurrentProject } from '@/components/real-estate-landing/RealEstateLandingCurrentProject'
import { resolveMediaUrl } from '@/blocks/real-estate-landing-media'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type Props = {
  blockType: 'real-estate-landing-current-project'
  sectionId?: string | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  bigNumber: string
  projectMeta: string
  projectNameHtml: string
  description: string
  image: unknown
  imageAlt?: string | null
  ctaLabel: string
  ctaHref: string
  ctaOpenInNewTab?: boolean | null
  stats?: { label: string; value: string; id?: string }[] | null
}

export const RealEstateLandingCurrentProjectBlock: React.FC<Props> = (props) => {
  const imageUrl = resolveMediaUrl(props.image)
  if (!imageUrl) return null

  return (
    <RealEstateLandingCurrentProject
      sectionId={props.sectionId ?? undefined}
      eyebrow={props.eyebrow}
      headingParts={(props.headingParts ?? []).map((p) => ({
        text: p.text,
        italic: p.italic ?? undefined,
      }))}
      bigNumber={props.bigNumber}
      projectMeta={props.projectMeta}
      projectNameHtml={props.projectNameHtml}
      description={props.description}
      imageUrl={imageUrl}
      imageAlt={props.imageAlt ?? undefined}
      ctaLabel={props.ctaLabel}
      ctaHref={props.ctaHref}
      ctaOpenInNewTab={props.ctaOpenInNewTab ?? undefined}
      stats={(props.stats ?? []).map((s) => ({ label: s.label, value: s.value }))}
    />
  )
}
