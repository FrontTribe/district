'use client'

import React from 'react'
import { RealEstateLandingTypology, type TipItem } from '@/components/real-estate-landing/RealEstateLandingTypology'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type ItemRow = {
  unitCode?: string | null
  /** @deprecated Payload field was renamed to `unitCode`; kept for older documents */
  id?: string | null
  name: string
  size: string
  description: string
  count: number
  highlight?: boolean | null
}

type Props = {
  blockType: 'real-estate-landing-typology'
  sectionId?: string | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  intro: string
  outroHtml?: string | null
  items?: ItemRow[] | null
  countSuffixWord?: string | null
}

export const RealEstateLandingTypologyBlock: React.FC<Props> = ({
  sectionId,
  eyebrow,
  headingParts,
  intro,
  outroHtml,
  items,
  countSuffixWord,
}) => (
  <RealEstateLandingTypology
    sectionId={sectionId ?? undefined}
    eyebrow={eyebrow}
    headingParts={(headingParts ?? []).map((p) => ({
      text: p.text,
      italic: p.italic ?? undefined,
    }))}
    intro={intro}
    outroHtml={outroHtml}
    countSuffixWord={countSuffixWord ?? undefined}
    items={(items ?? []).map(
      (it): TipItem => ({
        unitCode: (it.unitCode ?? it.id) as string,
        name: it.name,
        size: it.size,
        description: it.description,
        count: it.count,
        highlight: it.highlight ?? undefined,
      }),
    )}
  />
)
