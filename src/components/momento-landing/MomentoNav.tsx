'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { localeLang } from '@/utils/locale'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'
import { MomentoMobileMenu } from './MomentoMobileMenu'
import { NavToggle } from '@/components/mobile-nav/NavToggle'
import { scrollToSectionById } from '@/utils/scrollToSection'

export type MomentoNavItem = {
  label: string
  link: string
  scrollTarget?: string
  external?: boolean
}

type Props = {
  logoText?: string
  menuItems: MomentoNavItem[]
  locale: string
  visitCtaHref?: string
}

function scrollToSection(scrollTarget: string, afterMenuClose = false) {
  return scrollToSectionById(scrollTarget, { offset: -30, duration: 1.4, afterMenuClose })
}

export function MomentoNav({ logoText = 'Momento', menuItems, locale, visitCtaHref = '#lokacija' }: Props) {
  const ui = getMomentoUiCopy(locale)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const brand = logoText.replace(/\.$/, '')

  const onNavClick = (item: MomentoNavItem, e: React.MouseEvent, afterMenuClose = false) => {
    if (item.scrollTarget && scrollToSection(item.scrollTarget, afterMenuClose)) {
      e.preventDefault()
    }
  }

  const switchLocale = (code: string) => {
    if (code === locale) return
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0 && localeLang.some((l) => l.code === segments[0])) {
      segments[0] = code
    } else {
      segments.unshift(code)
    }
    router.push(`/${segments.join('/')}`)
  }

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' nav--menu-open' : ''}`}>
        <div className="shell nav-inner">
          <Link
            href="#top"
            className="brand"
            onClick={(e) => {
              if (scrollToSection('top')) e.preventDefault()
            }}
          >
            {brand}
            <span className="dot">.</span>
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => onNavClick(item, e)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <div className="lang-pick">
              {localeLang.map((l) => (
                <span
                  key={l.code}
                  role="button"
                  tabIndex={0}
                  className={l.code === locale ? 'active' : undefined}
                  onClick={() => switchLocale(l.code)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') switchLocale(l.code)
                  }}
                >
                  {l.code.toUpperCase()}
                </span>
              ))}
            </div>
            <Link
              href={visitCtaHref}
              className="cta-pill"
              onClick={(e) => onNavClick({ label: '', link: visitCtaHref, scrollTarget: 'lokacija' }, e)}
            >
              {ui.nav.visitCta} <span className="arr">↗</span>
            </Link>
            <NavToggle
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((open) => !open)}
              controlsId="momento-mobile-menu"
              openLabel={ui.nav.menuOpen}
              closeLabel={ui.nav.menuClose}
            />
          </div>
        </div>
      </header>

      <MomentoMobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={menuItems}
        locale={locale}
        visitCtaHref={visitCtaHref}
        onLocaleSwitch={switchLocale}
      />
    </>
  )
}
