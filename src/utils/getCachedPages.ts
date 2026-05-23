import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import type { Page } from '@/payload-types'
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from './cache-tags'

type SupportedLocale = 'en' | 'hr' | 'de' | 'all' | undefined

const normalizeLocale = (locale?: string): SupportedLocale =>
  (locale as SupportedLocale) ?? undefined

async function fetchPageBySlugImpl(
  slug: string,
  locale: SupportedLocale,
  depth: number,
): Promise<Page | null> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const pageQuery = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      depth,
      locale: normalizeLocale(locale),
    })
    return (pageQuery.docs[0] as Page) || null
  } catch {
    return null
  }
}

async function fetchPagesByTenantImpl(
  tenantId: string | null,
  locale: SupportedLocale,
  depth: number,
): Promise<Page[]> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const whereClause = tenantId ? { tenant: { equals: tenantId } } : { tenant: { exists: false } }

    const pagesResponse = await payload.find({
      collection: 'pages',
      depth,
      locale: normalizeLocale(locale),
      where: whereClause,
      /** Newest first so a freshly seeded hub page (three-columns) wins on main domain. */
      sort: '-createdAt',
    })
    return (pagesResponse.docs as Page[]) ?? []
  } catch {
    return []
  }
}

/**
 * Cached single-page lookup by slug + locale.
 *
 * Note: `slug` is enforced unique across the `pages` collection (see
 * `src/collections/pages.ts`), so a slug fully identifies a page regardless
 * of tenant. Cache tags include the broad `pages` tag plus a slug-specific
 * tag for surgical invalidation when an editor saves that single page.
 */
export async function getCachedPageBySlug(
  slug: string,
  locale?: string,
  depth: number = 4,
): Promise<Page | null> {
  const localeKey = locale ?? 'default'
  const loc = normalizeLocale(locale)

  if (process.env.NODE_ENV === 'development') {
    return fetchPageBySlugImpl(slug, loc, depth)
  }

  return unstable_cache(
    async (): Promise<Page | null> => fetchPageBySlugImpl(slug, loc, depth),
    ['page-by-slug', slug, localeKey, String(depth)],
    {
      tags: [CACHE_TAGS.pages(), CACHE_TAGS.page(slug)],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Cached list of pages for a tenant (or main domain when `tenantId === null`).
 * Used by the tenant home page renderer that stitches together every page block.
 *
 * In **development**, caching is disabled so `pnpm run seed:real-estate` (CLI) is
 * immediately visible — `revalidateTag` from Payload hooks does not reach the
 * Next dev server when the seed runs in a separate process.
 */
export async function getCachedPagesByTenant(
  tenantId: string | null,
  locale?: string,
  depth: number = 2,
): Promise<Page[]> {
  const localeKey = locale ?? 'default'
  const tenantKey = tenantId ?? 'main'
  const loc = normalizeLocale(locale)

  if (process.env.NODE_ENV === 'development') {
    return fetchPagesByTenantImpl(tenantId, loc, depth)
  }

  return unstable_cache(
    async (): Promise<Page[]> => fetchPagesByTenantImpl(tenantId, loc, depth),
    ['pages-by-tenant', tenantKey, localeKey, String(depth)],
    {
      tags: [CACHE_TAGS.pages(), CACHE_TAGS.pagesByTenant(tenantId)],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )()
}
