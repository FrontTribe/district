import type { Page, Tenant } from '@/payload-types'
import { getTenantVisualTheme } from '@/utils/tenantVisualTheme'

/**
 * Resolve tenant subdomain for the current page.
 * Page/preview context wins over host header so localhost (always "district")
 * and main-domain URLs still render tenant pages correctly.
 */
export function resolveTenantSubdomain(
  headerSubdomain: string | null | undefined,
  page?: Pick<Page, 'tenant' | 'slug'> | null,
  previewTenant?: string | null,
): string | null {
  if (previewTenant?.trim()) {
    return previewTenant.trim()
  }

  const tenant = page?.tenant
  if (tenant && typeof tenant === 'object' && tenant.subdomain?.trim()) {
    return tenant.subdomain.trim()
  }

  const slug = typeof page?.slug === 'string' ? page.slug.trim().toLowerCase() : ''
  if (slug && getTenantVisualTheme(slug) !== 'default') {
    return slug
  }

  if (headerSubdomain?.trim()) {
    return headerSubdomain.trim()
  }

  return null
}

export function resolveTenantId(
  page?: Pick<Page, 'tenant'> | null,
  tenantFromSubdomain?: Tenant | null,
): string | null {
  if (tenantFromSubdomain?.id != null) {
    return String(tenantFromSubdomain.id)
  }

  const tenant = page?.tenant
  if (tenant && typeof tenant === 'object' && tenant.id != null) {
    return String(tenant.id)
  }
  if (typeof tenant === 'number' || typeof tenant === 'string') {
    return String(tenant)
  }

  return null
}
