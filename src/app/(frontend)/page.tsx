import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { BlockRenderer } from '@/components/BlockRenderer'
import { Page, Tenant } from '@/payload-types'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const headersList = headers
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
    console.log('[Page] No current tenant, fetching all published pages for debugging')
    try {
      const allPagesResponse = await payload.find({
        collection: 'pages',
        depth: 2,
        where: {
          _status: {
            equals: 'published',
          },
        },
      })
      console.log(`[Page] Found ${allPagesResponse.docs.length} total published pages`)
      console.log(`[Page] All pages data:`, allPagesResponse.docs)
      pages = allPagesResponse.docs as Page[]
    } catch (error) {
      console.error('Error fetching all pages:', error)
    }
  }

  return (
    <div className="home">
      <div className="content">
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}

        {/* Debug info */}
        <div className="debug-info">
          <h3>Debug Information</h3>
          <p>Subdomain from header: {subdomain || 'None'}</p>
          <p>
            Current tenant: {currentTenant ? `${currentTenant.name} (${currentTenant.id})` : 'None'}
          </p>
          <p>
            Pages found: {pages.length}{' '}
            {!currentTenant && pages.length > 0 ? '(showing all pages)' : ''}
          </p>
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
        ) : null}

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
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
