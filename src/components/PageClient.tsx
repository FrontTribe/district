'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page as PageType } from '@/payload-types'
import { BlockRenderer } from './BlockRenderer'

export default function PageClient({ page: initialPage }: { page: PageType }) {
  const { data } = useLivePreview<PageType>({
    initialData: initialPage,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    depth: 2,
  })

  return (
    <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
      {data.layout && <BlockRenderer blocks={data.layout} />}
    </div>
  )
}
