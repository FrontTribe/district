import { generateTenantUrl } from '@/utils/generateTenantUrl'

function getConfiguredServerUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SERVER_URL?.trim()?.replace(/\/$/, '')
}

/**
 * Local `pnpm dev` serves HTTP; env often has https://localhost — breaks preview iframe.
 */
function normalizeLocalPreviewOrigin(url: string): string {
  if (process.env.NODE_ENV !== 'development') {
    return url
  }
  if (process.env.LIVE_PREVIEW_HTTPS === 'true') {
    return url
  }
  return url.replace(/^https:\/\//i, 'http://')
}

/**
 * Public frontend origin for Payload admin live preview (iframe target).
 *
 * Always uses the configured CMS/public URL (same origin as admin). Tenant context
 * is passed via `previewTenant` on the draft redirect — not via tenant subdomains.
 * Subdomain URLs (momento.district.hr) break preview on dev/staging and localhost.
 */
export function getLivePreviewFrontendUrl(_tenantSubdomain?: string | null): string {
  const serverUrl = getConfiguredServerUrl()

  if (serverUrl) {
    return normalizeLocalPreviewOrigin(serverUrl)
  }

  if (_tenantSubdomain) {
    return generateTenantUrl(_tenantSubdomain)
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
