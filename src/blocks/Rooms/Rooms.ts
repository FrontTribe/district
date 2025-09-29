import { Block } from 'payload'

const Rooms: Block = {
  slug: 'rooms',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      localized: true,
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks)',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      localized: true,
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
      localized: true,
    },
    {
      name: 'rooms',
      type: 'array',
      label: 'Rooms',
      minRows: 1,
      maxRows: 4,
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        {
          name: 'badges',
          type: 'array',
          label: 'Badges (e.g., Double Bed, 2 Guests, 40m²-65m²)',
          localized: true,
          fields: [{ name: 'text', type: 'text', localized: true }],
        },
        { name: 'image', type: 'upload', relationTo: 'media', required: true, localized: true },
      ],
      admin: {
        description: 'Add up to 4 rooms: Premium, Deluxe, Suite, Apartment',
      },
    },
    { name: 'sectionId', type: 'text', label: 'Section ID', localized: true },
  ],
}

export default Rooms
