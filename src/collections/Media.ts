import { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', hr: 'Medij' },
    plural: { en: 'Media', hr: 'Mediji' },
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    group: { en: 'Media & Assets', hr: 'Mediji i datoteke' },
    description: {
      en: 'Manage images, documents and other media files',
      hr: 'Upravljanje slikama, dokumentima i ostalim medijskim datotekama',
    },
  },
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
    afterChange: [],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',

      required: false,
      access: {
        read: () => true,
        create: ({ req }) =>
          (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
        update: ({ req }) => (req.user as any)?.role === 'superadmin',
      },

      // admin: {
      //   condition: ({ user }) => user?.role === 'superadmin',
      // },
    },
  ],
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*'],
    // Use the generated "xs" rendition served via Payload's own URL handler
    // (which proxies to whichever storage adapter is configured).
    adminThumbnail: 'xs',
    focalPoint: true,
    resizeOptions: {
      withoutEnlargement: true,
      fit: 'cover',
      position: 'center',
    },
    // Universal, reusable renditions (width-based + common aspect crops)
    imageSizes: [
      // Width-only, preserve aspect ratio
      { name: 'xs', width: 480 },
      { name: 'sm', width: 768 },
      { name: 'md', width: 1024 },
      { name: 'lg', width: 1440 },
      { name: 'xl', width: 1920 },
      { name: 'xxl', width: 2560 },

      // Common crops for cards/avatars/hero banners
      { name: 'square', width: 1200, height: 1200, position: 'center' },
      { name: 'portrait34', width: 1200, height: 1600, position: 'center' }, // 3:4
      { name: 'landscape43', width: 1600, height: 1200, position: 'center' }, // 4:3
      { name: 'landscape169', width: 1920, height: 1080, position: 'center' }, // 16:9
    ],
  },
}

export default Media
