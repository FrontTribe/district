'use client'

import React, { useState, useRef, useEffect } from 'react'
import { localeLang } from '@/utils/locale'

interface EnhancedLanguageSwitcherProps {
  currentLocale: string
  onLanguageChange: (locale: string) => void
  theme?: 'transparent' | 'dark' | 'light' | 'hub'
  disabled?: boolean
  /** `hub-inline` matches District landing topbar (HR · EN · DE). */
  variant?: 'dropdown' | 'hub-inline' | 'boutique-inline'
}

export default function EnhancedLanguageSwitcher({
  currentLocale,
  onLanguageChange,
  theme = 'transparent',
  disabled = false,
  variant = 'dropdown',
}: EnhancedLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = localeLang.find((lang) => lang.code === currentLocale)

  useEffect(() => {
    if (variant === 'hub-inline' || variant === 'boutique-inline') return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [variant])

  const handleLanguageSelect = (locale: string) => {
    if (disabled) return
    onLanguageChange(locale)
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={`enhanced-language-switcher theme-${theme} ${disabled ? 'disabled' : ''} ${variant === 'hub-inline' ? 'enhanced-language-switcher--hub-inline' : ''} ${variant === 'boutique-inline' ? 'enhanced-language-switcher--boutique-inline' : ''}`}
      ref={dropdownRef}
    >
      {variant === 'hub-inline' ? (
        <div className="hub-lang" role="group" aria-label="Language">
          {localeLang.map((lang, index) => (
            <React.Fragment key={lang.code}>
              {index > 0 ? (
                <span className="hub-lang__dot" aria-hidden>
                  ·
                </span>
              ) : null}
              <button
                type="button"
                className={`hub-lang__btn${lang.code === currentLocale ? ' hub-lang__btn--active' : ''}`}
                aria-pressed={lang.code === currentLocale}
                onClick={() => handleLanguageSelect(lang.code)}
                disabled={disabled}
              >
                {lang.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      ) : variant === 'boutique-inline' ? (
        <div className="boutique-lang" role="group" aria-label="Language">
          {localeLang.map((lang, index) => (
            <React.Fragment key={lang.code}>
              {index > 0 ? (
                <span className="boutique-lang__dot" aria-hidden>
                  ·
                </span>
              ) : null}
              <button
                type="button"
                className={`boutique-lang__btn${lang.code === currentLocale ? ' boutique-lang__btn--active' : ''}`}
                aria-pressed={lang.code === currentLocale}
                onClick={() => handleLanguageSelect(lang.code)}
                disabled={disabled}
              >
                {lang.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <>
          <button
            className="language-trigger"
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-haspopup="true"
            disabled={disabled}
          >
            <span className="current-language">{currentLanguage?.label || 'EN'}</span>
            <svg
              className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={`language-dropdown ${isOpen ? 'open' : ''}`}>
            {localeLang.map(({ code, label }) => (
              <button
                key={code}
                className={`language-option ${code === currentLocale ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(code)}
                disabled={disabled}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
