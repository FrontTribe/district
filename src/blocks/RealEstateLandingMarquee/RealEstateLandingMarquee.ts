import type { Block } from 'payload'
import { reLandingAdminGroup } from '@/blocks/real-estate-landing-shared'

const RealEstateLandingMarquee: Block = {
  slug: 'real-estate-landing-marquee',
  dbName: 're_mrq',
  interfaceName: 'RealEstateLandingMarqueeBlock',
  labels: {
    singular: { en: 'RE Landing — Marquee', hr: 'RE landing — marquee' },
    plural: { en: 'RE Landing — Marquee', hr: 'RE landing — marquee' },
  },
  admin: {
    group: reLandingAdminGroup,
    description: {
      en: 'Infinite horizontal ticker built from text fragments.',
      hr: 'Vodoravni ticker od tekstualnih fragmenata.',
    },
  },
  fields: [
    {
      name: 'durationSeconds',
      type: 'number',
      label: { en: 'Loop duration (seconds)', hr: 'Trajanje petlje (s)' },
      defaultValue: 60,
      min: 10,
      max: 240,
      admin: {
        description: { en: 'Lower = faster scroll.', hr: 'Manje = brže kretanje.' },
      },
    },
    {
      name: 'separator',
      type: 'text',
      label: { en: 'Separator between items', hr: 'Separator između stavki' },
      defaultValue: '·',
      admin: { description: { en: 'Single character or short symbol between phrases.', hr: 'Znak između fraza.' } },
    },
    {
      name: 'ariaLabel',
      type: 'text',
      label: { en: 'Aria label', hr: 'Aria oznaka' },
      admin: {
        description: { en: 'Describe the ticker for screen readers.', hr: 'Opis trake za čitače ekrana.' },
      },
    },
    {
      name: 'items',
      type: 'array',
      label: { en: 'Items', hr: 'Stavke' },
      minRows: 1,
      fields: [
        { name: 'text', type: 'text', required: true, label: { en: 'Text', hr: 'Tekst' } },
        { name: 'italic', type: 'checkbox', label: { en: 'Italic', hr: 'Kurziv' }, defaultValue: false },
      ],
    },
  ],
}

export default RealEstateLandingMarquee
