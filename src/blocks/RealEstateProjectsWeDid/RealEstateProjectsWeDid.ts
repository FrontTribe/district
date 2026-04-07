import { Block } from 'payload'

const RealEstateProjectsWeDid: Block = {
  slug: 'real-estate-projects-we-did',
  dbName: 're_pwd',
  labels: {
    singular: { en: 'Real Estate Projects We Did', hr: 'Projekti koje smo napravili' },
    plural: { en: 'Real Estate Projects We Did', hr: 'Projekti koje smo napravili' },
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: { en: 'Eyebrow', hr: 'Mali naslov' },
    },
    {
      name: 'heading',
      type: 'text',
      label: { en: 'Heading', hr: 'Naslov' },
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: { en: 'Subtitle', hr: 'Podnaslov' },
    },
    {
      name: 'projects',
      type: 'array',
      dbName: 'proj',
      label: { en: 'Projects', hr: 'Projekti' },
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', label: { en: 'Title', hr: 'Naziv' }, required: true },
        { name: 'description', type: 'textarea', label: { en: 'Description', hr: 'Opis' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: { en: 'Image', hr: 'Slika' } },
        { name: 'location', type: 'text', label: { en: 'Location', hr: 'Lokacija' } },
        { name: 'year', type: 'text', label: { en: 'Year', hr: 'Godina' } },
        {
          name: 'galleryImages',
          type: 'array',
          dbName: 'gal',
          label: { en: 'Gallery images', hr: 'Slike galerije' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Image', hr: 'Slika' },
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: { en: 'Section ID', hr: 'ID sekcije' },
    },
  ],
}

export default RealEstateProjectsWeDid
