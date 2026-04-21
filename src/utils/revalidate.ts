import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import type { Footer, Media, Menu, Page, Tenant } from '@/payload-types'
import { CACHE_TAGS } from './cache-tags'

/**
 * Helpers that translate Payload write events into Next.js cache tag invalidations.
 *
 * Why the indirection: Payload hooks may run during operations where the Next.js
 * request scope is unavailable (e.g. seed scripts, migrations, CLI). `revalidateTag`
 * throws in that case, so we wrap each invocation in a defensive try/catch.
 */

const safeRevalidate = (tag: string): void => {
  try {
    // Next.js 16 requires a profile argument; `'max'` performs a full purge,
    // matching the legacy single-argument behaviour we want for editor saves.
    revalidateTag(tag, 'max')
  } catch {
    // Outside a Next.js request scope (CLI, migrations) — nothing to revalidate.
  }
}

const tenantIdFromRelation = (
  tenant: Page['tenant'] | Menu['tenant'] | Footer['tenant'] | undefined | null,
): string | null => {
  if (!tenant) return null
  if (typeof tenant === 'object') return tenant.id ? String(tenant.id) : null
  return String(tenant)
}

export const revalidatePageHook: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  const currentTenantId = tenantIdFromRelation(doc.tenant)
  const previousTenantId = tenantIdFromRelation(previousDoc?.tenant)

  safeRevalidate(CACHE_TAGS.pages())
  safeRevalidate(CACHE_TAGS.pagesByTenant(currentTenantId))
  if (previousTenantId && previousTenantId !== currentTenantId) {
    safeRevalidate(CACHE_TAGS.pagesByTenant(previousTenantId))
  }

  if (doc.slug) {
    safeRevalidate(CACHE_TAGS.page(doc.slug))
    safeRevalidate(CACHE_TAGS.pageByTenantSlug(currentTenantId, doc.slug))
  }
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    safeRevalidate(CACHE_TAGS.page(previousDoc.slug))
    safeRevalidate(CACHE_TAGS.pageByTenantSlug(previousTenantId, previousDoc.slug))
  }

  return doc
}

export const revalidatePageDeleteHook: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  const tenantId = tenantIdFromRelation(doc.tenant)

  safeRevalidate(CACHE_TAGS.pages())
  safeRevalidate(CACHE_TAGS.pagesByTenant(tenantId))
  if (doc.slug) {
    safeRevalidate(CACHE_TAGS.page(doc.slug))
    safeRevalidate(CACHE_TAGS.pageByTenantSlug(tenantId, doc.slug))
  }

  return doc
}

export const revalidateMenuHook: CollectionAfterChangeHook<Menu> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  const currentTenantId = tenantIdFromRelation(doc.tenant)
  const previousTenantId = tenantIdFromRelation(previousDoc?.tenant)

  safeRevalidate(CACHE_TAGS.menus())
  safeRevalidate(CACHE_TAGS.menuByTenant(currentTenantId))
  if (previousTenantId && previousTenantId !== currentTenantId) {
    safeRevalidate(CACHE_TAGS.menuByTenant(previousTenantId))
  }

  return doc
}

export const revalidateMenuDeleteHook: CollectionAfterDeleteHook<Menu> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  safeRevalidate(CACHE_TAGS.menus())
  safeRevalidate(CACHE_TAGS.menuByTenant(tenantIdFromRelation(doc.tenant)))

  return doc
}

export const revalidateFooterHook: CollectionAfterChangeHook<Footer> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  const currentTenantId = tenantIdFromRelation(doc.tenant)
  const previousTenantId = tenantIdFromRelation(previousDoc?.tenant)

  safeRevalidate(CACHE_TAGS.footers())
  safeRevalidate(CACHE_TAGS.footerByTenant(currentTenantId))
  if (previousTenantId && previousTenantId !== currentTenantId) {
    safeRevalidate(CACHE_TAGS.footerByTenant(previousTenantId))
  }

  return doc
}

export const revalidateFooterDeleteHook: CollectionAfterDeleteHook<Footer> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  safeRevalidate(CACHE_TAGS.footers())
  safeRevalidate(CACHE_TAGS.footerByTenant(tenantIdFromRelation(doc.tenant)))

  return doc
}

export const revalidateTenantHook: CollectionAfterChangeHook<Tenant> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  safeRevalidate(CACHE_TAGS.tenants())
  if (doc.subdomain) safeRevalidate(CACHE_TAGS.tenantBySubdomain(doc.subdomain))
  if (previousDoc?.subdomain && previousDoc.subdomain !== doc.subdomain) {
    safeRevalidate(CACHE_TAGS.tenantBySubdomain(previousDoc.subdomain))
  }
  if (doc.id) safeRevalidate(CACHE_TAGS.tenantById(doc.id))

  return doc
}

export const revalidateTenantDeleteHook: CollectionAfterDeleteHook<Tenant> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc

  safeRevalidate(CACHE_TAGS.tenants())
  if (doc.subdomain) safeRevalidate(CACHE_TAGS.tenantBySubdomain(doc.subdomain))
  if (doc.id) safeRevalidate(CACHE_TAGS.tenantById(doc.id))

  return doc
}

/**
 * Media changes can ripple into any page that embeds the asset. Conservatively
 * invalidate every page-level cache so freshly uploaded/replaced assets surface
 * immediately on the front-end.
 */
export const revalidateMediaHook: CollectionAfterChangeHook<Media> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc
  safeRevalidate(CACHE_TAGS.media())
  safeRevalidate(CACHE_TAGS.pages())
  return doc
}

export const revalidateMediaDeleteHook: CollectionAfterDeleteHook<Media> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) return doc
  safeRevalidate(CACHE_TAGS.media())
  safeRevalidate(CACHE_TAGS.pages())
  return doc
}

/**
 * Generic global hook used as a safety net if any new global is introduced later.
 */
export const revalidateGlobalHook: GlobalAfterChangeHook = ({ doc, req: { context } }) => {
  if (context?.disableRevalidate) return doc
  safeRevalidate(CACHE_TAGS.pages())
  return doc
}
