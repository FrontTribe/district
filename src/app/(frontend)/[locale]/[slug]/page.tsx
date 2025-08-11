import PageClient from '@/components/PageClient'
import { getPayloadClient } from '@/utils/getPayloadClient'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Page as PageType } from '@/payload-types'

type PageProps = {
  params: {
    slug: string
    locale: string
  }
}

type AllowedLocale = 'en' | 'ar' | 'fr' | 'es' | 'all' | undefined

async function fetchPage(slug: string, locale: AllowedLocale): Promise<PageType | null> {
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
      locale, // <-- add locale here to fetch localized content
    })

    return pageQuery.docs[0] || null
  } catch (error) {
    console.error('Error fetching page data:', error)
    return null
  }
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params
  const page = await fetchPage(slug, locale as AllowedLocale)

  if (!page) {
    return notFound()
  }

  return <PageClient page={page} locale={locale} />
}
