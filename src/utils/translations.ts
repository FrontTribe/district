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
  address: {
    hr: 'Adresa',
    en: 'Address',
    de: 'Adresse',
  },
  workingHours: {
    hr: 'Radno vrijeme',
    en: 'Working Hours',
    de: 'Öffnungszeiten',
  },
  closed: {
    hr: 'Zatvoreno',
    en: 'Closed',
    de: 'Geschlossen',
  },
  monday: {
    hr: 'Ponedjeljak',
    en: 'Monday',
    de: 'Montag',
  },
  tuesday: {
    hr: 'Utorak',
    en: 'Tuesday',
    de: 'Dienstag',
  },
  wednesday: {
    hr: 'Srijeda',
    en: 'Wednesday',
    de: 'Mittwoch',
  },
  thursday: {
    hr: 'Četvrtak',
    en: 'Thursday',
    de: 'Donnerstag',
  },
  friday: {
    hr: 'Petak',
    en: 'Friday',
    de: 'Freitag',
  },
  saturday: {
    hr: 'Subota',
    en: 'Saturday',
    de: 'Samstag',
  },
  sunday: {
    hr: 'Nedjelja',
    en: 'Sunday',
    de: 'Sonntag',
  },
}

export function getTranslation(key: string, locale: string): string {
  const validLocale = locale === 'hr' || locale === 'en' || locale === 'de' ? locale : 'hr'
  return translations[key]?.[validLocale] || translations[key]?.hr || key
}
