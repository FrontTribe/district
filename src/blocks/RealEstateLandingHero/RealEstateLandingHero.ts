import type { Block } from 'payload'
import { reLandingAdminGroup, reLandingImageAltField } from '@/blocks/real-estate-landing-shared'

const RealEstateLandingHero: Block = {
  slug: 'real-estate-landing-hero',
  dbName: 're_hero',
  interfaceName: 'RealEstateLandingHeroBlock',
  labels: {
    singular: { en: 'RE Landing — Hero', hr: 'RE landing — hero' },
    plural: { en: 'RE Landing — Hero', hr: 'RE landing — hero' },
  },
  admin: {
    group: reLandingAdminGroup,
  },
  fields: [
    {
      name: 'heroSectionId',
      type: 'text',
      label: { en: 'Hero section id', hr: 'ID hero sekcije' },
      defaultValue: 'top',
      admin: {
        description: {
          en: 'HTML id for “back to top” / first screen (default: top).',
          hr: 'HTML id za povratak na vrh (zadano: top).',
        },
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: { en: 'Layout', hr: 'Raspored' },
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Split', value: 'split' },
        { label: 'Centered', value: 'centered' },
      ],
    },
    {
      name: 'topLeftLines',
      type: 'array',
      label: { en: 'Top left lines', hr: 'Gornji lijevi redovi' },
      admin: { description: { en: 'Small meta lines (e.g. city, coordinates).', hr: 'Mali meta redovi (grad, koordinate).' } },
      fields: [{ name: 'line', type: 'text', required: true, label: { en: 'Line', hr: 'Redak' } }],
    },
    {
      name: 'topRightLines',
      type: 'array',
      label: { en: 'Top right lines', hr: 'Gornji desni redovi' },
      fields: [{ name: 'line', type: 'text', required: true, label: { en: 'Line', hr: 'Redak' } }],
    },
    { name: 'eyebrow', type: 'text', required: true, label: { en: 'Eyebrow', hr: 'Mali naslov' } },
    { name: 'titleLine1', type: 'text', required: true, label: { en: 'Title line 1', hr: 'Naslov 1' } },
    {
      name: 'titleLine2Html',
      type: 'textarea',
      label: { en: 'Title line 2 (HTML)', hr: 'Naslov 2 (HTML)' },
      admin: { description: { en: 'Optional second line (e.g. italic name).', hr: 'Opcionalni drugi red.' } },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { en: 'Hero image', hr: 'Hero slika' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    reLandingImageAltField,
    { name: 'mediaCaption', type: 'text', label: { en: 'Media caption', hr: 'Potpis medija' } },
    { name: 'lead', type: 'textarea', required: true, label: { en: 'Lead paragraph', hr: 'Lead odlomak' } },
    {
      name: 'showScrollCue',
      type: 'checkbox',
      label: { en: 'Show scroll cue', hr: 'Prikaži scroll znak' },
      defaultValue: true,
    },
    {
      name: 'scrollCueLabel',
      type: 'text',
      label: { en: 'Scroll cue label', hr: 'Tekst scroll znaka' },
      defaultValue: 'Scroll to explore',
    },
    {
      name: 'metaRows',
      type: 'array',
      label: { en: 'Meta rows (key facts)', hr: 'Meta redovi (ključne činjenice)' },
      admin: { description: { en: 'Short label + value pairs under the hero.', hr: 'Kratki parovi ispod hera.' } },
      fields: [
        { name: 'label', type: 'text', required: true, label: { en: 'Label', hr: 'Oznaka' } },
        { name: 'value', type: 'text', required: true, label: { en: 'Value', hr: 'Vrijednost' } },
      ],
    },
  ],
}

export default RealEstateLandingHero
