import type { Block } from 'payload'
import { reLandingBlockMeta } from '@/blocks/real-estate-landing-shared'

const footerLineLinkTypeOptions = [
  { label: { en: 'Plain text', hr: 'Običan tekst' }, value: 'none' },
  { label: { en: 'Web link', hr: 'Web poveznica' }, value: 'url' },
  { label: { en: 'Email', hr: 'E-pošta' }, value: 'email' },
  { label: { en: 'Phone', hr: 'Telefon' }, value: 'phone' },
] as const

const RealEstateLandingFooter: Block = {
  slug: 'real-estate-landing-page-footer',
  dbName: 're_ftr',
  interfaceName: 'RealEstateLandingPageFooterBlock',
  labels: {
    singular: { en: 'RE Landing — Footer', hr: 'RE landing — podnožje' },
    plural: { en: 'RE Landing — Footer', hr: 'RE landing — podnožje' },
  },
  admin: reLandingBlockMeta({
    en: 'Contact footer: 4 columns (headquarters, phone, email, social) + bottom bar (brand, copyright, address).',
    hr: 'Kontakt podnožje: 4 stupca (sjedište, telefon, pošta, društvene mreže) + donja traka (marka, copyright, adresa).',
  }),
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: { en: 'Footer columns', hr: 'Stupci podnožja' },
      localized: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        description: {
          en: 'Typically 4 cells: Headquarters, Phone, Email, Follow us — each with one or more text lines (optional link).',
          hr: 'Tipično 4 ćelije: Sjedište, Telefon, Pošta, Pratite — svaka s jednim ili više redova teksta (opcionalna poveznica).',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { en: 'Column label', hr: 'Oznaka stupca' },
          required: true,
          localized: true,
        },
        {
          name: 'lines',
          type: 'array',
          dbName: 'ln',
          label: { en: 'Lines', hr: 'Redovi' },
          minRows: 1,
          localized: true,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: { en: 'Text', hr: 'Tekst' },
              required: true,
              localized: true,
            },
            {
              name: 'linkType',
              type: 'select',
              label: { en: 'Link type', hr: 'Vrsta poveznice' },
              defaultValue: 'none',
              options: [...footerLineLinkTypeOptions],
            },
            {
              name: 'href',
              type: 'text',
              label: { en: 'URL', hr: 'URL' },
              localized: true,
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'url',
                description: {
                  en: 'Full URL, e.g. https://instagram.com/…',
                  hr: 'Puni URL, npr. https://instagram.com/…',
                },
              },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              label: { en: 'Open in new tab', hr: 'Otvori u novom tabu' },
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'url',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'brandText',
      type: 'text',
      label: { en: 'Bottom bar — brand', hr: 'Donja traka — marka' },
      required: true,
      localized: true,
      defaultValue: 'district.',
    },
    {
      name: 'copyrightLine',
      type: 'text',
      label: { en: 'Bottom bar — center line', hr: 'Donja traka — središnji red' },
      required: true,
      localized: true,
      defaultValue: '© 2026 — MP BYD D.O.O.',
      admin: {
        description: {
          en: 'Year is auto-updated on the site (e.g. © 2026 — Company).',
          hr: 'Godina se automatski ažurira na stranici (npr. © 2026 — Tvrtka).',
        },
      },
    },
    {
      name: 'addressLine',
      type: 'text',
      label: { en: 'Bottom bar — address (right)', hr: 'Donja traka — adresa (desno)' },
      required: true,
      localized: true,
      defaultValue: 'Ulica Ljudevita Posavskog 7, Osijek',
    },
  ],
}

export default RealEstateLandingFooter
