'use client'

import { Page as PageType } from '@/payload-types'
import { BlockRenderer } from './BlockRenderer'
import { useLivePreview } from '@payloadcms/live-preview-react'
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'
import { getTenantVisualTheme } from '@/utils/tenantVisualTheme'
import { resolveTenantSubdomain } from '@/utils/resolveTenantSubdomain'
import { resolvePayloadServerURL } from '@/utils/payloadServerUrl'

const LIVE_PREVIEW_DEPTH = 6

export default function PageClient({
  page: initialPage,
  locale = 'hr',
  tenantVisualTheme = 'default',
  previewTenant,
}: {
  page: PageType
  locale?: string
  tenantVisualTheme?: TenantVisualTheme
  previewTenant?: string
}) {
  const { data: livePage } = useLivePreview({
    initialData: initialPage,
    serverURL: resolvePayloadServerURL(),
    depth: LIVE_PREVIEW_DEPTH,
  })

  const page: PageType = {
    ...initialPage,
    ...livePage,
    layout: livePage?.layout?.length ? livePage.layout : initialPage.layout,
  }

  const subdomain = resolveTenantSubdomain(null, page, previewTenant)
  const resolvedTheme = subdomain ? getTenantVisualTheme(subdomain) : tenantVisualTheme

  if (!page.layout?.length) {
    return (
      <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
        <p className="text-center text-gray-500">No content available for this page</p>
      </div>
    )
  }

  return (
    <BlockRenderer blocks={page.layout} locale={locale} tenantVisualTheme={resolvedTheme} />
  )
}
