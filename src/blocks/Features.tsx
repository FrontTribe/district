import { Block } from 'payload'

const Features: Block = {
  slug: 'features',
  fields: [
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export default Features
