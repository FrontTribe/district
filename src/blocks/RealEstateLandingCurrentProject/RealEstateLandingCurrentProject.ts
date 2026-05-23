import type { Block } from 'payload'
import {
  reLandingBlockMeta,
  reLandingHeadingPartsField,
  reLandingImageAltField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingCurrentProject: Block = {
  slug: 'real-estate-landing-current-project',
  dbName: 're_curr',
  interfaceName: 'RealEstateLandingCurrentProjectBlock',
  labels: {
    singular: { en: 'RE Landing — Current project', hr: 'RE landing — trenutni projekt' },
    plural: { en: 'RE Landing — Current project', hr: 'RE landing — trenutni projekt' },
  },
  admin: reLandingBlockMeta({
    en: 'Spotlight block for the active development: number, copy, hero image, stats, CTA.',
    hr: 'Istaknuti blok za aktivni projekt: broj, tekst, slika, statistike, CTA.',
  }),
  fields: [
    reLandingSectionIdField,
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    { name: 'bigNumber', type: 'text', required: true, label: { en: 'Big number', hr: 'Veliki broj' } },
    { name: 'projectMeta', type: 'text', required: true, label: { en: 'Project meta line', hr: 'Meta red projekta' } },
    {
      name: 'projectNameHtml',
      type: 'textarea',
      required: true,
      label: { en: 'Project name (HTML)', hr: 'Naziv projekta (HTML)' },
    },
    { name: 'description', type: 'textarea', required: true, label: { en: 'Description', hr: 'Opis' } },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { en: 'Key visual', hr: 'Ključna vizual' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    reLandingImageAltField,
    { name: 'ctaLabel', type: 'text', required: true, label: { en: 'CTA label', hr: 'Natpis gumba' } },
    { name: 'ctaHref', type: 'text', required: true, label: { en: 'CTA href', hr: 'CTA poveznica' } },
    {
      name: 'ctaOpenInNewTab',
      type: 'checkbox',
      label: { en: 'Open CTA in new tab', hr: 'CTA u novom tabu' },
      defaultValue: false,
    },
    {
      name: 'stats',
      type: 'array',
      dbName: 'cp_st',
      label: { en: 'Stats columns', hr: 'Statistike' },
      minRows: 1,
      admin: { description: { en: 'Three-ish columns under the image.', hr: 'Stupci ispod slike.' } },
      fields: [
        { name: 'label', type: 'text', required: true, label: { en: 'Label', hr: 'Oznaka' } },
        { name: 'value', type: 'text', required: true, label: { en: 'Value', hr: 'Vrijednost' } },
      ],
    },
  ],
}

export default RealEstateLandingCurrentProject
