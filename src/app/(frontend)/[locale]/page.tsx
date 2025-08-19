import { headers as getHeaders, headers } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { BlockRenderer } from '@/components/BlockRenderer'
import { Menu } from '@/components/Menu'
import { Footer } from '@/components/Footer'
import { Page, Tenant } from '@/payload-types'
import '../styles.css'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { localeLang } from '@/utils/locale'
import { notFound } from 'next/navigation'

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const requestHeaders: Headers = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: requestHeaders })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const headersList = requestHeaders
  const subdomain = headersList.get('x-tenant-subdomain')
  console.log(`[Page] Received Subdomain from header: ${subdomain}`)

  // Get current tenant based on subdomain
  let currentTenant: Tenant | null = null
  if (subdomain) {
    try {
      const tenantsResponse = await payload.find({
        collection: 'tenants',
        where: {
          subdomain: {
            equals: subdomain,
          },
        },
      })
      console.log(`[Page] Found ${tenantsResponse.docs.length} tenants for subdomain: ${subdomain}`)
      console.log(`[Page] Tenant data:`, tenantsResponse.docs)
      currentTenant = tenantsResponse.docs[0] || null
    } catch (error) {
      console.error('Error fetching tenant:', error)
    }
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

  // Fetch globals (menu and footer) for the current tenant
  let menuGlobal = null
  let footerGlobal = null

  try {
    // For now, we'll fetch all globals and filter by tenant on the client side
    // In a production environment, you might want to implement a custom API endpoint
    // that filters globals by tenant
    const menuResponse = await payload.findGlobal({
      slug: 'menu',
      depth: 2,
    })
    console.log('[Page] Menu global:', menuResponse)

    const footerResponse = await payload.findGlobal({
      slug: 'footer',
      depth: 2,
    })

    if (currentTenant) {
      if (
        menuResponse &&
        typeof menuResponse.tenant === 'object' &&
        menuResponse.tenant?.id === currentTenant.id
      ) {
        menuGlobal = menuResponse
      }
      if (
        footerResponse &&
        typeof footerResponse.tenant === 'object' &&
        footerResponse.tenant?.id === currentTenant.id
      ) {
        footerGlobal = footerResponse
      }
    } else {
      if (menuResponse && !menuResponse.tenant) menuGlobal = menuResponse
      if (footerResponse && !footerResponse.tenant) footerGlobal = footerResponse
    }
    console.log('[Page] Menu global:', menuGlobal)
    console.log('[Page] Footer global:', footerGlobal)
  } catch (error) {
    console.error('Error fetching globals:', error)
  }

  return (
    <>
      <RefreshRouteOnSave />

      {/* Menu */}
      <Menu
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
      />
      <div className="flex-1 pt-16">
        <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!user && <h1>Welcome to your new project.</h1>}
          {user && <h1>Welcome back, {user.email}</h1>}

          {/* Debug info */}
          <div className="debug-info">
            <h3>Debug Information</h3>
            <p>Subdomain from header: {subdomain || 'None'}</p>
            <p>
              Locale from URL: {locale || 'None'}
              {supportedLocale ? ` (${supportedLocale.label})` : ''}
            </p>
            <p>
              Current tenant:{' '}
              {currentTenant ? `${currentTenant.name} (${currentTenant.id})` : 'None'}
            </p>
            <p>
              Pages found: {pages.length}{' '}
              {!currentTenant && pages.length > 0 ? '(showing main domain pages only)' : ''}
            </p>
            <p>Menu global: {menuGlobal ? 'Found' : 'Not found'}</p>
            <p>Footer global: {footerGlobal ? 'Found' : 'Not found'}</p>
            {pages.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <p>
                  <strong>Page details:</strong>
                </p>
                {pages.map((page, index) => (
                  <div key={page.id} style={{ marginLeft: '10px', fontSize: '12px' }}>
                    <p>
                      • {page.title} (ID: {page.id})
                    </p>
                    <p style={{ marginLeft: '10px' }}>
                      Tenant:{' '}
                      {typeof page.tenant === 'string' ? page.tenant : page.tenant?.id || 'None'}
                    </p>
                    <p style={{ marginLeft: '10px' }}>Layout blocks: {page.layout?.length || 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Show current tenant info */}
          {currentTenant && (
            <div className="tenant-info">
              <h2>Current Tenant: {currentTenant.name}</h2>
              <p>Subdomain: {currentTenant.subdomain}</p>
            </div>
          )}

          {!currentTenant && subdomain && (
            <div className="tenant-not-found">
              <h2>Tenant Not Found</h2>
              <p>No tenant found for subdomain: {subdomain}</p>
            </div>
          )}

          {/* Render blocks from pages */}
          {pages.length > 0 ? (
            pages.map((page) => (
              <div key={page.id} className="page-content">
                <h2>{page.title}</h2>
                {page.layout && <BlockRenderer blocks={page.layout} />}
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

          <div className="links">
            <a
              className="admin"
              href={payloadConfig.routes.admin}
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to admin panel
            </a>
            <a
              className="docs"
              href="https://payloadcms.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
            </a>
          </div>
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
