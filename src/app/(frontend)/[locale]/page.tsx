import { headers } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { Page, Tenant } from '@/payload-types'
import '../styles.scss'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { localeLang } from '@/utils/locale'
import { notFound } from 'next/navigation'
import PageClient from '@/components/PageClient'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'

export default async function HomePage({ params }: { params: { locale: string } }) {
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
  console.log(`[Page] Received Subdomain from header: ${subdomain}`)

  // Get current tenant based on subdomain
  let currentTenant: Tenant | null = null
  if (subdomain) {
    currentTenant = await getTenantBySubdomain(subdomain)
    console.log(`[Page] Found tenant for subdomain ${subdomain}:`, currentTenant)
  } else {
    console.log('[Page] No subdomain found in headers')
  }

  // Fetch pages with blocks for the current tenant
  let pages: Page[] = []
  if (currentTenant) {
    try {
      console.log(`[Page] Fetching pages for tenant ID: ${currentTenant.id}`)
      const pagesResponse = await payload.find({
        collection: 'pages',
        depth: 2, // Include nested relationships
        locale: locale as 'en' | 'hr' | 'de' | 'all' | undefined,
        where: {
          and: [
            {
              tenant: {
                equals: currentTenant.id,
              },
            },
            {
              _status: {
                equals: 'published',
              },
            },
          ],
        },
      })
      console.log(`[Page] Found ${pagesResponse.docs.length} published pages for tenant`)
      console.log(`[Page] Pages data:`, pagesResponse.docs)
      pages = pagesResponse.docs as Page[]
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  } else {
    console.log('[Page] No current tenant, fetching only main domain pages (no tenant assigned)')
    try {
      const mainPagesResponse = await payload.find({
        collection: 'pages',
        depth: 2,
        locale: locale as 'en' | 'hr' | 'de' | 'all' | undefined,

        where: {
          and: [
            {
              _status: {
                equals: 'published',
              },
            },
            {
              tenant: {
                exists: false,
              },
            },
          ],
        },
      })
      console.log(`[Page] Found ${mainPagesResponse.docs.length} main domain pages`)
      console.log(`[Page] Main pages data:`, mainPagesResponse.docs)
      pages = mainPagesResponse.docs as Page[]
    } catch (error) {
      console.error('Error fetching main domain pages:', error)
    }
  }

  // Fetch menu and footer for the current tenant
  const tenantId = currentTenant?.id || null
  const { menu: menuGlobal, footer: footerGlobal } = await getTenantMenuAndFooter(tenantId, locale)

  console.log('[Page] Menu data:', menuGlobal)
  console.log('[Page] Footer data:', footerGlobal)

  return (
    <>
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
          menuGlobal?.logo && typeof menuGlobal.logo !== 'string' && menuGlobal.logo.url
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
      />
      <div className={`flex-1 ${menuGlobal?.positioning === 'fixed' ? 'pt-16' : ''}`}>
        <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Link */}
          <div className="demo-link-container mb-8 text-center">
            <Link
              href="/demo"
              className="demo-link inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🎨 View The Room Studio Demo
            </Link>
          </div>

          {/* Render blocks from pages */}
          {pages.length > 0 ? (
            pages.map((page) => (
              <div key={page.id}>
                <PageClient key={page.id} page={page} />
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
      </div>

      {/* Footer */}
      <Footer
        columns={
          footerGlobal?.columns?.map((column) => ({
            title: column.title,
            links:
              column.links?.map((link) => ({
                label: link.label,
                link: link.link,
                external: link.external || false,
              })) || [],
          })) || []
        }
        bottomSection={
          footerGlobal?.bottomSection
            ? {
                copyright: footerGlobal.bottomSection.copyright || undefined,
                socialLinks:
                  footerGlobal.bottomSection.socialLinks?.map((social) => ({
                    platform: social.platform || 'facebook',
                    url: social.url,
                  })) || [],
              }
            : undefined
        }
      />
    </>
  )
}
