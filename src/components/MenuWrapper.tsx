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

      // Navigate to the new locale while preserving the current page
      if (pathWithoutLocale === '') {
        // If we're on the main page, just go to the new locale
        router.push(`/${newLocale}`)
      } else {
        // If we're on a specific page, preserve the page path
        router.push(`/${newLocale}${pathWithoutLocale}`)
      }
    } catch (error) {
      console.error('Error changing language:', error)
    } finally {
      setIsLanguageChanging(false)
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
