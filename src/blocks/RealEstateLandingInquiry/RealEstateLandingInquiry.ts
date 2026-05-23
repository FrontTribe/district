import type { Block } from 'payload'
import {
  reLandingBlockMeta,
  reLandingHeadingPartsField,
  reLandingInquiryIntroHtmlField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingInquiry: Block = {
  slug: 'real-estate-landing-inquiry',
  dbName: 're_inq',
  interfaceName: 'RealEstateLandingInquiryBlock',
  labels: {
    singular: { en: 'RE Landing — Inquiry', hr: 'RE landing — upit' },
    plural: { en: 'RE Landing — Inquiry', hr: 'RE landing — upit' },
  },
  admin: reLandingBlockMeta({
    en:
      'Contact section: heading left + Payload Form (4 fields: name, email-phone, interest, message). Footer columns are in the Footer block.',
    hr:
      'Kontakt sekcija: naslov lijevo + Payload obrazac (4 polja: ime, email-telefon, interes, poruka). Stupci podnožja su u bloku Podnožje.',
  }),
  fields: [
    reLandingSectionIdField,
    {
      name: 'eyebrow',
      type: 'text',
      label: { en: 'Eyebrow (optional)', hr: 'Eyebrow (opcionalno)' },
      admin: {
        description: {
          en: 'Hidden when empty. Redesign uses heading only.',
          hr: 'Skriveno kad je prazno. Redizajn koristi samo naslov.',
        },
      },
    },
    reLandingHeadingPartsField,
    reLandingInquiryIntroHtmlField,
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: { en: 'Form (Form Builder)', hr: 'Obrazac (Form Builder)' },
      required: true,
      admin: {
        description: {
          en: '4 fields recommended: name, contact (email+phone), interest (select), message (textarea).',
          hr: 'Preporučeno 4 polja: ime, kontakt (email+telefon), interes (select), poruka (textarea).',
        },
      },
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      label: { en: 'Submit button label', hr: 'Natpis gumba za slanje' },
      defaultValue: '— POŠALJI PORUKU',
    },
    {
      name: 'disabledSubmitHelp',
      type: 'text',
      label: { en: 'Help text when form missing', hr: 'Poruka kad nema obrasca' },
      defaultValue: 'Odaberite obrazac u CMS-u',
    },
    {
      name: 'successMessage',
      type: 'text',
      label: { en: 'Success message', hr: 'Poruka nakon slanja' },
      defaultValue: 'Hvala — javit ćemo vam se uskoro.',
    },
  ],
}

export default RealEstateLandingInquiry
