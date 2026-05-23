'use client'

import React from 'react'
import { RealEstateLandingPageFooter } from '@/components/real-estate-landing/RealEstateLandingPageFooter'

/** Zigica demo footer — koristi isti `.footer` BEM kao RE landing. */
export function ZigicaPageFooter({ brand, line2 }: { brand: string; line2: string }) {
  return (
    <RealEstateLandingPageFooter
      columns={[]}
      brandText={brand}
      copyrightLine={line2}
      addressLine=""
    />
  )
}
