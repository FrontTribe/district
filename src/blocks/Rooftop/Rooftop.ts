import { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const Rooftop: Block = {
  slug: 'rooftop',
  admin: { group: districtAdminGroups.boutique },
  fields: [
    {
      name: 'layoutVariant',
      type: 'select',
      label: { en: 'Layout variant', hr: 'Varijanta layouta' },
      defaultValue: 'editorial',
      options: [
        { label: { en: 'Editorial (redesign)', hr: 'Editorial (redizajn)' }, value: 'editorial' },
        { label: { en: 'Marquee (legacy)', hr: 'Marquee (legacy)' }, value: 'marquee' },
      ],
    },
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
      label: 'Eyebrow',
      localized: true,
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (*italic* supported)',
      required: true,
      localized: true,
    },
    {
      name: 'mastheadMedia',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Masthead image', hr: 'Naslovna slika' },
    },
    {
      name: 'metaRows',
      type: 'array',
      label: { en: 'Masthead meta rows', hr: 'Meta redovi' },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'manifestEyebrow',
      type: 'text',
      label: { en: 'Manifest eyebrow', hr: 'Manifest eyebrow' },
      defaultValue: 'Manifest',
      localized: true,
    },
    {
      name: 'manifestHeading',
      type: 'textarea',
      label: { en: 'Manifest heading', hr: 'Manifest naslov' },
      localized: true,
    },
    {
      name: 'manifestItems',
      type: 'array',
      label: { en: 'Manifest items', hr: 'Manifest stavke' },
      fields: [
        { name: 'key', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'stackImages',
      type: 'array',
      label: { en: 'Stack images', hr: 'Stack slike' },
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text', defaultValue: '#kontakt' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images (marquee — legacy variant only)',
      minRows: 3,
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true, label: 'Image' },
        { name: 'alt', type: 'text', label: 'Alt text' },
        { name: 'caption', type: 'text', label: 'Caption (small text over image)' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layoutVariant === 'marquee',
      },
    },
    {
      name: 'baseDuration',
      type: 'number',
      label: 'Base duration (seconds for one loop)',
      defaultValue: 20,
      admin: {
        description: 'Marquee only. Higher = slower.',
        condition: (_, siblingData) => siblingData?.layoutVariant === 'marquee',
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      defaultValue: 'krov',
    },
  ],
}

export default Rooftop
