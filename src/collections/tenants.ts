import { CollectionConfig } from 'payload'

const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => (user as any).role !== 'superadmin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false

      if ((user as any).role === 'superadmin') {
        return true
      }

      const tenantId =
        typeof (user as any).tenant === 'object' && (user as any).tenant !== null
          ? (user as any).tenant.id
          : (user as any).tenant

      if (!tenantId) {
        return false
      }

      return {
        id: {
          equals: tenantId,
        },
      }
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
