import type { Page, Tenant } from '@/payload-types'

/** Host header subdomain, preview query param, or tenant from the page document. */
export function resolveTenantSubdomain(
  headerSubdomain: string | null | undefined,
  page?: Pick<Page, 'tenant'> | null,
  previewTenant?: string | null,
): string | null {
  if (headerSubdomain?.trim()) {
    return headerSubdomain.trim()
  }

  if (previewTenant?.trim()) {
    return previewTenant.trim()
  }

  const tenant = page?.tenant
  if (tenant && typeof tenant === 'object' && tenant.subdomain?.trim()) {
    return tenant.subdomain.trim()
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
