import { CollectionConfig } from 'payload'
import Hero from '@/blocks/Hero'
import Features from '@/blocks/Features'
import Section from '@/blocks/Section'
import Text from '@/blocks/Text'
import { ThreeColumns } from '@/blocks/ThreeColumns'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Site Content',
    description: 'Manage pages for tenants and main domain',
  },
  access: {
    read: ({ req }) => {
      console.log(req.user)

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
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      access: {
        read: () => true,
        create: ({ req }) => {
          const user = req.user as any
          return user?.role === 'superadmin'
        },
        update: ({ req }) => {
          const user = req.user as any
          return user?.role === 'superadmin'
        },
      },
      // admin: {
      //   condition: ({ user }) => user?.role === 'superadmin',
      // },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, Features, Text, ThreeColumns],
      localized: true,
    },
  ],
}

export default Pages
