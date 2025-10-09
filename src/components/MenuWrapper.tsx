'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import EnhancedLanguageSwitcher from './EnhancedLanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { HamburgerButton } from './HamburgerButton'

interface MenuItem {
  label: string
  link: string
  external?: boolean
  scrollTarget?: string
  children?: MenuItem[]
}

interface MenuWrapperProps {
  menuItems?: MenuItem[]
  logo?: {
    url: string
    alt: string
    width: number
    height: number
  }
  logoText?: string
  positioning?: 'fixed' | 'absolute' | 'relative'
  locale: string
  menuId?: string
  hideHamburger?: boolean
}

export const MenuWrapper: React.FC<MenuWrapperProps> = ({
  menuItems = [],
  logo,
  logoText,
  positioning: _positioning = 'fixed',
  locale,
  menuId = 'default',
  hideHamburger = false,
}) => {
  const _router = useRouter()
  const pathname = usePathname()
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isTenantMenu = menuId === 'tenant-menu'

  // Observe sections and mark active menu item when in view (tenant menu only)
  useEffect(() => {
    if (!isTenantMenu) return

    const targets = (menuItems || [])
      .map((item) => item.scrollTarget)
      .filter((id): id is string => Boolean(id))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (targets.length === 0) return

    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const visibilityById = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          const id = el.id
          // Use intersection ratio as visibility metric
          visibilityById.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        // Pick the most visible section
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
        // Focus around the center-ish of the viewport
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    targets.forEach((el) => observer.observe(el))
    observerRef.current = observer

    return () => {
      observer.disconnect()
      observerRef.current = null
    }
  }, [menuItems, menuId, activeSectionId])

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return // Don't switch if it's the same language

    try {
      setIsLanguageChanging(true)

      // Get the current path without the locale
      const pathWithoutLocale = pathname.replace(`/${locale}`, '')

      // Build the new URL
      const newPath =
        pathWithoutLocale === '' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`

      // Force a full page reload to ensure server-side content is fetched with the new locale
      // This is necessary because the PageClient component uses useLivePreview which doesn't
      // handle locale changes properly without a full server-side re-render
      window.location.href = newPath
    } catch (error) {
      console.error('Error changing language:', error)
      setIsLanguageChanging(false)
    }
  }

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.scrollTarget && !item.external) {
      e.preventDefault()
      const targetElement = document.getElementById(item.scrollTarget)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isTenantMenu) {
      e.preventDefault()
      // Try to find a hero section first
      const heroElement = document.querySelector('section[id*="hero"], .hero-block, [id*="hero"]')
      if (heroElement) {
        heroElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      } else {
        // If no hero section found, scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }
    // Close mobile menu when logo is clicked
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const headerClass = isTenantMenu ? 'header header--tenant' : 'header'
  const contentClass = isTenantMenu ? 'header-content header-content--tenant' : 'header-content'

  return (
    <header className={headerClass}>
      <div className={contentClass}>
        {isTenantMenu ? (
          // Tenant menu layout - logo left, menu center, language right
          <>
            <div className="tenant-menu-left">
              <div className="mobile-header-left">
                {!hideHamburger && (
                  <HamburgerButton isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
                )}
                <div className="logo">
                  <Link href="/" onClick={handleLogoClick}>
                    {logo ? (
                      <img src={logo.url} alt={logo.alt} width={logo.width} height={logo.height} />
                    ) : logoText ? (
                      <h1>{logoText}</h1>
                    ) : (
                      <h1>district.</h1>
                    )}
                  </Link>
                </div>
              </div>
            </div>
            <div className="tenant-menu-center">
              {menuItems.length > 0 && (
                <nav className="tenant-menu-nav">
                  <ul className="tenant-menu-list">
                    {menuItems.map((item, index) => (
                      <li key={index} className="tenant-menu-item">
                        <Link
                          href={item.link}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          onClick={(e) => handleMenuClick(item, e)}
                          className={`tenant-menu-link${
                            item.scrollTarget && activeSectionId === item.scrollTarget
                              ? ' is-active'
                              : ''
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
            <div className="tenant-menu-right">
              <div className="language-switcher-wrapper">
                <EnhancedLanguageSwitcher
                  currentLocale={locale}
                  onLanguageChange={handleLanguageChange}
                  theme="transparent"
                  disabled={isLanguageChanging}
                />
              </div>
            </div>
          </>
        ) : (
          // Main menu layout - original
          <>
            <div className="mobile-header-left">
              {!hideHamburger && (
                <HamburgerButton isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
              )}
              <div className="logo">
                <Link href="/" onClick={handleLogoClick}>
                  {logo ? (
                    <img src={logo.url} alt={logo.alt} width={logo.width} height={logo.height} />
                  ) : logoText ? (
                    <h1>{logoText}</h1>
                  ) : (
                    <h1>district.</h1>
                  )}
                </Link>
              </div>
            </div>
            <div className="language-switcher-wrapper">
              <EnhancedLanguageSwitcher
                currentLocale={locale}
                onLanguageChange={handleLanguageChange}
                theme="transparent"
                disabled={isLanguageChanging}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        menuItems={menuItems}
        logo={logo}
        logoText={logoText}
        locale={locale}
        onLanguageChange={handleLanguageChange}
        isLanguageChanging={isLanguageChanging}
        isTenantMenu={isTenantMenu}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}
