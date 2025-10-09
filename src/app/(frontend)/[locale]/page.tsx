import { headers } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { MainPageLoader } from '@/components/MainPageLoader'
import { Page, Tenant } from '@/payload-types'
import '../styles.scss'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { localeLang } from '@/utils/locale'
import { notFound } from 'next/navigation'
import PageClient from '@/components/PageClient'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const requestHeaders: Headers = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const headersList = requestHeaders
  const subdomain = headersList.get('x-tenant-subdomain')

  // Get current tenant based on subdomain
  let currentTenant: Tenant | null = null
  if (subdomain) {
    currentTenant = await getTenantBySubdomain(subdomain)
  }

  // Fetch pages with blocks for the current tenant
  let pages: Page[] = []
  if (currentTenant) {
    try {
      const pagesResponse = await payload.find({
        collection: 'pages',
        depth: 2, // Include nested relationships
        locale: locale as 'en' | 'hr' | 'de' | 'all' | undefined,
        where: {
          tenant: {
            equals: currentTenant.id,
          },
        },
      })
      pages = pagesResponse.docs as Page[]
    } catch (_error) {
      // Error fetching pages
    }
  } else {
    try {
      const mainPagesResponse = await payload.find({
        collection: 'pages',
        depth: 2,
        locale: locale as 'en' | 'hr' | 'de' | 'all' | undefined,
        where: {
          tenant: {
            exists: false,
          },
        },
      })
      pages = mainPagesResponse.docs as Page[]
    } catch (_error) {
      // Error fetching main domain pages
    }
  }

  // Fetch menu and footer for the current tenant
  const tenantId = currentTenant?.id ? String(currentTenant.id) : null
  const { menu: menuGlobal, footer: footerGlobal } = await getTenantMenuAndFooter(tenantId, locale)

  return (
    <MainPageLoader isMainDomain={!subdomain}>
      <RefreshRouteOnSave />

      {/* Menu Wrapper */}
      <MenuWrapper
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
        menuId={menuGlobal?.identifier || 'main-menu'}
        hideHamburger={!currentTenant}
      />
      <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render blocks from pages */}
        {pages.length > 0 ? (
          pages.map((page) => (
            <div key={page.id}>
              <PageClient page={page} locale={locale} />
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

      {/* Footer */}
      {footerGlobal && (
        <Footer
          leftContent={footerGlobal.leftContent}
          rightContent={footerGlobal.rightContent}
          bottomContent={footerGlobal.bottomContent}
        />
      )}
    </MainPageLoader>
  )
}
