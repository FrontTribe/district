import { Block } from 'payload'

const Text: Block = {
  slug: 'text',
  fields: [
    {
      name: 'content',
      type: 'textarea',
      label: 'Content',
      required: true,
    },
    {
      name: 'fontSize',
      type: 'select',
      label: 'Font Size',
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
        {
          label: 'Extra Large',
          value: 'xl',
        },
      ],
      defaultValue: 'medium',
      admin: {
        description: 'Choose the font size for the text content',
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for this section (used for menu navigation)',
      },
    },
  ],
}

export default Text
