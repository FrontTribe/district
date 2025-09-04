import { Block } from 'payload'

const Rooms: Block = {
  slug: 'rooms',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'Explore More',
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks)',
      required: true,
      defaultValue: 'More Rooms & Suites',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'rooms',
      type: 'array',
      label: 'Rooms',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'badges',
          type: 'array',
          label: 'Badges (e.g., Double Bed, 2 Guests, 40m²-65m²)',
          fields: [{ name: 'text', type: 'text' }],
        },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
      admin: {
        description: 'Add up to 4 rooms: Premium, Deluxe, Suite, Apartment',
      },
    },
    { name: 'sectionId', type: 'text', label: 'Section ID' },
  ],
}

export default Rooms
