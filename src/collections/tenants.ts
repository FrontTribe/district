// collections/tenants.ts
import { CollectionConfig } from 'payload'

const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => (user as any)?.role === 'superadmin',
    update: ({ req: { user } }) => (user as any)?.role === 'superadmin',
    delete: ({ req: { user } }) => (user as any)?.role === 'superadmin',
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
