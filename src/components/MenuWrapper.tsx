'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import EnhancedLanguageSwitcher from './EnhancedLanguageSwitcher'

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
}

export const MenuWrapper: React.FC<MenuWrapperProps> = ({
  menuItems = [],
  logo,
  logoText,
  positioning = 'fixed',
  locale,
  menuId = 'default',
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)

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
  }

  const isTenantMenu = menuId === 'tenant-menu'
  const headerClass = isTenantMenu ? 'header header--tenant' : 'header'
  const contentClass = isTenantMenu ? 'header-content header-content--tenant' : 'header-content'

  return (
    <header className={headerClass}>
      <div className={contentClass}>
        {isTenantMenu ? (
          // Tenant menu layout - logo left, menu center, language right
          <>
            <div className="tenant-menu-left">
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
                          className="tenant-menu-link"
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
            <div className="logo">
              <Link href="/">
                {logo ? (
                  <img src={logo.url} alt={logo.alt} width={logo.width} height={logo.height} />
                ) : logoText ? (
                  <h1>{logoText}</h1>
                ) : (
                  <h1>district.</h1>
                )}
              </Link>
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
    </header>
  )
}
