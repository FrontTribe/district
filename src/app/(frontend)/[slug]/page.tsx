import PageClient from '@/components/PageClient'
import { getPayloadClient } from '@/utils/getPayloadClient'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Page as PageType } from '@/payload-types'

type PageProps = {
  params: Promise<{ slug: string }> // <-- params is a Promise here
}

async function fetchPage(slug: string): Promise<PageType | null> {
  try {
    const { isEnabled: isDraftMode } = await draftMode()

    const payload = await getPayloadClient()

    const pageQuery = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      draft: isDraftMode,
      depth: 2,
    })

    return pageQuery.docs[0] || null
  } catch (error) {
    console.error('Error fetching page data:', error)
    return null
  }
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params // <-- await here
  const page = await fetchPage(slug)

  if (!page) {
    return notFound()
  }

  return <PageClient page={page} />
}
