'use client'

import { localeLang } from '@/utils/locale'
import { usePathname } from 'next/navigation'

interface LanguageSwitcherProps {
  currentLocale: string
  slug: string
}

export default function LanguageSwitcher({ currentLocale, slug: _slug }: LanguageSwitcherProps) {
  const pathname = usePathname()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    window.location.href = newPath // full reload
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
