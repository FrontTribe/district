'use client'

import React, { useState } from 'react'
import { renderBoutiqueHeroHeading } from '@/blocks/BoutiqueHeroContent'
import { BoutiqueFooterMap } from './BoutiqueFooterMap'
import { useOsijekTime } from './useOsijekTime'

type InfoRow = { label: string; value: string }
type ContactLink = { key: string; label: string; href: string }
type LegalLink = { label: string; href: string }

export type BoutiqueLandingFooterProps = {
  timeLabel?: string | null
  signoffEyebrow?: string | null
  signoffHeading?: string | null
  coordinatesLat?: string | null
  coordinatesLng?: string | null
  addressHeading?: string | null
  addressHtml?: string | null
  addressMapUrl?: string | null | undefined
  infoRows?: InfoRow[] | null
  contactHeading?: string | null
  contactLinks?: ContactLink[] | null
  newsletterHeading?: string | null
  newsletterNote?: string | null
  mapHeading?: string | null
  mapCta?: string
  distanceRows?: InfoRow[] | null
  marqueeItems?: { text: string }[] | null
  wordmark?: string | null
  copyright?: string | null
  legalLinks?: LegalLink[] | null
  madeBy?: string | null
}

export function BoutiqueLandingFooter({
  timeLabel = 'Vrijeme u Osijeku',
  signoffEyebrow,
  signoffHeading,
  coordinatesLat = '45.5550° N',
  coordinatesLng = '18.6955° E',
  addressHeading = 'Adresa & dolazak',
  addressHtml,
  addressMapUrl = 'https://maps.google.com/?q=Ljudevita+Posavskog+7+Osijek',
  infoRows,
  contactHeading = 'Razgovor',
  contactLinks,
  newsletterHeading,
  newsletterNote,
  mapHeading = 'Karta',
  mapCta = 'Otvori u Mapama',
  distanceRows,
  marqueeItems,
  wordmark = 'district.',
  copyright,
  legalLinks,
  madeBy,
}: BoutiqueLandingFooterProps) {
  const time = useOsijekTime()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)
  const year = new Date().getFullYear()

  const marquee = marqueeItems?.length
    ? marqueeItems
    : [
        { text: 'Boutique' },
        { text: 'Osijek' },
        { text: 'Krov & Jacuzzi' },
        { text: 'Drava' },
        { text: 'Opus Arena' },
        { text: 'MMXXVI' },
      ]

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) setNewsletterSent(true)
  }

  const wordmarkBase = (wordmark ?? 'district.').replace(/\.$/, '')

  return (
    <footer className="footer">
      <div className="footer-sign">
        <div className="footer-sign-grid" data-reveal="stagger">
          <div className="footer-meta-block">
            <span className="footer-meta-key">{timeLabel}</span>
            <span className="footer-meta-val">{time || '—:—'}</span>
          </div>
          <div className="footer-signoff">
            {signoffEyebrow ? (
              <span className="footer-signoff-eyebrow" data-reveal="fade-up">
                {signoffEyebrow}
              </span>
            ) : null}
            {signoffHeading ? (
              <h2 data-reveal="lines">{renderBoutiqueHeroHeading(signoffHeading)}</h2>
            ) : null}
          </div>
          <div className="footer-meta-block right">
            <span className="footer-meta-key">{coordinatesLat}</span>
            <span className="footer-meta-val">{coordinatesLng}</span>
          </div>
        </div>
      </div>

      <div className="footer-mid">
        <div className="footer-card footer-card-address" data-reveal="fade-up">
          <span className="footer-num">No. 01</span>
          <h4>{addressHeading}</h4>
          {addressHtml ? (
            <p
              dangerouslySetInnerHTML={{
                __html: addressHtml.replace(
                  /Ljudevita Posavskog 7/g,
                  '<a href="https://maps.google.com/?q=Ljudevita+Posavskog+7+Osijek" target="_blank" rel="noopener noreferrer">Ljudevita Posavskog 7</a>',
                ),
              }}
            />
          ) : null}
          {infoRows && infoRows.length > 0 ? (
            <ul className="footer-list">
              {infoRows.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="footer-card footer-card-contact" data-reveal="fade-up" data-delay="0.08">
          <span className="footer-num">No. 02</span>
          <h4>{contactHeading}</h4>
          {contactLinks && contactLinks.length > 0 ? (
            <ul className="footer-contact">
              {contactLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <span className="footer-contact-key">{link.label}</span>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.key}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <form className="newsletter" onSubmit={handleNewsletter}>
            {newsletterHeading ? <label className="newsletter-label">{newsletterHeading}</label> : null}
            {newsletterSent ? (
              <div className="newsletter-thanks">
                Hvala. {newsletterNote ? <span>{newsletterNote}</span> : <span>Prvi broj stiže uskoro.</span>}
              </div>
            ) : (
              <div className="newsletter-row">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="vaš@email.hr"
                />
                <button type="submit">
                  Pretplata <span className="arrow">→</span>
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="footer-card footer-card-map" data-reveal="fade-up" data-delay="0.16">
          <span className="footer-num">No. 03</span>
          <h4>{mapHeading}</h4>
          <a
            className="footer-map"
            href={addressMapUrl ?? 'https://maps.google.com/?q=Ljudevita+Posavskog+7+Osijek'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BoutiqueFooterMap />
            <span className="footer-map-cta">
              {mapCta} <span className="arrow">→</span>
            </span>
          </a>
          {distanceRows && distanceRows.length > 0 ? (
            <ul className="footer-list footer-list-tight">
              {distanceRows.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="footer-marquee" aria-hidden>
        <div className="footer-marquee-track">
          {[0, 1].map((pass) =>
            marquee.flatMap((item, i) => [
              <span key={`${pass}-t-${i}`}>{item.text}</span>,
              <span key={`${pass}-d-${i}`}>·</span>,
            ]),
          )}
        </div>
      </div>

      <div className="footer-wordmark" data-reveal="curtain">
        <div className="curtain-inner footer-wordmark-inner">
          {wordmarkBase}
          <span className="dot">.</span>
        </div>
      </div>

      <div className="footer-legal">
        <div className="footer-legal-col">
          {copyright?.startsWith('©') ? (
            <span>{copyright}</span>
          ) : (
            <>
              <span className="footer-legal-key">© {year}</span>
              <span>{copyright ?? 'District d.o.o. · OIB 56282051463 · sva prava pridržana'}</span>
            </>
          )}
        </div>
        <div className="footer-legal-col footer-legal-mid">
          {legalLinks?.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer-legal-col">
          {madeBy ? (
            <>
              <span className="footer-legal-key">Kreirao</span>
              <span>{madeBy.replace(/^Kreirao\s*/i, '')}</span>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
