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

          if (user?.role === 'superadmin') return true

          if (user?.role === 'tenant-admin') {
            console.log('🔒 tenant-admin update check')

            const tenantId = user?.tenant?.id || user?.tenant
            const dataTenant = data?.tenant

            // Extract tenant ID safely from string or object
            const dataTenantId = typeof dataTenant === 'string' ? dataTenant : dataTenant?.id

            const allowed = dataTenantId === tenantId
            console.log(`✅ Allowed to update: ${allowed}`)

            return allowed
          }

          return false
        },
      },
      // admin: {
      //   condition: ({ user }) => user?.role === 'superadmin',
      // },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, Features],
    },
  ],
}

export default Pages
