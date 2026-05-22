import type { Block } from 'payload'
import { reLandingAdminGroup, reLandingCtaFields } from '@/blocks/real-estate-landing-shared'

const RealEstateLandingNav: Block = {
  slug: 'real-estate-landing-nav',
  /** Postgres identifier ≤63 chars for indexes / FKs on nested arrays */
  dbName: 're_nav',
  interfaceName: 'RealEstateLandingNavBlock',
  labels: {
    singular: { en: 'RE Landing — Nav', hr: 'RE landing — navigacija' },
    plural: { en: 'RE Landing — Nav', hr: 'RE landing — navigacija' },
  },
  admin: {
    group: reLandingAdminGroup,
    description: {
      en: 'Top navigation: brand HTML, anchor links, optional CTA, language strip.',
      hr: 'Vrh navigacije: marka HTML, sidrene poveznice, opcionalni CTA, jezična traka.',
    },
  },
  fields: [
    {
      name: 'brandHtml',
      type: 'textarea',
      label: { en: 'Brand (HTML)', hr: 'Marka (HTML)' },
      defaultValue: '<b>district.</b>',
      admin: {
        description: { en: 'Small HTML snippet for the logo area.', hr: 'Mali HTML za logo.' },
      },
    },
    {
      name: 'brandAriaLabel',
      type: 'text',
      label: { en: 'Brand aria-label', hr: 'Brand aria-label' },
      admin: {
        description: {
          en: 'Accessibility label for the brand link (e.g. “District home”).',
          hr: 'Pristupačnost: opis poveznice na početak (npr. “District početna”).',
        },
      },
    },
    {
      name: 'langLine',
      type: 'text',
      label: { en: 'Language line', hr: 'Jezična traka' },
      defaultValue: 'HR · EN · DE',
    },
    {
      name: 'showLangLine',
      type: 'checkbox',
      label: { en: 'Show language line', hr: 'Prikaži jezičnu traku' },
      defaultValue: true,
    },
    {
      name: 'links',
      type: 'array',
      label: { en: 'Anchor links', hr: 'Sidrene poveznice' },
      minRows: 1,
      admin: {
        description: { en: 'In-page anchors (#section) or full URLs.', hr: 'Sidra na stranici (#sekcija) ili puni URL.' },
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: { en: 'Label', hr: 'Natpis' } },
        { name: 'href', type: 'text', required: true, label: { en: 'Href', hr: 'Href' } },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: { en: 'Open in new tab', hr: 'U novom tabu' },
          defaultValue: false,
        },
      ],
    },
    ...reLandingCtaFields,
  ],
}

export default RealEstateLandingNav
