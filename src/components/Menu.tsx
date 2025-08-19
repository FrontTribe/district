'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MenuItem {
  label: string
  link: string
  scrollTarget?: string
  external?: boolean
  children?: MenuItem[]
}

interface MenuProps {
  menuItems?: MenuItem[]
  logo?: {
    url: string
    alt: string
    width: number
    height: number
  }
  logoText?: string
}

export const Menu: React.FC<MenuProps> = ({ menuItems = [], logo, logoText }) => {
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

  const renderMenuItem = (item: MenuItem, index: number) => {
    const linkContent = (
      <>
        {item.label}
        {item.external && (
          <svg
            className="ml-1 h-4 w-4 inline"
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
      <li key={index} className="relative group">
        <Link
          {...linkProps}
          onClick={(e) => handleMenuClick(item, e)}
          className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {linkContent}
        </Link>
        {item.children && item.children.length > 0 && (
          <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.children.map((child, childIndex) => (
              <li key={childIndex}>
                <Link
                  href={child.link}
                  target={child.external ? '_blank' : undefined}
                  rel={child.external ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleMenuClick(child, e)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {child.label}
                  {child.external && (
                    <svg
                      className="ml-1 h-3 w-3 inline"
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
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {logo ? (
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-8 w-auto"
                />
              ) : logoText ? (
                <span className="text-xl font-bold text-gray-900">{logoText}</span>
              ) : (
                <span className="text-xl font-bold text-gray-900">Logo</span>
              )}
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map(renderMenuItem)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
