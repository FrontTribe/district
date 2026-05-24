/**
 * Seeds Boutique landing page + tenant menu + contact form.
 *
 *   pnpm run extract:boutique-images   (once — downloads to public/boutique-landing/)
 *   pnpm run seed:boutique
 *
 * Env: BOUTIQUE_SEED_TENANT_SUBDOMAIN (default boutique), BOUTIQUE_SEED_PAGE_SLUG,
 *      BOUTIQUE_SEED_SKIP_MEDIA, BOUTIQUE_SEED_CLEAN, ALLOW_SEED
 *      BOUTIQUE_SEED_RENTLIO=true — optional dev demo Rentlio IDs (off by default; link rooms in Admin)
 *      BOUTIQUE_SEED_RENTLIO_PROPERTY_ID, BOUTIQUE_SEED_RENTLIO_SALES_CHANNEL_ID,
 *      BOUTIQUE_SEED_RENTLIO_UNIT_TYPE_IDS (only when BOUTIQUE_SEED_RENTLIO=true)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import type { Payload, Where } from 'payload'

import { BOUTIQUE_INQUIRY_FORM_TITLE, getBoutiqueLocalePack } from '../src/data/boutiqueSeedDefaults'
import {
  boutiqueDemoImageUrls,
  boutiquePageMeta,
  boutiquePageTitle,
  buildBoutiquePayloadLayout,
  extractRentlioPreserveFromLayout,
  injectBoutiqueFormId,
  type BoutiqueDemoMediaKey,
  type RentlioRoomPreserve,
} from '../src/data/boutiqueLandingDemo'
import { createSeedLog, seedColor, seedPayloadContext, withTimeout, withTimeoutHeartbeat, logDbPoolStats, type SeedStep } from './seed-ui'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const log = createSeedLog('seed:boutique')

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const LOCALES = ['hr', 'en', 'de'] as const
const BOUTIQUE_SEED_MENU_TITLE = 'Boutique — navigacija'
const BOUTIQUE_ROOM_COUNT = 4
const FORM_OP_TIMEOUT_MS = 120_000

/** Keep CMS Rentlio links when re-seeding. Demo IDs only when BOUTIQUE_SEED_RENTLIO=true. */
function resolveRentlioPreserveForSeed(
  preserved: RentlioRoomPreserve,
  roomCount = BOUTIQUE_ROOM_COUNT,
): RentlioRoomPreserve {
  if (preserved.some((r) => r.rentlioPropertyId || r.rentlioUnitTypeId)) {
    return preserved
  }

  if (process.env.BOUTIQUE_SEED_RENTLIO !== 'true') {
    return preserved
  }

  const unitTypeIds = (process.env.BOUTIQUE_SEED_RENTLIO_UNIT_TYPE_IDS || '68216,68217,68218,68219')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  if (unitTypeIds.length === 0) {
    return preserved
  }

  const propertyId = process.env.BOUTIQUE_SEED_RENTLIO_PROPERTY_ID || '33210'
  const salesChannelId = process.env.BOUTIQUE_SEED_RENTLIO_SALES_CHANNEL_ID || '56190'

  return Array.from({ length: roomCount }, (_, i) => ({
    rentlioPropertyId: propertyId,
    rentlioSalesChannelId: salesChannelId,
    rentlioUnitTypeId: unitTypeIds[i] ?? unitTypeIds[0],
  }))
}

const SEED_MEDIA_ALTS: Record<BoutiqueDemoMediaKey, string> = {
  hero: 'Boutique — hero',
  about1: 'Boutique — about 1',
  about2: 'Boutique — about 2',
  about3: 'Boutique — about 3',
  rooftopHero: 'Boutique — rooftop hero',
  rooftop1: 'Boutique — rooftop 1',
  rooftop2: 'Boutique — rooftop 2',
  rooftop3: 'Boutique — rooftop 3',
  rooftop4: 'Boutique — rooftop 4',
  premium1: 'Boutique — premium 1',
  premium2: 'Boutique — premium 2',
  premium3: 'Boutique — premium 3',
  premium4: 'Boutique — premium 4',
  deluxe1: 'Boutique — deluxe 1',
  deluxe2: 'Boutique — deluxe 2',
  deluxe3: 'Boutique — deluxe 3',
  deluxe4: 'Boutique — deluxe 4',
  suite1: 'Boutique — suite 1',
  suite2: 'Boutique — suite 2',
  suite3: 'Boutique — suite 3',
  suite4: 'Boutique — suite 4',
  jacuzzi1: 'Boutique — jacuzzi 1',
  jacuzzi2: 'Boutique — jacuzzi 2',
  jacuzzi3: 'Boutique — jacuzzi 3',
  jacuzzi4: 'Boutique — jacuzzi 4',
}

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

function readPublicImage(publicPath: string) {
  const fsPath = path.resolve(__dirname, '../public', publicPath.replace(/^\//, ''))
  if (!fs.existsSync(fsPath)) {
    throw new Error(`Missing seed image: ${fsPath}\nRun: pnpm run extract:boutique-images`)
  }
  const buffer = fs.readFileSync(fsPath)
  return { buffer, mime: 'image/jpeg' as const, ext: 'jpg' }
}

async function getOrCreateMedia(
  payload: Payload,
  key: BoutiqueDemoMediaKey,
  sourcePath: string,
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
    context: seedPayloadContext,
  })
  if (found.docs[0]?.id) {
    return Number(found.docs[0].id)
  }

  const { buffer, mime } = readPublicImage(sourcePath)
  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    context: seedPayloadContext,
    data: { alt, tenant: tenantId },
    file: { data: buffer, mimetype: mime, name: `boutique-${key}.jpg`, size: buffer.length },
  })
  return Number(created.id)
}

async function resolveMediaIds(
  payload: Payload,
  tenantId: number,
  step: SeedStep,
): Promise<Record<BoutiqueDemoMediaKey, number>> {
  const keys = Object.keys(boutiqueDemoImageUrls) as BoutiqueDemoMediaKey[]

  if (process.env.BOUTIQUE_SEED_SKIP_MEDIA === 'true') {
    step.detail('BOUTIQUE_SEED_SKIP_MEDIA=true — koristim postojeće slike tenanta')
    const first = await payload.find({
      collection: 'media',
      where: { tenant: { equals: tenantId } },
      limit: 30,
      depth: 0,
      overrideAccess: true,
      context: seedPayloadContext,
    })
    const fallback = Number(first.docs[0]?.id ?? 0)
    if (!fallback) {
      step.fail('Nema medija za tenant — ukloni BOUTIQUE_SEED_SKIP_MEDIA ili uploadaj slike.')
    }
    return Object.fromEntries(keys.map((key) => [key, fallback])) as Record<BoutiqueDemoMediaKey, number>
  }

  step.detail(`${keys.length} slika (S3 upload može potrajati)…`)
  const ids = {} as Record<BoutiqueDemoMediaKey, number>
  for (const key of keys) {
    step.detail(`medij: ${key}…`)
    ids[key] = await getOrCreateMedia(payload, key, boutiqueDemoImageUrls[key], tenantId)
  }
  return ids
}

async function resolveTenant(payload: Payload, step: SeedStep) {
  const subdomain = (process.env.BOUTIQUE_SEED_TENANT_SUBDOMAIN || 'boutique').trim()
  const found = await payload.find({
    collection: 'tenants',
    where: { subdomain: { equals: subdomain } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    context: seedPayloadContext,
  })
  const t = found.docs[0]
  if (!t?.id) {
    step.fail(`Tenant nije pronađen: subdomain="${subdomain}". Prvo pokreni pnpm run seed:hub.`)
  }
  step.detail(`tenant id=${t.id} (${subdomain})`)
  return { id: Number(t.id), subdomain }
}

async function ensureMenu(payload: Payload, tenantId: number, step: SeedStep) {
  const localized = (loc: (typeof LOCALES)[number]) => {
    const pack = getBoutiqueLocalePack(loc)
    return {
      title: BOUTIQUE_SEED_MENU_TITLE,
      identifier: 'tenant-menu' as const,
      tenant: tenantId,
      menuItems: pack.nav.map((link) => ({
        label: link.label,
        link: `#${link.scrollTarget}`,
        scrollTarget: link.scrollTarget,
        external: false,
      })),
    }
  }

  step.detail('Provjeravam tenant-menu…')
  const existing = await withTimeout(
    payload.find({
      collection: 'menu',
      where: {
        and: [{ tenant: { equals: tenantId } }, { identifier: { equals: 'tenant-menu' } }],
      } as Where,
      limit: 1,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      context: seedPayloadContext,
      select: { id: true, identifier: true },
    }),
    30_000,
    'pretraga izbornika',
  )

  let id = existing.docs[0]?.id

  if (id == null) {
    step.detail('Kreiram tenant-menu (hr)…')
    const created = await withTimeout(
      payload.create({
        collection: 'menu',
        locale: 'hr',
        overrideAccess: true,
        context: seedPayloadContext,
        data: localized('hr'),
      }),
      FORM_OP_TIMEOUT_MS,
      'kreiranje izbornika',
    )
    id = created.id
    step.detail(`Kreiran tenant-menu id=${id}`)
  } else {
    step.detail(`Pronađen tenant-menu id=${id} — ažuriram lokalizacije`)
  }

  for (const loc of LOCALES) {
    step.detail(`Sprema lokalizaciju: ${loc}…`)
    await withTimeout(
      payload.update({
        collection: 'menu',
        id: id!,
        locale: loc,
        overrideAccess: true,
        context: seedPayloadContext,
        data: localized(loc),
      }),
      FORM_OP_TIMEOUT_MS,
      `izbornik ${loc}`,
    )
  }

  step.done(`tenant-menu id=${id} (hr, en, de)`)
}

function lexicalPlain(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function ensureContactForm(payload: Payload, step: SeedStep): Promise<number> {
  step.detail(`Tražim obrazac „${BOUTIQUE_INQUIRY_FORM_TITLE}”…`)

  const existing = await withTimeout(
    payload.find({
      collection: 'forms',
      locale: 'hr',
      where: { title: { equals: BOUTIQUE_INQUIRY_FORM_TITLE } },
      limit: 1,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      context: seedPayloadContext,
      select: { id: true, title: true },
    }),
    30_000,
    'pretraga obrasca',
  )

  let id = existing.docs[0]?.id

  const buildFields = (loc: (typeof LOCALES)[number]) => {
    const fs = getBoutiqueLocalePack(loc).formSeed
    return [
      {
        blockType: 'text' as const,
        name: 'naziv',
        label: fs.nameFieldLabel,
        required: true,
        placeholder: fs.namePlaceholder,
      },
      {
        blockType: 'email' as const,
        name: 'email',
        label: fs.emailFieldLabel,
        required: true,
        placeholder: fs.emailPlaceholder,
      },
      {
        blockType: 'text' as const,
        name: 'telefon',
        label: fs.phoneFieldLabel,
        required: false,
        placeholder: fs.phonePlaceholder,
      },
      {
        blockType: 'select' as const,
        name: 'tip',
        label: fs.typeFieldLabel,
        required: true,
        placeholder: fs.typePlaceholder,
        options: fs.typeOptions.map((option) => ({
          label: option.label,
          value: option.value,
        })),
      },
      {
        blockType: 'textarea' as const,
        name: 'poruka',
        label: fs.messageFieldLabel,
        required: true,
        placeholder: fs.messagePlaceholder,
      },
    ]
  }

  const formData = (loc: (typeof LOCALES)[number]) => {
    const pack = getBoutiqueLocalePack(loc)
    return {
      title: BOUTIQUE_INQUIRY_FORM_TITLE,
      submitButtonLabel: pack.formSeed.submitButtonLabel,
      confirmationType: 'message' as const,
      confirmationMessage: lexicalPlain(pack.formSeed.successMessage),
      fields: buildFields(loc),
    }
  }

  if (id == null) {
    step.detail('Kreiram obrazac (hr)…')
    logDbPoolStats(payload, 'prije create forms')
    const created = await withTimeoutHeartbeat(
      payload.create({
        collection: 'forms',
        locale: 'hr',
        overrideAccess: true,
        context: seedPayloadContext,
        data: formData('hr'),
      }),
      FORM_OP_TIMEOUT_MS,
      'kreiranje obrasca (hr)',
      step.detail,
    )
    id = created.id
    step.detail(`Kreiran obrazac id=${id}`)
  } else {
    step.detail(`Obrazac već postoji id=${id} — ažuriram lokalizacije`)
  }

  for (const loc of LOCALES) {
    step.detail(`Obrazac lokalizacija: ${loc}…`)
    await withTimeout(
      payload.update({
        collection: 'forms',
        id: id!,
        locale: loc,
        overrideAccess: true,
        context: seedPayloadContext,
        data: formData(loc),
      }),
      FORM_OP_TIMEOUT_MS,
      `obrazac ${loc}`,
    )
  }

  step.done(`obrazac id=${id} (hr, en, de)`)
  return Number(id)
}

async function run(): Promise<void> {
  const { assertSeedAllowed } = await import('./seed-guard')
  assertSeedAllowed('seed:boutique')

  const totalSteps = 7
  const slug = (process.env.BOUTIQUE_SEED_PAGE_SLUG || 'boutique').trim()
  const tenantHint = (process.env.BOUTIQUE_SEED_TENANT_SUBDOMAIN || 'boutique').trim()

  log.banner('Boutique landing', {
    slug,
    tenant: tenantHint,
    skipMedia: process.env.BOUTIQUE_SEED_SKIP_MEDIA === 'true' ? 'da' : 'ne',
  })

  const s1 = log.step(1, totalSteps, 'Učitavam module')
  const [{ getPayload }, { default: payloadConfig }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  s1.done('layout builder + Payload')

  const s2 = log.step(2, totalSteps, 'Spajam se na bazu')
  const payload = await getPayload({ config: await Promise.resolve(payloadConfig) })
  s2.done('povezano')

  try {
    const s3 = log.step(3, totalSteps, 'Tenant + Rentlio')
    const tenant = await resolveTenant(payload, s3)

    const existingPage = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slug } }, { tenant: { equals: tenant.id } }],
      } as Where,
      limit: 1,
      depth: 2,
      overrideAccess: true,
      context: seedPayloadContext,
    })

    const rentlioPreserve = resolveRentlioPreserveForSeed(
      extractRentlioPreserveFromLayout(
        existingPage.docs[0]?.layout as Parameters<typeof extractRentlioPreserveFromLayout>[0],
      ),
    )
    if (rentlioPreserve.some((r) => r.rentlioPropertyId || r.rentlioUnitTypeId)) {
      s3.detail('Zadržavam postojeće Rentlio veze iz CMS-a')
    } else {
      s3.detail(
        'Sobe bez Rentlio veza — povežite property/channel/unit type ručno u Adminu (Products dropdown)',
      )
    }
    s3.done('tenant')

    const s4 = log.step(4, totalSteps, 'Obrazac (Form Builder)')
    const formId = await ensureContactForm(payload, s4)

    const s5 = log.step(5, totalSteps, 'Demo mediji')
    const mediaIds = await resolveMediaIds(payload, tenant.id, s5)
    s5.detail(
      `media: ${Object.entries(mediaIds)
        .slice(0, 4)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}…`,
    )
    s5.done(`${Object.keys(mediaIds).length} slika`)

    const s6 = log.step(6, totalSteps, 'Izbornik')
    await ensureMenu(payload, tenant.id, s6)

    const s7 = log.step(7, totalSteps, 'Stranica pages')
    const layouts = Object.fromEntries(
      LOCALES.map((loc) => [
        loc,
        injectBoutiqueFormId(buildBoutiquePayloadLayout(mediaIds, loc, rentlioPreserve), formId),
      ]),
    ) as Record<(typeof LOCALES)[number], ReturnType<typeof buildBoutiquePayloadLayout>>

    s7.detail(`${layouts.hr.length} blokova × 3 jezika`)
    let pageId = existingPage.docs[0]?.id

    if (!pageId) {
      s7.detail('Kreiram novu stranicu (hr)…')
      const created = await withTimeout(
        payload.create({
          collection: 'pages',
          locale: 'hr',
          overrideAccess: true,
          context: seedPayloadContext,
          data: {
            title: boutiquePageTitle('hr'),
            slug,
            tenant: tenant.id,
            layout: layouts.hr as never,
            meta: { ...boutiquePageMeta('hr'), image: mediaIds.hero },
          },
        }),
        FORM_OP_TIMEOUT_MS,
        'kreiranje stranice',
      )
      pageId = created.id
      s7.detail(`Nova stranica id=${pageId}`)
    } else {
      s7.detail(`Postojeća stranica id=${pageId} — ažuriram lokalizacije`)
    }

    for (const loc of LOCALES) {
      s7.detail(`Lokalizacija: ${loc}…`)
      await withTimeout(
        payload.update({
          collection: 'pages',
          id: pageId!,
          locale: loc,
          overrideAccess: true,
          context: seedPayloadContext,
          data: {
            title: boutiquePageTitle(loc),
            layout: layouts[loc] as never,
            meta: { ...boutiquePageMeta(loc), image: mediaIds.hero },
            tenant: tenant.id,
          },
        }),
        FORM_OP_TIMEOUT_MS,
        `stranica ${loc}`,
      )
    }

    s7.done(`stranica id=${pageId} (/${slug})`)

    log.success(
      `Boutique landing spremljen — Admin → Pages → „${boutiquePageTitle('hr')}”. Footer: blok \`boutique-footer\`.`,
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
