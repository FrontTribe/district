import { CollectionConfig } from 'payload'

const Footer: CollectionConfig = {
  slug: 'footer',
  admin: {
    useAsTitle: 'title',
    group: 'Site Content',
    description: 'Manage footer content for tenants and main domain',
  },
  access: {
    read: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
    update: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && (req.user as any)?.role === 'tenant-admin') {
          data.tenant = (req.user as any)?.tenant?.id || (req.user as any)?.tenant
          return data
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Internal title for this footer (e.g., "Hotel ABC Footer", "Restaurant XYZ Footer")',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      access: {
        create: ({ req }) =>
          (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
        update: ({ req }) => (req.user as any)?.role === 'superadmin',
      },
    },
    {
      name: 'leftContent',
      type: 'group',
      label: 'Left Content',
      fields: [
        {
          name: 'heading',
          type: 'textarea',
          label: 'Main Heading',
          required: true,
          localized: true,
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Subheading (optional)',
          localized: true,
        },
      ],
    },
    {
      name: 'rightContent',
      type: 'group',
      label: 'Right Content',
      fields: [
        {
          name: 'contact',
          type: 'group',
          label: 'Contact Information',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Contact Heading',
              required: true,
              defaultValue: 'Contact',
              localized: true,
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email Address',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram Handle',
              admin: {
                description: 'Enter without @ symbol (e.g., legendslounge)',
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          label: 'Address Information',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Address Heading',
              required: true,
              defaultValue: 'Address',
              localized: true,
            },
            {
              name: 'venue',
              type: 'text',
              label: 'Venue Name',
              required: true,
              localized: true,
            },
            {
              name: 'street',
              type: 'text',
              label: 'Street Address',
              required: true,
              localized: true,
            },
            {
              name: 'city',
              type: 'text',
              label: 'City and Postal Code',
              required: true,
              localized: true,
            },
            {
              name: 'country',
              type: 'text',
              label: 'Country',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'bottomContent',
      type: 'group',
      label: 'Bottom Content',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright Text',
          required: true,
          defaultValue: 'All Rights Reserved © 2025',
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Footer Links',
          localized: true,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Link Text',
              required: true,
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Link URL',
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
          name: 'madeBy',
          type: 'text',
          label: 'Made By Text',
          required: true,
          defaultValue: 'Designed with passion by De Jongens van Boven',
          localized: true,
        },
      ],
    },
  ],
}

export default Footer
