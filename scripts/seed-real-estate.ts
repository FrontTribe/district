/**
 * Seeds the Real Estate landing page (Payload `pages.layout`; početni tekstovi u
 * `src/data/reLandingSeedDefaults.ts`). Produkcija čita isključivo CMS.
 *
 * Layout završava blokovima **upit** (`real-estate-landing-inquiry`) + **podnožje** (`real-estate-landing-page-footer`).
 * Obrazac: Payload Form Builder (`forms` kolekcija), referenciran iz inquiry bloka.
 *
 * Prerequisites: `.env` / `.env.local` with `DATABASE_URI`, `PAYLOAD_SECRET`, S3 credentials (media uses S3).
 * Slike za landing: `public/re-landing/*.jpg` (5 komada). Ažuriraj iz `District Real Estate.html`:
 *   pnpm run extract:real-estate-images
 * Note: those files are loaded before importing Payload config — a static `import` of `payload.config` would run before `dotenv` and leave `PAYLOAD_SECRET` empty.
 *
 * Usage (from repo root):
 *   pnpm run seed:real-estate
 *   pnpm run clean:real-estate   — prvo briše stare RE seed zapise za tenanta, zatim isti seed kao gore
 *
 * Env (optional):
 *   RE_SEED_TENANT_NAME   — tenant display name (default: "Real estate")
 *   RE_SEED_TENANT_SUBDOMAIN — match tenant by subdomain instead of name
 *   RE_SEED_PAGE_SLUG     — page slug (default: "real-estate")
 *   RE_SEED_SKIP_MEDIA    — if "true", reuse first 5 image media docs for tenant (may look wrong)
 *   RE_SEED_SKIP_STANOVI  — if "true", skip PDF parse + documents/media/buildings seed
 *   RE_SEED_STANOVI_DOCUMENT_ID — Payload `documents.id` (PDF već u CMS-u; preuzima se za parse)
 *   STANOVI_DOCUMENT_ID   — isto kao gore (alias)
 *   STANOVI_PDF           — lokalna datoteka (dev); ako postoji, upload u `documents` s naslovom seeda
 *   RE_SEED_NON_INTERACTIVE — "true" = bez readline odabira PDF-a (CI / produkcija skripta)
 *   STANOVI_BUILDING_TITLE — buildings.title for upsert (default: KVART ŽIGICA — stanovi)
 *   ALLOW_SEED           — set `true` to run against non-dev DATABASE_URI (see scripts/seed-guard.ts)
 *   RE_SEED_SKIP_FOOTER   — ako je "true", ne dira kolekciju Podnožja (marketing footer za ostale stranice)
 *   RE_SEED_MARKETING_FOOTER — ako je "true", kreira/ažurira marketing Podnožje u kolekciji (nije RE landing strip)
 *   RE_SEED_FORCE_TENANT_FOOTER — pregazi marketing Podnožje čak i kad nije seed stub (ručno uređeno).
 *   RE_SEED_CLEAN — ako je "true", prije ostalog briše za ovog tenanta: stranicu (slug+tenant), zgradu
 *     (STANOVI_BUILDING_TITLE), seed medije (altovi re-landing + tlocrt), dokument naslova
 *     `seed:re-landing:unit-details-pdf`, te marketing Podnožje (osim ako RE_SEED_CLEAN_SKIP_FOOTER=true).
 *     Koristi `pnpm run clean:real-estate` (isti skript, postavlja RE_SEED_CLEAN).
 *   RE_SEED_CLEAN_SKIP_FOOTER — uz RE_SEED_CLEAN: ne briši kolekciju Podnožja (marketing footer za tenanta).
 */
import fs from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import type { Payload, Where } from 'payload'
import sharp from 'sharp'

import { resolvePayloadFileUrl } from '../src/utils/resolvePayloadFileUrl'
import { getReLandingLocalePack } from '../src/data/realEstateLandingLocales'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function banner(title: string) {
  const line = '━'.repeat(56)
  console.info(`\n${line}\n  seed:real-estate  │  ${title}\n${line}`)
}

function step(n: number, total: number, label: string) {
  console.info(`\n  [${String(n).padStart(2)}/${total}] ${label}`)
}

/** Zatvara pg pool iz Payload postgres adaptera — inače Node često ostane „visiti”. */
async function shutdownDbPool(payload: Payload): Promise<void> {
  try {
    const pool = (payload as unknown as { db?: { pool?: { end: (cb?: (err?: Error) => void) => Promise<void> } } })
      .db?.pool
    if (pool && typeof pool.end === 'function') {
      await pool.end()
      console.info('\n  (DB pool zatvoren)')
    }
  } catch (e) {
    console.warn('\n  Upozorenje: zatvaranje DB poola nije uspjelo (nije kritično).', e)
  }
}

/** Must run before any import of `payload.config` — that module reads `process.env` at load time. */
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const LOCALES = ['hr', 'en', 'de'] as const

const SEED_MEDIA_ALTS = {
  hero: 'KVART ŽIGICA — hero',
  tzd018: 'KVART ŽIGICA — interijer 1',
  tzd019: 'KVART ŽIGICA — interijer 2',
  tzd021: 'KVART ŽIGICA — interijer 3',
  tzd026: 'KVART ŽIGICA — interijer 4',
} as const

/** Legacy altovi — brišu se uz clean; traže se pri ponovnom seedu ako novi alt još ne postoji. */
const LEGACY_SEED_MEDIA_ALTS: Record<keyof typeof SEED_MEDIA_ALTS, string> = {
  hero: 'seed:re-landing:hero',
  tzd018: 'seed:re-landing:tzd018',
  tzd019: 'seed:re-landing:tzd019',
  tzd021: 'seed:re-landing:tzd021',
  tzd026: 'seed:re-landing:tzd026',
}

type MediaKey = keyof typeof SEED_MEDIA_ALTS

async function downloadFile(url: string): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`)
  }
  const mime = res.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg'
  const buffer = Buffer.from(await res.arrayBuffer())
  const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpeg'
  return { buffer, mime, ext }
}

/** Lokalne datoteke iz `public/` (isti path kao u browseru, npr. `/re-landing/hero.jpg`). */
function readPublicImageFile(publicPath: string): { buffer: Buffer; mime: string; ext: string } {
  const rel = publicPath.replace(/^\//, '')
  const fsPath = path.resolve(__dirname, '../public', rel)
  if (!fs.existsSync(fsPath)) {
    throw new Error(`Seed image missing on disk: ${fsPath} (expected for ${publicPath})`)
  }
  const buffer = fs.readFileSync(fsPath)
  const lower = fsPath.toLowerCase()
  const ext = lower.endsWith('.png') ? 'png' : lower.endsWith('.webp') ? 'webp' : 'jpeg'
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
  return { buffer, mime, ext }
}

async function loadSeedImageBytes(url: string): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  if (url.startsWith('/')) {
    return readPublicImageFile(url)
  }
  return downloadFile(url)
}

async function getOrCreateSeedMedia(
  payload: Payload,
  key: MediaKey,
  sourceUrl: string,
  tenantId: number,
): Promise<number> {
  const alt = SEED_MEDIA_ALTS[key]
  const legacyAlt = LEGACY_SEED_MEDIA_ALTS[key]
  for (const lookupAlt of [alt, legacyAlt]) {
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: lookupAlt } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const existing = found.docs[0]
    if (existing?.id) {
      if (lookupAlt === legacyAlt && alt !== legacyAlt) {
        await payload.update({
          collection: 'media',
          id: existing.id,
          overrideAccess: true,
          data: { alt },
        })
      }
      return typeof existing.id === 'number' ? existing.id : Number(existing.id)
    }
  }

  const { buffer, mime, ext } = await loadSeedImageBytes(sourceUrl)
  const name = `re-landing-${key}.${ext}`

  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: {
      alt,
      tenant: tenantId,
    },
    file: {
      data: buffer,
      mimetype: mime,
      name,
      size: buffer.length,
    },
  })

  return typeof created.id === 'number' ? created.id : Number(created.id)
}

type ResolvedTenantForSeed = {
  id: number
  name: string
  subdomain: string
}

async function resolveTenantForSeed(payload: Payload): Promise<ResolvedTenantForSeed> {
  const bySubdomain = process.env.RE_SEED_TENANT_SUBDOMAIN?.trim()
  const byName = (process.env.RE_SEED_TENANT_NAME || 'Real estate').trim()

  const where: Where = bySubdomain
    ? { subdomain: { equals: bySubdomain } }
    : { name: { equals: byName } }

  const tenants = await payload.find({
    collection: 'tenants',
    where,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const t = tenants.docs[0]
  if (!t?.id) {
    const all = await payload.find({
      collection: 'tenants',
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    const names = all.docs.map((d) => `${d.name} (${d.subdomain})`).join(', ')
    throw new Error(
      `Tenant not found for ${bySubdomain ? `subdomain="${bySubdomain}"` : `name="${byName}"`}. ` +
        `Known tenants: ${names || '(none)'}. Set RE_SEED_TENANT_NAME or RE_SEED_TENANT_SUBDOMAIN.`,
    )
  }

  const id = typeof t.id === 'number' ? t.id : Number(t.id)
  const name = typeof t.name === 'string' ? t.name : String(t.name ?? 'Tenant')
  const subdomain =
    typeof (t as { subdomain?: string }).subdomain === 'string'
      ? (t as { subdomain: string }).subdomain
      : String((t as { subdomain?: string }).subdomain ?? '')

  return { id, name, subdomain }
}

async function resolveMediaIds(
  payload: Payload,
  tenantId: number,
  imageUrls: Record<keyof typeof SEED_MEDIA_ALTS, string>,
): Promise<Record<keyof typeof SEED_MEDIA_ALTS, number>> {
  type MK = keyof typeof SEED_MEDIA_ALTS
  if (process.env.RE_SEED_SKIP_MEDIA === 'true') {
    const need = Object.keys(SEED_MEDIA_ALTS).length
    const any = await payload.find({
      collection: 'media',
      where: { mimeType: { contains: 'image' } },
      limit: need,
      depth: 0,
      overrideAccess: true,
    })
    const ids = any.docs.map((d) => (typeof d.id === 'number' ? d.id : Number(d.id))).filter(Boolean)
    if (ids.length < need) {
      throw new Error(`RE_SEED_SKIP_MEDIA=true but fewer than ${need} image media documents exist.`)
    }
    const keys = Object.keys(SEED_MEDIA_ALTS) as MK[]
    return Object.fromEntries(keys.map((k, i) => [k, ids[i]])) as Record<MK, number>
  }

  const keys = Object.keys(SEED_MEDIA_ALTS) as MK[]
  const entries = await Promise.all(
    keys.map(async (k) => [k, await getOrCreateSeedMedia(payload, k, imageUrls[k], tenantId)] as const),
  )
  return Object.fromEntries(entries) as Record<MK, number>
}

const STANOVI_DOC_TITLE = 'KVART ŽIGICA — jedinice (PDF)'
const LEGACY_STANOVI_DOC_TITLE = 'seed:re-landing:unit-details-pdf'
const STANOVI_FLOORPLAN_ALT = 'KVART ŽIGICA — tlocrt (placeholder)'
const LEGACY_STANOVI_FLOORPLAN_ALT = 'seed:re-landing:floorplan-placeholder'
const LEGACY_STANOVI_BUILDING_TITLE = 'KVART ŽIGICA — stanovi (seed)'

function parseEnvStanoviDocumentId(): number | null {
  const raw =
    process.env.RE_SEED_STANOVI_DOCUMENT_ID?.trim() || process.env.STANOVI_DOCUMENT_ID?.trim()
  if (!raw) return null
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) {
    console.warn(`  Ignoriram neispravan STANOVI_DOCUMENT_ID / RE_SEED_STANOVI_DOCUMENT_ID="${raw}"`)
    return null
  }
  return n
}

async function fetchPdfBytesForDocument(payload: Payload, docId: number): Promise<Buffer> {
  const doc = await payload.findByID({
    collection: 'documents',
    id: docId,
    depth: 0,
    overrideAccess: true,
  })
  const row = doc as { url?: string | null; filename?: string | null }
  const url =
    row.url ??
    (row.filename && process.env.S3_BUCKET && process.env.S3_REGION
      ? `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${row.filename}`
      : null)
  if (!url) {
    throw new Error(`Dokument id=${docId} nema url/filename — prenesite PDF u Admin → Documents.`)
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || 'http://127.0.0.1:3000'
  const absolute = resolvePayloadFileUrl(url, base)
  const res = await fetch(absolute)
  if (!res.ok) {
    throw new Error(`Preuzimanje PDF-a nije uspjelo (${absolute}): HTTP ${res.status}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

/** Interaktivno: odabir jednog retka iz kolekcije `documents` (zadnjih N). */
async function interactivePickStanoviDocument(payload: Payload): Promise<number | null> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    const docs = await payload.find({
      collection: 'documents',
      limit: 40,
      depth: 0,
      overrideAccess: true,
      sort: '-updatedAt',
    })
    if (!docs.docs.length) {
      console.info(
        '  Nema dokumenata u `documents` — prenesite PDF u Admin ili postavite RE_SEED_STANOVI_DOCUMENT_ID.',
      )
      return null
    }
    console.info('\n  PDF dokumenti u CMS-u (odabir za parsiranje stanova / zgradu):')
    docs.docs.forEach((d, i) => {
      const title = (d as { title?: string | null }).title || '(bez naslova)'
      const fn = (d as { filename?: string | null }).filename || ''
      const id = typeof d.id === 'number' ? d.id : Number(d.id)
      console.info(`    ${i + 1}) id=${id}  ${String(title)}  ${fn}`)
    })
    console.info('    0) Preskoči (bez zgrade / tipologije iz PDF-a)\n')
    const ans = (await rl.question('  Upišite broj (0–N): ')).trim()
    const n = Number.parseInt(ans, 10)
    if (!Number.isFinite(n) || n < 1) return null
    const pick = docs.docs[n - 1]
    if (!pick?.id) return null
    return typeof pick.id === 'number' ? pick.id : Number(pick.id)
  } finally {
    rl.close()
  }
}

async function getOrCreateStanoviPdfDocument(
  payload: Payload,
  pdfPath: string,
): Promise<number> {
  for (const title of [STANOVI_DOC_TITLE, LEGACY_STANOVI_DOC_TITLE]) {
    const found = await payload.find({
      collection: 'documents',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const existing = found.docs[0]
    if (existing?.id) {
      if (title === LEGACY_STANOVI_DOC_TITLE) {
        await payload.update({
          collection: 'documents',
          id: existing.id,
          overrideAccess: true,
          data: { title: STANOVI_DOC_TITLE },
        })
      }
      return typeof existing.id === 'number' ? existing.id : Number(existing.id)
    }
  }

  const buffer = fs.readFileSync(pdfPath)
  const name = path.basename(pdfPath) || 'stanovi.pdf'
  const created = await payload.create({
    collection: 'documents',
    overrideAccess: true,
    data: { title: STANOVI_DOC_TITLE },
    file: {
      data: buffer,
      mimetype: 'application/pdf',
      name,
      size: buffer.length,
    },
  })
  return typeof created.id === 'number' ? created.id : Number(created.id)
}

async function getOrCreateStanoviFloorPlanMedia(payload: Payload, tenantId: number): Promise<number> {
  for (const alt of [STANOVI_FLOORPLAN_ALT, LEGACY_STANOVI_FLOORPLAN_ALT]) {
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const existing = found.docs[0]
    if (existing?.id) {
      if (alt === LEGACY_STANOVI_FLOORPLAN_ALT) {
        await payload.update({
          collection: 'media',
          id: existing.id,
          overrideAccess: true,
          data: { alt: STANOVI_FLOORPLAN_ALT },
        })
      }
      return typeof existing.id === 'number' ? existing.id : Number(existing.id)
    }
  }

  const png = await sharp({
    create: {
      width: 1600,
      height: 900,
      channels: 3,
      background: { r: 245, g: 245, b: 248 },
    },
  })
    .png()
    .toBuffer()

  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt: STANOVI_FLOORPLAN_ALT, tenant: tenantId },
    file: {
      data: png,
      mimetype: 'image/png',
      name: 're-landing-floorplan-placeholder.png',
      size: png.length,
    },
  })
  return typeof created.id === 'number' ? created.id : Number(created.id)
}

/**
 * Parsira `STANOVI_PDF`, kreira/ponovno koristi dokument + placeholder tlocrt,
 * upsert-a `buildings` s jedinicama, te iz istog parsa gradi redove za blok tipologije.
 */
async function seedStanoviBuildingsFromPdf(
  payload: Payload,
  tenantId: number,
): Promise<{
  buildingId: number | null
  typologyItems: import('../src/utils/deriveTypologyFromStanoviPdf').TypologyFromPdfItem[] | null
  pdfUnitCount: number | null
}> {
  const buildingTitle = (process.env.STANOVI_BUILDING_TITLE || 'KVART ŽIGICA — stanovi').trim()

  const lookupExistingBuildingId = async (): Promise<number | null> => {
    const found = await payload.find({
      collection: 'buildings',
      where: { title: { equals: buildingTitle } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const id = found.docs[0]?.id
    if (id == null) return null
    return typeof id === 'number' ? id : Number(id)
  }

  const empty = async () => ({
    buildingId: await lookupExistingBuildingId(),
    typologyItems: null as import('../src/utils/deriveTypologyFromStanoviPdf').TypologyFromPdfItem[] | null,
    pdfUnitCount: null as number | null,
  })

  if (process.env.RE_SEED_SKIP_STANOVI === 'true') {
    console.info('RE_SEED_SKIP_STANOVI=true — skipping Stanovi PDF / buildings.')
    return empty()
  }

  let docId: number
  let pdfBuffer: Buffer

  const envDocId = parseEnvStanoviDocumentId()
  const pdfPath = path.resolve(
    process.cwd(),
    (process.env.STANOVI_PDF || 'Stanovi Compressed.pdf').trim(),
  )

  if (envDocId != null) {
    docId = envDocId
    try {
      pdfBuffer = await fetchPdfBytesForDocument(payload, docId)
      console.info(`  Stanovi PDF: CMS dokument id=${docId} (RE_SEED_STANOVI_DOCUMENT_ID / STANOVI_DOCUMENT_ID).`)
    } catch (e) {
      console.error('  Učitavanje PDF-a iz CMS dokumenta nije uspjelo:', e)
      return empty()
    }
  } else if (fs.existsSync(pdfPath)) {
    pdfBuffer = fs.readFileSync(pdfPath)
    docId = await getOrCreateStanoviPdfDocument(payload, pdfPath)
    console.info(`  Stanovi PDF: lokalna datoteka ${pdfPath} → documents id=${docId}.`)
  } else if (
    process.stdin.isTTY &&
    process.env.RE_SEED_NON_INTERACTIVE !== 'true' &&
    process.env.CI !== 'true'
  ) {
    const picked = await interactivePickStanoviDocument(payload)
    if (picked == null) {
      console.info('  Preskočen odabir PDF-a — nema importa stanova / zgrade.')
      return empty()
    }
    docId = picked
    try {
      pdfBuffer = await fetchPdfBytesForDocument(payload, docId)
      console.info(`  Stanovi PDF: interaktivno odabran CMS dokument id=${docId}.`)
    } catch (e) {
      console.error('  Učitavanje odabranog PDF-a nije uspjelo:', e)
      return empty()
    }
  } else {
    console.info(
      `  Nema lokalnog PDF-a (${pdfPath}), nema RE_SEED_STANOVI_DOCUMENT_ID, interaktivni odabir isključen — preskačem stanove.`,
    )
    return empty()
  }

  const { dedupeStanPagesByLabel, parseStanoviPdfBuffer, placeholderUnitPolygon } = await import(
    '../src/utils/parseStanoviPdf'
  )

  const parsedPages = dedupeStanPagesByLabel(await parseStanoviPdfBuffer(pdfBuffer))
  if (parsedPages.length === 0) {
    console.warn(`No unit pages parsed from PDF (documents id=${docId}) — skipping buildings.`)
    return empty()
  }

  const { deriveTypologyItemsFromParsedPages } = await import('../src/utils/deriveTypologyFromStanoviPdf')
  const typologyItems = deriveTypologyItemsFromParsedPages(parsedPages)
  const pdfUnitCount = parsedPages.length

  const existingBuilding = await payload.find({
    collection: 'buildings',
    where: { title: { equals: buildingTitle } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const floorPlanId = await getOrCreateStanoviFloorPlanMedia(payload, tenantId)

  type PrevUnitRow = {
    id?: string | number
    label?: string | null
    status?: string | null
    shape?: { points?: { x: number; y: number }[] }
  }

  let prevUnitsByLabel = new Map<string, PrevUnitRow>()
  if (existingBuilding.docs[0]?.id) {
    const existingId = existingBuilding.docs[0].id
    const existingFull = await payload.findByID({
      collection: 'buildings',
      id: existingId,
      depth: 0,
      overrideAccess: true,
    })
    const rows = (existingFull as { units?: PrevUnitRow[] | null }).units
    for (const row of rows ?? []) {
      const lab = row?.label != null ? String(row.label).trim() : ''
      if (lab) prevUnitsByLabel.set(lab, row)
    }
  }

  const units = parsedPages.map((p, i) => {
    const prev = prevUnitsByLabel.get(p.label)
    const status: 'available' | 'reserved' | 'sold' =
      prev?.status === 'reserved' || prev?.status === 'sold' ? prev.status : 'available'

    const pts = prev?.shape?.points
    const shape =
      Array.isArray(pts) && pts.length >= 3
        ? { points: pts.map((pt) => ({ x: pt.x, y: pt.y })) }
        : { points: placeholderUnitPolygon(i).map((pt) => ({ x: pt.x, y: pt.y })) }

    const row: Record<string, unknown> = {
      label: p.label,
      detailPageNumber: p.pageNumber,
      dilatacija: p.dilatacija,
      floor: p.floor,
      unitType: p.unitType,
      status,
      shape,
    }
    if (p.netArea != null) row.netArea = p.netArea
    if (p.grossArea != null) row.grossArea = p.grossArea
    if (prev?.id != null) row.id = prev.id
    return row
  })

  const buildingData = {
    floorPlanImage: floorPlanId,
    unitDetailsPdf: docId,
    units,
  }

  let buildingId: number

  if (existingBuilding.docs[0]?.id) {
    const id = existingBuilding.docs[0].id
    await payload.update({
      collection: 'buildings',
      id,
      overrideAccess: true,
      data: buildingData,
    })
    console.info(`Updated building "${buildingTitle}" id=${id} (${units.length} units).`)
    buildingId = typeof id === 'number' ? id : Number(id)
  } else {
    const created = await payload.create({
      collection: 'buildings',
      overrideAccess: true,
      data: {
        title: buildingTitle,
        ...buildingData,
      },
    })
    const newId = created.id
    console.info(`Created building "${buildingTitle}" id=${newId} (${units.length} units).`)
    buildingId = typeof newId === 'number' ? newId : Number(newId)
  }

  return {
    buildingId,
    typologyItems: typologyItems.length > 0 ? typologyItems : null,
    pdfUnitCount: typologyItems.length > 0 ? pdfUnitCount : null,
  }
}

/** Marketing `footer` koji je označio seed — na ponovni seed ažuriramo ga s podacima tenanta. */
function footerDocIsReLandingSeedStub(doc: Record<string, unknown>): boolean {
  const bottom = doc.bottomContent
  const collectStrings = (v: unknown): string[] => {
    if (v == null) return []
    if (typeof v === 'string') return [v]
    if (typeof v === 'object' && !Array.isArray(v)) {
      return Object.values(v as Record<string, unknown>).flatMap(collectStrings)
    }
    return []
  }
  const madeByStrings = bottom && typeof bottom === 'object' ? collectStrings((bottom as { madeBy?: unknown }).madeBy) : []
  if (madeByStrings.some((s) => s.includes('seed:re-landing'))) return true
  const titleStrings = collectStrings(doc.title)
  if (titleStrings.some((s) => s.includes(' (seed)'))) return true
  return false
}

/**
 * Marketing footer (`footer` kolekcija) za tenant — na RE landing ruti prikazuje se ispod layouta.
 *
 * - Novi tenant: kreira zapis.
 * - Postoji zapis iz seeda (`madeBy` s `seed:re-landing` ili naslov s ` (seed)`): **uvijek** ga ponovno
 *   uskladi s tenantom (naziv · subdomain) bez potrebe za RE_SEED_FORCE_TENANT_FOOTER.
 * - Ručno uređeno podnožje: ne diramo (osim RE_SEED_FORCE_TENANT_FOOTER=true ili clean:real-estate).
 */
async function ensureTenantMarketingFooter(
  payload: Payload,
  tenantId: number,
  tenant: ResolvedTenantForSeed,
): Promise<void> {
  if (process.env.RE_SEED_SKIP_FOOTER === 'true') {
    console.info('      → kolekcija Podnožja: preskočeno (RE_SEED_SKIP_FOOTER=true)')
    return
  }

  const year = new Date().getFullYear()
  const force = process.env.RE_SEED_FORCE_TENANT_FOOTER === 'true'

  const existing = await payload.find({
    collection: 'footer',
    where: { tenant: { equals: tenantId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  let id: string | number | undefined = existing.docs[0]?.id
  if (id != null && !force) {
    const existingDoc = await payload.findByID({
      collection: 'footer',
      id,
      depth: 0,
      overrideAccess: true,
    })
    if (!footerDocIsReLandingSeedStub(existingDoc as Record<string, unknown>)) {
      console.info(
        `      → Podnožje (kolekcija) već postoji id=${id} — nisam dirao (ručno uređeno; RE_SEED_FORCE_TENANT_FOOTER=true ili pnpm run clean:real-estate za seed tekstove)`,
      )
      return
    }
  }

  const localized = (loc: 'hr' | 'en' | 'de') => {
    const p = getReLandingLocalePack(loc)
    const phoneCol = p.footer.columns.find((c) => /telefon|phone/i.test(c.label))
    const tel =
      phoneCol?.lines.find((l) => l.linkType === 'phone')?.text.trim() ||
      '+385 99 231 123'
    const mailCol = p.footer.columns.find((c) => /pošta|email|e-mail|mail/i.test(c.label))
    const email =
      mailCol?.lines.find((l) => l.linkType === 'email')?.text.trim() || 'support@district.hr'

    const hqCol = p.footer.columns.find((c) => /sjedište|headquarters|sitz/i.test(c.label))
    const hqLines = hqCol?.lines.map((l) => l.text.trim()).filter(Boolean) ?? []
    const street = hqLines[0] || 'Ulica Ljudevita Posavskog 7'
    const city = hqLines[1] || '31000 Osijek'

    const contactHeading = loc === 'hr' ? 'Kontakt' : loc === 'en' ? 'Contact' : 'Kontakt'
    const addressHeading = loc === 'hr' ? 'Adresa' : loc === 'en' ? 'Address' : 'Adresse'
    const title =
      loc === 'hr'
        ? `Podnožje — ${tenant.name}`
        : loc === 'en'
          ? `Footer — ${tenant.name}`
          : `Fußzeile — ${tenant.name}`

    const socialCol = p.footer.columns.find((c) => /pratite|follow|folgen/i.test(c.label))
    const bottomLinks =
      socialCol?.lines
        .filter((l) => l.linkType === 'url' && l.href)
        .map((l) => ({
          text: l.text,
          url: l.href!,
          openInNewTab: Boolean(l.openInNewTab),
        })) ?? []

    return {
      title,
      leftContent: {
        heading: `<p><b>${p.footer.brandText}</b></p>`,
        subheading: p.footer.addressLine,
      },
      rightContent: {
        contact: {
          heading: contactHeading,
          email,
          phone: tel,
        },
        address: {
          heading: addressHeading,
          venue: 'District',
          street,
          city,
          country: loc === 'hr' ? 'Hrvatska' : loc === 'en' ? 'Croatia' : 'Kroatien',
        },
      },
      bottomContent: {
        copyright: p.footer.copyrightLine.replace(/\d{4}/, String(year)),
        ...(bottomLinks.length ? { links: bottomLinks } : {}),
      },
    }
  }

  if (id == null) {
    const created = await payload.create({
      collection: 'footer',
      locale: 'hr',
      overrideAccess: true,
      data: {
        ...localized('hr'),
        tenant: tenantId,
      },
    })
    id = created.id
    console.info(`      → kreirano Podnožje (kolekcija) id=${id}`)
  } else {
    console.info(
      `      → ažuriram Podnožje (kolekcija) id=${id}${force ? ' — RE_SEED_FORCE_TENANT_FOOTER' : ' (seed stub → tenant · subdomain)'}`,
    )
  }

  for (const loc of ['hr', 'en', 'de'] as const) {
    await payload.update({
      collection: 'footer',
      id: id!,
      locale: loc,
      overrideAccess: true,
      data: localized(loc),
    })
  }
}

function assertReLandingLayoutTail(layout: { blockType?: string }[], locale: string): void {
  const n = layout.length
  if (n < 2) {
    throw new Error(`[seed:real-estate] layout prekratak za ${locale} (${n} blokova)`)
  }
  const inquiry = layout[n - 2]?.blockType
  const footer = layout[n - 1]?.blockType
  if (inquiry !== 'real-estate-landing-inquiry') {
    throw new Error(
      `[seed:real-estate] pretposljednji blok mora biti upit (${locale}), dobiveno: ${String(inquiry)}`,
    )
  }
  if (footer !== 'real-estate-landing-page-footer') {
    throw new Error(
      `[seed:real-estate] zadnji blok mora biti podnožje (${locale}), dobiveno: ${String(footer)}`,
    )
  }
}

const RE_LANDING_INQUIRY_FORM_TITLE = 'Upit — KVART ŽIGICA'
const LEGACY_RE_LANDING_INQUIRY_FORM_TITLES = ['RE Landing — inquiry (seed)', 'RE Landing — inquiry']

/** Minimal Lexical rich text for Payload Form Builder `confirmationMessage`. */
function lexicalPlainParagraph(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

async function ensureReLandingInquiryForm(payload: Payload): Promise<number> {
  console.info('      → tražim postojeći obrazac…')
  const existing = await payload.find({
    collection: 'forms',
    locale: 'hr',
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })

  let id: string | number | undefined = existing.docs.find(
    (doc) =>
      doc.title?.trim() === RE_LANDING_INQUIRY_FORM_TITLE ||
      LEGACY_RE_LANDING_INQUIRY_FORM_TITLES.includes(doc.title?.trim() ?? ''),
  )?.id

  const buildFields = (loc: 'hr' | 'en' | 'de') => {
    const fs = getReLandingLocalePack(loc).formSeed
    return [
      {
        blockType: 'text' as const,
        name: 'name',
        label: fs.nameFieldLabel,
        required: true,
        placeholder: fs.namePlaceholder,
      },
      {
        blockType: 'text' as const,
        name: 'contact',
        label: fs.contactFieldLabel,
        required: true,
        placeholder: fs.contactPlaceholder,
      },
      {
        blockType: 'select' as const,
        name: 'interest',
        label: fs.interestFieldLabel,
        required: true,
        placeholder: fs.interestPlaceholder,
        options: fs.interestOptions.map((o) => ({ label: o.label, value: o.value })),
      },
      {
        blockType: 'textarea' as const,
        name: 'message',
        label: fs.messageFieldLabel,
        required: false,
        placeholder: fs.messagePlaceholder,
      },
    ]
  }

  const formDataForLocale = (loc: 'hr' | 'en' | 'de') => {
    const pack = getReLandingLocalePack(loc)
    return {
      title: RE_LANDING_INQUIRY_FORM_TITLE,
      submitButtonLabel: pack.inquiry.submitButtonLabel,
      confirmationType: 'message' as const,
      confirmationMessage: lexicalPlainParagraph(pack.inquiry.successMessage),
      fields: buildFields(loc),
    }
  }

  if (id == null) {
    console.info('      → kreiram obrazac (hr)…')
    const created = await payload.create({
      collection: 'forms',
      locale: 'hr',
      overrideAccess: true,
      data: formDataForLocale('hr'),
    })
    id = created.id
    console.info(`      → kreiran obrazac id=${id}`)
  } else {
    console.info(`      → obrazac već postoji id=${id} — ažuriram lokalizacije`)
  }

  for (const loc of ['hr', 'en', 'de'] as const) {
    console.info(`      → obrazac lokalizacija: ${loc}`)
    await payload.update({
      collection: 'forms',
      id: id!,
      locale: loc,
      overrideAccess: true,
      data: formDataForLocale(loc),
    })
  }

  console.info(`      → obrazac spreman id=${id}`)
  return Number(id)
}

/**
 * Briše rezultate prethodnog `seed:real-estate` za istog tenanta (slug + STANOVI_BUILDING_TITLE + seed altovi).
 * Zgrada i dokument naslova `seed:re-landing:unit-details-pdf` nisu vezani na tenanta u CMS-u — oprez ako dijelite bazu.
 */
async function cleanReLandingSeedArtifacts(
  payload: Payload,
  tenantId: number,
  slug: string,
): Promise<void> {
  const buildingTitle = (process.env.STANOVI_BUILDING_TITLE || 'KVART ŽIGICA — stanovi').trim()
  console.info('      → RE_SEED_CLEAN: brišem stare seed zapise…')

  const delCount = { pages: 0, buildings: 0, media: 0, documents: 0, footers: 0 }

  const pageRows = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }],
    } as Where,
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })
  for (const doc of pageRows.docs) {
    if (doc?.id != null) {
      await payload.delete({ collection: 'pages', id: doc.id, overrideAccess: true })
      delCount.pages++
    }
  }

  const buildingTitles = [buildingTitle, LEGACY_STANOVI_BUILDING_TITLE]
  for (const title of buildingTitles) {
    const bRows = await payload.find({
      collection: 'buildings',
      where: { title: { equals: title } },
      limit: 20,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of bRows.docs) {
      if (doc?.id != null) {
        await payload.delete({ collection: 'buildings', id: doc.id, overrideAccess: true })
        delCount.buildings++
      }
    }
  }

  const seedAlts = [
    ...Object.values(SEED_MEDIA_ALTS),
    ...Object.values(LEGACY_SEED_MEDIA_ALTS),
    STANOVI_FLOORPLAN_ALT,
    LEGACY_STANOVI_FLOORPLAN_ALT,
  ]
  for (const alt of seedAlts) {
    const found = await payload.find({
      collection: 'media',
      where: {
        and: [{ alt: { equals: alt } }, { tenant: { equals: tenantId } }],
      } as Where,
      limit: 30,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of found.docs) {
      if (doc?.id != null) {
        await payload.delete({ collection: 'media', id: doc.id, overrideAccess: true })
        delCount.media++
      }
    }
  }

  for (const docTitle of [STANOVI_DOC_TITLE, LEGACY_STANOVI_DOC_TITLE]) {
    const seedPdf = await payload.find({
      collection: 'documents',
      where: { title: { equals: docTitle } },
      limit: 10,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of seedPdf.docs) {
      if (doc?.id != null) {
        await payload.delete({ collection: 'documents', id: doc.id, overrideAccess: true })
        delCount.documents++
      }
    }
  }

  if (process.env.RE_SEED_CLEAN_SKIP_FOOTER === 'true') {
    console.info(
      `      → obrisano: stranice=${delCount.pages}, zgrade=${delCount.buildings}, mediji=${delCount.media}, dokumenti=${delCount.documents}; Podnožja preskočeno (RE_SEED_CLEAN_SKIP_FOOTER)`,
    )
    return
  }

  const footers = await payload.find({
    collection: 'footer',
    where: { tenant: { equals: tenantId } },
    limit: 20,
    depth: 0,
    overrideAccess: true,
  })
  for (const doc of footers.docs) {
    if (doc?.id != null) {
      await payload.delete({ collection: 'footer', id: doc.id, overrideAccess: true })
      delCount.footers++
    }
  }

  console.info(
    `      → obrisano: stranice=${delCount.pages}, zgrade=${delCount.buildings}, mediji=${delCount.media}, dokumenti=${delCount.documents}, podnožja=${delCount.footers}`,
  )
}

async function run(): Promise<void> {
  const { assertSeedAllowed } = await import('./seed-guard.ts')
  assertSeedAllowed('seed:real-estate')

  const totalSteps = 8
  const slug = (process.env.RE_SEED_PAGE_SLUG || 'real-estate').trim()
  const tenantHint =
    process.env.RE_SEED_TENANT_SUBDOMAIN?.trim() ||
    (process.env.RE_SEED_TENANT_NAME || 'Real estate').trim()

  banner('Real Estate landing')
  console.info(`  slug:         ${slug}`)
  console.info(`  tenant:       ${tenantHint}`)
  console.info(`  skip mediji:  ${process.env.RE_SEED_SKIP_MEDIA === 'true' ? 'da' : 'ne'}`)
  console.info(`  skip stanovi: ${process.env.RE_SEED_SKIP_STANOVI === 'true' ? 'da' : 'ne'}`)
  console.info(`  clean:        ${process.env.RE_SEED_CLEAN === 'true' ? 'da (brije pa seeda)' : 'ne'}`)

  step(1, totalSteps, 'Učitavam module (demo layout + Payload)…')
  const { buildRealEstateLandingPayloadLayout, reLandingDemoImageUrls } = await import(
    '../src/data/realEstateLandingDemo'
  )
  const [{ getPayload }, { default: payloadConfig }] = await Promise.all([
    import('payload'),
    import('../src/payload.config.ts'),
  ])
  console.info('      → gotovo')

  step(2, totalSteps, 'Spajam se na bazu (getPayload)…')
  const resolvedConfig = await Promise.resolve(payloadConfig as Promise<typeof payloadConfig> | typeof payloadConfig)
  const payload = await getPayload({ config: resolvedConfig })
  console.info('      → spojeno')

  try {
    step(3, totalSteps, 'Tenant + demo mediji (Unsplash ili skip)…')
    const tenant = await resolveTenantForSeed(payload)
    const tenantId = tenant.id
    console.info(`      → tenant id=${tenantId} (${tenant.name} · ${tenant.subdomain})`)

    if (process.env.RE_SEED_CLEAN === 'true') {
      await cleanReLandingSeedArtifacts(payload, tenantId, slug)
    }

    const mediaIds = await resolveMediaIds(payload, tenantId, reLandingDemoImageUrls)
    console.info(
      `      → media ids: ${Object.entries(mediaIds)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`,
    )

    if (process.env.RE_SEED_MARKETING_FOOTER === 'true') {
      await ensureTenantMarketingFooter(payload, tenantId, tenant)
    } else {
      console.info('      → marketing Podnožje (kolekcija): preskočeno (RE landing podnožje je u layoutu)')
    }

    step(4, totalSteps, 'Obrazac (Form Builder) za RE landing upit…')
    const inquiryFormId = await ensureReLandingInquiryForm(payload)

    step(5, totalSteps, 'Stanovi PDF → dokument, tlocrt, zgrada, tipologija…')
    const stanovi = await seedStanoviBuildingsFromPdf(payload, tenantId)
    if (stanovi.typologyItems?.length) {
      console.info(
        `      → tipologija: ${stanovi.typologyItems.length} redova (${stanovi.typologyItems.map((r) => `${r.name}×${r.count}`).join(', ')})`,
      )
    } else {
      console.info('      → tipologija: default iz demo datoteke (nema PDF podataka)')
    }
    if (stanovi.buildingId != null) {
      console.info(`      → zgrada id=${stanovi.buildingId} (unit browser u layoutu)`)
    } else {
      console.info('      → nema zgrade za unit browser (PDF ili skip)')
    }

    step(6, totalSteps, 'Sastavljam layout blokova (hr, en, de)…')
    const { reLandingPageTitle, reLandingMeta, typologyIntroFromPdf } = await import(
      '../src/data/realEstateLandingLocales'
    )

    const typologyOpts = (loc: (typeof LOCALES)[number]) => ({
      buildingId: stanovi.buildingId ?? undefined,
      typologyItems: stanovi.typologyItems ?? undefined,
      typologyIntro:
        stanovi.typologyItems?.length && stanovi.pdfUnitCount != null
          ? typologyIntroFromPdf(loc, stanovi.pdfUnitCount, stanovi.typologyItems.length)
          : undefined,
      formId: inquiryFormId,
    })

    const layouts = {
      hr: buildRealEstateLandingPayloadLayout(mediaIds, typologyOpts('hr'), 'hr'),
      en: buildRealEstateLandingPayloadLayout(mediaIds, typologyOpts('en'), 'en'),
      de: buildRealEstateLandingPayloadLayout(mediaIds, typologyOpts('de'), 'de'),
    }
    for (const loc of LOCALES) {
      assertReLandingLayoutTail(layouts[loc], loc)
    }
    console.info(`      → ${layouts.hr.length} blokova × 3 jezika (upit + podnožje u layoutu)`)
    step(7, totalSteps, 'Stranica `pages` (create ili update)…')
    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }],
      } as Where,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    let pageId: string | number

    if (existing.docs[0]?.id) {
      pageId = existing.docs[0].id
      console.info(`      → postojeća stranica id=${pageId}`)
    } else {
      const created = await payload.create({
        collection: 'pages',
        locale: 'hr',
        overrideAccess: true,
        data: {
          title: reLandingPageTitle('hr'),
          slug,
          tenant: tenantId,
          layout: layouts.hr,
          meta: { ...reLandingMeta('hr'), image: mediaIds.hero },
        },
      })
      pageId = created.id
      console.info(`      → nova stranica id=${pageId}`)
    }

    step(8, totalSteps, 'Lokalizacije hr, en, de…')
    for (const locale of LOCALES) {
      await payload.update({
        collection: 'pages',
        id: pageId,
        locale,
        overrideAccess: true,
        data: {
          title: reLandingPageTitle(locale),
          layout: layouts[locale],
          meta: { ...reLandingMeta(locale), image: mediaIds.hero },
          tenant: tenantId,
        },
      })
      console.info(`      → ${locale}: spremljeno`)
    }

    console.info(`\n  ✓ Završeno. Otvori Payload → Pages → „${reLandingPageTitle('hr')}” (slug /${slug})`)
    console.info(
      '  → RE landing podnožje: zadnji blok „RE landing — podnožje” u layoutu stranice.',
    )
    console.info(
      '  → Kontakt obrazac: blok „RE landing — upit” + obrazac u Obrasci (Form Builder).',
    )
    console.info(
      '  → Frontend dev: cache za stranice / menu / footer je isključen; u produkciji pričekaj revalidaciju ili spremi stranicu u Adminu.',
    )
  } finally {
    await shutdownDbPool(payload)
  }
}

run()
  .then(() => {
    console.info('\n[seed:real-estate] Izlaz iz procesa (0).\n')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n[seed:real-estate] Greška — izlaz (1).\n', err)
    process.exit(1)
  })
