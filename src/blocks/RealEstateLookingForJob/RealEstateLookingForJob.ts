import { Block } from 'payload'

const RealEstateLookingForJob: Block = {
  slug: 'real-estate-looking-for-job',
  labels: {
    singular: { en: 'Real Estate Looking for Job', hr: 'Tražimo radnike' },
    plural: { en: 'Real Estate Looking for Job', hr: 'Tražimo radnike' },
  },
  fields: [
    { name: 'badge', type: 'text', label: { en: 'Badge', hr: 'Značka' } },
    { name: 'heading', type: 'text', label: { en: 'Heading', hr: 'Naslov' }, required: true },
    { name: 'subtitle', type: 'text', label: { en: 'Subtitle', hr: 'Podnaslov' } },
    { name: 'description', type: 'textarea', label: { en: 'Description', hr: 'Opis' }, required: true },
    {
      name: 'features',
      type: 'array',
      label: { en: 'Features', hr: 'Karakteristike' },
      fields: [{ name: 'text', type: 'text', label: { en: 'Text', hr: 'Tekst' }, required: true }],
    },
    { name: 'buttonText', type: 'text', label: { en: 'Button text', hr: 'Tekst gumba' }, required: true },
    { name: 'buttonUrl', type: 'text', label: { en: 'Button URL', hr: 'URL gumba' }, required: true },
    { name: 'ctaNote', type: 'text', label: { en: 'CTA note', hr: 'Napomena' } },
    { name: 'sectionId', type: 'text', label: { en: 'Section ID', hr: 'ID sekcije' } },
  ],
}

export default RealEstateLookingForJob
