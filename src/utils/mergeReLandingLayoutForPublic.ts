import type { Menu, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

function pickMenuDefaults(menu: Menu | null | undefined): Menu['reLandingDefaults'] | null {
  const d = menu?.reLandingDefaults
  if (!d || typeof d !== 'object') return null
  return d
}

/**
 * Spaja podatke iz CMS-a prije rendera: blok „RE landing — upit” dobiva `formActionUrl` iz izbornika
 * kad je u bloku prazno. Tamno podnožje na RE landingu dolazi iz kolekcije **Podnožja** (`footer`), ne iz layouta.
 */
const DEPRECATED_RE_LANDING_FOOTER = 'real-estate-landing-page-footer'

export function mergeReLandingLayoutForPublic(
  layout: Page['layout'] | null | undefined,
  menu: Menu | null,
): Page['layout'] | null | undefined {
  if (!layout?.length) return layout

  const hasDeprecatedFooter = layout.some((b) => b && typeof b === 'object' && b.blockType === DEPRECATED_RE_LANDING_FOOTER)
  const source = (
    hasDeprecatedFooter
      ? layout.filter((b) => b && typeof b === 'object' && b.blockType !== DEPRECATED_RE_LANDING_FOOTER)
      : layout
  ) as LayoutBlock[]

  const menuDefaults = pickMenuDefaults(menu)
  const menuFormUrl = menuDefaults?.formActionUrl?.trim() ?? ''
  const menuFormMethod = menuDefaults?.formMethod
  let inquiryChanged = false
  const next = source.map((block) => {
    if (!block || typeof block !== 'object') return block

    if (block.blockType === 'real-estate-landing-inquiry') {
      const curUrl = typeof block.formActionUrl === 'string' ? block.formActionUrl.trim() : ''
      if (!curUrl && menuFormUrl) {
        inquiryChanged = true
        const method = (block.formMethod ?? menuFormMethod ?? 'POST') as 'GET' | 'POST'
        return { ...block, formActionUrl: menuFormUrl, formMethod: method }
      }
    }

    return block
  }) as LayoutBlock[]

  if (hasDeprecatedFooter || inquiryChanged) return next
  return layout
}

export function mergePageLayoutForPublicPage(page: Page, menu: Menu | null): Page {
  const mergedLayout = mergeReLandingLayoutForPublic(page.layout, menu)
  if (mergedLayout === page.layout) return page
  return { ...page, layout: mergedLayout }
}
