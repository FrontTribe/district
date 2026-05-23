import type { Form } from '@/payload-types'
import { getReLandingLocalePack, type ReLandingLocale } from '@/data/realEstateLandingLocales'

type FormField = NonNullable<Form['fields']>[number]

function normalizeLocale(locale: string): ReLandingLocale {
  if (locale === 'en' || locale === 'de') return locale
  return 'hr'
}

/** Kad Form Builder u bazi nema `name`/`label` (schema drift), koristimo seed tekstove. */
export function buildInquiryFormFallback(locale: string): FormField[] {
  const fs = getReLandingLocalePack(normalizeLocale(locale)).formSeed
  return [
    {
      blockType: 'text',
      name: 'name',
      label: fs.nameFieldLabel,
      required: true,
      placeholder: fs.namePlaceholder,
    },
    {
      blockType: 'text',
      name: 'contact',
      label: fs.contactFieldLabel,
      required: true,
      placeholder: fs.contactPlaceholder,
    },
    {
      blockType: 'select',
      name: 'interest',
      label: fs.interestFieldLabel,
      required: true,
      placeholder: fs.interestPlaceholder,
      options: fs.interestOptions.map((o) => ({ label: o.label, value: o.value })),
    },
    {
      blockType: 'textarea',
      name: 'message',
      label: fs.messageFieldLabel,
      required: false,
      placeholder: fs.messagePlaceholder,
    },
  ] as FormField[]
}

export function inquiryFormFieldsAreUsable(fields: FormField[] | null | undefined): boolean {
  return Boolean(
    fields?.some(
      (f) => f.blockType !== 'message' && 'name' in f && typeof f.name === 'string' && f.name.trim(),
    ),
  )
}

export function resolveInquiryFormFields(form: Form | null, locale: string): FormField[] {
  const fields = (form?.fields ?? []).filter((f) => f.blockType !== 'message')
  if (inquiryFormFieldsAreUsable(fields)) return fields
  return buildInquiryFormFallback(locale)
}
