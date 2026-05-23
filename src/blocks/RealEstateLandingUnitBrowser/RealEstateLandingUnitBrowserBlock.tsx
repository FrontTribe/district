'use client'

import React from 'react'
import { RealEstateLandingUnitBrowser } from '@/components/real-estate-landing/RealEstateLandingUnitBrowser'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type Props = {
  blockType: 'real-estate-landing-unit-browser'
  sectionId?: string | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  introHtml: string
  legendHtml?: string | null
  detailPanelNoteHtml?: string | null
  building: unknown
  pdfMetaLine?: string | null
  browserCopy?: Record<string, string | null | undefined> | null
  pdfModalCopy?: Record<string, string | null | undefined> | null
}

export const RealEstateLandingUnitBrowserBlock: React.FC<Props & { locale?: string | null }> = ({
  sectionId,
  eyebrow,
  headingParts,
  introHtml,
  legendHtml,
  detailPanelNoteHtml,
  building,
  pdfMetaLine,
  browserCopy,
  pdfModalCopy,
  locale,
}) => (
  <RealEstateLandingUnitBrowser
    sectionId={sectionId ?? undefined}
    eyebrow={eyebrow}
    headingParts={(headingParts ?? []).map((p) => ({
      text: p.text,
      italic: p.italic ?? undefined,
    }))}
    introHtml={introHtml}
    legendHtml={legendHtml}
    detailPanelNoteHtml={detailPanelNoteHtml}
    building={building as never}
    pdfMetaLine={pdfMetaLine}
    browserCopy={browserCopy as never}
    pdfModalCopy={pdfModalCopy as never}
    locale={locale ?? undefined}
  />
)
