'use client'

import { usePathname } from 'next/navigation'

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
]

interface LanguageSwitcherProps {
  currentLocale: string
  slug: string
}

export default function LanguageSwitcher({ currentLocale, slug }: LanguageSwitcherProps) {
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
      {locales.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  )
}
