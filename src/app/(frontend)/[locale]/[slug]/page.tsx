import PageClient from '@/components/PageClient'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import type { Tenant } from '@/payload-types'
import { RealEstateLandingShell } from '@/components/real-estate-landing'
import { MomentoLandingShell } from '@/components/momento-landing'
import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { resolveTenantSubdomain, resolveTenantId } from '@/utils/resolveTenantSubdomain'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'
import { getTenantVisualTheme } from '@/utils/tenantVisualTheme'
import { getCachedPageBySlug } from '@/utils/getCachedPages'
import { localeLang } from '@/utils/locale'
import { generateMetadataFromPage } from '@/utils/generateMetadata'
import { enrichInquiryFormsInPage } from '@/utils/enrichInquiryFormsInPage'
import { layoutHasBoutiqueFooter } from '@/utils/boutiqueLayoutFlags'
import { buildMomentoShellMenu } from '@/utils/buildMomentoShellMenu'
import { BoutiqueLandingShell } from '@/components/boutique-landing/BoutiqueLandingShell'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<{
    previewTenant?: string
  }>
}

type AllowedLocale = 'en' | 'hr' | 'de' | undefined

const fetchPage = (slug: string, locale: AllowedLocale) => getCachedPageBySlug(slug, locale, 6)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const page = await fetchPage(slug, locale as AllowedLocale)

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return generateMetadataFromPage(page, locale, baseUrl)
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug, locale } = await params
  const { previewTenant } = await searchParams
  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const page = await fetchPage(slug, locale as AllowedLocale)

  if (!page) {
    return notFound()
  }

  const requestHeaders = await headers()
  const subdomain = resolveTenantSubdomain(
    requestHeaders.get('x-tenant-subdomain'),
    page,
    previewTenant,
  )

  let currentTenant: Tenant | null = null
  if (subdomain) {
    currentTenant = await getTenantBySubdomain(subdomain)
  }
  if (!currentTenant && page.tenant && typeof page.tenant === 'object') {
    currentTenant = page.tenant
  }

  const tenantId = resolveTenantId(page, currentTenant)
  const { menu: menuGlobal, footer: footerGlobal } = await getTenantMenuAndFooter(tenantId, locale)
  const tenantVisualTheme = getTenantVisualTheme(subdomain)
  const isMomentoTheme = tenantVisualTheme === 'momento'
  const isBoutiqueTenantPage = tenantVisualTheme === 'boutique' && Boolean(subdomain || currentTenant)
  const isMomentoTenantPage = isMomentoTheme && Boolean(subdomain || currentTenant)

  const mergedPage = await enrichInquiryFormsInPage(page, locale)

  const layout = mergedPage.layout ?? []
  const blockType = (b: { blockType?: string | null }) => String(b.blockType ?? '')

  const isRealEstateLandingPage =
    layout.length > 0 && layout.every((b) => blockType(b).startsWith('real-estate-landing-'))

  const hasLandingNav = layout.some((b) => b.blockType === 'real-estate-landing-nav')

  const showTenantMenu = Boolean(
    currentTenant && !(isRealEstateLandingPage && hasLandingNav) && !isMomentoTenantPage,
  )
  const hasBoutiqueFooterBlock = layoutHasBoutiqueFooter(layout)
  const showTenantFooter = Boolean(
    currentTenant &&
      footerGlobal &&
      !isMomentoTenantPage &&
      !isRealEstateLandingPage &&
      !hasBoutiqueFooterBlock,
  )

  const momentoMenu = isMomentoTheme ? buildMomentoShellMenu(menuGlobal, locale) : undefined

  const pageClient = (
    <PageClient
      page={mergedPage}
      locale={locale}
      previewTenant={previewTenant}
      tenantVisualTheme={tenantVisualTheme}
    />
  )

  const pageBody = (
    <>
      {showTenantMenu && (
        <MenuWrapper
          tenantVisualTheme={tenantVisualTheme}
          brandSubtitle={
            tenantVisualTheme === 'boutique' ? 'Boutique · Osijek' : undefined
          }
          menuItems={
            menuGlobal?.menuItems?.map((item) => ({
              label: item.label,
              link: item.link,
              scrollTarget: item.scrollTarget || undefined,
              external: item.external || false,
              children:
                item.children?.map((child) => ({
                  label: child.label,
                  link: child.link,
                  scrollTarget: child.scrollTarget || undefined,
                  external: child.external || false,
                })) || [],
            })) || []
          }
          logo={
            menuGlobal?.logo &&
            typeof menuGlobal.logo === 'object' &&
            'url' in menuGlobal.logo &&
            menuGlobal.logo.url
              ? {
                  url: menuGlobal.logo.url,
                  alt: menuGlobal.logo.alt || 'Logo',
                  width: menuGlobal.logo.width || 100,
                  height: menuGlobal.logo.height || 100,
                }
              : undefined
          }
          logoText={menuGlobal?.logoText || undefined}
          positioning={menuGlobal?.positioning || 'fixed'}
          locale={locale}
          menuId={menuGlobal?.identifier || 'tenant-menu'}
        />
      )}

      {isRealEstateLandingPage ? (
        <RealEstateLandingShell>{pageClient}</RealEstateLandingShell>
      ) : isMomentoTenantPage ? (
        <MomentoLandingShell menu={momentoMenu}>{pageClient}</MomentoLandingShell>
      ) : (
        <div
          className={
            isBoutiqueTenantPage
              ? 'content content--full-bleed'
              : 'content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
          }
        >
          {pageClient}
        </div>
      )}

      {showTenantFooter && footerGlobal && !isRealEstateLandingPage ? (
        <Footer
          variant={tenantVisualTheme === 'boutique' ? 'boutique' : 'default'}
          leftContent={footerGlobal.leftContent}
          rightContent={footerGlobal.rightContent}
          bottomContent={footerGlobal.bottomContent}
        />
      ) : null}
    </>
  )

  return isBoutiqueTenantPage ? (
    <BoutiqueLandingShell locale={locale}>{pageBody}</BoutiqueLandingShell>
  ) : isMomentoTenantPage ? (
    <div className="momento-tenant-root">{pageBody}</div>
  ) : (
    pageBody
  )
}
