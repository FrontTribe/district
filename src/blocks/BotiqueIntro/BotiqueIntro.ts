import { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const BotiqueIntro: Block = {
  slug: 'botique-intro',
  admin: { group: districtAdminGroups.boutique },
  fields: [
    {
      name: 'chapterNum',
      type: 'text',
      label: { en: 'Chapter number', hr: 'Broj poglavlja' },
    },
    {
      name: 'chapterLabel',
      type: 'text',
      label: { en: 'Chapter label', hr: 'Oznaka poglavlja' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow / Small Heading',
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks; *italic* segments)',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Intro text',
    },
    {
      name: 'pullQuote',
      type: 'textarea',
      label: { en: 'Pull quote', hr: 'Citat' },
    },
    {
      name: 'pullQuoteCite',
      type: 'text',
      label: { en: 'Quote citation', hr: 'Izvor citata' },
    },
    {
      name: 'stats',
      type: 'array',
      label: { en: 'Stats row', hr: 'Statistike' },
      fields: [
        { name: 'value', type: 'number', required: true, label: { en: 'Value', hr: 'Vrijednost' } },
        { name: 'suffix', type: 'text', label: { en: 'Suffix (e.g. m², %)', hr: 'Sufiks' } },
        { name: 'label', type: 'text', required: true, label: { en: 'Label', hr: 'Oznaka' } },
      ],
    },
    {
      name: 'collageTags',
      type: 'array',
      label: { en: 'Collage image tags', hr: 'Oznake na koláži' },
      maxRows: 3,
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text', label: 'Label' },
        { name: 'href', type: 'text', label: 'URL' },
      ],
    },
    {
      name: 'mediaTopRight',
      type: 'upload',
      relationTo: 'media',
      label: 'Top Right Image',
    },
    {
      name: 'mediaBottomLeft',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom Left Large Image',
    },
    {
      name: 'mediaBottomRight',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom Right Small Image',
    },
    {
      name: 'parallax',
      type: 'group',
      label: 'Parallax (scroll) Strength',
      admin: {
        description:
          'Adjust vertical parallax in percent of the element height. Negative moves up, positive moves down.',
      },
      fields: [
        { name: 'topRight', type: 'number', label: 'Top Right Image yPercent', defaultValue: -15 },
        { name: 'bottomLeft', type: 'number', label: 'Bottom Left Image yPercent', defaultValue: 10 },
        { name: 'bottomRight', type: 'number', label: 'Bottom Right Image yPercent', defaultValue: -8 },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      defaultValue: 'o-nama',
    },
  ],
}

export default BotiqueIntro
