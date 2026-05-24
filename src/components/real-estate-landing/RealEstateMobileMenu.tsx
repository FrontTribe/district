'use client'

import React from 'react'
import { useMobileMenuLock } from '@/components/mobile-nav/useMobileMenuLock'
import { handleInPageNavClick } from '@/utils/scrollToSection'
import type { RealEstateLandingNavLink } from './RealEstateLandingNav'

const LANDING_LOCALES = ['hr', 'en', 'de'] as const
type LandingLocale = (typeof LANDING_LOCALES)[number]

const CLOSE_LABELS: Record<LandingLocale, string> = {
  hr: 'Zatvori',
  en: 'Close',
  de: 'Schließen',
}

type Props = {
  isOpen: boolean
  onClose: () => void
  links: RealEstateLandingNavLink[]
  ctaLabel?: string | null
  ctaHref?: string | null
  ctaOpenInNewTab?: boolean
  currentLocale: LandingLocale
  hrefForLocale: (locale: LandingLocale) => string
}

export function RealEstateMobileMenu({
  isOpen,
  onClose,
  links,
  ctaLabel,
  ctaHref,
  ctaOpenInNewTab = false,
  currentLocale,
  hrefForLocale,
}: Props) {
  useMobileMenuLock(isOpen, onClose)

  if (!isOpen) return null

  return (
    <div className="re-nav-menu is-open" id="re-mobile-menu" role="presentation">
      <button
        type="button"
        className="re-nav-menu__backdrop"
        aria-label={CLOSE_LABELS[currentLocale]}
        onClick={onClose}
      />
      <div className="re-nav-menu__panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <nav className="re-nav-menu__links" aria-label="Primary">
          {links.map((link, index) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className="re-nav-menu__link"
              style={{ animationDelay: `${index * 45}ms` }}
              {...(link.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={(e) => {
                handleInPageNavClick(e, {
                  href: link.href,
                  external: link.openInNewTab,
                  afterMenuClose: true,
                  offset: -30,
                  duration: 1.2,
                  onAfterNavigate: onClose,
                })
              }}
            >
              <span className="re-nav-menu__index" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="re-nav-menu__label serif">{link.label}</span>
              <span className="re-nav-menu__arrow" aria-hidden>
                →
              </span>
            </a>
          ))}
        </nav>

        <div className="re-nav-menu__footer">
          <span className="re-nav-menu__lang mono" aria-label="Language">
            {LANDING_LOCALES.map((lc, i) => (
              <React.Fragment key={lc}>
                {i > 0 ? <span className="re-nav-menu__lang-sep"> · </span> : null}
                <a
                  href={hrefForLocale(lc)}
                  className={lc === currentLocale ? 'is-active' : undefined}
                  aria-current={lc === currentLocale ? 'page' : undefined}
                  onClick={onClose}
                >
                  {lc.toUpperCase()}
                </a>
              </React.Fragment>
            ))}
          </span>
          {ctaHref && ctaLabel ? (
            <a
              href={ctaHref}
              className="re-nav-menu__cta nav__cta-btn mono"
              {...(ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={(e) => {
                handleInPageNavClick(e, {
                  href: ctaHref,
                  external: ctaOpenInNewTab,
                  afterMenuClose: true,
                  offset: -30,
                  duration: 1.2,
                  onAfterNavigate: onClose,
                })
              }}
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
