'use client'

import React from 'react'
import {
  RealEstateLandingPageFooter,
  type FooterColumn,
  type FooterLine,
} from '@/components/real-estate-landing/RealEstateLandingPageFooter'

type Props = {
  blockType: 'real-estate-landing-page-footer'
  columns?:
    | {
        label: string
        lines?: FooterLine[] | null
        id?: string | null
      }[]
    | null
  brandText: string
  copyrightLine: string
  addressLine: string
}

function mapColumns(columns: Props['columns']): FooterColumn[] {
  return (columns ?? [])
    .map((col) => ({
      label: col.label,
      lines: (col.lines ?? []).map((line) => ({
        text: line.text,
        linkType: line.linkType ?? 'none',
        href: line.href ?? null,
        openInNewTab: line.openInNewTab ?? false,
      })),
    }))
    .filter((col) => col.lines.length > 0)
}

export const RealEstateLandingFooterBlock: React.FC<Props> = ({
  columns,
  brandText,
  copyrightLine,
  addressLine,
}) => (
  <RealEstateLandingPageFooter
    columns={mapColumns(columns)}
    brandText={brandText}
    copyrightLine={copyrightLine}
    addressLine={addressLine}
  />
)
