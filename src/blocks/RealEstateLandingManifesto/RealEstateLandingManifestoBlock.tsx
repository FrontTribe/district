'use client'

import React from 'react'
import {
  RealEstateLandingManifesto,
  type ManifestoRow,
  type ManifestoSegment,
} from '@/components/real-estate-landing/RealEstateLandingManifesto'

type Props = {
  blockType: 'real-estate-landing-manifesto'
  sectionId?: string | null
  labelLeft: string
  labelNum: string
  topIntroHtml?: string | null
  footnoteHtml?: string | null
  rows?: { segments?: { text: string; style?: 'plain' | 'mute' | 'accent' | null; id?: string }[] | null; id?: string }[] | null
}

export const RealEstateLandingManifestoBlock: React.FC<Props> = ({
  sectionId,
  labelLeft,
  labelNum,
  topIntroHtml,
  footnoteHtml,
  rows,
}) => {
  const normalized: ManifestoRow[] = (rows ?? []).map((row) => ({
    segments: (row.segments ?? []).map(
      (s): ManifestoSegment => ({
        text: s.text,
        style: (s.style ?? 'plain') as ManifestoSegment['style'],
      }),
    ),
  }))

  return (
    <RealEstateLandingManifesto
      sectionId={sectionId ?? undefined}
      labelLeft={labelLeft}
      labelNum={labelNum}
      topIntroHtml={topIntroHtml}
      footnoteHtml={footnoteHtml}
      rows={normalized}
    />
  )
}
