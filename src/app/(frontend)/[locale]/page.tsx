import { headers } from 'next/headers'
import React from 'react'
import type { Metadata } from 'next'

import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { HubBottombar } from '@/components/HubBottombar'
import { MainPageLoader } from '@/components/MainPageLoader'
import { Page, Tenant } from '@/payload-types'
import '../styles.scss'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { localeLang } from '@/utils/locale'
import { notFound } from 'next/navigation'
import PageClient from '@/components/PageClient'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'
import { getTenantVisualTheme } from '@/utils/tenantVisualTheme'
import { getCachedPagesByTenant } from '@/utils/getCachedPages'
import { generateMetadataFromPages } from '@/utils/generateMetadata'
import { buildHubSocialLinks } from '@/utils/hubSocialLinks'

/**
 * Generate static params for all supported locales.
 * Combined with cached data fetches, this lets Next.js statically prepare the
 * locale routes; the per-tenant content layer remains request-scoped because of
 * `headers()` usage below, but underlying queries hit the in-memory cache.
 */
export async function generateStaticParams() {
  return localeLang.map((lang) => ({
    locale: lang.code,
  }))
}

/**
 * Fetch pages for metadata generation. Falls back to main-domain pages when a
 * tenant has no localized content.
 */
async function fetchPagesForMetadata(locale: string, subdomain?: string | null): Promise<Page[]> {
  let currentTenant: Tenant | null = null
  if (subdomain) {
    currentTenant = await getTenantBySubdomain(subdomain)
  }

  if (currentTenant) {
    const tenantPages = await getCachedPagesByTenant(String(currentTenant.id), locale)
    if (tenantPages.length > 0) return tenantPages
    return getCachedPagesByTenant(null, locale)
  }

  return getCachedPagesByTenant(null, locale)
}

/**
 * Generate metadata for the home page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const requestHeaders: Headers = await headers()
  const subdomain = requestHeaders.get('x-tenant-subdomain')

  const pages = await fetchPagesForMetadata(locale, subdomain)

  return generateMetadataFromPages(pages, locale, !!subdomain)
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const requestHeaders: Headers = await headers()
  const subdomain = requestHeaders.get('x-tenant-subdomain')

  let currentTenant: Tenant | null = null
  if (subdomain) {
    currentTenant = await getTenantBySubdomain(subdomain)
  }

  let pages: Page[] = []
  if (currentTenant) {
    pages = await getCachedPagesByTenant(String(currentTenant.id), locale)

    // Fallback to main-domain pages if tenant exists but has no localized pages.
    // When falling back, also surface the main-domain menu/footer (clear tenant).
    if (pages.length === 0) {
      pages = await getCachedPagesByTenant(null, locale)
      if (pages.length > 0) {
        currentTenant = null
      }
    }
  } else {
    pages = await getCachedPagesByTenant(null, locale)
  }

  // Fetch menu and footer for the current tenant
  const tenantId = currentTenant?.id ? String(currentTenant.id) : null
  const { menu: menuGlobal, footer: footerGlobal } = await getTenantMenuAndFooter(tenantId, locale)
  const tenantVisualTheme = getTenantVisualTheme(subdomain)

  const firstBlockType = pages[0]?.layout?.[0]?.blockType
  const isHubTriptychHome = !currentTenant && firstBlockType === 'three-columns'
  const hubMenuCount = menuGlobal?.menuItems?.length ?? 0
  const isBoutiqueTenantHome = Boolean(currentTenant && tenantVisualTheme === 'boutique')
  const mainContentClassName = isHubTriptychHome
    ? 'content w-full'
    : isBoutiqueTenantHome
      ? 'content w-full'
      : 'content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'

  const hubSocialLinks = isHubTriptychHome ? buildHubSocialLinks(footerGlobal) : undefined

  const homeInner = (
    <>
      <RefreshRouteOnSave />

      {/* Menu Wrapper */}
      <MenuWrapper
        tenantVisualTheme={currentTenant ? tenantVisualTheme : 'default'}
        brandSubtitle={
          currentTenant && tenantVisualTheme === 'boutique'
            ? 'Boutique · Osijek'
            : undefined
        }
        menuItems={
          menuGlobal?.menuItems?.map((item) => ({
            label: item.label,
            link: item.link,
            scrollTarget: item.scrollTarget || undefined,
            external: item.external || false,
            children:
              item.children?.map((child) => ({
                label: child.label,
                link: child.link,
                scrollTarget: child.scrollTarget || undefined,
                external: child.external || false,
              })) || [],
          })) || []
        }
        logo={
          menuGlobal?.logo &&
          typeof menuGlobal.logo === 'object' &&
          'url' in menuGlobal.logo &&
          menuGlobal.logo.url
            ? {
                url: menuGlobal.logo.url,
                alt: menuGlobal.logo.alt || 'Logo',
                width: menuGlobal.logo.width || 100,
                height: menuGlobal.logo.height || 100,
              }
            : undefined
        }
        logoText={menuGlobal?.logoText || undefined}
        positioning={menuGlobal?.positioning || 'fixed'}
        locale={locale}
        menuId={menuGlobal?.identifier || (currentTenant ? 'tenant-menu' : 'main-menu')}
        hubLanding={isHubTriptychHome}
        hideHamburger={!currentTenant && (!isHubTriptychHome || hubMenuCount === 0)}
        hubTagline={menuGlobal?.hubTagline}
        hubSocialLinks={hubSocialLinks}
      />
      <div className={mainContentClassName}>
        {/* Render blocks from pages */}
        {pages.length > 0 ? (
          pages.map((page) => (
            <div key={page.id}>
              <PageClient
                page={page}
                locale={locale}
                tenantVisualTheme={currentTenant ? tenantVisualTheme : 'default'}
              />
            </div>
          ))
        ) : currentTenant ? (
          <div className="no-pages">
            <h2>No Pages Found</h2>
            <p>No pages have been created for this tenant yet.</p>
          </div>
        ) : (
          <div className="no-pages">
            <h2>No Pages Found</h2>
            <p>No pages have been created for the main domain yet.</p>
          </div>
        )}
      </div>

      {/* Footer — full CMS footer except on hub triptych (uses HubBottombar like District Landing) */}
      {footerGlobal && !isHubTriptychHome && (
        <Footer
          variant={tenantVisualTheme === 'boutique' ? 'boutique' : 'default'}
          leftContent={footerGlobal.leftContent}
          rightContent={footerGlobal.rightContent}
          bottomContent={footerGlobal.bottomContent}
        />
      )}
      {footerGlobal && isHubTriptychHome && <HubBottombar footer={footerGlobal} />}
    </>
  )

  return (
    <MainPageLoader isMainDomain={!currentTenant} hubTriptychIntro={isHubTriptychHome}>
      {isBoutiqueTenantHome ? (
        <div className="boutique-tenant-root">{homeInner}</div>
      ) : (
        homeInner
      )}
    </MainPageLoader>
  )
}
