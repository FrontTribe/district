import { CollectionConfig } from 'payload'

const restrictTenantLogin = async ({ req, user }: { req: any; user: any }) => {
  if (user.role === 'superadmin') {
    return
  }

  if (user.role === 'tenant-admin') {
    let requestSubdomain = ''

    const origin = req.headers.get('origin')
    if (origin) {
      const url = new URL(origin)
      const hostname = url.hostname
      requestSubdomain = hostname.split('.')[0]
    }

    if (!requestSubdomain) {
      throw new Error('Access Denied: Could not identify the login domain.')
    }

    if (!user.tenant) {
      throw new Error('Access Denied: You are not assigned to a tenant.')
    }

    const userTenantDoc = await req.payload.findByID({
      collection: 'tenants',
      id: typeof user.tenant === 'string' ? user.tenant : user.tenant.id,
      depth: 0,
    })

    if (!userTenantDoc) {
      throw new Error('Access Denied: Your assigned tenant could not be found.')
    }

    if (userTenantDoc.subdomain !== requestSubdomain) {
      throw new Error('Access Denied: You can only log in from your assigned domain.')
    }
  }
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: false,
    },
  },
  hooks: {
    afterLogin: [restrictTenantLogin],
  },
  admin: {
    useAsTitle: 'email',
    group: 'System Management',
    description: 'Manage user accounts and permissions',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'superadmin',
    create: ({ req: { user } }) => user?.role === 'superadmin',
    update: ({ req: { user } }) => user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
  fields: [
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
