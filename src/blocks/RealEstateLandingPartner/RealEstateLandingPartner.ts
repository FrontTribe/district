import type { Block } from 'payload'
import {
  reLandingBlockMeta,
  reLandingHeadingPartsField,
  reLandingImageAltField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingPartner: Block = {
  slug: 'real-estate-landing-partner',
  dbName: 're_prt',
  interfaceName: 'RealEstateLandingPartnerBlock',
  labels: {
    singular: { en: 'RE Landing — Partner', hr: 'RE landing — partner' },
    plural: { en: 'RE Landing — Partner', hr: 'RE landing — partner' },
  },
  admin: reLandingBlockMeta({
    en: 'Split section: large image + editorial copy, primary CTA, optional secondary CTA.',
    hr: 'Podijeljena sekcija: velika slika + tekst, primarni i sekundarni CTA.',
  }),
  fields: [
    reLandingSectionIdField,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { en: 'Image', hr: 'Slika' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    reLandingImageAltField,
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    {
      name: 'paragraphs',
      type: 'array',
      label: { en: 'Body paragraphs', hr: 'Odlomci' },
      minRows: 1,
      fields: [{ name: 'text', type: 'textarea', required: true, label: { en: 'Paragraph', hr: 'Odlomak' } }],
    },
    { name: 'ctaLabel', type: 'text', required: true, label: { en: 'Primary CTA label', hr: 'Primarni CTA' } },
    { name: 'ctaHref', type: 'text', required: true, label: { en: 'Primary CTA href', hr: 'Primarni CTA link' } },
    {
      name: 'ctaOpenInNewTab',
      type: 'checkbox',
      label: { en: 'Primary CTA in new tab', hr: 'Primarni CTA u novom tabu' },
      defaultValue: false,
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      label: { en: 'Secondary CTA label', hr: 'Sekundarni CTA natpis' },
    },
    {
      name: 'secondaryCtaHref',
      type: 'text',
      label: { en: 'Secondary CTA href', hr: 'Sekundarni CTA link' },
    },
    {
      name: 'secondaryCtaOpenInNewTab',
      type: 'checkbox',
      label: { en: 'Secondary CTA in new tab', hr: 'Sekundarni CTA u novom tabu' },
      defaultValue: false,
    },
    { name: 'signatureBold', type: 'text', required: true, label: { en: 'Signature (bold)', hr: 'Potpis (bold)' } },
    { name: 'signatureSub', type: 'text', required: true, label: { en: 'Signature (subline)', hr: 'Potpis (podred)' } },
  ],
}

export default RealEstateLandingPartner
