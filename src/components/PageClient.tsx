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
      <h1>{data.title}</h1>
      {data.excerpt && <p className="text-lg italic text-gray-600">{data.excerpt}</p>}

      {/* Replace the <pre> tag with the BlockRenderer */}
      {data.layout && <BlockRenderer blocks={data.layout} />}
    </div>
  )
}
