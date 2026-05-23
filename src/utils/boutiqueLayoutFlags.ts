import type { Page } from '@/payload-types'

export function layoutHasBoutiqueFooter(layout: Page['layout'] | null | undefined): boolean {
  if (!layout?.length) return false
  return layout.some((b) => b.blockType === 'boutique-footer')
}
