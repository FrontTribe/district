import { CollectionConfig } from 'payload'

const restrictTenantLogin = async ({ req, user }: { req: any; user: any }) => {
  if (user.role === 'superadmin') {
    return
  }

  if (user.role === 'tenant-admin') {
    let requestSubdomain = ''

    if (req.tenant) {
      requestSubdomain = req.tenant.subdomain
    } else {
      const origin = req.headers.get('origin')
      if (origin) {
        const url = new URL(origin)
        const hostname = url.hostname
        requestSubdomain = hostname.split('.')[0]
      }
    }

    if (!requestSubdomain) {
      throw new Error('Could not identify the login domain. Access denied.')
    }

    if (!user.tenant) {
      throw new Error('You are not assigned to a tenant. Access denied.')
    }

    const userTenantDoc = await req.payload.findByID({
      collection: 'tenants',
      id: typeof user.tenant === 'string' ? user.tenant : user.tenant.id,
      depth: 0,
    })

    if (!userTenantDoc) {
      throw new Error('Your assigned tenant could not be found. Access denied.')
    }

    if (userTenantDoc.subdomain !== requestSubdomain) {
      throw new Error('Access Denied: You can only log in from your assigned domain.')
    }
  }
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Set auth to true
  // ✅ Corrected for your version: The hooks object is at the top level
  hooks: {
    afterLogin: [restrictTenantLogin],
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // ... your access controls remain the same
    read: ({ req: { user } }) => {
      if (!user) {
        return false
      }
      if (user && user.role === 'superadmin') {
        return true
      }
      return user
        ? {
            id: {
              equals: user.id,
            },
          }
        : false
    },
    create: ({ req: { user } }) => !!user && user.role === 'superadmin',
    update: ({ req: { user }, id }) => {
      if (!user) {
        return false
      }
      if (user.role === 'superadmin') {
        return true
      }
      return user.id === id
    },
    delete: ({ req: { user } }) => !!user && user.role === 'superadmin',
  },
  fields: [
    // ... your fields remain the same
    {
      name: 'role',
      type: 'select',
      options: ['superadmin', 'tenant-admin'],
      defaultValue: 'tenant-admin',
      required: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
    },
  ],
}

export default Users
