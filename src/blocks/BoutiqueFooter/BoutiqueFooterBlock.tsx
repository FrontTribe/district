'use client'

import React from 'react'
import { BoutiqueLandingFooter } from '@/components/boutique-landing/BoutiqueLandingFooter'

type Props = {
  blockType: 'boutique-footer'
  timeLabel?: string | null
  signoffEyebrow?: string | null
  signoffHeading?: string | null
  coordinatesLat?: string | null
  coordinatesLng?: string | null
  addressHeading?: string | null
  addressHtml?: string | null
  addressMapUrl?: string | null
  infoRows?: { label: string; value: string }[] | null
  contactHeading?: string | null
  contactLinks?: { key: string; label: string; href: string }[] | null
  newsletterHeading?: string | null
  newsletterNote?: string | null
  mapHeading?: string | null
  mapCta?: string | null
  distanceRows?: { label: string; value: string }[] | null
  marqueeItems?: { text: string }[] | null
  wordmark?: string | null
  copyright?: string | null
  legalLinks?: { label: string; href: string }[] | null
  madeBy?: string | null
  locale?: string
}

export const BoutiqueFooterBlock: React.FC<Props> = ({
  blockType: _blockType,
  locale: _locale,
  addressMapUrl,
  mapCta,
  ...rest
}) => (
  <BoutiqueLandingFooter
    {...rest}
    addressMapUrl={addressMapUrl ?? undefined}
    mapCta={mapCta ?? undefined}
  />
)
