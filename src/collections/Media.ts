import { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: ({ req }) => {
      if (!req.user) {
        return true
      }
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
    create: ({ req }) =>
      (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
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
    delete: ({ req }) => {
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
      ({ req, data }) => {
        if (req.user && (req.user as any)?.role === 'tenant-admin') {
          data.tenant = (req.user as any)?.tenant?.id || (req.user as any)?.tenant
          return data
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
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

      admin: {
        condition: ({ user }) => user?.role === 'superadmin',
      },
    },
  ],
  upload: {
    staticDir: 'media',
  },
}

export default Media
