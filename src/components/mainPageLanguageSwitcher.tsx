'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { localeLang } from '@/utils/locale'

interface MainPageLanguageSwitcherProps {
  locale: string
}

export default function MainPageLanguageSwitcher({ locale }: MainPageLanguageSwitcherProps) {
  const pathname = usePathname()
  const _router = useRouter()
  const currentLocale = locale

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    // Force a full page reload to ensure server-side content is fetched with the new locale
    // This is necessary because the PageClient component uses useLivePreview which doesn't
    // handle locale changes properly without a full server-side re-render
    window.location.href = newPath
  }

  if (!localeLang.some((lang) => lang.code === currentLocale)) {
    return null
  }

  return (
    <select value={currentLocale} onChange={handleChange} aria-label="Select language">
      {localeLang.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  )
}
