import { CollectionConfig } from 'payload'

const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => {
      if (!user || typeof user !== 'object') return true
      return (user as { role?: string }).role !== 'superadmin'
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'superadmin',
    update: ({ req: { user } }) => user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'subdomain',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}

export default Tenants
