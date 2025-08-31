'use client'

import React from 'react'
import Link from 'next/link'
import MainPageLanguageSwitcher from './mainPageLanguageSwitcher'

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
  return (
    <div className={`menu-wrapper menu-${menuId} ${positioning}`}>
      <div className="menu-container">
        <div className="menu-content">
          {/* Logo - Centered */}
          <div className="menu-logo-centered">
            <Link href="/">
              {logo ? (
                <img src={logo.url} alt={logo.alt} width={logo.width} height={logo.height} />
              ) : logoText ? (
                <span className="logo-text">{logoText}</span>
              ) : (
                <span className="logo-text">Logo</span>
              )}
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="menu-navigation">
            <div className="menu-items">
              {menuItems.map((item, index) => {
                const handleMenuClick = (e: React.MouseEvent) => {
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

                if (item.external) {
                  return (
                    <div key={index} className="menu-item external">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.label}
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                      {item.children && item.children.length > 0 && (
                        <div className="menu-dropdown">
                          {item.children.map((child, childIndex) => (
                            <a
                              key={childIndex}
                              href={child.link}
                              target={child.external ? '_blank' : undefined}
                              rel={child.external ? 'noopener noreferrer' : undefined}
                            >
                              {child.label}
                              {child.external && (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <div key={index} className="menu-item">
                    <Link href={item.link} onClick={handleMenuClick}>
                      {item.label}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <div className="menu-dropdown">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.link}
                            target={child.external ? '_blank' : undefined}
                            rel={child.external ? 'noopener noreferrer' : undefined}
                          >
                            {child.label}
                            {child.external && (
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="menu-language-switcher">
            <MainPageLanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
