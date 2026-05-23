'use client'

import { Page as PageType } from '@/payload-types'
import { BlockRenderer } from './BlockRenderer'
import { useState, useEffect } from 'react'
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'

export default function PageClient({
  page: initialPage,
  locale = 'hr',
  tenantVisualTheme = 'default',
}: {
  page: PageType
  locale?: string
  tenantVisualTheme?: TenantVisualTheme
}) {
  const [_hasRendered, setHasRendered] = useState(false)

  // Track if we've rendered content
  useEffect(() => {
    if (initialPage?.layout && initialPage.layout.length > 0) {
      setHasRendered(true)
    }
  }, [initialPage])

  // If we have no data at all, don't render anything
  if (!initialPage) {
    return null
  }

  // If we have no layout, show a fallback
  if (!initialPage.layout || initialPage.layout.length === 0) {
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
      blocks={initialPage.layout}
      locale={locale}
      tenantVisualTheme={tenantVisualTheme}
    />
  )
}
