'use client'

import React from 'react'
import Link from 'next/link'
import { localeLang } from '@/utils/locale'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'
import { useMobileMenuLock } from '@/components/mobile-nav/useMobileMenuLock'
import { handleInPageNavClick } from '@/utils/scrollToSection'
import type { MomentoNavItem } from './MomentoNav'

type Props = {
  isOpen: boolean
  onClose: () => void
  menuItems: MomentoNavItem[]
  locale: string
  visitCtaHref: string
  onLocaleSwitch: (code: string) => void
}

export function MomentoMobileMenu({
  isOpen,
  onClose,
  menuItems,
  locale,
  visitCtaHref,
  onLocaleSwitch,
}: Props) {
  const ui = getMomentoUiCopy(locale)

  useMobileMenuLock(isOpen, onClose)

  if (!isOpen) return null

  return (
    <div className="nav-menu is-open" id="momento-mobile-menu" role="presentation">
      <button
        type="button"
        className="nav-menu__backdrop"
        aria-label={ui.nav.menuClose}
        onClick={onClose}
      />
      <div
        className="nav-menu__panel"
        role="dialog"
        aria-modal="true"
        aria-label={ui.nav.mobileNav}
      >
        <nav className="nav-menu__links" aria-label={ui.nav.mobileNav}>
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.link}
              className="nav-menu__link"
              style={{ animationDelay: `${index * 45}ms` }}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                handleInPageNavClick(e, {
                  scrollTarget: item.scrollTarget,
                  href: item.link,
                  external: item.external,
                  afterMenuClose: true,
                  offset: -30,
                  duration: 1.4,
                  onAfterNavigate: onClose,
                })
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-menu__footer">
          <div className="nav-menu__lang" aria-label={ui.nav.language}>
            {localeLang.map((l) => (
              <button
                key={l.code}
                type="button"
                className={l.code === locale ? 'active' : undefined}
                onClick={() => onLocaleSwitch(l.code)}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            href={visitCtaHref}
            className="nav-menu__cta"
            onClick={(e) => {
              handleInPageNavClick(e, {
                scrollTarget: 'lokacija',
                href: visitCtaHref,
                afterMenuClose: true,
                offset: -30,
                duration: 1.4,
                onAfterNavigate: onClose,
              })
            }}
          >
            {ui.nav.visitCta} <span className="arr">↗</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
