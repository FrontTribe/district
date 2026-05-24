'use client'

import React from 'react'
import Link from 'next/link'
import EnhancedLanguageSwitcher from './EnhancedLanguageSwitcher'
import { getTranslation } from '@/utils/translations'
import { TenantMobileMenuShell } from '@/components/mobile-nav/TenantMobileMenuShell'
import type { BoutiqueBrandmarkLogo } from '@/components/BoutiqueBrandmark'

type MenuItem = {
  label: string
  link: string
  external?: boolean
  scrollTarget?: string
}

type BoutiqueMobileMenuProps = {
  menuItems: MenuItem[]
  logo?: BoutiqueBrandmarkLogo
  logoText?: string
  brandSubtitle?: string | null
  locale: string
  isOpen: boolean
  activeSectionId: string | null
  isLanguageChanging: boolean
  onClose: () => void
  onLanguageChange: (locale: string) => void
  onMenuClick: (item: MenuItem, e: React.MouseEvent) => void
  onLogoClick: React.MouseEventHandler<HTMLAnchorElement>
}

export function BoutiqueMobileMenu({
  menuItems,
  locale,
  isOpen,
  activeSectionId,
  isLanguageChanging,
  onClose,
  onLanguageChange,
  onMenuClick,
}: BoutiqueMobileMenuProps) {
  return (
    <TenantMobileMenuShell
      isOpen={isOpen}
      onClose={onClose}
      variant="boutique"
      syncNavOffset
      menuId="boutique-mobile-menu"
      ariaLabel="Navigation"
      closeLabel="Zatvori"
    >
      <nav className="tenant-mobile-menu__links" aria-label="Primary">
        {menuItems.map((item, index) => {
          const linkProps = item.external
            ? { href: item.link, target: '_blank' as const, rel: 'noopener noreferrer' }
            : { href: item.link }

          return (
            <Link
              key={item.link + item.label}
              {...linkProps}
              onClick={(e) => onMenuClick(item, e)}
              className={`tenant-mobile-menu__link${
                item.scrollTarget && activeSectionId === item.scrollTarget ? ' is-active' : ''
              }`}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <span className="tenant-mobile-menu__link-index" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item.label}</span>
              <span className="tenant-mobile-menu__link-arrow" aria-hidden>
                →
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="tenant-mobile-menu__footer">
        <EnhancedLanguageSwitcher
          currentLocale={locale}
          onLanguageChange={onLanguageChange}
          theme="light"
          disabled={isLanguageChanging}
          variant="boutique-inline"
        />
        <Link
          href="#sobe"
          className="boutique-ghost-btn tenant-mobile-menu__cta"
          onClick={(e) => onMenuClick({ link: '#sobe', label: '', scrollTarget: 'sobe' }, e)}
        >
          <span className="boutique-ghost-btn__label">{getTranslation('boutiqueReserve', locale)}</span>
          <span className="boutique-ghost-btn__arrow" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </TenantMobileMenuShell>
  )
}
