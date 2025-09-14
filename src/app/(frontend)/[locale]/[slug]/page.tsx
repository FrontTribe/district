import PageClient from '@/components/PageClient'
import { getPayloadClient } from '@/utils/getPayloadClient'
import { notFound } from 'next/navigation'
import { draftMode, headers } from 'next/headers'
import type { Page as PageType, Tenant } from '@/payload-types'
import { MenuWrapper } from '@/components/MenuWrapper'
import { Footer } from '@/components/Footer'
import { getTenantBySubdomain, getTenantMenuAndFooter } from '@/utils/getTenantData'
import { localeLang } from '@/utils/locale'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

type AllowedLocale = 'en' | 'hr' | 'de' | undefined

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

      <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageClient page={page} />
      </div>

      {/* Footer - only show for tenant pages */}
      {currentTenant && (
        <Footer
          columns={
            footerGlobal?.columns?.map((column) => ({
              title: column.title,
              links:
                column.links?.map((link) => ({
                  label: link.label,
                  link: link.link,
                  external: link.external || false,
                })) || [],
            })) || []
          }
          bottomSection={
            footerGlobal?.bottomSection
              ? {
                  copyright: footerGlobal.bottomSection?.copyright ?? undefined,
                  socialLinks:
                    footerGlobal.bottomSection?.socialLinks?.map((s) => ({
                      platform: s.platform as string,
                      url: s.url,
                    })) || [],
                }
              : undefined
          }
        />
      )}
    </>
  )
}
