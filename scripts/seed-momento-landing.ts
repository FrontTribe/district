/**
 * Seeds the Momento landing page (Payload `pages.layout`; početni tekstovi u
 * `src/data/momentoSeedDefaults.ts`). Produkcija čita isključivo CMS.
 *
 * Layout blokovi (7): Hero → Intro → Image Grid → Concept Bar Menu → Job Opportunity → Location → Momento Footer.
 * Navigacija: kolekcija `menu` (tenant-menu).
 *
 * Prerequisites: `.env` / `.env.local` with `DATABASE_URI`, `PAYLOAD_SECRET`, S3 credentials.
 * Slike: `public/momento-landing/*.jpg` (6 komada). Ažuriraj iz `Momento by District.html`:
 *   pnpm run extract:momento-images
 *
 * Usage (from repo root):
 *   pnpm run seed:momento
 *   pnpm run clean:momento   — briše seed zapise pa seeda ponovno
 *
 * Env (optional):
 *   MOMENTO_SEED_TENANT_NAME       — default: "Momento"
 *   MOMENTO_SEED_TENANT_SUBDOMAIN  — match tenant by subdomain instead of name
 *   MOMENTO_SEED_PAGE_SLUG         — default: "momento"
 *   MOMENTO_SEED_SKIP_MEDIA        — if "true", reuse first 6 image media docs
 *   MOMENTO_SEED_SKIP_MENU         — if "true", ne dira kolekciju Izbornik
 *   MOMENTO_SEED_CLEAN             — briše stranicu, seed medije, menu stubove
 *   MOMENTO_SEED_CLEAN_SKIP_MENU   — uz CLEAN: ne briši Izbornik
 *   ALLOW_SEED                       — set `true` to run against non-dev DATABASE_URI (see scripts/seed-guard.ts)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import type { Payload, Where } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const LOCALES = ['hr', 'en', 'de'] as const

const SEED_MEDIA_ALTS = {
  hero: 'Momento — lounge hero',
  interior1: 'Momento — lounge interior',
  interior2: 'Momento — bar area',
  interior3: 'Momento — interior detail',
  terrace: 'Momento — terrace',
  career: 'Momento — team',
} as const

const LEGACY_SEED_MEDIA_ALTS: Record<keyof typeof SEED_MEDIA_ALTS, string> = {
  hero: 'seed:momento:hero',
  interior1: 'seed:momento:interior-1',
  interior2: 'seed:momento:interior-2',
  interior3: 'seed:momento:interior-3',
  terrace: 'seed:momento:terrace',
  career: 'seed:momento:career',
}

const MOMENTO_SEED_MENU_TITLE = 'Momento — navigacija'
const LEGACY_MOMENTO_SEED_MENU_TITLES = ['Momento — navigacija (seed)']

type MediaKey = keyof typeof SEED_MEDIA_ALTS

function banner(title: string) {
  const line = '━'.repeat(56)
  console.info(`\n${line}\n  seed:momento  │  ${title}\n${line}`)
}

function step(n: number, total: number, label: string) {
  console.info(`\n  [${String(n).padStart(2)}/${total}] ${label}`)
}

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
      where: {
        and: [{ alt: { equals: lookupAlt } }, { tenant: { equals: tenantId } }],
      } as Where,
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

  const { buffer, mime, ext } = readPublicImageFile(sourceUrl)
  const name = `momento-${key}.${ext}`

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
  const bySubdomain = process.env.MOMENTO_SEED_TENANT_SUBDOMAIN?.trim()
  const byName = (process.env.MOMENTO_SEED_TENANT_NAME || 'Momento').trim()

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
        `Known tenants: ${names || '(none)'}. Set MOMENTO_SEED_TENANT_NAME or MOMENTO_SEED_TENANT_SUBDOMAIN.`,
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
  imageUrls: Record<MediaKey, string>,
): Promise<Record<MediaKey, number>> {
  if (process.env.MOMENTO_SEED_SKIP_MEDIA === 'true') {
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
      throw new Error(`MOMENTO_SEED_SKIP_MEDIA=true but fewer than ${need} image media documents exist.`)
    }
    const keys = Object.keys(SEED_MEDIA_ALTS) as MediaKey[]
    return Object.fromEntries(keys.map((k, i) => [k, ids[i]])) as Record<MediaKey, number>
  }

  const keys = Object.keys(SEED_MEDIA_ALTS) as MediaKey[]
  const entries = await Promise.all(
    keys.map(async (k) => [k, await getOrCreateSeedMedia(payload, k, imageUrls[k], tenantId)] as const),
  )
  return Object.fromEntries(entries) as Record<MediaKey, number>
}

function menuDocIsMomentoSeedStub(doc: Record<string, unknown>): boolean {
  const titleStrings =
    typeof doc.title === 'string'
      ? [doc.title]
      : doc.title && typeof doc.title === 'object'
        ? Object.values(doc.title as Record<string, string>)
        : []
  if (titleStrings.some((s) => s === MOMENTO_SEED_MENU_TITLE)) return true
  return titleStrings.some((s) => LEGACY_MOMENTO_SEED_MENU_TITLES.includes(s) || s.includes('(seed)'))
}

async function ensureTenantMenu(
  payload: Payload,
  tenantId: number,
  logoMediaId: number,
): Promise<void> {
  if (process.env.MOMENTO_SEED_SKIP_MENU === 'true') {
    console.info('      → kolekcija Izbornik: preskočeno (MOMENTO_SEED_SKIP_MENU=true)')
    return
  }

  const { getMomentoLocalePack } = await import('../src/data/momentoSeedDefaults')
  const existing = await payload.find({
    collection: 'menu',
    where: {
      and: [{ tenant: { equals: tenantId } }, { identifier: { equals: 'tenant-menu' } }],
    } as Where,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  let id: string | number | undefined = existing.docs[0]?.id
  if (id != null) {
    const existingDoc = await payload.findByID({
      collection: 'menu',
      id,
      depth: 0,
      overrideAccess: true,
    })
    if (!menuDocIsMomentoSeedStub(existingDoc as Record<string, unknown>)) {
      console.info(
        `      → Izbornik već postoji id=${id} — nisam dirao (ručno uređeno; MOMENTO_SEED_CLEAN ili obriši ručno za seed)`,
      )
      return
    }
  }

  const localized = (loc: (typeof LOCALES)[number]) => {
    const pack = getMomentoLocalePack(loc)
    return {
      title: MOMENTO_SEED_MENU_TITLE,
      identifier: 'tenant-menu' as const,
      tenant: tenantId,
      logo: logoMediaId,
      logoText: pack.nav.logoText,
      positioning: 'fixed' as const,
      menuItems: pack.nav.links.map((link) => ({
        label: link.label,
        link: `#${link.scrollTarget}`,
        scrollTarget: link.scrollTarget,
        external: false,
      })),
    }
  }

  if (id == null) {
    const created = await payload.create({
      collection: 'menu',
      locale: 'hr',
      overrideAccess: true,
      data: localized('hr'),
    })
    id = created.id
    console.info(`      → kreiran Izbornik id=${id}`)
  } else {
    console.info(`      → ažuriram Izbornik id=${id}`)
  }

  for (const loc of LOCALES) {
    await payload.update({
      collection: 'menu',
      id: id!,
      locale: loc,
      overrideAccess: true,
      data: localized(loc),
    })
  }
}

async function cleanMomentoSeedArtifacts(payload: Payload, tenantId: number, slug: string): Promise<void> {
  console.info('      → MOMENTO_SEED_CLEAN: brišem stare seed zapise…')
  const delCount = { pages: 0, media: 0, menus: 0 }

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

  for (const alt of [...Object.values(SEED_MEDIA_ALTS), ...Object.values(LEGACY_SEED_MEDIA_ALTS)]) {
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

  if (process.env.MOMENTO_SEED_CLEAN_SKIP_MENU !== 'true') {
    const menus = await payload.find({
      collection: 'menu',
      where: { tenant: { equals: tenantId } },
      limit: 20,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of menus.docs) {
      if (doc?.id != null) {
        await payload.delete({ collection: 'menu', id: doc.id, overrideAccess: true })
        delCount.menus++
      }
    }
  }

  console.info(
    `      → obrisano: stranice=${delCount.pages}, mediji=${delCount.media}, izbornici=${delCount.menus}`,
  )
}

async function run(): Promise<void> {
  const { assertSeedAllowed } = await import('./seed-guard')
  assertSeedAllowed('seed:momento')

  const totalSteps = 6
  const slug = (process.env.MOMENTO_SEED_PAGE_SLUG || 'momento').trim()
  const tenantHint =
    process.env.MOMENTO_SEED_TENANT_SUBDOMAIN?.trim() ||
    (process.env.MOMENTO_SEED_TENANT_NAME || 'Momento').trim()

  banner('Momento landing')
  console.info(`  slug:         ${slug}`)
  console.info(`  tenant:       ${tenantHint}`)
  console.info(`  clean:        ${process.env.MOMENTO_SEED_CLEAN === 'true' ? 'da' : 'ne'}`)

  step(1, totalSteps, 'Učitavam module (layout builder + Payload)…')
  const { buildMomentoPayloadLayout, momentoDemoImageUrls, momentoPageTitle, momentoPageMeta } =
    await import('../src/data/momentoLandingDemo')
  const [{ getPayload }, { default: payloadConfig }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])

  step(2, totalSteps, 'Spajam se na bazu…')
  const resolvedConfig = await Promise.resolve(payloadConfig as Promise<typeof payloadConfig> | typeof payloadConfig)
  const payload = await getPayload({ config: resolvedConfig })

  try {
    step(3, totalSteps, 'Tenant + seed mediji…')
    const tenant = await resolveTenantForSeed(payload)
    const tenantId = tenant.id
    console.info(`      → tenant id=${tenantId} (${tenant.name} · ${tenant.subdomain})`)

    if (process.env.MOMENTO_SEED_CLEAN === 'true') {
      await cleanMomentoSeedArtifacts(payload, tenantId, slug)
    }

    const mediaIds = await resolveMediaIds(payload, tenantId, momentoDemoImageUrls)
    console.info(
      `      → media ids: ${Object.entries(mediaIds)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`,
    )

    step(4, totalSteps, 'Izbornik…')
    await ensureTenantMenu(payload, tenantId, mediaIds.hero)

    step(5, totalSteps, 'Sastavljam layout (7 blokova × 3 jezika)…')
    const layouts = {
      hr: buildMomentoPayloadLayout(mediaIds, 'hr'),
      en: buildMomentoPayloadLayout(mediaIds, 'en'),
      de: buildMomentoPayloadLayout(mediaIds, 'de'),
    }
    console.info(`      → ${layouts.hr.length} blokova × 3 jezika`)

    step(6, totalSteps, 'Stranica `pages` (create ili update)…')
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
          title: momentoPageTitle('hr'),
          slug,
          tenant: tenantId,
          layout: layouts.hr,
          meta: { ...momentoPageMeta('hr'), image: mediaIds.hero },
        },
      })
      pageId = created.id
      console.info(`      → nova stranica id=${pageId}`)
    }

    for (const locale of LOCALES) {
      await payload.update({
        collection: 'pages',
        id: pageId,
        locale,
        overrideAccess: true,
        data: {
          title: momentoPageTitle(locale),
          layout: layouts[locale],
          meta: { ...momentoPageMeta(locale), image: mediaIds.hero },
          tenant: tenantId,
        },
      })
      console.info(`      → ${locale}: spremljeno`)
    }

    console.info(`\n  ✓ Završeno. Payload → Pages → „${momentoPageTitle('hr')}” (slug /${slug})`)
    console.info('  → Navigacija: Admin → Izbornik (tenant-menu). Podnožje: zadnji blok „Momento — podnožje” u layoutu stranice.')
  } finally {
    await shutdownDbPool(payload)
  }
}

run()
  .then(() => {
    console.info('\n[seed:momento] Izlaz iz procesa (0).\n')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n[seed:momento] Greška — izlaz (1).\n', err)
    process.exit(1)
  })
