import { Block } from 'payload'

const RealEstateHero: Block = {
  slug: 'real-estate-hero',
  labels: {
    singular: { en: 'Real Estate Hero', hr: 'Hero (nekretnine)' },
    plural: { en: 'Real Estate Heroes', hr: 'Hero sekcije (nekretnine)' },
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: { en: 'Heading', hr: 'Naslov' },
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: { en: 'Subheading', hr: 'Podnaslov' },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Background Image', hr: 'Pozadinska slika' },
      admin: {
        description: { en: 'Optional hero background image', hr: 'Opcionalna pozadinska slika' },
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: { en: 'Section ID', hr: 'ID sekcije' },
      admin: {
        description: { en: 'Optional ID for anchor links (e.g. hero)', hr: 'Opcionalni ID za navigaciju' },
      },
    },
  ],
}

export default RealEstateHero
