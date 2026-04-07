import { Block } from 'payload'

const RealEstateAboutUs: Block = {
  slug: 'real-estate-about-us',
  labels: {
    singular: { en: 'Real Estate About Us', hr: 'O nama (nekretnine)' },
    plural: { en: 'Real Estate About Us', hr: 'O nama sekcije' },
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: { en: 'Eyebrow', hr: 'Mali naslov' },
      admin: {
        description: { en: 'Small label above the heading', hr: 'Oznaka iznad naslova' },
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: { en: 'Heading', hr: 'Naslov' },
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: { en: 'Body', hr: 'Tekst' },
      required: true,
      admin: {
        description: { en: 'HTML allowed (e.g. <p>...</p>)', hr: 'HTML dozvoljen' },
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: { en: 'Section ID', hr: 'ID sekcije' },
    },
  ],
}

export default RealEstateAboutUs
