'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { localeLang } from '@/utils/locale'

interface MainPageLanguageSwitcherProps {
    locale: string
}

export default function MainPageLanguageSwitcher({ locale }: MainPageLanguageSwitcherProps) {
    const pathname = usePathname()
    const router = useRouter()
    const currentLocale = locale

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value
        const segments = pathname.split('/')
        segments[1] = newLocale
        const newPath = segments.join('/')
        router.push(newPath)
    }

    if (!localeLang.some((lang) => lang.code === currentLocale)) {
        return null
    }

    return (
        <select
            value={currentLocale}
            onChange={handleChange}
            aria-label="Select language"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
            {localeLang.map(({ code, label }) => (
                <option key={code} value={code}>
                    {label}
                </option>
            ))}
        </select>
    )
}
