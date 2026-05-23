import { generateTenantUrl } from '@/utils/generateTenantUrl'

/**
 * Public frontend origin for Payload admin live preview (iframe target).
 * Mirrors tenant URL rules used elsewhere (local .test, dev.*, prod).
 */
export function getLivePreviewFrontendUrl(tenantSubdomain?: string | null): string {
  if (tenantSubdomain) {
    return generateTenantUrl(tenantSubdomain)
  }

  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

/** Path on the frontend for a pages collection document. */
export function getLivePreviewPagePath(
  slug: string | null | undefined,
  localeCode?: string | null,
): string {
  const normalizedSlug = slug?.trim() || '/'

  if (normalizedSlug === '/') {
    return localeCode ? `/${localeCode}` : '/'
  }

  return localeCode ? `/${localeCode}/${normalizedSlug}` : `/${normalizedSlug}`
}
