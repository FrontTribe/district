'use client'

import React from 'react'
import Link from 'next/link'

type FooterLink = { label: string; href: string }

type Props = {
  logoText?: string
  tagline?: string
  navLinks?: FooterLink[]
  email?: string
  phone?: string
  instagram?: string
  copyright?: string
  madeBy?: string
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
  email = 'support@district.hr',
  phone = '+385 99 554 4337',
  instagram = 'https://instagram.com/district.hr',
  copyright = `Sva prava pridržana © ${new Date().getFullYear()} District d.o.o.`,
  madeBy = 'Kreirao Front Tribe',
}: Props) {
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
            <h4>Stranice</h4>
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="foot-col">
            <h4>Kontakt</h4>
            <Link href={`mailto:${email}`}>{email}</Link>
            <Link href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link>
          </div>
          <div className="foot-col">
            <h4>Pratite nas</h4>
            {instagram ? (
              <Link href={instagram} target="_blank" rel="noopener noreferrer">
                Instagram ↗
              </Link>
            ) : null}
          </div>
        </div>
        <div className="foot-mega">— Vaš trenutak, vaš Momento —</div>
        <div className="foot-bottom">
          <span>{copyright}</span>
          <span className="made">
            {madeBy.includes('Front Tribe') ? (
              <>
                Kreirao <em>Front Tribe</em>
              </>
            ) : (
              madeBy
            )}
          </span>
        </div>
      </div>
    </footer>
  )
}
