'use client'

import { Page as PageType } from '@/payload-types'
import { BlockRenderer } from './BlockRenderer'
import { useEffect, useState } from 'react'

export default function PageClient({ page: initialPage }: { page: PageType }) {
  const [hasRendered, setHasRendered] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('[PageClient] Rendering page:', {
      pageId: initialPage?.id,
      title: initialPage?.title || 'No title',
      blockCount: initialPage?.layout?.length || 0,
    })
  }, [initialPage])

  // Track if we've rendered content
  useEffect(() => {
    if (initialPage?.layout && initialPage.layout.length > 0) {
      setHasRendered(true)
      console.log('[PageClient] Content rendered successfully')
    }
  }, [initialPage])

  // If we have no data at all, don't render anything
  if (!initialPage) {
    console.error('[PageClient] No page data available')
    return null
  }

  // If we have no layout, show a fallback
  if (!initialPage.layout || initialPage.layout.length === 0) {
    console.warn('[PageClient] No layout data available')
    return (
      <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
        <div className="text-center text-gray-500">
          <p>No content available for this page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
      <BlockRenderer blocks={initialPage.layout} />
    </div>
  )
}
