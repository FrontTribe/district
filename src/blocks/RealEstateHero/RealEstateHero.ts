import { Block } from 'payload'

const RealEstateHero: Block = {
  slug: 'real-estate-hero',
  labels: {
    singular: 'Real Estate Hero',
    plural: 'Real Estate Heroes',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title Line 1',
      defaultValue: 'DISTRICT',
      required: true,
    },
    {
      name: 'titleLine2',
      type: 'text',
      label: 'Title Line 2',
      defaultValue: 'REAL ESTATE',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      defaultValue: 'Modern living spaces designed for comfort and luxury',
    },
    {
      name: 'backgroundMedia',
      type: 'group',
      label: 'Background Media',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Media Type',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'image',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'video',
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

export default RealEstateHero
