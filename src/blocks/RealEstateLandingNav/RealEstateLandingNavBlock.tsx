'use client'

import React from 'react'
import { RealEstateLandingNav } from '@/components/real-estate-landing/RealEstateLandingNav'

type Props = {
  blockType: 'real-estate-landing-nav'
  brandHtml?: string | null
  brandAriaLabel?: string | null
  langLine?: string | null
  showLangLine?: boolean | null
  links?: { label: string; href: string; openInNewTab?: boolean | null; id?: string }[] | null
  ctaLabel?: string | null
  ctaHref?: string | null
  ctaOpenInNewTab?: boolean | null
  locale?: string | null
}

export const RealEstateLandingNavBlock: React.FC<Props> = ({
  brandHtml,
  brandAriaLabel,
  langLine,
  showLangLine,
  links,
  ctaLabel,
  ctaHref,
  ctaOpenInNewTab,
  locale,
}) => (
  <RealEstateLandingNav
    brandHtml={brandHtml ?? undefined}
    brandAriaLabel={brandAriaLabel ?? undefined}
    langLine={langLine ?? undefined}
    showLangLine={showLangLine !== false}
    links={(links ?? []).map((l) => ({
      label: l.label,
      href: l.href,
      openInNewTab: l.openInNewTab ?? undefined,
    }))}
    ctaLabel={ctaLabel ?? undefined}
    ctaHref={ctaHref ?? undefined}
    ctaOpenInNewTab={ctaOpenInNewTab ?? false}
    locale={locale ?? undefined}
  />
)
