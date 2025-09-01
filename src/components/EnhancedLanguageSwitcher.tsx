'use client'

import { useState, useRef, useEffect } from 'react'
import { localeLang } from '@/utils/locale'

interface EnhancedLanguageSwitcherProps {
  currentLocale: string
  onLanguageChange: (locale: string) => void
  theme?: 'transparent' | 'dark' | 'light'
  disabled?: boolean
}

export default function EnhancedLanguageSwitcher({
  currentLocale,
  onLanguageChange,
  theme = 'transparent',
  disabled = false,
}: EnhancedLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = localeLang.find((lang) => lang.code === currentLocale)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
      className={`enhanced-language-switcher theme-${theme} ${disabled ? 'disabled' : ''}`}
      ref={dropdownRef}
    >
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
    </div>
  )
}
