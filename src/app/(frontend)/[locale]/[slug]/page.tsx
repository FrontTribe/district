import PageClient from '@/components/PageClient'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import type { Tenant } from '@/payload-types'
import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'
import { getCachedPageBySlug } from '@/utils/getCachedPages'
import { localeLang } from '@/utils/locale'
import { generateMetadataFromPage } from '@/utils/generateMetadata'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

type AllowedLocale = 'en' | 'hr' | 'de' | undefined

const fetchPage = (slug: string, locale: AllowedLocale) => getCachedPageBySlug(slug, locale, 4)

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

  const layout = page.layout ?? []
  const isRealEstatePage =
    layout.length > 0 &&
    layout.every((b: { blockType?: string }) => b.blockType?.startsWith('real-estate-'))

  return (
    <>
      {/* Menu Wrapper - only show for tenant pages */}
      {currentTenant && (
        <MenuWrapper
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

      {isRealEstatePage ? (
        <main className="real-estate-preview">
          <PageClient page={page} locale={locale} />
        </main>
      ) : (
        <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageClient page={page} locale={locale} />
        </div>
      )}

      {/* Footer - only show for tenant pages */}
      {currentTenant && footerGlobal && (
        <Footer
          leftContent={footerGlobal.leftContent}
          rightContent={footerGlobal.rightContent}
          bottomContent={footerGlobal.bottomContent}
        />
      )}
    </>
  )
}
