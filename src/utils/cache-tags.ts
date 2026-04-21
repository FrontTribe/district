/**
 * Centralized cache tag generators used by `unstable_cache` and `revalidateTag`.
 *
 * Tag conventions:
 * - Specific tags (e.g. `page:rooms`) allow surgical invalidation when one doc changes.
 * - Group tags (e.g. `pages:tenant-3`) allow invalidating every cache entry related to a
 *   tenant when a single page (or its slug) changes.
 * - Collection-wide tags (e.g. `pages`) are a safety net used by media/tenant changes
 *   that may affect many pages at once.
 *
 * Use `'main'` as a stand-in for "no tenant" (the public district.hr root domain).
 */

const tenantKey = (tenantId: string | null | undefined): string => {
  if (tenantId === null || tenantId === undefined || tenantId === '') return 'main'
  return String(tenantId)
}

export const CACHE_TAGS = {
  tenants: () => 'tenants' as const,
  tenantBySubdomain: (subdomain: string) => `tenant:subdomain:${subdomain}`,
  tenantById: (tenantId: string | number) => `tenant:id:${tenantId}`,

  pages: () => 'pages' as const,
  pagesByTenant: (tenantId: string | null | undefined) => `pages:${tenantKey(tenantId)}`,
  page: (slug: string) => `page:${slug}`,
  pageByTenantSlug: (tenantId: string | null | undefined, slug: string) =>
    `page:${tenantKey(tenantId)}:${slug}`,

  menus: () => 'menus' as const,
  menuByTenant: (tenantId: string | null | undefined) => `menu:${tenantKey(tenantId)}`,

  footers: () => 'footers' as const,
  footerByTenant: (tenantId: string | null | undefined) => `footer:${tenantKey(tenantId)}`,

  media: () => 'media' as const,
}

/**
 * Default time (seconds) before a cached entry is considered stale and refreshed
 * lazily in the background. Tag-based revalidation makes this mostly a safety net.
 */
export const CACHE_REVALIDATE_SECONDS = 60 * 60 // 1 hour
