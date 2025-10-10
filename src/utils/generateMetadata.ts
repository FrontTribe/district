import type { Metadata } from 'next'
import type { Page } from '@/payload-types'

interface SEOMetadata {
  title?: string | null
  description?: string | null
  image?: {
    url?: string | null
  } | null
  keywords?: string | null
}

/**
 * Generates Next.js metadata from Payload CMS page SEO data
 * @param page - The page object from Payload CMS
 * @param locale - The current locale
 * @returns Next.js Metadata object
 */
export function generateMetadataFromPage(
  page: Page | null,
  locale?: string,
  baseUrl?: string,
): Metadata {
  if (!page) {
    return {
      title: 'District',
      description: 'District - Boutique Experience',
    }
  }

  // Extract SEO data from the page
  const meta = page.meta as SEOMetadata | undefined

  // Build the metadata object
  const metadata: Metadata = {
    title: meta?.title || `District — ${page.title}`,
    description: meta?.description || page.title,
  }

  // Add keywords if available
  if (meta?.keywords) {
    metadata.keywords = meta.keywords
  }

  // Add Open Graph metadata
  if (meta?.title || meta?.description || meta?.image) {
    metadata.openGraph = {
      title: meta?.title || `District — ${page.title}`,
      description: meta?.description || page.title,
      locale: locale || 'hr',
      type: 'website',
    }

    // Add OG image if available
    if (meta?.image && typeof meta.image === 'object' && meta.image.url) {
      metadata.openGraph.images = [
        {
          url: meta.image.url,
        },
      ]
    }
  }

  // Add Twitter Card metadata
  if (meta?.title || meta?.description || meta?.image) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: meta?.title || `District — ${page.title}`,
      description: meta?.description || page.title,
    }

    // Add Twitter image if available
    if (meta?.image && typeof meta.image === 'object' && meta.image.url) {
      metadata.twitter.images = [meta.image.url]
    }
  }

  // Add canonical URL if baseUrl is provided
  if (baseUrl) {
    const slug = page.slug === '/' ? '' : `/${page.slug}`
    const localePrefix = locale ? `/${locale}` : ''
    metadata.alternates = {
      canonical: `${baseUrl}${localePrefix}${slug}`,
    }
  }

  return metadata
}

/**
 * Generates metadata for a list of pages (home page with multiple pages)
 * @param pages - Array of pages
 * @param locale - The current locale
 * @returns Next.js Metadata object
 */
export function generateMetadataFromPages(
  pages: Page[],
  locale?: string,
  isTenantPage?: boolean,
): Metadata {
  // For home page, use the first page or create default metadata
  const firstPage = pages[0]

  if (!firstPage) {
    return {
      title: isTenantPage ? 'District - Boutique Experience' : 'District',
      description: 'Welcome to District',
    }
  }

  return generateMetadataFromPage(firstPage, locale)
}

