import { Block } from 'payload'

const RooftopFeatures: Block = {
  slug: 'rooftop-features',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      required: true,
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default RooftopFeatures
