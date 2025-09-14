'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page as PageType } from '@/payload-types'
import { BlockRenderer } from './BlockRenderer'
import { useEffect, useState } from 'react'

export default function PageClient({ page: initialPage }: { page: PageType }) {
  const [hasRendered, setHasRendered] = useState(false)

  const { data, isLoading } = useLivePreview<PageType>({
    initialData: initialPage,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  // Use the live preview data if available, otherwise fall back to initial data
  const pageData = data || initialPage

  // Track if we've successfully rendered content
  useEffect(() => {
    if (pageData?.layout && pageData.layout.length > 0) {
      setHasRendered(true)
    }
  }, [pageData])

  // Debug logging
  useEffect(() => {
    console.log('[PageClient] Page data:', {
      hasInitialData: !!initialPage,
      hasLiveData: !!data,
      isLoading,
      hasLayout: !!pageData?.layout,
      layoutLength: pageData?.layout?.length || 0,
      hasRendered,
    })
  }, [initialPage, data, isLoading, pageData, hasRendered])

  // If we have no data at all, don't render anything
  if (!pageData) {
    console.error('[PageClient] No page data available')
    return null
  }

  // If we've previously rendered content and now have no layout, keep showing the last known good content
  if (hasRendered && (!pageData.layout || pageData.layout.length === 0)) {
    console.warn('[PageClient] Layout disappeared, keeping last rendered content')
    return (
      <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
        <div className="text-center text-gray-500">
          <p>Content temporarily unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
      {pageData.layout && <BlockRenderer blocks={pageData.layout} />}
    </div>
  )
}
