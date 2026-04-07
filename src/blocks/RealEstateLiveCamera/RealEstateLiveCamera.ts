import { Block } from 'payload'

const RealEstateLiveCamera: Block = {
  slug: 'real-estate-live-camera',
  labels: {
    singular: { en: 'Real Estate Live Camera', hr: 'Live kamera' },
    plural: { en: 'Real Estate Live Camera', hr: 'Live kamera' },
  },
  fields: [
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
      name: 'streamUrl',
      type: 'text',
      label: { en: 'Stream / embed URL', hr: 'URL streama' },
      admin: {
        description: { en: 'YouTube embed URL, Vimeo, or iframe src. Leave empty for placeholder.', hr: 'YouTube embed URL ili iframe src.' },
      },
    },
    {
      name: 'fallbackImage',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Fallback image', hr: 'Rezervna slika' },
      admin: {
        description: { en: 'Shown when no stream URL is set', hr: 'Prikazuje se ako nema streama' },
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: { en: 'Section ID', hr: 'ID sekcije' },
    },
  ],
}

export default RealEstateLiveCamera
