import type { Block } from 'payload'
import {
  reLandingAdminGroup,
  reLandingHeadingPartsField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingGallery: Block = {
  slug: 'real-estate-landing-gallery',
  dbName: 're_gal',
  interfaceName: 'RealEstateLandingGalleryBlock',
  labels: {
    singular: { en: 'RE Landing — Gallery', hr: 'RE landing — galerija' },
    plural: { en: 'RE Landing — Gallery', hr: 'RE landing — galerija' },
  },
  admin: {
    group: reLandingAdminGroup,
    description: {
      en: 'Pinned horizontal gallery with progress and counter.',
      hr: 'Horizontalna galerija s napretkom i brojačem.',
    },
  },
  fields: [
    reLandingSectionIdField,
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      label: { en: 'Intro (plain text)', hr: 'Uvod (obični tekst)' },
      admin: {
        description: {
          en: 'Fallback text beside the heading. Ignored when “Intro (HTML)” is filled.',
          hr: 'Zamjenski tekst pokraj naslova. Ignorira se kad je postavljen HTML uvod.',
        },
      },
    },
    {
      name: 'introHtml',
      type: 'textarea',
      label: { en: 'Intro (HTML)', hr: 'Uvod (HTML)' },
      admin: {
        description: {
          en: 'When set, replaces the plain intro next to the heading.',
          hr: 'Kad je postavljeno, zamjenjuje obični uvod pokraj naslova.',
        },
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: { en: 'Slides', hr: 'Slajdovi' },
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: { mimeType: { contains: 'image' } },
        },
        {
          name: 'slideImageAlt',
          type: 'text',
          label: { en: 'Slide image alt', hr: 'Alt slike slajda' },
          admin: {
            description: {
              en: 'Overrides default alt (slide title) for accessibility.',
              hr: 'Nadjačava zadani alt (naslov slajda).',
            },
          },
        },
        { name: 'name', type: 'text', required: true, label: { en: 'Title', hr: 'Naslov' } },
        { name: 'location', type: 'text', required: true, label: { en: 'Subtitle / location', hr: 'Podnaslov / lokacija' } },
        {
          name: 'credit',
          type: 'text',
          label: { en: 'Photo credit', hr: 'Kredit fotografije' },
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: { en: 'Optional link URL', hr: 'Opcionalni URL' },
          admin: { description: { en: 'Wraps the slide in a link when set.', hr: 'Slajd postaje poveznica kad je postavljeno.' } },
        },
        {
          name: 'linkOpenInNewTab',
          type: 'checkbox',
          label: { en: 'Open link in new tab', hr: 'Poveznica u novom tabu' },
          defaultValue: false,
        },
      ],
    },
  ],
}

export default RealEstateLandingGallery
