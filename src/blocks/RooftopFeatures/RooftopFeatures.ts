import { Block } from 'payload'

const RooftopFeatures: Block = {
  slug: 'rooftop-features',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      required: true,
      defaultValue: 'Anyone. Anywhere. 290+ markers, 160+ patterns.',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        { name: 'icon', type: 'text', label: 'Icon (emoji or small text)' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
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
