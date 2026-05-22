'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { localeLang } from '@/utils/locale'
import type { MomentoNavItem } from './MomentoNav'

type Props = {
  isOpen: boolean
  onClose: () => void
  menuItems: MomentoNavItem[]
  locale: string
  visitCtaHref: string
  onItemClick: (item: MomentoNavItem, e: React.MouseEvent) => void
  onLocaleSwitch: (code: string) => void
}

export function MomentoMobileMenu({
  isOpen,
  onClose,
  menuItems,
  locale,
  visitCtaHref,
  onItemClick,
  onLocaleSwitch,
}: Props) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis
    lenis?.stop?.()

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      lenis?.start?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="nav-menu is-open" id="momento-mobile-menu" role="presentation">
      <button type="button" className="nav-menu__backdrop" aria-label="Zatvori izbornik" onClick={onClose} />
      <div className="nav-menu__panel" role="dialog" aria-modal="true" aria-label="Navigacija">
        <nav className="nav-menu__links" aria-label="Mobilna navigacija">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.link}
              className="nav-menu__link"
              style={{ animationDelay: `${index * 45}ms` }}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                onItemClick(item, e)
                onClose()
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-menu__footer">
          <div className="nav-menu__lang" aria-label="Jezik">
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
              onItemClick({ label: '', link: visitCtaHref, scrollTarget: 'lokacija' }, e)
              onClose()
            }}
          >
            Posjeti nas <span className="arr">↗</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
