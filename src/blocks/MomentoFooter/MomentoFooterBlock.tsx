'use client'

import React from 'react'
import { MomentoFooter } from '@/components/momento-landing/MomentoFooter'

type NavLink = { label: string; href: string; id?: string | null }

type Props = {
  blockType: 'momento-footer'
  logoText?: string | null
  tagline?: string | null
  navLinks?: NavLink[] | null
  pagesHeading?: string | null
  contactHeading?: string | null
  email?: string | null
  phone?: string | null
  socialHeading?: string | null
  instagram?: string | null
  megaLine?: string | null
  copyright?: string | null
  madeBy?: string | null
  locale?: string
}

function normalizeInstagram(value?: string | null): string | undefined {
  const raw = value?.trim()
  if (!raw) return undefined
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const handle = raw.replace(/^@/, '')
  return `https://instagram.com/${handle}`
}

export const MomentoFooterBlock: React.FC<Props> = ({
  logoText,
  tagline,
  navLinks,
  pagesHeading,
  contactHeading,
  email,
  phone,
  socialHeading,
  instagram,
  megaLine,
  copyright,
  madeBy,
  locale = 'hr',
}) => (
  <MomentoFooter
    logoText={logoText ?? undefined}
    tagline={tagline ?? undefined}
    navLinks={navLinks?.map((link) => ({ label: link.label, href: link.href }))}
    pagesHeading={pagesHeading ?? undefined}
    contactHeading={contactHeading ?? undefined}
    email={email ?? undefined}
    phone={phone ?? undefined}
    socialHeading={socialHeading ?? undefined}
    instagram={normalizeInstagram(instagram)}
    megaLine={megaLine ?? undefined}
    copyright={copyright ?? undefined}
    madeBy={madeBy ?? undefined}
    locale={locale}
  />
)
