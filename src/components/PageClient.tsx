'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page as PageType } from '@/payload-types'

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

      {data.layout && (
        <div>
          <h2 className="mt-8 border-t pt-4">Live Layout Data:</h2>
          <pre className="rounded-lg bg-gray-100 p-4">{JSON.stringify(data.layout, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
