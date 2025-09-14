import { Block } from 'payload'

const ImageGrid: Block = {
  slug: 'image-grid',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description: 'Main title displayed in the center',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      required: true,
      admin: {
        description: 'Subtitle text displayed below the title',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      admin: {
        description: 'Optional button text (e.g., "Reservieren")',
      },
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Button URL',
      admin: {
        description: 'URL for the button (if button text is provided)',
        condition: (data) => !!data.buttonText,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'position',
          type: 'select',
          label: 'Position',
          required: true,
          options: [
            { label: 'Top Left (16:9)', value: 'top-left' },
            { label: 'Top Right (9:16)', value: 'top-right' },
            { label: 'Bottom Left (9:16)', value: 'bottom-left' },
            { label: 'Bottom Right (16:9)', value: 'bottom-right' },
          ],
          admin: {
            description: 'Choose the position and aspect ratio for this image',
          },
        },
      ],
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

export default ImageGrid
