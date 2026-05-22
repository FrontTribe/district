import type { Block } from 'payload'
import {
  reLandingAdminGroup,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingManifesto: Block = {
  slug: 'real-estate-landing-manifesto',
  /** Short DB prefix: nested `rows → segments → style` enum otherwise exceeds Postgres 63-char limit. */
  dbName: 're_mfst',
  interfaceName: 'RealEstateLandingManifestoBlock',
  labels: {
    singular: { en: 'RE Landing — Manifesto', hr: 'RE landing — manifest' },
    plural: { en: 'RE Landing — Manifesto', hr: 'RE landing — manifest' },
  },
  admin: {
    group: reLandingAdminGroup,
    description: {
      en: 'Large typographic statement: labels + multi-line segmented copy.',
      hr: 'Veliki tipografski blok: oznake + višeredni segmentirani tekst.',
    },
  },
  fields: [
    reLandingSectionIdField,
    { name: 'labelLeft', type: 'text', required: true, label: { en: 'Left label', hr: 'Lijeva oznaka' } },
    { name: 'labelNum', type: 'text', required: true, label: { en: 'Number label', hr: 'Brojčana oznaka' } },
    {
      name: 'topIntroHtml',
      type: 'textarea',
      label: { en: 'Intro above statement (HTML)', hr: 'Uvod iznad teksta (HTML)' },
      admin: { description: { en: 'Optional short paragraph before the big type.', hr: 'Opcionalni kratki odlomak prije velikog teksta.' } },
    },
    {
      name: 'rows',
      type: 'array',
      label: { en: 'Statement rows', hr: 'Redovi izjave' },
      minRows: 1,
      admin: {
        description: {
          en: 'Each row = sequence of segments (plain / muted / accent).',
          hr: 'Svaki red = niz segmenata (obični / prigušeni / naglašeni).',
        },
      },
      fields: [
        {
          name: 'segments',
          type: 'array',
          label: { en: 'Segments in this row', hr: 'Segmenti u retku' },
          minRows: 1,
          fields: [
            { name: 'text', type: 'text', required: true, label: { en: 'Text', hr: 'Tekst' } },
            {
              name: 'style',
              type: 'select',
              label: { en: 'Style', hr: 'Stil' },
              defaultValue: 'plain',
              options: [
                { label: 'Plain', value: 'plain' },
                { label: 'Muted', value: 'mute' },
                { label: 'Accent', value: 'accent' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'footnoteHtml',
      type: 'textarea',
      label: { en: 'Footnote (HTML)', hr: 'Fusnota (HTML)' },
      admin: { description: { en: 'Optional small print under the statement.', hr: 'Opcionalni sitni tekst ispod.' } },
    },
  ],
}

export default RealEstateLandingManifesto
