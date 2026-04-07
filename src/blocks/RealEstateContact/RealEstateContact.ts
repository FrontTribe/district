import { Block } from 'payload'

const RealEstateContact: Block = {
  slug: 'real-estate-contact',
  labels: {
    singular: { en: 'Real Estate Contact', hr: 'Kontakt (nekretnine)' },
    plural: { en: 'Real Estate Contact', hr: 'Kontakt sekcije' },
  },
  fields: [
    { name: 'eyebrow', type: 'text', label: { en: 'Eyebrow', hr: 'Mali naslov' } },
    { name: 'heading', type: 'text', label: { en: 'Heading', hr: 'Naslov' }, required: true },
    { name: 'leftText', type: 'textarea', label: { en: 'Intro text', hr: 'Uvodni tekst' } },
    { name: 'address', type: 'textarea', label: { en: 'Address', hr: 'Adresa' } },
    { name: 'email', type: 'email', label: { en: 'Email', hr: 'Email' } },
    { name: 'phone', type: 'text', label: { en: 'Phone', hr: 'Telefon' } },
    { name: 'sectionId', type: 'text', label: { en: 'Section ID', hr: 'ID sekcije' } },
  ],
}

export default RealEstateContact
