'use client'

import React from 'react'
import { RealEstateContact } from '@/components/real-estate-page'

type Props = {
  blockType: 'real-estate-contact'
  eyebrow?: string | null
  heading: string
  leftText?: string | null
  address?: string | null
  email?: string | null
  phone?: string | null
  sectionId?: string | null
}

export const RealEstateContactBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  leftText,
  address,
  email,
  phone,
  sectionId,
}) => (
  <RealEstateContact
    eyebrow={eyebrow ?? undefined}
    heading={heading}
    leftText={leftText ?? undefined}
    address={address ?? undefined}
    email={email ?? undefined}
    phone={phone ?? undefined}
    sectionId={sectionId ?? undefined}
  />
)
