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
 *   RE_SEED_SKIP_STANOVI  — if "true", skip PDF parse + buildings seed
 *   RE_SEED_STANOVI_MEDIA_ID — Payload `media.id` (PDF prenesen u Admin → Mediji)
 *   RE_SEED_STANOVI_DOCUMENT_ID — legacy: `documents.id` (deprecated; koristite media)
 *   STANOVI_DOCUMENT_ID   — isto kao gore (alias)
 *   STANOVI_PDF           — lokalna datoteka (dev); upload u `documents` ako postoji na disku
 *   RE_SEED_NON_INTERACTIVE — "true" = bez interaktivnog odabira PDF-a iz Mediji (CI / produkcija)
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
import { createSeedLog, seedColor, seedPayloadContext, withTimeout, type SeedStep, runSeedFormWorker } from './seed-ui'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const log = createSeedLog('seed:real-estate')
const FORM_OP_TIMEOUT_MS = 120_000

/** Must run before any import of `payload.config` — that module reads `process.env` at load time. */
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const LOCALES = ['hr', 'en', 'de'] as const

/** Zatvara pg pool iz Payload postgres adaptera — inače Node često ostane „visiti”. */
async function shutdownDbPool(payload: Payload): Promise<void> {
  try {
    const pool = (payload as unknown as { db?: { pool?: { end: () => Promise<void> } } }).db?.pool
    if (pool && typeof pool.end === 'function') {
      await pool.end()
      console.info(`    ${seedColor.dim('·')} DB pool zatvoren`)
    }
  } catch {
    console.info(`    ${seedColor.warn('!')} Zatvaranje DB poola preskočeno`)
  }
}

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
      context: seedPayloadContext,
    })
    const existing = found.docs[0]
    if (existing?.id) {
      if (lookupAlt === legacyAlt && alt !== legacyAlt) {
        await payload.update({
          collection: 'media',
          id: existing.id,
          overrideAccess: true,
      context: seedPayloadContext,
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
    context: seedPayloadContext,
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
      context: seedPayloadContext,
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
  step: SeedStep,
): Promise<Record<keyof typeof SEED_MEDIA_ALTS, number>> {
  type MK = keyof typeof SEED_MEDIA_ALTS
  if (process.env.RE_SEED_SKIP_MEDIA === 'true') {
    step.detail('RE_SEED_SKIP_MEDIA=true — koristim postojeće slike')
    const need = Object.keys(SEED_MEDIA_ALTS).length
    const any = await payload.find({
      collection: 'media',
      where: { mimeType: { contains: 'image' } },
      limit: need,
      depth: 0,
      overrideAccess: true,
      context: seedPayloadContext,
    })
    const ids = any.docs.map((d) => (typeof d.id === 'number' ? d.id : Number(d.id))).filter(Boolean)
    if (ids.length < need) {
      step.fail(`RE_SEED_SKIP_MEDIA=true ali nema ${need} slika u medijima.`)
    }
    const keys = Object.keys(SEED_MEDIA_ALTS) as MK[]
    return Object.fromEntries(keys.map((k, i) => [k, ids[i]])) as Record<MK, number>
  }

  const keys = Object.keys(SEED_MEDIA_ALTS) as MK[]
  const entries: [MK, number][] = []
  for (const key of keys) {
    step.detail(`medij: ${key}…`)
    entries.push([key, await getOrCreateSeedMedia(payload, key, imageUrls[key], tenantId)])
  }
  return Object.fromEntries(entries) as Record<MK, number>
}

const STANOVI_DOC_TITLE = 'KVART ŽIGICA — jedinice (PDF)'
const LEGACY_STANOVI_DOC_TITLE = 'seed:re-landing:unit-details-pdf'
const STANOVI_FLOORPLAN_ALT = 'KVART ŽIGICA — tlocrt (placeholder)'
const LEGACY_STANOVI_FLOORPLAN_ALT = 'seed:re-landing:floorplan-placeholder'
const LEGACY_STANOVI_BUILDING_TITLE = 'KVART ŽIGICA — stanovi (seed)'

function parseEnvStanoviMediaId(): number | null {
  const raw = process.env.RE_SEED_STANOVI_MEDIA_ID?.trim()
  if (!raw) return null
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) {
    console.warn(`  Ignoriram neispravan RE_SEED_STANOVI_MEDIA_ID="${raw}"`)
    return null
  }
  return n
}

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

async function fetchPdfBytesFromUpload(
  payload: Payload,
  collection: 'media' | 'documents',
  uploadId: number,
): Promise<Buffer> {
  const doc = await payload.findByID({
    collection,
    id: uploadId,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
  })
  const row = doc as { url?: string | null; filename?: string | null; mimeType?: string | null }
  if (row.mimeType && !row.mimeType.toLowerCase().includes('pdf')) {
    throw new Error(`${collection} id=${uploadId} nije PDF (${row.mimeType})`)
  }
  const url =
    row.url ??
    (row.filename && process.env.S3_BUCKET && process.env.S3_REGION
      ? `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${row.filename}`
      : null)
  if (!url) {
    throw new Error(
      `${collection} id=${uploadId} nema url/filename — prenesite PDF u Admin → Mediji.`,
    )
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || 'http://127.0.0.1:3000'
  const absolute = resolvePayloadFileUrl(url, base)
  const res = await fetch(absolute)
  if (!res.ok) {
    throw new Error(`Preuzimanje PDF-a nije uspjelo (${absolute}): HTTP ${res.status}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

/** @deprecated Koristi fetchPdfBytesFromUpload(..., 'media', id) */
async function fetchPdfBytesForDocument(payload: Payload, docId: number): Promise<Buffer> {
  return fetchPdfBytesFromUpload(payload, 'documents', docId)
}

async function fetchPdfBytesForMedia(payload: Payload, mediaId: number): Promise<Buffer> {
  return fetchPdfBytesFromUpload(payload, 'media', mediaId)
}

/**
 * Zgrada (`buildings.unitDetailsPdf`) i dalje referencira `documents`.
 * Odabrani PDF iz Mediji syncamo u documents (po filename) da frontend `/api/pdf-file` radi.
 */
async function ensureStanoviDocumentFromMedia(payload: Payload, mediaId: number): Promise<number> {
  const media = await payload.findByID({
    collection: 'media',
    id: mediaId,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
  })
  const row = media as {
    filename?: string | null
    alt?: string | null
    mimeType?: string | null
  }

  if (row.mimeType && !row.mimeType.toLowerCase().includes('pdf')) {
    throw new Error(`Medij id=${mediaId} nije PDF`)
  }

  const filename = row.filename?.trim()
  if (filename) {
    const byFilename = await payload.find({
      collection: 'documents',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      context: seedPayloadContext,
    })
    const existing = byFilename.docs[0]
    if (existing?.id) {
      return typeof existing.id === 'number' ? existing.id : Number(existing.id)
    }
  }

  const buffer = await fetchPdfBytesForMedia(payload, mediaId)
  const title = row.alt?.trim() || filename || STANOVI_DOC_TITLE
  const created = await payload.create({
    collection: 'documents',
    overrideAccess: true,
    context: seedPayloadContext,
    data: { title },
    file: {
      data: buffer,
      mimetype: 'application/pdf',
      name: filename || 'stanovi.pdf',
      size: buffer.length,
    },
  })
  return typeof created.id === 'number' ? created.id : Number(created.id)
}

async function listStanoviPdfMedia(payload: Payload, tenantId: number) {
  const pdfWhere = { mimeType: { contains: 'pdf' } } as const

  const forTenant = await payload.find({
    collection: 'media',
    where: {
      and: [
        pdfWhere,
        {
          or: [{ tenant: { equals: tenantId } }, { tenant: { exists: false } }],
        },
      ],
    } as Where,
    limit: 50,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
    sort: '-updatedAt',
  })

  if (forTenant.docs.length > 0) return forTenant.docs

  return (
    await payload.find({
      collection: 'media',
      where: pdfWhere,
      limit: 50,
      depth: 0,
      overrideAccess: true,
      context: seedPayloadContext,
      sort: '-updatedAt',
    })
  ).docs
}

/** Interaktivno: odabir PDF-a iz kolekcije `media` (Admin → Mediji). */
async function interactivePickStanoviPdfMedia(
  payload: Payload,
  tenantId: number,
): Promise<number | null> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    const pdfs = await listStanoviPdfMedia(payload, tenantId)
    if (!pdfs.length) {
      console.info(
        '\n  Nema PDF-ova u Mediji — prenesite STANOVI.pdf u Admin → Mediji (application/pdf), zatim pokrenite seed ponovno.',
      )
      console.info('  Ili postavite RE_SEED_STANOVI_MEDIA_ID=<id>.\n')
      return null
    }

    console.info('\n  PDF datoteke u Mediji (odabir za import stanova / zgradu):')
    pdfs.forEach((d, i) => {
      const alt = (d as { alt?: string | null }).alt?.trim()
      const fn = (d as { filename?: string | null }).filename || ''
      const id = typeof d.id === 'number' ? d.id : Number(d.id)
      const tenant = (d as { tenant?: number | { id?: number } | null }).tenant
      const tenantLabel =
        tenant == null
          ? ''
          : typeof tenant === 'object'
            ? ` tenant=${tenant.id ?? '?'}`
            : ` tenant=${tenant}`
      console.info(`    ${i + 1}) id=${id}  ${alt || fn || '(bez naziva)'}  ${fn}${tenantLabel}`)
    })
    console.info('    0) Preskoči (bez zgrade / tipologije iz PDF-a)\n')

    const ans = (await rl.question('  Upišite broj (0–N): ')).trim()
    const n = Number.parseInt(ans, 10)
    if (!Number.isFinite(n) || n < 1) return null
    const pick = pdfs[n - 1]
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
      context: seedPayloadContext,
    })
    const existing = found.docs[0]
    if (existing?.id) {
      if (title === LEGACY_STANOVI_DOC_TITLE) {
        await payload.update({
          collection: 'documents',
          id: existing.id,
          overrideAccess: true,
      context: seedPayloadContext,
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
    context: seedPayloadContext,
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
      context: seedPayloadContext,
    })
    const existing = found.docs[0]
    if (existing?.id) {
      if (alt === LEGACY_STANOVI_FLOORPLAN_ALT) {
        await payload.update({
          collection: 'media',
          id: existing.id,
          overrideAccess: true,
      context: seedPayloadContext,
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
    context: seedPayloadContext,
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
 * Parsira PDF stanova (Mediji → documents sync), kreira placeholder tlocrt,
 * upsert-a `buildings` s jedinicama, te iz istog parsa gradi redove za blok tipologije.
 */
async function seedStanoviBuildingsFromPdf(
  payload: Payload,
  tenantId: number,
  step: SeedStep,
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
      context: seedPayloadContext,
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
    step.skip('Stanovi PDF / zgrade preskočeno (RE_SEED_SKIP_STANOVI=true)')
    return empty()
  }

  let docId: number
  let pdfBuffer: Buffer

  const envMediaId = parseEnvStanoviMediaId()
  const envDocId = parseEnvStanoviDocumentId()
  const pdfPath = path.resolve(
    process.cwd(),
    (process.env.STANOVI_PDF || 'Stanovi Compressed.pdf').trim(),
  )

  if (envMediaId != null) {
    try {
      pdfBuffer = await fetchPdfBytesForMedia(payload, envMediaId)
      docId = await ensureStanoviDocumentFromMedia(payload, envMediaId)
      step.detail(`Stanovi PDF: Mediji id=${envMediaId} → documents id=${docId}`)
    } catch (e) {
      step.detail(`Učitavanje PDF-a iz Mediji nije uspjelo: ${e instanceof Error ? e.message : e}`)
      return empty()
    }
  } else if (envDocId != null) {
    docId = envDocId
    try {
      pdfBuffer = await fetchPdfBytesForDocument(payload, docId)
      step.detail(`Stanovi PDF: documents id=${docId} (legacy env)`)
    } catch (e) {
      step.detail(`Učitavanje PDF-a iz documents nije uspjelo: ${e instanceof Error ? e.message : e}`)
      return empty()
    }
  } else if (fs.existsSync(pdfPath)) {
    pdfBuffer = fs.readFileSync(pdfPath)
    docId = await getOrCreateStanoviPdfDocument(payload, pdfPath)
    step.detail(`Stanovi PDF: lokalna datoteka → documents id=${docId}`)
  } else if (
    process.stdin.isTTY &&
    process.env.RE_SEED_NON_INTERACTIVE !== 'true' &&
    process.env.CI !== 'true'
  ) {
    const pickedMediaId = await interactivePickStanoviPdfMedia(payload, tenantId)
    if (pickedMediaId == null) {
      step.skip('Preskočen odabir PDF-a — nema importa stanova / zgrade')
      return empty()
    }
    try {
      pdfBuffer = await fetchPdfBytesForMedia(payload, pickedMediaId)
      docId = await ensureStanoviDocumentFromMedia(payload, pickedMediaId)
      step.detail(`Stanovi PDF: odabran Mediji id=${pickedMediaId} → documents id=${docId}`)
    } catch (e) {
      step.detail(`Učitavanje odabranog PDF-a nije uspjelo: ${e instanceof Error ? e.message : e}`)
      return empty()
    }
  } else {
    step.skip(
      `Nema PDF-a u Mediji — prenesite u Admin → Mediji, postavite RE_SEED_STANOVI_MEDIA_ID, ili pokrenite seed interaktivno`,
    )
    return empty()
  }

  const { dedupeStanPagesByLabel, parseStanoviPdfBuffer, placeholderUnitPolygon } = await import(
    '../src/utils/parseStanoviPdf'
  )

  const parsedPages = dedupeStanPagesByLabel(await parseStanoviPdfBuffer(pdfBuffer))
  if (parsedPages.length === 0) {
    step.detail(`Nema jedinica u PDF-u (documents id=${docId}) — preskačem zgradu`)
    return empty()
  }

  step.detail(`PDF: ${parsedPages.length} jedinica parsirano`)

  const { deriveTypologyItemsFromParsedPages } = await import('../src/utils/deriveTypologyFromStanoviPdf')
  const typologyItems = deriveTypologyItemsFromParsedPages(parsedPages)
  const pdfUnitCount = parsedPages.length

  const existingBuilding = await payload.find({
    collection: 'buildings',
    where: { title: { equals: buildingTitle } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
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
      context: seedPayloadContext,
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
      context: seedPayloadContext,
      data: buildingData,
    })
    step.detail(`Ažurirana zgrada „${buildingTitle}” id=${id} (${units.length} jedinica)`)
    buildingId = typeof id === 'number' ? id : Number(id)
  } else {
    const created = await payload.create({
      collection: 'buildings',
      overrideAccess: true,
      context: seedPayloadContext,
      data: {
        title: buildingTitle,
        ...buildingData,
      },
    })
    const newId = created.id
    step.detail(`Kreirana zgrada „${buildingTitle}” id=${newId} (${units.length} jedinica)`)
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
  step: SeedStep,
): Promise<void> {
  if (process.env.RE_SEED_SKIP_FOOTER === 'true') {
    step.skip('Kolekcija Podnožja preskočena (RE_SEED_SKIP_FOOTER=true)')
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
      context: seedPayloadContext,
    })
    if (!footerDocIsReLandingSeedStub(existingDoc as Record<string, unknown>)) {
      step.skip(
        `Podnožje id=${id} već postoji (ručno uređeno; RE_SEED_FORCE_TENANT_FOOTER=true ili clean:real-estate)`,
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
      context: seedPayloadContext,
      data: {
        ...localized('hr'),
        tenant: tenantId,
      },
    })
    id = created.id
    step.detail(`Kreirano Podnožje (kolekcija) id=${id}`)
  } else {
    step.detail(
      `Ažuriram Podnožje id=${id}${force ? ' — RE_SEED_FORCE_TENANT_FOOTER' : ' (seed stub)'}`,
    )
  }

  for (const loc of ['hr', 'en', 'de'] as const) {
    step.detail(`Podnožje lokalizacija: ${loc}…`)
    await payload.update({
      collection: 'footer',
      id: id!,
      locale: loc,
      overrideAccess: true,
      context: seedPayloadContext,
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

/**
 * Briše rezultate prethodnog `seed:real-estate` za istog tenanta (slug + STANOVI_BUILDING_TITLE + seed altovi).
 * Zgrada i dokument naslova `seed:re-landing:unit-details-pdf` nisu vezani na tenanta u CMS-u — oprez ako dijelite bazu.
 */
async function cleanReLandingSeedArtifacts(
  payload: Payload,
  tenantId: number,
  slug: string,
  step: SeedStep,
): Promise<void> {
  const buildingTitle = (process.env.STANOVI_BUILDING_TITLE || 'KVART ŽIGICA — stanovi').trim()
  step.detail('RE_SEED_CLEAN — brišem stare seed zapise…')

  const delCount = { pages: 0, buildings: 0, media: 0, documents: 0, footers: 0 }

  const pageRows = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }],
    } as Where,
    limit: 50,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
  })
  for (const doc of pageRows.docs) {
    if (doc?.id != null) {
      await payload.delete({
        collection: 'pages',
        id: doc.id,
        overrideAccess: true,
        context: seedPayloadContext,
      })
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
      context: seedPayloadContext,
    })
    for (const doc of bRows.docs) {
      if (doc?.id != null) {
        await payload.delete({
          collection: 'buildings',
          id: doc.id,
          overrideAccess: true,
          context: seedPayloadContext,
        })
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
      context: seedPayloadContext,
    })
    for (const doc of found.docs) {
      if (doc?.id != null) {
        await payload.delete({
          collection: 'media',
          id: doc.id,
          overrideAccess: true,
          context: seedPayloadContext,
        })
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
      context: seedPayloadContext,
    })
    for (const doc of seedPdf.docs) {
      if (doc?.id != null) {
        await payload.delete({
          collection: 'documents',
          id: doc.id,
          overrideAccess: true,
          context: seedPayloadContext,
        })
        delCount.documents++
      }
    }
  }

  if (process.env.RE_SEED_CLEAN_SKIP_FOOTER === 'true') {
    step.detail(
      `Obrisano: stranice=${delCount.pages}, zgrade=${delCount.buildings}, mediji=${delCount.media}, dokumenti=${delCount.documents}; Podnožja preskočeno`,
    )
    return
  }

  const footers = await payload.find({
    collection: 'footer',
    where: { tenant: { equals: tenantId } },
    limit: 20,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
  })
  for (const doc of footers.docs) {
    if (doc?.id != null) {
      await payload.delete({
        collection: 'footer',
        id: doc.id,
        overrideAccess: true,
        context: seedPayloadContext,
      })
      delCount.footers++
    }
  }

  step.detail(
    `Obrisano: stranice=${delCount.pages}, zgrade=${delCount.buildings}, mediji=${delCount.media}, dokumenti=${delCount.documents}, podnožja=${delCount.footers}`,
  )
}

async function run(): Promise<void> {
  const { assertSeedAllowed } = await import('./seed-guard')
  assertSeedAllowed('seed:real-estate')

  const totalSteps = 8
  const slug = (process.env.RE_SEED_PAGE_SLUG || 'real-estate').trim()
  const tenantHint =
    process.env.RE_SEED_TENANT_SUBDOMAIN?.trim() ||
    (process.env.RE_SEED_TENANT_NAME || 'Real estate').trim()

  log.banner('Real Estate landing', {
    slug,
    tenant: tenantHint,
    skipMedia: process.env.RE_SEED_SKIP_MEDIA === 'true' ? 'da' : 'ne',
    skipStanovi: process.env.RE_SEED_SKIP_STANOVI === 'true' ? 'da' : 'ne',
    clean: process.env.RE_SEED_CLEAN === 'true' ? 'da' : 'ne',
  })

  const s1 = log.step(1, totalSteps, 'Učitavam module')
  const { buildRealEstateLandingPayloadLayout, reLandingDemoImageUrls } = await import(
    '../src/data/realEstateLandingDemo'
  )
  const [{ getPayload }, { default: payloadConfig }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  s1.done('layout builder + Payload')

  const s2 = log.step(2, totalSteps, 'Spajam se na bazu')
  const resolvedConfig = await Promise.resolve(payloadConfig as Promise<typeof payloadConfig> | typeof payloadConfig)
  const payload = await getPayload({ config: resolvedConfig })
  s2.done('povezano')

  try {
    const s3 = log.step(3, totalSteps, 'Tenant')
    const tenant = await resolveTenantForSeed(payload)
    const tenantId = tenant.id
    s3.detail(`tenant id=${tenantId} (${tenant.name} · ${tenant.subdomain})`)

    if (process.env.RE_SEED_CLEAN === 'true') {
      await cleanReLandingSeedArtifacts(payload, tenantId, slug, s3)
    }
    s3.done('tenant')

    const s4 = log.step(4, totalSteps, 'Obrazac (Form Builder)')
    const inquiryFormId = await runSeedFormWorker('real-estate', s4)

    const s5 = log.step(5, totalSteps, 'Demo mediji')
    const mediaIds = await resolveMediaIds(payload, tenantId, reLandingDemoImageUrls, s5)
    s5.detail(
      `media: ${Object.entries(mediaIds)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`,
    )

    if (process.env.RE_SEED_MARKETING_FOOTER === 'true') {
      await ensureTenantMarketingFooter(payload, tenantId, tenant, s5)
    } else {
      s5.detail('Marketing Podnožje (kolekcija): preskočeno — RE landing podnožje je u layoutu')
    }
    s5.done('mediji')

    const s6 = log.step(6, totalSteps, 'Stanovi PDF (Mediji) → zgrada + tipologija')
    const stanovi = await seedStanoviBuildingsFromPdf(payload, tenantId, s6)
    if (stanovi.typologyItems?.length) {
      s6.detail(
        `Tipologija: ${stanovi.typologyItems.length} redova (${stanovi.typologyItems.map((r) => `${r.name}×${r.count}`).join(', ')})`,
      )
    } else {
      s6.detail('Tipologija: default iz demo datoteke (nema PDF podataka)')
    }
    if (stanovi.buildingId != null) {
      s6.detail(`Zgrada id=${stanovi.buildingId} (unit browser u layoutu)`)
    } else {
      s6.detail('Nema zgrade za unit browser (PDF ili skip)')
    }
    s6.done('stanovi / zgrada')

    const s7 = log.step(7, totalSteps, 'Layout blokova (hr, en, de)')
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
    s7.done(`${layouts.hr.length} blokova × 3 jezika`)

    const s8 = log.step(8, totalSteps, 'Stranica pages (hr, en, de)')
    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }],
      } as Where,
      limit: 1,
      depth: 0,
      overrideAccess: true,
      context: seedPayloadContext,
    })

    let pageId: string | number

    if (existing.docs[0]?.id) {
      pageId = existing.docs[0].id
      s8.detail(`Postojeća stranica id=${pageId}`)
    } else {
      s8.detail('Kreiram novu stranicu (hr)…')
      const created = await withTimeout(
        payload.create({
          collection: 'pages',
          locale: 'hr',
          overrideAccess: true,
          context: seedPayloadContext,
          data: {
            title: reLandingPageTitle('hr'),
            slug,
            tenant: tenantId,
            layout: layouts.hr,
            meta: { ...reLandingMeta('hr'), image: mediaIds.hero },
          },
        }),
        FORM_OP_TIMEOUT_MS,
        'kreiranje stranice',
      )
      pageId = created.id
      s8.detail(`Nova stranica id=${pageId}`)
    }

    for (const locale of LOCALES) {
      s8.detail(`Lokalizacija: ${locale}…`)
      await withTimeout(
        payload.update({
          collection: 'pages',
          id: pageId,
          locale,
          overrideAccess: true,
          context: seedPayloadContext,
          data: {
            title: reLandingPageTitle(locale),
            layout: layouts[locale],
            meta: { ...reLandingMeta(locale), image: mediaIds.hero },
            tenant: tenantId,
          },
        }),
        FORM_OP_TIMEOUT_MS,
        `stranica ${locale}`,
      )
    }
    s8.done(`stranica id=${pageId} (/${slug})`)

    log.success(
      `RE landing spremljen — Admin → Pages → „${reLandingPageTitle('hr')}”. Upit + podnožje u layoutu.`,
    )
  } finally {
    await shutdownDbPool(payload)
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    log.error('Seed nije uspio.', err)
    process.exit(1)
  })
