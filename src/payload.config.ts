import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { localeLang } from './utils/locale'

// storage
import { s3Storage } from '@payloadcms/storage-s3'

// collections
import Tenants from './collections/tenants'
import Users from './collections/Users'
import Pages from './collections/pages'
import Media from './collections/Media'
import Menu from './collections/Menu'
import Footer from './collections/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },

    livePreview: {
      collections: ['pages', 'menu', 'footer'],
      url: ({ data, req, locale }) => {
        const { user } = req
        let tenantSubdomain = null

        if (typeof data.tenant === 'object' && data.tenant?.subdomain) {
          tenantSubdomain = data.tenant.subdomain
        } else if (
          user &&
          user.role === 'tenant-admin' &&
          typeof user.tenant === 'object' &&
          user.tenant?.subdomain
        ) {
          tenantSubdomain = user.tenant.subdomain
        }

        const frontendURL = tenantSubdomain
          ? `http://${tenantSubdomain}.test:3000`
          : 'http://localhost:3000'

        let pagePath = '/'
        if (data.slug !== '/') {
          pagePath = locale ? `/${locale.code}/${data.slug}` : `/${data.slug}`
        } else {
          pagePath = locale ? `/${locale.code}` : '/'
        }

        const draftURL = new URL(`${frontendURL}/api/draft`)
        draftURL.searchParams.set('url', pagePath)
        draftURL.searchParams.set('secret', process.env.DRAFT_SECRET || '')

        if (locale) {
          draftURL.searchParams.set('locale', locale.code)
        }

        return draftURL.toString()
      },
    },
  },
  collections: [Users, Media, Tenants, Pages, Menu, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    'http://restaurants.test:3000',
    'http://localhost:3000', // Good to keep this for other tools
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  localization: {
    locales: localeLang,
    defaultLocale: 'en',
    fallback: true,
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `District — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
    formBuilderPlugin({
      formOverrides: {
        admin: {
          group: 'Forms',
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms',
        },
      },
    }),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ],
})
