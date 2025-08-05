import { GlobalConfig } from 'payload'

const Menu: GlobalConfig = {
  slug: 'menu',
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
      name: 'menuItems',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: {
            description: 'URL or path for this menu item (required even if using scroll target)',
          },
        },
        {
          name: 'scrollTarget',
          type: 'text',
          label: 'Scroll Target (Section ID)',
          admin: {
            description:
              'Optional section ID to scroll to (e.g., "hero", "features"). Leave empty to use the link above.',
          },
        },
        {
          name: 'external',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'children',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              admin: {
                description:
                  'URL or path for this menu item (required even if using scroll target)',
              },
            },
            {
              name: 'scrollTarget',
              type: 'text',
              label: 'Scroll Target (Section ID)',
              admin: {
                description:
                  'Optional section ID to scroll to (e.g., "hero", "features"). Leave empty to use the link above.',
              },
            },
            {
              name: 'external',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoText',
      type: 'text',
      required: false,
    },
  ],
}

export default Menu
