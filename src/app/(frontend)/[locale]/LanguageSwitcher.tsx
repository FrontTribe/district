'use client'

import { useRouter, usePathname } from 'next/navigation'

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
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value

    // Build new path by replacing locale segment
    // Assuming URL structure: /[locale]/[slug]
    const segments = pathname.split('/')
    segments[1] = newLocale // Replace locale segment
    router.push(segments.join('/'))
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
