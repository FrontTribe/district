import type { ParsedStanPage } from './parseStanoviPdf'

/** Jedan red u Payload bloku `real-estate-landing-typology` (seed iz PDF-a). */
export type TypologyFromPdfItem = {
  unitCode: string
  /** Ključ tipa iz PDF parsera — za prijevod naziva/opisa u EN/DE seedu. */
  unitTypeKey: ParsedStanPage['unitType']
  name: string
  size: string
  description: string
  count: number
  highlight: boolean
}

const TYPE_ORDER: ParsedStanPage['unitType'][] = [
  'garsonijera',
  'jednosobni',
  'jednoipolsobni',
  'dvosobni',
  'dvoipolsobni',
  'trosobni',
  'penthouse',
  'other',
]

const TYPE_META: Record<
  ParsedStanPage['unitType'],
  { unitCode: string; name: string; description: string }
> = {
  garsonijera: {
    unitCode: 'g',
    name: 'Garsonijera',
    description: 'Kompaktan gradski stan',
  },
  jednosobni: {
    unitCode: '1s',
    name: 'Jednosobni',
    description: 'Funkcionalan raspored za jednu osobu ili par',
  },
  jednoipolsobni: {
    unitCode: '1.5',
    name: 'Jednoipolsobni',
    description: 'Dodata polusoba — fleksibilniji dnevni boravak',
  },
  dvosobni: {
    unitCode: 'd',
    name: 'Dvosobni',
    description: 'Idealno za mlade obitelji',
  },
  dvoipolsobni: {
    unitCode: '2.5',
    name: 'Dvoipolsobni',
    description: 'Više prostora za rad od kuće ili dječju sobu',
  },
  trosobni: {
    unitCode: 't',
    name: 'Trosobni',
    description: 'Prostor za obitelj s djecom',
  },
  penthouse: {
    unitCode: 'ph',
    name: 'Penthouse',
    description: 'Vrhunac etže s panoramom',
  },
  other: {
    unitCode: '—',
    name: 'Ostalo',
    description: 'Tipovi izvan standardne nomenklature u PDF-u',
  },
}

function formatNetRangeM2(areas: number[]): string {
  const valid = areas.filter((n) => Number.isFinite(n) && n > 0)
  if (valid.length === 0) return '—'
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const fmt = (x: number) => {
    const r = Math.round(x * 10) / 10
    return Number.isInteger(r) ? String(r) : r.toFixed(1).replace(/\.0$/, '')
  }
  if (min === max) return `${fmt(min)} m²`
  return `${fmt(min)}–${fmt(max)} m²`
}

/**
 * Grupira deduplicirane stranice PDF-a po `unitType`, broji jedinice i računa raspon neto m².
 * Redoslijed redova: od garsonijere prema penthouseu, `other` na kraju.
 */
export function deriveTypologyItemsFromParsedPages(pages: ParsedStanPage[]): TypologyFromPdfItem[] {
  if (!pages.length) return []

  const byType = new Map<ParsedStanPage['unitType'], ParsedStanPage[]>()
  for (const p of pages) {
    const list = byType.get(p.unitType)
    if (list) list.push(p)
    else byType.set(p.unitType, [p])
  }

  const out: TypologyFromPdfItem[] = []
  for (const t of TYPE_ORDER) {
    const list = byType.get(t)
    if (!list?.length) continue
    const meta = TYPE_META[t]
    const nets = list.map((x) => x.netArea).filter((n): n is number => n != null && Number.isFinite(n) && n > 0)
    const count = list.length
    out.push({
      unitCode: meta.unitCode,
      unitTypeKey: t,
      name: meta.name,
      size: formatNetRangeM2(nets),
      description: meta.description,
      count,
      highlight: false,
    })
  }

  return out
}
