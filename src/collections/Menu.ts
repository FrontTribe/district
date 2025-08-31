import { CollectionConfig } from 'payload'

const Menu: CollectionConfig = {
  slug: 'menu',
  admin: {
    useAsTitle: 'title',
    group: 'Site Content',
    description: 'Manage navigation menus for tenants and main domain',
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
      name: 'identifier',
      type: 'select',
      label: 'Menu Identifier',
      required: true,
      defaultValue: 'main-menu',
      options: [
        {
          label: 'Main Menu (Frontend)',
          value: 'main-menu',
        },
        {
          label: 'Tenant Menu',
          value: 'tenant-menu',
        },
      ],
      admin: {
        description: 'Unique identifier for this menu type. Main Menu gets centered logo styling, Tenant Menu gets standard top-left styling.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal title for this menu (e.g., "Hotel ABC Menu", "Restaurant XYZ Menu")',
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
    {
      name: 'positioning',
      type: 'select',
      label: 'Menu Positioning',
      defaultValue: 'fixed',
      options: [
        {
          label: 'Fixed (Stays at top when scrolling)',
          value: 'fixed',
        },
        {
          label: 'Absolute (Scrolls with content)',
          value: 'absolute',
        },
        {
          label: 'Relative (Normal document flow)',
          value: 'relative',
        },
      ],
      admin: {
        description: 'Choose how the menu should be positioned on the page',
      },
    },
  ],
}

export default Menu
