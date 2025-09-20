import { Block } from 'payload'

const ThreeColumns: Block = {
  slug: 'three-columns',
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          admin: {
            description: 'Optional background image for this column',
          },
        },
        {
          name: 'fullHeight',
          type: 'checkbox',
          label: 'Full Height Column',
          defaultValue: false,
          admin: {
            description: 'Make this column take the full viewport height',
          },
        },
        {
          name: 'gradient',
          type: 'group',
          label: 'Gradient Overlay',
          admin: {
            description: 'Optional gradient overlay for this column',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Enable Gradient',
              defaultValue: false,
            },
            {
              name: 'type',
              type: 'select',
              label: 'Gradient Type',
              defaultValue: 'linear',
              options: [
                { label: 'Linear', value: 'linear' },
                { label: 'Radial', value: 'radial' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'direction',
              type: 'select',
              label: 'Gradient Direction',
              defaultValue: 'to-bottom',
              options: [
                { label: 'To Bottom', value: 'to-bottom' },
                { label: 'To Top', value: 'to-top' },
                { label: 'To Right', value: 'to-right' },
                { label: 'To Left', value: 'to-left' },
                { label: 'To Bottom Right', value: 'to-bottom-right' },
                { label: 'To Bottom Left', value: 'to-bottom-left' },
                { label: 'To Top Right', value: 'to-top-right' },
                { label: 'To Top Left', value: 'to-top-left' },
              ],
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.enabled === true && siblingData?.type === 'linear',
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Gradient Position',
              defaultValue: 'center',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top Left', value: 'top-left' },
                { label: 'Top Right', value: 'top-right' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
              ],
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.enabled === true && siblingData?.type === 'radial',
              },
            },
            {
              name: 'startColor',
              type: 'text',
              label: 'Start Color',
              defaultValue: '#000000',
              admin: {
                description: 'Hex color code (e.g., #000000)',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'endColor',
              type: 'text',
              label: 'End Color',
              defaultValue: '#ffffff',
              admin: {
                description: 'Hex color code (e.g., #ffffff)',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'opacity',
              type: 'number',
              label: 'Opacity',
              defaultValue: 0.7,
              min: 0,
              max: 1,
              admin: {
                description: 'Gradient opacity (0 = transparent, 1 = opaque)',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          fields: [
            {
              name: 'tenant',
              type: 'relationship',
              relationTo: 'tenants',
              label: 'Tenant',
              required: true,
              admin: {
                description:
                  'Select the tenant to link to. URL will be generated automatically based on environment.',
              },
            },
            {
              name: 'text',
              type: 'text',
              label: 'Link Text',
              required: true,
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'socialNetworks',
          type: 'group',
          label: 'Social Networks',
          admin: {
            description: 'Optional social network links for this column',
          },
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
              admin: {
                description: 'Full Facebook profile or page URL',
              },
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
              admin: {
                description: 'Full Instagram profile URL',
              },
            },
          ],
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

export default ThreeColumns
