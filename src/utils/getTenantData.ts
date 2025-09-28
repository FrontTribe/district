import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { Menu, Footer, Tenant } from '@/payload-types'

/**
 * Gets tenant-specific menu data
 * @param tenantId - The tenant ID to fetch menu for (null for main domain)
 * @param locale - The locale to fetch the menu in
 * @returns Menu data or null if none found
 */
export async function getTenantMenu(
  tenantId: string | null,
  locale?: string,
): Promise<Menu | null> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    const whereClause = tenantId ? { tenant: { equals: tenantId } } : { tenant: { exists: false } }

    const menuResponse = await payload.find({
      collection: 'menu',
      where: whereClause,
      limit: 1,
      depth: 2,
      locale: locale as any,
    })

    return menuResponse.docs[0] || null
  } catch (_error) {
    return null
  }
}

/**
 * Gets tenant-specific footer data
 * @param tenantId - The tenant ID to fetch footer for (null for main domain)
 * @param locale - The locale to fetch the footer in
 * @returns Footer data or null if none found
 */
export async function getTenantFooter(
  tenantId: string | null,
  locale?: string,
): Promise<Footer | null> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    const whereClause = tenantId ? { tenant: { equals: tenantId } } : { tenant: { exists: false } }

    const footerResponse = await payload.find({
      collection: 'footer',
      where: whereClause,
      limit: 1,
      depth: 2,
      locale: locale as any,
    })

    return footerResponse.docs[0] || null
  } catch (_error) {
    return null
  }
}

/**
 * Gets tenant data by subdomain
 * @param subdomain - The subdomain to look up
 * @returns Tenant data or null if none found
 */
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    const tenantResponse = await payload.find({
      collection: 'tenants',
      where: {
        subdomain: { equals: subdomain },
      },
      limit: 1,
    })

    return tenantResponse.docs[0] || null
  } catch (_error) {
    return null
  }
}

/**
 * Gets both menu and footer data for a tenant
 * @param tenantId - The tenant ID to fetch data for (null for main domain)
 * @param locale - The locale to fetch data in
 * @returns Object containing menu and footer data
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
