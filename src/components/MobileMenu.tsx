'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import EnhancedLanguageSwitcher from './EnhancedLanguageSwitcher'

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
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  menuItems = [],
  logo,
  logoText,
  locale,
  onLanguageChange,
  isLanguageChanging,
  isTenantMenu = false,
  isOpen,
  onClose,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  // Observe sections and mark active menu item when in view (tenant menu only)
  useEffect(() => {
    if (!isTenantMenu) return

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
          const id = el.id
          visibilityById.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
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

    return () => {
      observer.disconnect()
    }
  }, [menuItems, isTenantMenu, activeSectionId])

  // GSAP animations
  useEffect(() => {
    if (!overlayRef.current || !menuRef.current) return

    const overlay = overlayRef.current
    const menu = menuRef.current

    if (isOpen) {
      // Open animation
      tl.current = gsap.timeline()

      // Show overlay with fade in
      tl.current
        .set(overlay, { opacity: 0 })
        .to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        // Slide menu in from right
        .fromTo(menu, { x: '100%' }, { x: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')

      // Animate menu items if they exist
      if (menuItemsRef.current) {
        const menuItems = menuItemsRef.current
        tl.current.fromTo(
          menuItems.querySelectorAll('.mobile-menu-item'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2',
        )
      }
    } else {
      // Close animation - create a new timeline for closing
      const closeTl = gsap.timeline()

      // Animate menu items out first
      if (menuItemsRef.current) {
        const menuItems = menuItemsRef.current
        closeTl.to(menuItems.querySelectorAll('.mobile-menu-item'), {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: 'power2.in',
        })
      }

      // Then slide menu out and fade overlay
      closeTl
        .to(menu, { x: '100%', duration: 0.3, ease: 'power3.in' }, '-=0.1')
        .to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.2')
        .set(overlay, { display: 'none' })
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
    // Close menu after click
    onClose()
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isTenantMenu) {
      e.preventDefault()
      const heroElement = document.querySelector('section[id*="hero"], .hero-block, [id*="hero"]')
      if (heroElement) {
        heroElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }
    onClose()
  }

  const renderMenuItem = (item: MenuItem, index: number) => {
    const linkContent = (
      <>
        {item.label}
        {item.external && (
          <svg
            className="ml-2 h-4 w-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </>
    )

    const linkProps = item.external
      ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
      : { href: item.link }

    return (
      <div key={index} className="mobile-menu-item">
        <Link
          {...linkProps}
          onClick={(e) => handleMenuClick(item, e)}
          className={`mobile-menu-link${
            item.scrollTarget && activeSectionId === item.scrollTarget ? ' is-active' : ''
          }`}
        >
          {linkContent}
        </Link>
        {item.children && item.children.length > 0 && (
          <div className="mobile-submenu">
            {item.children.map((child, childIndex) => (
              <Link
                key={childIndex}
                href={child.link}
                target={child.external ? '_blank' : undefined}
                rel={child.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleMenuClick(child, e)}
                className="mobile-submenu-link"
              >
                {child.label}
                {child.external && (
                  <svg
                    className="ml-2 h-3 w-3 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className={`mobile-menu-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
      >
        {/* Mobile Menu Panel */}
        <div ref={menuRef} className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
          {/* Mobile Menu Header */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-header-left">
              <Link href="/" onClick={handleLogoClick} className="mobile-menu-logo">
                {logo ? (
                  <img src={logo.url} alt={logo.alt} width={logo.width} height={logo.height} />
                ) : logoText ? (
                  <h1>{logoText}</h1>
                ) : (
                  <h1>district.</h1>
                )}
              </Link>
            </div>
            <div className="mobile-menu-header-right">
              <EnhancedLanguageSwitcher
                currentLocale={locale}
                onLanguageChange={onLanguageChange}
                theme="transparent"
                disabled={isLanguageChanging}
              />
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div ref={menuItemsRef} className="mobile-menu-items">
            {menuItems.map(renderMenuItem)}
          </div>

          {/* Mobile Menu Footer */}
          <div className="mobile-menu-footer">
            <div className="mobile-social-links">
              <a href="#" className="mobile-social-link">
                Facebook
              </a>
              <a href="#" className="mobile-social-link">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
