/**
 * Static Momento landing UI chrome (section labels, filter controls, aria text, etc.).
 * CMS copy lives in Payload `pages.layout` and `menu` — fetched per locale.
 *
 * next-intl is not installed yet; migrate these strings there when added.
 */
import type { MomentoLocale } from '@/data/momentoSeedDefaults'

export type MomentoUiCopy = {
  nav: {
    visitCta: string
    menuOpen: string
    menuClose: string
    mobileNav: string
    language: string
  }
  hero: {
    metaLeft: string
    metaLocation: string
    metaEst: string
    metaRight: string
    flourish: string
    hoursLabel: string
    menuItemsLabel: string
    scrollCue: string
  }
  story: {
    sectionAbout: string
    openNow: string
    sectionSpace: string
    spaceHeadingLine1: string
    spaceHeadingLine2: string
    galleryCaptions: string[]
    marquee: { t: string; em?: boolean }[]
    tags: string[]
    interiorAlt: string
  }
  offers: {
    sectionLabel: string
    headingLine1: string
    headingLine2: string
  }
  menu: {
    sectionLabel: string
    titleFallback: string
    menuEmphasis: string
    filterAll: string
    itemsCount: (n: number) => string
    prevCategories: string
    moreCategories: string
  }
  career: {
    sectionFallback: string
    quote: string
    quoteAuthor: string
  }
  location: {
    sectionLabel: string
    addressLabel: string
    contactLabel: string
    hoursLabel: string
    closed: string
    today: string
    mapSubline: string
    mapsAria: (street: string) => string
    titleTail: string
  }
  footer: {
    instagram: string
    madeByPrefix: string
    madeByAgency: string
    madeByUrl: string
  }
}

const hr: MomentoUiCopy = {
  nav: {
    visitCta: 'Posjeti nas',
    menuOpen: 'Otvori izbornik',
    menuClose: 'Zatvori izbornik',
    mobileNav: 'Mobilna navigacija',
    language: 'Jezik',
  },
  hero: {
    metaLeft: 'Lounge & Caffe Bar',
    metaLocation: 'Osijek · Retfala',
    metaEst: 'est. 2024',
    metaRight: 'by District —',
    flourish: 'Lounge & Caffe Bar u srcu Retfale',
    hoursLabel: 'Otvoreno svaki dan',
    menuItemsLabel: 'Stavki na meniju',
    scrollCue: 'Skrolaj',
  },
  story: {
    sectionAbout: '01 / O nama',
    openNow: 'Otvoreno sada',
    sectionSpace: '02 / Prostor',
    spaceHeadingLine1: 'Svjetlo, zelenilo,',
    spaceHeadingLine2: 'i miris kave.',
    galleryCaptions: ['Lounge', 'Bar', 'Enterijer', 'Detalji', 'Atmosfera', 'Terasa'],
    marquee: [
      { t: 'Espresso' },
      { t: 'Matcha latte', em: true },
      { t: 'Fresh sokovi' },
      { t: 'Slastice', em: true },
      { t: 'Craft pivo' },
      { t: 'Vina', em: true },
      { t: 'Kroasani' },
      { t: 'Aperitiv', em: true },
    ],
    tags: ['Kava', 'Matcha', 'Fresh sokovi', 'Craft pivo', 'Vina', 'Kroasani', 'Slastice', 'Aperitiv'],
    interiorAlt: 'Momento interijer',
  },
  offers: {
    sectionLabel: '03 / Posebna ponuda',
    headingLine1: 'Kombinacije koje',
    headingLine2: 'nas razmaze.',
  },
  menu: {
    sectionLabel: '04 / Cjenik',
    titleFallback: 'Naš',
    menuEmphasis: 'meni.',
    filterAll: 'Sve',
    itemsCount: (n) => `${n} stavki`,
    prevCategories: 'Prethodne kategorije',
    moreCategories: 'Više kategorija',
  },
  career: {
    sectionFallback: '05 / Momento zapošljava',
    quote: 'Najbolji dani su oni kada gosti odlaze s osmijehom.',
    quoteAuthor: '— Momento tim',
  },
  location: {
    sectionLabel: '06 / Lokacija',
    addressLabel: 'Adresa',
    contactLabel: 'Kontakt',
    hoursLabel: 'Radno vrijeme',
    closed: 'Zatvoreno',
    today: ' · danas',
    mapSubline: 'Osijek · Retfala',
    mapsAria: (street) => `Otvori ${street} u Google Maps`,
    titleTail: 'pronaći.',
  },
  footer: {
    instagram: 'Instagram ↗',
    madeByPrefix: 'Kreirao',
    madeByAgency: 'Front Tribe',
    madeByUrl: 'https://fronttribe.com',
  },
}

const en: MomentoUiCopy = {
  nav: {
    visitCta: 'Visit us',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    mobileNav: 'Mobile navigation',
    language: 'Language',
  },
  hero: {
    metaLeft: 'Lounge & Coffee Bar',
    metaLocation: 'Osijek · Retfala',
    metaEst: 'est. 2024',
    metaRight: 'by District —',
    flourish: 'Lounge & coffee bar in the heart of Retfala',
    hoursLabel: 'Open every day',
    menuItemsLabel: 'Items on the menu',
    scrollCue: 'Scroll',
  },
  story: {
    sectionAbout: '01 / About',
    openNow: 'Open now',
    sectionSpace: '02 / Space',
    spaceHeadingLine1: 'Light, greenery,',
    spaceHeadingLine2: 'and the aroma of coffee.',
    galleryCaptions: ['Lounge', 'Bar', 'Interior', 'Details', 'Atmosphere', 'Terrace'],
    marquee: [
      { t: 'Espresso' },
      { t: 'Matcha latte', em: true },
      { t: 'Fresh juices' },
      { t: 'Pastries', em: true },
      { t: 'Craft beer' },
      { t: 'Wines', em: true },
      { t: 'Croissants' },
      { t: 'Aperitif', em: true },
    ],
    tags: ['Coffee', 'Matcha', 'Fresh juices', 'Craft beer', 'Wines', 'Croissants', 'Pastries', 'Aperitif'],
    interiorAlt: 'Momento interior',
  },
  offers: {
    sectionLabel: '03 / Special offers',
    headingLine1: 'Combos that',
    headingLine2: 'spoil us.',
  },
  menu: {
    sectionLabel: '04 / Menu',
    titleFallback: 'Our',
    menuEmphasis: 'menu.',
    filterAll: 'All',
    itemsCount: (n) => `${n} items`,
    prevCategories: 'Previous categories',
    moreCategories: 'More categories',
  },
  career: {
    sectionFallback: '05 / Now hiring',
    quote: 'The best days are when guests leave with a smile.',
    quoteAuthor: '— The Momento team',
  },
  location: {
    sectionLabel: '06 / Location',
    addressLabel: 'Address',
    contactLabel: 'Contact',
    hoursLabel: 'Opening hours',
    closed: 'Closed',
    today: ' · today',
    mapSubline: 'Osijek · Retfala',
    mapsAria: (street) => `Open ${street} in Google Maps`,
    titleTail: 'find us.',
  },
  footer: {
    instagram: 'Instagram ↗',
    madeByPrefix: 'Made by',
    madeByAgency: 'Front Tribe',
    madeByUrl: 'https://fronttribe.com',
  },
}

const de: MomentoUiCopy = {
  nav: {
    visitCta: 'Besuchen Sie uns',
    menuOpen: 'Menü öffnen',
    menuClose: 'Menü schließen',
    mobileNav: 'Mobile Navigation',
    language: 'Sprache',
  },
  hero: {
    metaLeft: 'Lounge & Coffee Bar',
    metaLocation: 'Osijek · Retfala',
    metaEst: 'est. 2024',
    metaRight: 'by District —',
    flourish: 'Lounge & Coffee Bar im Herzen von Retfala',
    hoursLabel: 'Täglich geöffnet',
    menuItemsLabel: 'Artikel auf der Karte',
    scrollCue: 'Scrollen',
  },
  story: {
    sectionAbout: '01 / Über uns',
    openNow: 'Jetzt geöffnet',
    sectionSpace: '02 / Raum',
    spaceHeadingLine1: 'Licht, Grün,',
    spaceHeadingLine2: 'und Kaffeeduft.',
    galleryCaptions: ['Lounge', 'Bar', 'Interieur', 'Details', 'Atmosphäre', 'Terrasse'],
    marquee: [
      { t: 'Espresso' },
      { t: 'Matcha Latte', em: true },
      { t: 'Frische Säfte' },
      { t: 'Süßes', em: true },
      { t: 'Craft-Bier' },
      { t: 'Weine', em: true },
      { t: 'Croissants' },
      { t: 'Aperitif', em: true },
    ],
    tags: ['Kaffee', 'Matcha', 'Frische Säfte', 'Craft-Bier', 'Weine', 'Croissants', 'Süßes', 'Aperitif'],
    interiorAlt: 'Momento Interieur',
  },
  offers: {
    sectionLabel: '03 / Sonderangebote',
    headingLine1: 'Kombinationen, die',
    headingLine2: 'uns verwöhnen.',
  },
  menu: {
    sectionLabel: '04 / Speisekarte',
    titleFallback: 'Unsere',
    menuEmphasis: 'Karte.',
    filterAll: 'Alle',
    itemsCount: (n) => `${n} Artikel`,
    prevCategories: 'Vorherige Kategorien',
    moreCategories: 'Weitere Kategorien',
  },
  career: {
    sectionFallback: '05 / Wir stellen ein',
    quote: 'Die besten Tage sind die, an denen Gäste mit einem Lächeln gehen.',
    quoteAuthor: '— Das Momento-Team',
  },
  location: {
    sectionLabel: '06 / Standort',
    addressLabel: 'Adresse',
    contactLabel: 'Kontakt',
    hoursLabel: 'Öffnungszeiten',
    closed: 'Geschlossen',
    today: ' · heute',
    mapSubline: 'Osijek · Retfala',
    mapsAria: (street) => `${street} in Google Maps öffnen`,
    titleTail: 'finden.',
  },
  footer: {
    instagram: 'Instagram ↗',
    madeByPrefix: 'Erstellt von',
    madeByAgency: 'Front Tribe',
    madeByUrl: 'https://fronttribe.com',
  },
}

const packs: Record<MomentoLocale, MomentoUiCopy> = { hr, en, de }

export function getMomentoUiCopy(locale: string): MomentoUiCopy {
  const key = locale === 'en' || locale === 'de' ? locale : 'hr'
  return packs[key]
}

export function normalizeMomentoLocale(locale: string): MomentoLocale {
  if (locale === 'en' || locale === 'de') return locale
  return 'hr'
}
