'use client'

import { Page as PageType } from '@/payload-types'
import { BlockRenderer } from './BlockRenderer'
import { useLivePreview } from '@payloadcms/live-preview-react'
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'
import { getPayloadServerURL } from '@/utils/payloadServerUrl'

const LIVE_PREVIEW_DEPTH = 6

export default function PageClient({
  page: initialPage,
  locale = 'hr',
  tenantVisualTheme = 'default',
}: {
  page: PageType
  locale?: string
  tenantVisualTheme?: TenantVisualTheme
}) {
  const { data: page } = useLivePreview({
    initialData: initialPage,
    serverURL: getPayloadServerURL(),
    depth: LIVE_PREVIEW_DEPTH,
  })

  if (!page) {
    return null
  }

  if (!page.layout || page.layout.length === 0) {
    return (
      <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
        <div className="text-center text-gray-500">
          <p>No content available for this page</p>
        </div>
      </div>
    )
  }

  return (
    <BlockRenderer
      blocks={page.layout}
      locale={locale}
      tenantVisualTheme={tenantVisualTheme}
    />
  )
}
