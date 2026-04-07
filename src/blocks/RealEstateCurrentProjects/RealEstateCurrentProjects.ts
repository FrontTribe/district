import { Block } from 'payload'

const RealEstateCurrentProjects: Block = {
  slug: 'real-estate-current-projects',
  labels: {
    singular: { en: 'Real Estate Current Projects', hr: 'Trenutni projekti' },
    plural: { en: 'Real Estate Current Projects', hr: 'Trenutni projekti' },
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
      label: { en: 'Projects', hr: 'Projekti' },
      minRows: 1,
      fields: [
        {
          name: 'building',
          type: 'relationship',
          relationTo: 'buildings',
          label: { en: 'Building', hr: 'Zgrada' },
          admin: {
            description: {
              en: 'Floor plan and units are defined on the Building. Opening this project on the site shows the plan; tap a unit to open its PDF page.',
              hr: 'Tlocrt i jedinice definirani su na zgradi. Klik na projekt na stranici otvara tlocrt; klik na jedinicu otvara stranicu PDF-a.',
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          label: { en: 'Title', hr: 'Naziv' },
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: { en: 'Short description', hr: 'Kratki opis' },
          admin: {
            description: {
              en: 'Shown on the project card and in the drawer.',
              hr: 'Prikazuje se na kartici projekta i u draweru.',
            },
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Image', hr: 'Slika' },
          admin: {
            description: {
              en: 'Thumbnail on the project card (grid).',
              hr: 'Sličica na kartici projekta (mreža).',
            },
            filterOptions: {
              mimeType: { contains: 'image' },
            },
          },
        },
        {
          name: 'status',
          type: 'text',
          label: { en: 'Status', hr: 'Status' },
          admin: { hidden: true },
        },
        {
          name: 'ctaText',
          type: 'text',
          label: { en: 'Button text', hr: 'Tekst gumba' },
          admin: { hidden: true },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: { en: 'Button URL', hr: 'URL gumba' },
          admin: { hidden: true },
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

export default RealEstateCurrentProjects
