'use client'

import React from 'react'
import {
  RealEstateLandingPastProjects,
  type PastProjectRow,
} from '@/components/real-estate-landing/RealEstateLandingPastProjects'
import { resolveMediaUrl } from '@/blocks/real-estate-landing-media'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type GalleryRow = {
  image: unknown
  caption?: string | null
  alt?: string | null
  credit?: string | null
  id?: string
}
type ProjectRow = {
  name: string
  subtitle?: string | null
  location: string
  year: string
  statusLabel: string
  statusActive?: boolean | null
  summaryHtml?: string | null
  externalUrl?: string | null
  externalOpenInNewTab?: boolean | null
  previewImage?: unknown
  previewImageAlt?: string | null
  gallery?: GalleryRow[] | null
  id?: string
}

type Props = {
  blockType: 'real-estate-landing-past-projects'
  sectionId?: string | null
  layout?: 'rows' | 'grid' | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  introHtml: string
  projects?: ProjectRow[] | null
}

export const RealEstateLandingPastProjectsBlock: React.FC<Props> = ({
  sectionId,
  layout,
  eyebrow,
  headingParts,
  introHtml,
  projects,
}) => {
  const normalized: PastProjectRow[] = (projects ?? []).map((p) => ({
    name: p.name,
    subtitle: p.subtitle ?? undefined,
    location: p.location,
    year: p.year,
    statusLabel: p.statusLabel,
    statusActive: p.statusActive ?? false,
    summaryHtml: p.summaryHtml ?? undefined,
    previewImageUrl: resolveMediaUrl(p.previewImage) ?? null,
    previewImageAlt: p.previewImageAlt ?? undefined,
    externalUrl: p.externalUrl ?? undefined,
    externalOpenInNewTab: p.externalOpenInNewTab ?? undefined,
    gallery: (p.gallery ?? [])
      .map((g) => {
        const url = resolveMediaUrl(g.image)
        if (!url) return null
        return {
          url,
          alt: g.alt ?? undefined,
          caption: g.caption ?? undefined,
          credit: g.credit ?? undefined,
        }
      })
      .filter(Boolean) as PastProjectRow['gallery'],
  }))

  return (
    <RealEstateLandingPastProjects
      sectionId={sectionId ?? undefined}
      layout={(layout === 'grid' ? 'grid' : 'rows') as 'rows' | 'grid'}
      eyebrow={eyebrow}
      headingParts={(headingParts ?? []).map((hp) => ({
        text: hp.text,
        italic: hp.italic ?? undefined,
      }))}
      introHtml={introHtml}
      projects={normalized}
    />
  )
}
