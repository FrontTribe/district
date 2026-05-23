'use client'

import React from 'react'
import Link from 'next/link'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'

type FooterLink = { label: string; href: string }

type Props = {
  logoText?: string
  tagline?: string
  navLinks?: FooterLink[]
  pagesHeading?: string
  contactHeading?: string
  socialHeading?: string
  email?: string
  phone?: string
  instagram?: string
  megaLine?: string
  copyright?: string
  madeBy?: string
  locale?: string
}

export function MomentoFooter({
  logoText = 'Momento',
  tagline = 'Lounge & caffe bar u prizemlju District Boutique-a. Vaš trenutak, svaki dan.',
  navLinks = [
    { label: 'O nama', href: '#o-nama' },
    { label: 'Naš meni', href: '#menu' },
    { label: 'Karijera', href: '#karijera' },
    { label: 'Lokacija', href: '#lokacija' },
  ],
  pagesHeading = 'Stranice',
  contactHeading = 'Kontakt',
  socialHeading = 'Pratite nas',
  email = 'support@district.hr',
  phone = '+385 99 554 4337',
  instagram = 'https://instagram.com/district.hr',
  megaLine = '— Vaš trenutak, vaš Momento —',
  copyright = `Sva prava pridržana © ${new Date().getFullYear()} District d.o.o.`,
  madeBy,
  locale = 'hr',
}: Props) {
  const ui = getMomentoUiCopy(locale)
  const brand = logoText.replace(/\.$/, '')

  return (
    <footer>
      <div className="shell">
        <div className="foot-top">
          <div>
            <div className="foot-brand">
              {brand}
              <em>.</em>
            </div>
            <p className="foot-tag">{tagline}</p>
          </div>
          <div className="foot-col">
            <h4>{pagesHeading}</h4>
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="foot-col">
            <h4>{contactHeading}</h4>
            <Link href={`mailto:${email}`}>{email}</Link>
            <Link href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link>
          </div>
          <div className="foot-col">
            <h4>{socialHeading}</h4>
            {instagram ? (
              <Link href={instagram} target="_blank" rel="noopener noreferrer">
                {ui.footer.instagram}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="foot-mega">{megaLine}</div>
        <div className="foot-bottom">
          <span>{copyright}</span>
          <span className="made">
            {madeBy && !madeBy.includes('Front Tribe') ? (
              madeBy
            ) : (
              <>
                {ui.footer.madeByPrefix}{' '}
                <Link href={ui.footer.madeByUrl} target="_blank" rel="noopener noreferrer">
                  <em>{ui.footer.madeByAgency}</em>
                </Link>
              </>
            )}
          </span>
        </div>
      </div>
    </footer>
  )
}
