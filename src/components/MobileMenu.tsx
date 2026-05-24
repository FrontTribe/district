'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import EnhancedLanguageSwitcher from './EnhancedLanguageSwitcher'
import { TenantMobileMenuShell } from '@/components/mobile-nav/TenantMobileMenuShell'
import type { HubSocialLink } from '@/utils/hubSocialLinks'
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'
import { BoutiqueMobileMenu } from '@/components/BoutiqueMobileMenu'
import { handleInPageNavClick, restorePageScroll, scrollToSectionById } from '@/utils/scrollToSection'

interface MenuItem {
  label: string
  link: string
  external?: boolean
  scrollTarget?: string
  children?: MenuItem[]
}

interface MobileMenuProps {
  menuItems?: MenuItem[]
  logo?: {
    url: string
    alt: string
    width: number
    height: number
  }
  logoText?: string
  locale: string
  onLanguageChange: (locale: string) => void
  isLanguageChanging: boolean
  isTenantMenu?: boolean
  hubLanding?: boolean
  tenantVisualTheme?: TenantVisualTheme
  brandSubtitle?: string | null
  isOpen: boolean
  onClose: () => void
  hubSocialLinks?: HubSocialLink[]
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  menuItems = [],
  logo,
  logoText,
  locale,
  onLanguageChange,
  isLanguageChanging,
  isTenantMenu = false,
  hubLanding = false,
  tenantVisualTheme = 'default',
  brandSubtitle,
  isOpen,
  onClose,
  hubSocialLinks,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const sectionSpyEnabled = isTenantMenu || hubLanding
  const isBoutiqueDrawer = isTenantMenu && tenantVisualTheme === 'boutique' && !hubLanding
  const drawerVariant = hubLanding ? 'hub' : isTenantMenu ? 'default' : 'default'
  const menuId = hubLanding ? 'hub-mobile-menu' : 'district-mobile-menu'

  useEffect(() => {
    if (!sectionSpyEnabled) return

    const targets = (menuItems || [])
      .map((item) => item.scrollTarget)
      .filter((id): id is string => Boolean(id))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (targets.length === 0) return

    const visibilityById = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          visibilityById.set(el.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let bestId: string | null = null
        let bestRatio = 0
        visibilityById.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })
        if (bestId && bestId !== activeSectionId) setActiveSectionId(bestId)
      },
      {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [menuItems, sectionSpyEnabled, activeSectionId])

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    handleInPageNavClick(e, {
      scrollTarget: item.scrollTarget,
      href: item.link,
      external: item.external,
      afterMenuClose: true,
      onAfterNavigate: onClose,
    })
  }

  const handleLogoClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!isTenantMenu && !hubLanding) {
      onClose()
      return
    }

    e.preventDefault()
    onClose()

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const topById = document.getElementById('top')
        if (topById) {
          scrollToSectionById('top', { offset: -30, duration: 1.2 })
          return
        }

        const heroElement = document.querySelector(
          'section[id*="hero"], .hero-block, [id*="hero"]',
        ) as HTMLElement | null

        if (heroElement?.id) {
          scrollToSectionById(heroElement.id, { offset: -30, duration: 1.2 })
          return
        }

        restorePageScroll()
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }),
    )
  }

  if (isBoutiqueDrawer) {
    return (
      <BoutiqueMobileMenu
        menuItems={menuItems}
        logo={logo}
        logoText={logoText}
        brandSubtitle={brandSubtitle}
        locale={locale}
        isOpen={isOpen}
        activeSectionId={activeSectionId}
        isLanguageChanging={isLanguageChanging}
        onClose={onClose}
        onLanguageChange={onLanguageChange}
        onMenuClick={handleMenuClick}
        onLogoClick={handleLogoClick}
      />
    )
  }

  const flatItems = menuItems.flatMap((item) => [item, ...(item.children ?? [])])

  return (
    <TenantMobileMenuShell
      isOpen={isOpen}
      onClose={onClose}
      variant={drawerVariant}
      syncNavOffset
      menuId={menuId}
      ariaLabel="Navigation"
    >
      <nav className="tenant-mobile-menu__links" aria-label="Primary">
        {flatItems.map((item, index) => {
          const linkProps = item.external
            ? { href: item.link, target: '_blank' as const, rel: 'noopener noreferrer' }
            : { href: item.link }

          return (
            <Link
              key={`${item.link}-${item.label}`}
              {...linkProps}
              className={`tenant-mobile-menu__link${
                item.scrollTarget && activeSectionId === item.scrollTarget ? ' is-active' : ''
              }`}
              style={{ animationDelay: `${index * 45}ms` }}
              onClick={(e) => handleMenuClick(item, e)}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="tenant-mobile-menu__footer">
        <EnhancedLanguageSwitcher
          currentLocale={locale}
          onLanguageChange={onLanguageChange}
          theme={hubLanding ? 'hub' : 'transparent'}
          disabled={isLanguageChanging}
          variant={hubLanding ? 'hub-inline' : 'dropdown'}
        />
        {hubLanding && hubSocialLinks && hubSocialLinks.length > 0 ? (
          <div className="tenant-mobile-menu__lang" aria-label="Social media">
            {hubSocialLinks.map((s, index) => (
              <React.Fragment key={`${s.label}-${s.href}`}>
                {index > 0 ? <span className="tenant-mobile-menu__lang-sep"> · </span> : null}
                <a
                  href={s.href}
                  className="tenant-mobile-menu__link"
                  style={{ fontSize: '11px', animation: 'none', opacity: 1, transform: 'none' }}
                  {...(s.href.startsWith('http')
                    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                    : {})}
                  onClick={onClose}
                >
                  {s.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </TenantMobileMenuShell>
  )
}
