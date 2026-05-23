import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import type { Page } from '@/payload-types'

type SupportedLocale = 'hr' | 'en' | 'de'

/**
 * Payload depth-populate za `forms` relationship često ne vrati lokalizirane labele/opcije.
 * Ponovno učitamo obrazac s aktivnim localeom prije rendera.
 */
export async function enrichInquiryFormsInPage(page: Page, locale: string): Promise<Page> {
  const layout = page.layout
  if (!layout?.length) return page

  const payload = await getPayload({ config: payloadConfig })
  const loc = (['hr', 'en', 'de'].includes(locale) ? locale : 'hr') as SupportedLocale

  const enrichedLayout = await Promise.all(
    layout.map(async (block) => {
      if (block.blockType !== 'real-estate-landing-inquiry') return block

      const formRef = block.form
      const formId =
        typeof formRef === 'object' && formRef != null && 'id' in formRef ? formRef.id : formRef
      if (formId == null) return block

      try {
        const form = await payload.findByID({
          collection: 'forms',
          id: formId,
          locale: loc,
          depth: 0,
          overrideAccess: true,
        })
        return { ...block, form }
      } catch {
        return block
      }
    }),
  )

  return { ...page, layout: enrichedLayout as Page['layout'] }
}
