import type { Menu, Page } from '@/payload-types'

/**
 * Spaja podatke iz CMS-a prije rendera RE landing stranice.
 */
export function mergeReLandingLayoutForPublic(
  layout: Page['layout'] | null | undefined,
): Page['layout'] | null | undefined {
  return layout
}

export function mergePageLayoutForPublicPage(page: Page, _menu?: Menu | null): Page {
  return page
}
