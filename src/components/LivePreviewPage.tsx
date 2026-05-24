'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import type { Page } from '@/payload-types'
import { BlockRenderer } from '@/components/BlockRenderer'
import { MomentoLandingShell, type MomentoShellMenuProps } from '@/components/momento-landing'
import { RealEstateLandingShell } from '@/components/real-estate-landing'
import { resolveTenantSubdomain } from '@/utils/resolveTenantSubdomain'
import { getTenantVisualTheme, type TenantVisualTheme } from '@/utils/tenantVisualTheme'
import { resolvePayloadServerURL } from '@/utils/payloadServerUrl'

const LIVE_PREVIEW_DEPTH = 6

function isRealEstateLandingLayout(layout: Page['layout']): boolean {
  if (!layout?.length) return false
  return layout.every((b) => String(b.blockType ?? '').startsWith('real-estate-landing-'))
}

type LivePreviewPageProps = {
  page: Page
  locale: string
  tenantVisualTheme: TenantVisualTheme
  momentoMenu?: MomentoShellMenuProps
  isRealEstateLandingPage?: boolean
  isBoutiqueTenantPage?: boolean
}

/**
 * Client-side page body for Payload live preview: merges CMS edits and keeps
 * tenant landing shells (Momento/RE CSS) in sync with block updates.
 * Boutique shell stays on the server layout to avoid double-wrapping.
 */
export function LivePreviewPage({
  page: initialPage,
  locale,
  tenantVisualTheme,
  momentoMenu,
  isRealEstateLandingPage = false,
  isBoutiqueTenantPage = false,
}: LivePreviewPageProps) {
  const { data: page } = useLivePreview({
    initialData: initialPage,
    serverURL: resolvePayloadServerURL(),
    depth: LIVE_PREVIEW_DEPTH,
  })

  const subdomain = resolveTenantSubdomain(null, page)
  const theme = subdomain ? getTenantVisualTheme(subdomain) : tenantVisualTheme
  const layout = page?.layout ?? []

  if (!layout.length) {
    return (
      <div className="prose mx-auto max-w-4xl p-4 lg:p-8">
        <p className="text-center text-gray-500">No content available for this page</p>
      </div>
    )
  }

  const blocks = (
    <BlockRenderer blocks={layout} locale={locale} tenantVisualTheme={theme} />
  )

  if (isRealEstateLandingPage || isRealEstateLandingLayout(layout)) {
    return <RealEstateLandingShell>{blocks}</RealEstateLandingShell>
  }

  if (theme === 'momento') {
    return <MomentoLandingShell menu={momentoMenu}>{blocks}</MomentoLandingShell>
  }

  if (theme === 'boutique' || isBoutiqueTenantPage) {
    return <div className="content content--full-bleed">{blocks}</div>
  }

  return (
    <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{blocks}</div>
  )
}
