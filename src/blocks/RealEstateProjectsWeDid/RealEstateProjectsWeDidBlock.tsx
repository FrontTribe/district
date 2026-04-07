'use client'

import React from 'react'
import { RealEstateProjectsWeDid } from '@/components/real-estate-page'
import type { ProjectItem } from '@/components/real-estate-page'

type Media = { url?: string } | string | number | null
type ProjectRow = {
  title: string
  description?: string | null
  image?: Media | null
  location?: string | null
  year?: string | null
  galleryImages?: Array<{ image?: Media | null }> | null
}

function getUrl(m: Media | undefined | null): string | undefined {
  if (!m || typeof m !== 'object' || !('url' in m)) return undefined
  return m.url
}

type Props = {
  blockType: 'real-estate-projects-we-did'
  eyebrow?: string | null
  heading: string
  subtitle?: string | null
  projects: ProjectRow[]
  sectionId?: string | null
}

export const RealEstateProjectsWeDidBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subtitle,
  projects,
  sectionId,
}) => {
  const items: ProjectItem[] = (projects ?? []).map((p) => ({
    title: p.title,
    description: p.description ?? undefined,
    imageUrl: getUrl(p.image),
    location: p.location ?? undefined,
    year: p.year ?? undefined,
    galleryImages: (p.galleryImages ?? [])
      .map((g) => getUrl(g.image))
      .filter((url): url is string => !!url),
  }))

  return (
    <RealEstateProjectsWeDid
      eyebrow={eyebrow ?? undefined}
      heading={heading}
      subtitle={subtitle ?? undefined}
      projects={items}
      sectionId={sectionId ?? undefined}
    />
  )
}
