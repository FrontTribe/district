import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { Menu, Footer, Tenant } from '@/payload-types'
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from './cache-tags'

type SupportedLocale = 'en' | 'hr' | 'de' | 'all' | undefined

const normalizeLocale = (locale?: string): SupportedLocale =>
  (locale as SupportedLocale) ?? undefined

/**
 * Cached lookup of a tenant by its subdomain.
 * Tagged so that any change to the underlying tenant invalidates the cache entry.
 */
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  return unstable_cache(
    async (): Promise<Tenant | null> => {
      try {
        const payload = await getPayload({ config: payloadConfig })
        const res = await payload.find({
          collection: 'tenants',
          where: { subdomain: { equals: subdomain } },
          limit: 1,
        })
        return (res.docs[0] as Tenant) || null
      } catch {
        return null
      }
    },
    ['tenant-by-subdomain', subdomain],
    {
      tags: [CACHE_TAGS.tenants(), CACHE_TAGS.tenantBySubdomain(subdomain)],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Cached menu lookup keyed by tenant + locale. `tenantId === null` returns
 * the main-domain menu (where `tenant` field is unset).
 */
export async function getTenantMenu(
  tenantId: string | null,
  locale?: string,
): Promise<Menu | null> {
  const localeKey = locale ?? 'default'
  const tenantKey = tenantId ?? 'main'

  return unstable_cache(
    async (): Promise<Menu | null> => {
      try {
        const payload = await getPayload({ config: payloadConfig })
        const whereClause = tenantId
          ? { tenant: { equals: tenantId } }
          : { tenant: { exists: false } }

        const menuResponse = await payload.find({
          collection: 'menu',
          where: whereClause,
          limit: 1,
          depth: 2,
          locale: normalizeLocale(locale),
        })

        return (menuResponse.docs[0] as Menu) || null
      } catch {
        return null
      }
    },
    ['tenant-menu', tenantKey, localeKey],
    {
      tags: [CACHE_TAGS.menus(), CACHE_TAGS.menuByTenant(tenantId)],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Cached footer lookup keyed by tenant + locale. Mirrors `getTenantMenu`.
 */
export async function getTenantFooter(
  tenantId: string | null,
  locale?: string,
): Promise<Footer | null> {
  const localeKey = locale ?? 'default'
  const tenantKey = tenantId ?? 'main'

  return unstable_cache(
    async (): Promise<Footer | null> => {
      try {
        const payload = await getPayload({ config: payloadConfig })
        const whereClause = tenantId
          ? { tenant: { equals: tenantId } }
          : { tenant: { exists: false } }

        const footerResponse = await payload.find({
          collection: 'footer',
          where: whereClause,
          limit: 1,
          depth: 2,
          locale: normalizeLocale(locale),
        })

        return (footerResponse.docs[0] as Footer) || null
      } catch {
        return null
      }
    },
    ['tenant-footer', tenantKey, localeKey],
    {
      tags: [CACHE_TAGS.footers(), CACHE_TAGS.footerByTenant(tenantId)],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Convenience helper that resolves menu + footer in parallel. Each leaf call
 * is independently cached so they can be invalidated separately.
 */
export async function getTenantMenuAndFooter(
  tenantId: string | null,
  locale?: string,
): Promise<{ menu: Menu | null; footer: Footer | null }> {
  const [menu, footer] = await Promise.all([
    getTenantMenu(tenantId, locale),
    getTenantFooter(tenantId, locale),
  ])

  return { menu, footer }
}
