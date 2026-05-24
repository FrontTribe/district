import type { ParsedStanPage } from '@/utils/parseStanoviPdf'
import type { TypologyFromPdfItem } from '@/utils/deriveTypologyFromStanoviPdf'
import { reLandingSeedPacks, type ReLandingLocale, type ReLandingSeedLocalePack } from '@/data/reLandingSeedDefaults'

export type { ReLandingLocale, ReLandingHeadingPart } from '@/data/reLandingSeedDefaults'
/** @deprecated Usklađeno s CMS seed paketom — koristi `ReLandingSeedLocalePack`. */
export type LocalePack = ReLandingSeedLocalePack

const PACKS = reLandingSeedPacks

export function getReLandingLocalePack(locale: ReLandingLocale): LocalePack {
  return PACKS[locale] ?? PACKS.hr
}

const UNIT_I18N: Record<
  'en' | 'de',
  Record<ParsedStanPage['unitType'], { name: string; description: string }>
> = {
  en: {
    garsonijera: { name: 'Studio', description: 'Compact city apartment' },
    jednosobni: { name: 'One-bedroom', description: 'Efficient layout for one person or a couple' },
    jednoipolsobni: { name: '1.5-bedroom', description: 'Extra half-room for a flexible living area' },
    dvosobni: { name: 'Two-bedroom', description: 'Ideal for young families' },
    dvoipolsobni: { name: '2.5-bedroom', description: 'More space for home office or a kids’ room' },
    trosobni: { name: 'Three-bedroom', description: 'Space for a family with children' },
    penthouse: { name: 'Penthouse', description: 'Top floor with panoramic views' },
    other: { name: 'Other', description: 'Types outside the standard PDF naming' },
  },
  de: {
    garsonijera: { name: 'Garsoniere', description: 'Kompakte Stadtwohnung' },
    jednosobni: { name: 'Einzimmer', description: 'Funktional für eine Person oder Paare' },
    jednoipolsobni: { name: '1,5-Zimmer', description: 'Zusätzlicher Halbraum — flexiblerer Wohnbereich' },
    dvosobni: { name: 'Zweizimmer', description: 'Ideal für junge Familien' },
    dvoipolsobni: { name: '2,5-Zimmer', description: 'Mehr Platz für Homeoffice oder Kinderzimmer' },
    trosobni: { name: 'Dreizimmer', description: 'Raum für Familien mit Kindern' },
    penthouse: { name: 'Penthouse', description: 'Oberste Etage mit Panorama' },
    other: { name: 'Sonstige', description: 'Typen außerhalb der Standard-PDF-Nomenklatur' },
  },
}

const HR_UNIT_TYPE_NAMES: Record<ParsedStanPage['unitType'], string> = {
  garsonijera: 'Garsonijera',
  jednosobni: 'Jednosobni',
  jednoipolsobni: '1.5-sobni',
  dvosobni: '2-sobni',
  dvoipolsobni: '2.5-sobni',
  trosobni: '3-sobni',
  penthouse: 'Penthouse',
  other: '—',
}

/** Oznake tipa na kartici stana (CMS / seed ne prevode PDF, ali UI da). */
export const UNIT_TYPE_LABELS_BY_LOCALE: Record<
  ReLandingLocale,
  Record<ParsedStanPage['unitType'] | 'other', string>
> = {
  hr: HR_UNIT_TYPE_NAMES,
  en: {
    garsonijera: UNIT_I18N.en.garsonijera.name,
    jednosobni: UNIT_I18N.en.jednosobni.name,
    jednoipolsobni: UNIT_I18N.en.jednoipolsobni.name,
    dvosobni: UNIT_I18N.en.dvosobni.name,
    dvoipolsobni: UNIT_I18N.en.dvoipolsobni.name,
    trosobni: UNIT_I18N.en.trosobni.name,
    penthouse: UNIT_I18N.en.penthouse.name,
    other: UNIT_I18N.en.other.name,
  },
  de: {
    garsonijera: UNIT_I18N.de.garsonijera.name,
    jednosobni: UNIT_I18N.de.jednosobni.name,
    jednoipolsobni: UNIT_I18N.de.jednoipolsobni.name,
    dvosobni: UNIT_I18N.de.dvosobni.name,
    dvoipolsobni: UNIT_I18N.de.dvoipolsobni.name,
    trosobni: UNIT_I18N.de.trosobni.name,
    penthouse: UNIT_I18N.de.penthouse.name,
    other: UNIT_I18N.de.other.name,
  },
}

/** Prijevod redova tipologije iz PDF-a (naziv + opis); `size` i `count` ostaju. */
export function translateTypologyPdfRows(
  items: TypologyFromPdfItem[] | null | undefined,
  locale: ReLandingLocale,
): TypologyFromPdfItem[] | undefined {
  if (!items?.length) return undefined
  if (locale === 'hr') return items.map((i) => ({ ...i }))
  const table = UNIT_I18N[locale as 'en' | 'de']
  return items.map((row) => {
    const key = row.unitTypeKey ?? 'other'
    const t = table[key] ?? table.other
    return { ...row, name: t.name, description: t.description }
  })
}

export function typologyIntroFromPdf(locale: ReLandingLocale, unitCount: number, typeCount: number): string {
  if (locale === 'en') {
    return `Counts and net m² ranges in the table are derived from the technical PDF: ${unitCount} units across ${typeCount} apartment types.`
  }
  if (locale === 'de') {
    return `Anzahl und Netto-m²-Spanne in der Tabelle stammen aus dem technischen PDF: ${unitCount} Einheiten in ${typeCount} Wohnungstypen.`
  }
  return `Broj jedinica i raspon neto m² u tablici izračunati su iz tehničkog elaborata (PDF): ${unitCount} jedinica, ${typeCount} tipova stanova.`
}


/** Naslov stranice u CMS-u / tabu (po jeziku). */
export function reLandingPageTitle(locale: ReLandingLocale): string {
  if (locale === 'en') return 'Real estate — Landing'
  if (locale === 'de') return 'Real estate — Landing'
  return 'Real estate - Landing'
}

/** Fallback redovi tipologije kad nema PDF-a (s `unitTypeKey` za EN/DE prijevod u buildu). */
export const typologyDemoRows: Record<ReLandingLocale, TypologyFromPdfItem[]> = {
  hr: [
    {
      unitCode: 'g',
      unitTypeKey: 'garsonijera',
      name: 'Garsonijera',
      size: '28–34 m²',
      description: 'Kompaktan gradski stan',
      count: 12,
      highlight: false,
    },
    {
      unitCode: 'd',
      unitTypeKey: 'dvosobni',
      name: 'Dvosobni',
      size: '55–72 m²',
      description: 'Idealno za mlade obitelji',
      count: 24,
      highlight: false,
    },
  ],
  en: [
    {
      unitCode: 'g',
      unitTypeKey: 'garsonijera',
      name: 'Studio',
      size: '28–34 m²',
      description: 'Compact city apartment',
      count: 12,
      highlight: false,
    },
    {
      unitCode: 'd',
      unitTypeKey: 'dvosobni',
      name: 'Two-bedroom',
      size: '55–72 m²',
      description: 'Ideal for young families',
      count: 24,
      highlight: false,
    },
  ],
  de: [
    {
      unitCode: 'g',
      unitTypeKey: 'garsonijera',
      name: 'Garsoniere',
      size: '28–34 m²',
      description: 'Kompakte Stadtwohnung',
      count: 12,
      highlight: false,
    },
    {
      unitCode: 'd',
      unitTypeKey: 'dvosobni',
      name: 'Zweizimmer',
      size: '55–72 m²',
      description: 'Ideal für junge Familien',
      count: 24,
      highlight: false,
    },
  ],
}

export function reLandingMeta(locale: ReLandingLocale): { title: string; description: string } {
  if (locale === 'en') {
    return {
      title: 'District — Real estate (landing)',
      description: 'Premium residential concept — District Real Estate.',
    }
  }
  if (locale === 'de') {
    return {
      title: 'District — Real estate (Landing)',
      description: 'Premium-Wohnkonzept — District Real Estate.',
    }
  }
  return {
    title: 'District — Real estate (landing)',
    description: 'Premium stambeni koncept — District Real Estate.',
  }
}
