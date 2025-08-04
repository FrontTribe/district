// collections/tenants.ts
import { CollectionConfig } from 'payload'

const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'superadmin'
    },
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
