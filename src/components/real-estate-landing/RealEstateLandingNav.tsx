'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'

export type RealEstateLandingNavLink = { label: string; href: string; openInNewTab?: boolean }

const LANDING_LOCALES = ['hr', 'en', 'de'] as const
type LandingLocale = (typeof LANDING_LOCALES)[number]

function isLandingLocale(s: string | undefined): s is LandingLocale {
  return s === 'hr' || s === 'en' || s === 'de'
}

/** Zamijeni ili umetni prvi segment puta (`/hr/...` → `/en/...`). */
function hrefForLocale(pathname: string, target: LandingLocale): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && isLandingLocale(parts[0])) {
    return `/${[target, ...parts.slice(1)].join('/')}`
  }
  if (parts.length === 0) return `/${target}`
  return `/${target}/${parts.join('/')}`
}

export type RealEstateLandingNavProps = {
  brandHtml?: string
  brandAriaLabel?: string
  /** Zastarjelo: jezik se uvijek bira putem linkova HR / EN / DE. */
  langLine?: string
  /** Ako je `false`, i dalje prikazujemo jezični switcher (landing). */
  showLangLine?: boolean
  links: RealEstateLandingNavLink[]
  ctaLabel?: string | null
  ctaHref?: string | null
  ctaOpenInNewTab?: boolean
  /** Jezik stranice iz CMS-a (kad pathname nema `[locale]` prefiks). */
  locale?: string | null
}

export function RealEstateLandingNav({
  brandHtml = '<b>district.</b>',
  brandAriaLabel,
  showLangLine: _showLangLine = true,
  langLine: _langLine,
  links,
  ctaLabel,
  ctaHref,
  ctaOpenInNewTab = false,
  locale: localeProp,
}: RealEstateLandingNavProps) {
  const pathname = usePathname() || '/'
  const ref = useRef<HTMLElement>(null)

  const currentLocale = useMemo((): LandingLocale => {
    const first = pathname.split('/').filter(Boolean)[0]
    if (isLandingLocale(first)) return first
    if (isLandingLocale(localeProp ?? undefined)) return localeProp as LandingLocale
    return 'hr'
  }, [pathname, localeProp])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      if (window.scrollY > 80) el.classList.add('nav--scrolled')
      else el.classList.remove('nav--scrolled')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="nav" ref={ref}>
      <a href="#top" className="nav__brand" aria-label={brandAriaLabel || undefined} dangerouslySetInnerHTML={{ __html: brandHtml }} />
      <div className="nav__menu">
        {links.map((l) => (
          <a key={l.href + l.label} href={l.href} {...(l.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav__cta">
        {ctaHref && ctaLabel ? (
          <a
            href={ctaHref}
            className="nav__cta-btn mono"
            {...(ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {ctaLabel}
          </a>
        ) : null}
        <span className="nav__lang-switch mono" aria-label="Language">
          {LANDING_LOCALES.map((lc, i) => (
            <React.Fragment key={lc}>
              {i > 0 ? <span className="nav__lang-sep"> · </span> : null}
              <a
                href={hrefForLocale(pathname, lc)}
                className={lc === currentLocale ? 'is-active' : undefined}
                aria-current={lc === currentLocale ? 'page' : undefined}
              >
                {lc.toUpperCase()}
              </a>
            </React.Fragment>
          ))}
        </span>
        <span className="nav__dot" />
      </div>
    </nav>
  )
}
