/**
 * Seeds the Momento landing page (Payload `pages.layout`; početni tekstovi u
 * `src/data/momentoSeedDefaults.ts`). Produkcija čita isključivo CMS.
 *
 * Layout blokovi (6): Hero → Intro → Image Grid → Concept Bar Menu → Job Opportunity → Location.
 * Navigacija: kolekcija `menu` (tenant-menu). Podnožje: kolekcija `footer`.
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
 *   MOMENTO_SEED_SKIP_FOOTER       — if "true", ne dira kolekciju Podnožja
 *   MOMENTO_SEED_SKIP_MENU         — if "true", ne dira kolekciju Izbornik
 *   MOMENTO_SEED_FORCE_TENANT_FOOTER — pregazi Podnožje čak i kad nije seed stub
 *   MOMENTO_SEED_CLEAN             — briše stranicu, seed medije, menu/footer stubove
 *   MOMENTO_SEED_CLEAN_SKIP_FOOTER — uz CLEAN: ne briši Podnožja
 *   MOMENTO_SEED_CLEAN_SKIP_MENU   — uz CLEAN: ne briši Izbornik
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
  hero: 'seed:momento:hero',
  interior1: 'seed:momento:interior-1',
  interior2: 'seed:momento:interior-2',
  interior3: 'seed:momento:interior-3',
  terrace: 'seed:momento:terrace',
  career: 'seed:momento:career',
} as const

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
  const found = await payload.find({
    collection: 'media',
    where: {
      and: [{ alt: { equals: alt } }, { tenant: { equals: tenantId } }],
    } as Where,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = found.docs[0]
  if (existing?.id) {
    return typeof existing.id === 'number' ? existing.id : Number(existing.id)
  }

  const { buffer, mime, ext } = readPublicImageFile(sourceUrl)
  const name = `momento-seed-${key}.${ext}`

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

function footerDocIsMomentoSeedStub(doc: Record<string, unknown>): boolean {
  const bottom = doc.bottomContent
  const collectStrings = (v: unknown): string[] => {
    if (v == null) return []
    if (typeof v === 'string') return [v]
    if (typeof v === 'object' && !Array.isArray(v)) {
      return Object.values(v as Record<string, unknown>).flatMap(collectStrings)
    }
    return []
  }
  const madeByStrings =
    bottom && typeof bottom === 'object' ? collectStrings((bottom as { madeBy?: unknown }).madeBy) : []
  if (madeByStrings.some((s) => s.includes('seed:momento'))) return true
  const titleStrings = collectStrings(doc.title)
  if (titleStrings.some((s) => s.includes('(seed)'))) return true
  return false
}

function menuDocIsMomentoSeedStub(doc: Record<string, unknown>): boolean {
  const titleStrings =
    typeof doc.title === 'string'
      ? [doc.title]
      : doc.title && typeof doc.title === 'object'
        ? Object.values(doc.title as Record<string, string>)
        : []
  return titleStrings.some((s) => s.includes('(seed)'))
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
      title: `Momento — navigacija (seed)`,
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

async function ensureTenantFooter(payload: Payload, tenantId: number): Promise<void> {
  if (process.env.MOMENTO_SEED_SKIP_FOOTER === 'true') {
    console.info('      → kolekcija Podnožja: preskočeno (MOMENTO_SEED_SKIP_FOOTER=true)')
    return
  }

  const force = process.env.MOMENTO_SEED_FORCE_TENANT_FOOTER === 'true'
  const { getMomentoLocalePack } = await import('../src/data/momentoSeedDefaults')

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
    if (!footerDocIsMomentoSeedStub(existingDoc as Record<string, unknown>)) {
      console.info(
        `      → Podnožje već postoji id=${id} — nisam dirao (ručno uređeno; MOMENTO_SEED_FORCE_TENANT_FOOTER=true ili clean:momento)`,
      )
      return
    }
  }

  const year = new Date().getFullYear()
  const localized = (loc: (typeof LOCALES)[number]) => {
    const p = getMomentoLocalePack(loc)
    return {
      title: p.footer.title,
      tenant: tenantId,
      leftContent: {
        heading: p.footer.leftHeading,
        subheading: p.footer.leftSubheading,
      },
      rightContent: {
        contact: {
          heading: p.footer.contactHeading,
          email: p.footer.email,
          phone: p.footer.phone,
          instagram: p.footer.instagram,
        },
        address: {
          heading: p.footer.addressHeading,
          venue: p.footer.venue,
          street: p.footer.street,
          city: p.footer.city,
          country: p.footer.country,
        },
      },
      bottomContent: {
        copyright: `Sva prava pridržana © ${year} District d.o.o.`,
        madeBy: p.footer.madeBy,
      },
    }
  }

  if (id == null) {
    const created = await payload.create({
      collection: 'footer',
      locale: 'hr',
      overrideAccess: true,
      data: localized('hr'),
    })
    id = created.id
    console.info(`      → kreirano Podnožje id=${id}`)
  } else {
    console.info(`      → ažuriram Podnožje id=${id}`)
  }

  for (const loc of LOCALES) {
    await payload.update({
      collection: 'footer',
      id: id!,
      locale: loc,
      overrideAccess: true,
      data: localized(loc),
    })
  }
}

async function cleanMomentoSeedArtifacts(payload: Payload, tenantId: number, slug: string): Promise<void> {
  console.info('      → MOMENTO_SEED_CLEAN: brišem stare seed zapise…')
  const delCount = { pages: 0, media: 0, footers: 0, menus: 0 }

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

  for (const alt of Object.values(SEED_MEDIA_ALTS)) {
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

  if (process.env.MOMENTO_SEED_CLEAN_SKIP_FOOTER !== 'true') {
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
  }

  console.info(
    `      → obrisano: stranice=${delCount.pages}, mediji=${delCount.media}, izbornici=${delCount.menus}, podnožja=${delCount.footers}`,
  )
}

async function run(): Promise<void> {
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
    import('../src/payload.config.ts'),
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

    step(4, totalSteps, 'Izbornik + Podnožje…')
    await ensureTenantMenu(payload, tenantId, mediaIds.hero)
    await ensureTenantFooter(payload, tenantId)

    step(5, totalSteps, 'Sastavljam layout (6 blokova × 3 jezika)…')
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
    console.info('  → Navigacija: Admin → Izbornik (tenant-menu). Podnožje: Admin → Podnožja.')
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
