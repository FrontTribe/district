import { Block } from 'payload'

const BotiqueIntro: Block = {
  slug: 'botique-intro',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow / Small Heading',
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks)',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Intro text',
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
        },
        {
          name: 'href',
          type: 'text',
          label: 'URL',
        },
      ],
    },
    {
      name: 'mediaTopRight',
      type: 'upload',
      relationTo: 'media',
      label: 'Top Right Image',
    },
    {
      name: 'mediaBottomLeft',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom Left Large Image',
    },
    {
      name: 'mediaBottomRight',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom Right Small Image',
    },
    {
      name: 'parallax',
      type: 'group',
      label: 'Parallax (scroll) Strength',
      admin: {
        description:
          'Adjust vertical parallax in percent of the element height. Negative moves up, positive moves down.',
      },
      fields: [
        {
          name: 'topRight',
          type: 'number',
          label: 'Top Right Image yPercent',
          defaultValue: -15,
        },
        {
          name: 'bottomLeft',
          type: 'number',
          label: 'Bottom Left Image yPercent',
          defaultValue: 10,
        },
        {
          name: 'bottomRight',
          type: 'number',
          label: 'Bottom Right Image yPercent',
          defaultValue: -8,
        },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default BotiqueIntro
