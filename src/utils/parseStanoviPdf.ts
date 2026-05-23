/**
 * Parsiranje teksta sa stranica PDF-a "Stanovi" (npr. `Stanovi Compressed.pdf`).
 * Očekuje se blok s retkom poput: `DILATACIJA A  DVOSOBNI STAN A.1.1.` i `POVRŠINA UKUPNO  48,39  46,87`.
 */

export type ParsedStanPage = {
  pageNumber: number
  label: string
  dilatacija: string
  floor: number
  unitType:
    | 'garsonijera'
    | 'jednosobni'
    | 'jednoipolsobni'
    | 'dvosobni'
    | 'dvoipolsobni'
    | 'trosobni'
    | 'penthouse'
    | 'other'
  netArea?: number
  grossArea?: number
}

const STAN_RE =
  /(GARSONIJERA|JEDNOIPOLSOBNI|JEDNOSOBNI|DVOSOBNI|DVOIPOLSOBNI|TROSOBNI|PENTHOUSE)\s+STAN\s+([A-Z]\.\d+\.\d+)\.?/i

const DIL_RE = /DILATACIJA\s+([A-Z0-9]+)/i
const FLOOR_RE = /(\d+)\.\s*KAT/i
const PRIZ_RE = /PRIZEMLJE/i
const AREA_RE = /POVRŠINA\s+UKUPNO\s+([\d.,]+)\s+([\d.,]+)/i

export function parseHrDecimal(raw: string): number {
  let s = raw.trim().replace(/\s/g, '')
  const hasComma = s.includes(',')
  const hasDot = s.includes('.')
  if (hasComma && hasDot) {
    // EU thousands: 1.234,56
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.')
    } else {
      s = s.replace(/,/g, '')
    }
  } else if (hasComma) {
    s = s.replace(',', '.')
  }
  const n = Number.parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

function mapStanType(raw: string): ParsedStanPage['unitType'] {
  const u = raw.toUpperCase()
  if (u === 'GARSONIJERA') return 'garsonijera'
  if (u === 'JEDNOSOBNI') return 'jednosobni'
  if (u === 'JEDNOIPOLSOBNI') return 'jednoipolsobni'
  if (u === 'DVOSOBNI') return 'dvosobni'
  if (u === 'DVOIPOLSOBNI') return 'dvoipolsobni'
  if (u === 'TROSOBNI') return 'trosobni'
  if (u === 'PENTHOUSE') return 'penthouse'
  return 'other'
}

export function parseStanoviPageText(pageText: string, pageNumber: number): ParsedStanPage | null {
  const stan = pageText.match(STAN_RE)
  if (!stan) return null

  const typeWord = stan[1]
  const code = stan[2]
  const label = `${typeWord} STAN ${code}`.replace(/\s+/g, ' ')

  const dil = pageText.match(DIL_RE)?.[1]?.trim() || 'A'

  let floor = 0
  if (PRIZ_RE.test(pageText)) floor = 0
  else {
    const fm = pageText.match(FLOOR_RE)
    if (fm) floor = Number.parseInt(fm[1], 10)
  }

  const am = pageText.match(AREA_RE)
  let netArea: number | undefined
  let grossArea: number | undefined
  if (am) {
    netArea = parseHrDecimal(am[1])
    grossArea = parseHrDecimal(am[2])
  }

  return {
    pageNumber,
    label,
    dilatacija: dil,
    floor,
    unitType: mapStanType(typeWord),
    netArea,
    grossArea,
  }
}

/**
 * pdfjs-dist (korišten u `pdf-parse` v2) pri učitavanju baca ako `Array.prototype`
 * ima vlastita enumerable svojstva — npr. `Array.prototype.random` iz nekog globalnog patcha.
 * Privremeno ih čini neenumerabilnima tijekom parsiranja, zatim vraća deskriptore.
 */
async function withSanitizedArrayPrototypeForPdfJs<T>(run: () => Promise<T>): Promise<T> {
  const proto = Array.prototype
  const patched: { key: PropertyKey; desc: PropertyDescriptor }[] = []
  for (const key of Reflect.ownKeys(proto)) {
    const d = Object.getOwnPropertyDescriptor(proto, key)
    if (!d?.enumerable || d.configurable === false) continue
    patched.push({ key, desc: d })
    Object.defineProperty(proto, key, { ...d, enumerable: false })
  }
  try {
    return await run()
  } finally {
    for (const { key, desc } of patched) {
      try {
        Object.defineProperty(proto, key, desc)
      } catch {
        /* ignore restore failure */
      }
    }
  }
}

/** Trokuti u donjem desnom dijelu (različiti po indeksu) — admin zamijeni crtanjem na tlocrtu. */
export function placeholderUnitPolygon(index: number): { x: number; y: number }[] {
  const col = index % 10
  const row = Math.floor(index / 10) % 8
  const baseX = 58 + col * 3.5
  const baseY = 78 + row * 2.2
  return [
    { x: baseX, y: baseY },
    { x: baseX + 3, y: baseY },
    { x: baseX + 1.5, y: baseY - 2.2 },
  ]
}

export async function parseStanoviPdfBuffer(buffer: Buffer): Promise<ParsedStanPage[]> {
  return withSanitizedArrayPrototypeForPdfJs(async () => {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    const { pages } = await parser.getText()
    const out: ParsedStanPage[] = []
    for (const p of pages) {
      const pageNum = typeof p.num === 'number' && Number.isFinite(p.num) ? p.num : out.length + 1
      const parsed = parseStanoviPageText(String(p.text ?? ''), pageNum)
      if (parsed) out.push(parsed)
    }
    return out
  })
}

/** Ista oznaka stan može se pojaviti na više stranica PDF-a — zadrži prvu stranicu (najmanji broj). */
export function dedupeStanPagesByLabel(pages: ParsedStanPage[]): ParsedStanPage[] {
  const byLabel = new Map<string, ParsedStanPage>()
  for (const r of pages) {
    const prev = byLabel.get(r.label)
    if (!prev || r.pageNumber < prev.pageNumber) byLabel.set(r.label, r)
  }
  return [...byLabel.values()].sort((a, b) => a.pageNumber - b.pageNumber)
}
