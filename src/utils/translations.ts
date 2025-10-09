type Locale = 'hr' | 'en' | 'de'

type Translations = {
  [key: string]: {
    [key in Locale]: string
  }
}

const translations: Translations = {
  comingSoon: {
    hr: 'Uskoro',
    en: 'Coming Soon',
    de: 'Demnächst',
  },
  scrollToExplore: {
    hr: 'Skrolaj za istraživanje',
    en: 'Scroll to explore',
    de: 'Scrollen um zu erkunden',
  },
}

export function getTranslation(key: string, locale: string): string {
  const validLocale = (locale === 'hr' || locale === 'en' || locale === 'de') ? locale : 'hr'
  return translations[key]?.[validLocale] || translations[key]?.hr || key
}

