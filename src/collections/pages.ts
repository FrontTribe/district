import { CollectionConfig } from 'payload'
import Hero from '@/blocks/Hero'
import Features from '@/blocks/Features'
import Section from '@/blocks/Section'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
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
      ({ req, data, operation }) => {
        if (operation === 'create' && (req.user as any)?.role === 'tenant-admin') {
          data.tenant = (req.user as any)?.tenant?.id || (req.user as any)?.tenant
          return data
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      access: {
        read: ({ req }) => {
          const user = req.user as any
          return user?.role === 'superadmin' || user?.role === 'tenant-admin'
        },
        create: ({ req }) => {
          const user = req.user as any
          return user?.role === 'superadmin' || user?.role === 'tenant-admin'
        },
        update: ({ req, data }) => {
          const user = req.user as any
          // This must allow tenant-admin to update if the tenant matches
          if (user?.role === 'superadmin') return true
          if (user?.role === 'tenant-admin') {
            // Only allow update if the tenant matches
            return data?.tenant === (user?.tenant?.id || user?.tenant)
          }
          return false
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, Features],
    },
  ],
}

export default Pages
