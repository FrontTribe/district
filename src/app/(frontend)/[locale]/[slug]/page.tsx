import PageClient from '@/components/PageClient'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import type { Tenant } from '@/payload-types'
import { RealEstateLandingShell } from '@/components/real-estate-landing'
import { MomentoLandingShell } from '@/components/momento-landing'
import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'
import { getTenantVisualTheme } from '@/utils/tenantVisualTheme'
import { getCachedPageBySlug } from '@/utils/getCachedPages'
import { localeLang } from '@/utils/locale'
import { generateMetadataFromPage } from '@/utils/generateMetadata'
import { mergePageLayoutForPublicPage } from '@/utils/mergeReLandingLayoutForPublic'
import { enrichInquiryFormsInPage } from '@/utils/enrichInquiryFormsInPage'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

type AllowedLocale = 'en' | 'hr' | 'de' | undefined

/** Dubina za ugniježđene blokove (npr. `building` → `unitDetailsPdf` u unit browseru). */
const fetchPage = (slug: string, locale: AllowedLocale) => getCachedPageBySlug(slug, locale, 6)

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const page = await fetchPage(slug, locale as AllowedLocale)

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
    }
  }

  // Get base URL from environment or construct it
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return generateMetadataFromPage(page, locale, baseUrl)
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params
  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const page = await fetchPage(slug, locale as AllowedLocale)

  if (!page) {
    return notFound()
  }

  // Get tenant data for menu and footer
  const requestHeaders: Headers = await headers()
  const headersList = requestHeaders
  const subdomain = headersList.get('x-tenant-subdomain')

  let currentTenant: Tenant | null = null
  if (subdomain) {
    currentTenant = await getTenantBySubdomain(subdomain)
  }

  // Fetch menu and footer for the current tenant
  const tenantId = currentTenant?.id ? String(currentTenant.id) : null
  const { menu: menuGlobal, footer: footerGlobal } = await getTenantMenuAndFooter(tenantId, locale)
  const tenantVisualTheme = getTenantVisualTheme(subdomain)
  const isBoutiqueTenantPage = Boolean(currentTenant && tenantVisualTheme === 'boutique')
  const isMomentoTenantPage = Boolean(currentTenant && tenantVisualTheme === 'momento')

  const mergedPage = await enrichInquiryFormsInPage(
    mergePageLayoutForPublicPage(page, menuGlobal),
    locale,
  )

  const layout = mergedPage.layout ?? []
  const blockType = (b: { blockType?: string | null }) => String(b.blockType ?? '')

  const isRealEstateLandingPage =
    layout.length > 0 && layout.every((b) => blockType(b).startsWith('real-estate-landing-'))

  const isLegacyRealEstatePage =
    layout.length > 0 &&
    layout.every((b) => {
      const t = blockType(b)
      return t.startsWith('real-estate-') && !t.startsWith('real-estate-landing-')
    })

  const hasLandingNav = layout.some((b) => b.blockType === 'real-estate-landing-nav')

  const showTenantMenu = Boolean(
    currentTenant && !(isRealEstateLandingPage && hasLandingNav) && !isMomentoTenantPage,
  )
  const showTenantFooter = Boolean(currentTenant && footerGlobal && !isMomentoTenantPage && !isRealEstateLandingPage)

  const momentoMenu =
    menuGlobal && isMomentoTenantPage
      ? {
          logoText: menuGlobal.logoText ?? 'Momento.',
          locale,
          menuItems:
            menuGlobal.menuItems?.map((item) => ({
              label: item.label,
              link: item.link,
              scrollTarget: item.scrollTarget || undefined,
              external: item.external || false,
            })) ?? [],
        }
      : undefined

  const pageClient = (
    <PageClient
      page={mergedPage}
      locale={locale}
      tenantVisualTheme={currentTenant ? tenantVisualTheme : 'default'}
    />
  )

  const pageBody = (
    <>
      {/* Menu Wrapper - only show for tenant pages */}
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
      ) : isLegacyRealEstatePage ? (
        <main className="real-estate-preview">{pageClient}</main>
      ) : (
        <div
          className={
            isBoutiqueTenantPage
              ? 'content w-full'
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
    <div className="boutique-tenant-root">{pageBody}</div>
  ) : isMomentoTenantPage ? (
    <div className="momento-tenant-root">{pageBody}</div>
  ) : (
    pageBody
  )
}
