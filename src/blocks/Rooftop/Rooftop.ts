import { Block } from 'payload'

const Rooftop: Block = {
  slug: 'rooftop',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      required: true,
      defaultValue: 'A Predictive, Personalised Health Platform — for People and Practitioners.',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images (marquee)',
      minRows: 3,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt text',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (small text over image)',
        },
      ],
    },
    {
      name: 'baseDuration',
      type: 'number',
      label: 'Base duration (seconds for one loop)',
      defaultValue: 20,
      admin: {
        description: 'Higher = slower. Animation speeds up temporarily with scroll velocity.',
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default Rooftop
