/**
 * Seeds 3 tenants + 3 tenant “home” pages + 1 main-domain hub page with a `three-columns` block
 * (District hub triptych on `/[locale]` when no tenant subdomain is set).
 *
 * Main-domain listing uses `tenant: null` pages; the hub page should be the **newest** so it sorts
 * first with Payload’s default `-createdAt` ordering. This script creates tenant pages first, then the hub.
 *
 * Prerequisites: `.env` / `.env.local` with `DATABASE_URI`, `PAYLOAD_SECRET`.
 *
 * Usage:
 *   pnpm run seed:hub
 *
 * Tenants: Boutique, Momento, Real estate (`boutique`, `momento`, `real-estate`).
 * Tenant home page slugs match subdomain. Re-run **does not overwrite** existing tenant pages
 * (only creates a placeholder if missing). Hub triptych page is updated only when missing or
 * when `SEED_HUB_FORCE_HUB=true`.
 *
 * Optional env:
 *   SEED_HUB_SLUG        — main hub page slug (default: `district-hub`)
 *   SEED_TENANT_A_NAME, SEED_TENANT_A_SUBDOMAIN — (Boutique / boutique)
 *   SEED_TENANT_B_NAME, SEED_TENANT_B_SUBDOMAIN — (Momento / momento)
 *   SEED_TENANT_C_NAME, SEED_TENANT_C_SUBDOMAIN — (Real estate / real-estate)
 *   SEED_USE_SAFE_SUBDOMAINS — if `true`, use demo-a, demo-b, demo-c instead (avoids clashes)
 *   SEED_HUB_FORCE_PAGES — if `true`, overwrite tenant home pages with placeholder layout (dev only)
 *   SEED_HUB_FORCE_HUB   — if `true`, overwrite hub page layout even when it already exists
 *   ALLOW_SEED           — set `true` to run against non-dev DATABASE_URI (see scripts/seed-guard.ts)
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import type { Payload } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const LOCALES = ['hr', 'en', 'de'] as const

type TenantSeed = { name: string; subdomain: string }

function getTenantSeeds(): TenantSeed[] {
  if (process.env.SEED_USE_SAFE_SUBDOMAINS === 'true') {
    return [
      { name: process.env.SEED_TENANT_A_NAME || 'Demo — A', subdomain: 'demo-a' },
      { name: process.env.SEED_TENANT_B_NAME || 'Demo — B', subdomain: 'demo-b' },
      { name: process.env.SEED_TENANT_C_NAME || 'Demo — C', subdomain: 'demo-c' },
    ]
  }
  return [
    {
      name: process.env.SEED_TENANT_A_NAME || 'Boutique',
      subdomain: process.env.SEED_TENANT_A_SUBDOMAIN || 'boutique',
    },
    {
      name: process.env.SEED_TENANT_B_NAME || 'Momento',
      subdomain: process.env.SEED_TENANT_B_SUBDOMAIN || 'momento',
    },
    {
      name: process.env.SEED_TENANT_C_NAME || 'Real estate',
      subdomain: process.env.SEED_TENANT_C_SUBDOMAIN || 'real-estate',
    },
  ]
}

function tenantPageSlug(subdomain: string): string {
  return subdomain.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
}

const COLUMN_COPY: Record<
  (typeof LOCALES)[number],
  { title: string; kicker: string; subtitle: string; linkText: string }[]
> = {
  hr: [
    { title: 'Boutique', kicker: '01 / Hotel', subtitle: 'Luksuzni smještaj i osobni pristup.', linkText: 'Ulaz' },
    { title: 'Momento', kicker: '02 / Dining', subtitle: 'Fine dining i bar iskustvo.', linkText: 'Ulaz' },
    { title: 'Nekretnine', kicker: '03 / Estate', subtitle: 'Stambeni i poslovni projekti.', linkText: 'Ulaz' },
  ],
  en: [
    { title: 'Boutique', kicker: '01 / Hotel', subtitle: 'Luxury stays with a personal touch.', linkText: 'Enter' },
    { title: 'Momento', kicker: '02 / Dining', subtitle: 'Fine dining and bar experience.', linkText: 'Enter' },
    { title: 'Real Estate', kicker: '03 / Estate', subtitle: 'Residential and commercial projects.', linkText: 'Enter' },
  ],
  de: [
    { title: 'Boutique', kicker: '01 / Hotel', subtitle: 'Luxusunterkünfte mit persönlicher Note.', linkText: 'Eintreten' },
    { title: 'Momento', kicker: '02 / Dining', subtitle: 'Fine Dining und Bar.', linkText: 'Eintreten' },
    { title: 'Immobilien', kicker: '03 / Estate', subtitle: 'Wohn- und Gewerbeprojekte.', linkText: 'Eintreten' },
  ],
}

function buildHubLayout(
  locale: (typeof LOCALES)[number],
  tenantIds: [number, number, number],
  seeds: TenantSeed[],
) {
  const copy = COLUMN_COPY[locale]
  return [
    {
      blockType: 'three-columns' as const,
      sectionId: 'hub',
      columns: tenantIds.map((tenantId, i) => {
        const row = seeds[i]!
        const c = copy[i]
        return {
          title: row.name,
          kicker: c?.kicker ?? `0${i + 1}`,
          subtitle: c?.subtitle ?? '',
          numberLabel: '',
          titleItalic: '',
          fullHeight: true,
          comingSoon: false,
          gradient: {
            enabled: false,
            type: 'linear' as const,
            direction: 'to-bottom' as const,
            position: 'center' as const,
            startColor: '#000000',
            endColor: '#ffffff',
            opacity: 0.7,
          },
          link: {
            tenant: tenantId,
            text: c?.linkText ?? 'Enter',
            openInNewTab: false,
          },
          socialNetworks: { facebook: '', instagram: '' },
        }
      }),
    },
  ]
}

const TENANT_WELCOME: Record<(typeof LOCALES)[number], string> = {
  hr: '<p>Dobrodošli — placeholder stranica tenanta. Uredi sadržaj u Payload CMS-u.</p>',
  en: '<p>Welcome — tenant placeholder page. Edit content in Payload CMS.</p>',
  de: '<p>Willkommen — Platzhalter-Seite. Inhalt im Payload CMS bearbeiten.</p>',
}

function buildTenantLayout(locale: (typeof LOCALES)[number]) {
  return [
    {
      blockType: 'text' as const,
      content: TENANT_WELCOME[locale],
      fontSize: 'medium' as const,
    },
  ]
}

async function upsertTenant(payload: Payload, row: TenantSeed): Promise<number> {
  const found = await payload.find({
    collection: 'tenants',
    where: { subdomain: { equals: row.subdomain } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = found.docs[0]
  if (existing?.id) {
    const id = typeof existing.id === 'number' ? existing.id : Number(existing.id)
    await payload.update({
      collection: 'tenants',
      id,
      data: { name: row.name },
      overrideAccess: true,
    })
    return id
  }
  const created = await payload.create({
    collection: 'tenants',
    data: { name: row.name, subdomain: row.subdomain },
    overrideAccess: true,
  })
  return typeof created.id === 'number' ? created.id : Number(created.id)
}

async function upsertTenantHomePage(
  payload: Payload,
  tenantId: number,
  slug: string,
  titles: Record<(typeof LOCALES)[number], string>,
) {
  const legacySlug = `tenant-${slug}`
  const forcePages = process.env.SEED_HUB_FORCE_PAGES === 'true'

  let existing = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (!existing.docs[0]) {
    existing = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: legacySlug } }, { tenant: { equals: tenantId } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
  }

  const existingDoc = existing.docs[0]
  if (existingDoc?.id && !forcePages) {
    if (existingDoc.slug === legacySlug) {
      await payload.update({
        collection: 'pages',
        id: existingDoc.id,
        locale: 'hr',
        overrideAccess: true,
        data: { slug },
      })
    }
    console.info(
      `Tenant page exists slug=${slug} — skipped layout update (SEED_HUB_FORCE_PAGES=true to overwrite placeholder)`,
    )
    return
  }

  let pageId: string | number
  if (existingDoc?.id) {
    pageId = existingDoc.id
  } else {
    const created = await payload.create({
      collection: 'pages',
      locale: 'hr',
      overrideAccess: true,
      data: {
        title: titles.hr,
        slug,
        tenant: tenantId,
        layout: buildTenantLayout('hr'),
      },
    })
    pageId = created.id
  }

  for (const locale of LOCALES) {
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale,
      overrideAccess: true,
      data: {
        title: titles[locale],
        layout: buildTenantLayout(locale),
        tenant: tenantId,
        ...(locale === 'hr' ? { slug } : {}),
      },
    })
  }
}

async function upsertHubPage(
  payload: Payload,
  hubSlug: string,
  tenantIds: [number, number, number],
  seeds: TenantSeed[],
  titles: Record<(typeof LOCALES)[number], string>,
) {
  const forceHub = process.env.SEED_HUB_FORCE_HUB === 'true'

  const found = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: hubSlug } }, { tenant: { exists: false } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const existingDoc = found.docs[0]
  if (existingDoc?.id && !forceHub) {
    console.info(
      `Hub page exists slug=${hubSlug} — skipped layout update (SEED_HUB_FORCE_HUB=true to refresh triptych)`,
    )
    return
  }

  let pageId: string | number
  if (existingDoc?.id) {
    pageId = existingDoc.id
  } else {
    const created = await payload.create({
      collection: 'pages',
      locale: 'hr',
      overrideAccess: true,
      data: {
        title: titles.hr,
        slug: hubSlug,
        layout: buildHubLayout('hr', tenantIds, seeds),
      },
    })
    pageId = created.id
  }

  for (const locale of LOCALES) {
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale,
      overrideAccess: true,
      data: {
        title: titles[locale],
        layout: buildHubLayout(locale, tenantIds, seeds),
      },
    })
  }
}

async function main() {
  const { assertSeedAllowed } = await import('./seed-guard.ts')
  assertSeedAllowed('seed:hub')

  const [{ getPayload }, { default: payloadConfig }] = await Promise.all([
    import('payload'),
    import('../src/payload.config.ts'),
  ])

  const resolvedConfig = await Promise.resolve(payloadConfig as Promise<typeof payloadConfig> | typeof payloadConfig)
  const payload = await getPayload({ config: resolvedConfig })

  const rows = getTenantSeeds()
  const tenantIds: number[] = []
  for (const row of rows) {
    const id = await upsertTenant(payload, row)
    tenantIds.push(id)
    console.info(`Tenant OK: ${row.name} (${row.subdomain}) id=${id}`)
  }

  const triplet = tenantIds as [number, number, number]

  const hubSlug = (process.env.SEED_HUB_SLUG || 'district-hub').trim()
  const hubTitles = {
    hr: 'District — početna',
    en: 'District — home',
    de: 'District — Start',
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    const slug = tenantPageSlug(row.subdomain)
    const titles = {
      hr: `${row.name} — početna`,
      en: `${row.name} — home`,
      de: `${row.name} — Start`,
    }
    await upsertTenantHomePage(payload, triplet[i]!, slug, titles)
    console.info(`Tenant page OK: slug=${slug} tenant=${row.subdomain}`)
  }

  await upsertHubPage(payload, hubSlug, triplet, rows, hubTitles)
  console.info(`Hub page OK: slug=${hubSlug} (main domain, no tenant)`)
  console.info('Done. Open /hr on the main domain — first page should be the three-column hub.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
