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
import { assertSeedAllowed } from './seed-guard'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const LOCALES = ['hr', 'en', 'de'] as const
const BOUTIQUE_SEED_MENU_TITLE = 'Boutique — navigacija'
const BOUTIQUE_ROOM_COUNT = 4

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
  })
  if (found.docs[0]?.id) {
    return Number(found.docs[0].id)
  }

  const { buffer, mime } = readPublicImage(sourcePath)
  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt, tenant: tenantId },
    file: { data: buffer, mimetype: mime, name: `boutique-${key}.jpg`, size: buffer.length },
  })
  return Number(created.id)
}

async function resolveMediaIds(payload: Payload, tenantId: number) {
  if (process.env.BOUTIQUE_SEED_SKIP_MEDIA === 'true') {
    console.info('  → Mediji: preskočeno (BOUTIQUE_SEED_SKIP_MEDIA=true)')
    const first = await payload.find({
      collection: 'media',
      where: { tenant: { equals: tenantId } },
      limit: 30,
      overrideAccess: true,
    })
    const fallback = Number(first.docs[0]?.id ?? 0)
    const ids = {} as Record<BoutiqueDemoMediaKey, number>
    for (const key of Object.keys(boutiqueDemoImageUrls) as BoutiqueDemoMediaKey[]) {
      ids[key] = fallback
    }
    return ids
  }

  console.info(`  → Mediji: ${Object.keys(boutiqueDemoImageUrls).length} slika (S3 upload može potrajati)…`)
  const ids = {} as Record<BoutiqueDemoMediaKey, number>
  for (const [key, url] of Object.entries(boutiqueDemoImageUrls) as [BoutiqueDemoMediaKey, string][]) {
    console.info(`      → ${key}…`)
    ids[key] = await getOrCreateMedia(payload, key, url, tenantId)
  }
  console.info('  → Mediji: gotovo')
  return ids
}

async function resolveTenant(payload: Payload) {
  const subdomain = (process.env.BOUTIQUE_SEED_TENANT_SUBDOMAIN || 'boutique').trim()
  const found = await payload.find({
    collection: 'tenants',
    where: { subdomain: { equals: subdomain } },
    limit: 1,
    overrideAccess: true,
  })
  const t = found.docs[0]
  if (!t?.id) throw new Error(`Tenant not found: subdomain="${subdomain}". Run pnpm run seed:hub first.`)
  return { id: Number(t.id), subdomain }
}

async function ensureMenu(payload: Payload, tenantId: number) {
  const existing = await payload.find({
    collection: 'menu',
    where: {
      and: [{ tenant: { equals: tenantId } }, { identifier: { equals: 'tenant-menu' } }],
    } as Where,
    limit: 1,
    overrideAccess: true,
  })

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

  let id = existing.docs[0]?.id

  if (id == null) {
    const created = await payload.create({
      collection: 'menu',
      locale: 'hr',
      overrideAccess: true,
      data: localized('hr'),
    })
    id = created.id
    console.info(`  → Created menu id=${id}`)
  } else {
    console.info(`  → Updating menu id=${id}`)
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

async function ensureContactForm(payload: Payload): Promise<number> {
  const existing = await payload.find({
    collection: 'forms',
    locale: 'hr',
    limit: 20,
    overrideAccess: true,
  })
  let id = existing.docs.find((d) => d.title === BOUTIQUE_INQUIRY_FORM_TITLE)?.id

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
        options: fs.typeOptions,
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
    const created = await payload.create({
      collection: 'forms',
      locale: 'hr',
      overrideAccess: true,
      data: formData('hr'),
    })
    id = created.id
  }

  for (const loc of LOCALES) {
    await payload.update({
      collection: 'forms',
      id: id!,
      locale: loc,
      overrideAccess: true,
      data: formData(loc),
    })
  }

  return Number(id)
}

async function main() {
  assertSeedAllowed('seed:boutique')

  const slug = (process.env.BOUTIQUE_SEED_PAGE_SLUG || 'boutique').trim()
  const { getPayload } = await import('payload')
  const { default: payloadConfig } = await import('../src/payload.config')
  const payload = await getPayload({ config: await Promise.resolve(payloadConfig) })

  try {
    const tenant = await resolveTenant(payload)
    console.info(`Tenant id=${tenant.id} (${tenant.subdomain})`)

    const existingPage = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slug } }, { tenant: { equals: tenant.id } }],
      } as Where,
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })

    const rentlioPreserve = resolveRentlioPreserveForSeed(
      extractRentlioPreserveFromLayout(
        existingPage.docs[0]?.layout as Parameters<typeof extractRentlioPreserveFromLayout>[0],
      ),
    )
    if (rentlioPreserve.some((r) => r.rentlioPropertyId || r.rentlioUnitTypeId)) {
      console.info('  → Zadržavam postojeće Rentlio veze iz CMS-a.')
    } else {
      console.info(
        '  → Sobe bez Rentlio veza — povežite property/channel/unit type ručno u Adminu (Products dropdown).',
      )
    }

    const mediaIds = await resolveMediaIds(payload, tenant.id)
    console.info('  → Obrazac (Form Builder)…')
    const formId = await ensureContactForm(payload)
    console.info(`  → Obrazac id=${formId}`)
    console.info('  → Izbornik…')
    await ensureMenu(payload, tenant.id)

    const layouts = Object.fromEntries(
      LOCALES.map((loc) => [
        loc,
        injectBoutiqueFormId(buildBoutiquePayloadLayout(mediaIds, loc, rentlioPreserve), formId),
      ]),
    ) as Record<(typeof LOCALES)[number], ReturnType<typeof buildBoutiquePayloadLayout>>

    let pageId = existingPage.docs[0]?.id

    if (!pageId) {
      const created = await payload.create({
        collection: 'pages',
        locale: 'hr',
        overrideAccess: true,
        data: {
          title: boutiquePageTitle('hr'),
          slug,
          tenant: tenant.id,
          layout: layouts.hr as never,
          meta: { ...boutiquePageMeta('hr'), image: mediaIds.hero },
        },
      })
      pageId = created.id
      console.info(`Created page id=${pageId}`)
    } else {
      console.info(`Updating page id=${pageId}`)
    }

    for (const loc of LOCALES) {
      await payload.update({
        collection: 'pages',
        id: pageId!,
        locale: loc,
        overrideAccess: true,
        data: {
          title: boutiquePageTitle(loc),
          layout: layouts[loc] as never,
          meta: { ...boutiquePageMeta(loc), image: mediaIds.hero },
        },
      })
    }

    console.info('\nDone. Boutique landing seeded (hr/en/de). Footer is layout block `boutique-footer`.')
  } finally {
    const pool = (payload as unknown as { db?: { pool?: { end?: () => Promise<void> } } }).db?.pool
    if (pool?.end) await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
