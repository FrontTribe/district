import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageClient from '@/components/PageClient'
import { RealEstateLandingShell } from '@/components/real-estate-landing'
import { getCachedPageBySlug } from '@/utils/getCachedPages'
import { getTenantMenu } from '@/utils/getTenantData'
import { mergePageLayoutForPublicPage } from '@/utils/mergeReLandingLayoutForPublic'
import { enrichInquiryFormsInPage } from '@/utils/enrichInquiryFormsInPage'
import { localeLang } from '@/utils/locale'
import type { ReLandingLocale } from '@/data/realEstateLandingLocales'

export const dynamic = 'force-dynamic'

const PREVIEW_SLUG = (process.env.RE_SEED_PAGE_SLUG || 'real-estate').trim()

export const metadata: Metadata = {
  title: 'Real Estate Landing — Preview (CMS)',
  description:
    'Isti `pages` zapis kao produkcija — učitava se slug iz CMS-a (default: real-estate). Pokreni `pnpm run seed:real-estate` ako stranica ne postoji.',
}

type Props = { params: Promise<{ locale: string }> }

function previewLocale(code: string): ReLandingLocale {
  if (code === 'en' || code === 'de') return code
  return 'hr'
}

export default async function PreviewRealEstateLandingPage({ params }: Props) {
  const { locale: raw } = await params
  const supported = localeLang.find((lang) => lang.code === raw)
  if (!supported) {
    return notFound()
  }

  const locale = previewLocale(raw)
  const page = await getCachedPageBySlug(PREVIEW_SLUG, locale, 6)

  if (!page?.layout?.length) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center text-sm text-neutral-600">
        <p className="mb-4 font-medium text-neutral-900">Nema stranice u CMS-u</p>
        <p>
          Slug: <code className="rounded bg-neutral-100 px-1">{PREVIEW_SLUG}</code> · jezik:{' '}
          <code className="rounded bg-neutral-100 px-1">{locale}</code>
        </p>
        <p className="mt-4">
          Pokreni <code className="rounded bg-neutral-100 px-1">pnpm run seed:real-estate</code> ili uredi
          postojeću stranicu u Payloadu.
        </p>
      </div>
    )
  }

  const tenantRel = page.tenant
  const tenantIdStr =
    tenantRel && typeof tenantRel === 'object' && 'id' in tenantRel
      ? String((tenantRel as { id: number | string }).id)
      : typeof tenantRel === 'number' || typeof tenantRel === 'string'
        ? String(tenantRel)
        : null

  const menu = await getTenantMenu(tenantIdStr, locale)

  const mergedPage = await enrichInquiryFormsInPage(
    mergePageLayoutForPublicPage(page, menu),
    locale,
  )

  const layout = mergedPage.layout ?? []
  const blockType = (b: { blockType?: string | null }) => String(b.blockType ?? '')
  const isRealEstateLandingPage =
    layout.length > 0 && layout.every((b) => blockType(b).startsWith('real-estate-landing-'))

  if (!isRealEstateLandingPage) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center text-sm text-neutral-600">
        <p className="font-medium text-neutral-900">Stranica nije RE landing (blokovi ne počinju s real-estate-landing-).</p>
        <p className="mt-2">U CMS-u postavi layout samo iz novih RE landing blokova.</p>
      </div>
    )
  }

  return (
    <>
      <RealEstateLandingShell>
        <PageClient page={mergedPage} locale={locale} />
      </RealEstateLandingShell>
    </>
  )
}
