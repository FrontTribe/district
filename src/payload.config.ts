import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { hr } from '@payloadcms/translations/languages/hr'
import { en } from '@payloadcms/translations/languages/en'
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
import Documents from './collections/documents'
import Buildings from './collections/buildings'
import { loadRentlioOptions } from './utils/rentlio'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProductionRuntime = process.env.NODE_ENV === 'production'
const requestedSchemaPush = process.env.PAYLOAD_DB_PUSH === 'true'
const runMigrationsOnBoot = process.env.PAYLOAD_RUN_MIGRATIONS_ON_BOOT === 'true'
const s3Endpoint = process.env.S3_ENDPOINT

if (isProductionRuntime && requestedSchemaPush) {
  throw new Error(
    'Refusing to start: PAYLOAD_DB_PUSH=true is not allowed in production. Run migrations explicitly and keep PAYLOAD_DB_PUSH=false.',
  )
}

const allowSchemaPush = requestedSchemaPush && !isProductionRuntime

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
          ? `https://${tenantSubdomain}.test:3000`
          : 'https://localhost:3000'

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
  collections: [Users, Media, Documents, Tenants, Pages, Menu, Footer, Buildings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // Allow all origins - nginx handles security
  cors: '*',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Never push DB schema unless explicitly enabled in a non-production runtime.
    push: allowSchemaPush,
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Keep runtime boot non-interactive; only run migrations on boot if explicitly requested.
    prodMigrations: runMigrationsOnBoot ? migrations : undefined,
  }),
  localization: {
    locales: localeLang,
    defaultLocale: 'hr',
    fallback: true,
  },
  i18n: {
    supportedLanguages: { hr, en },
    fallbackLanguage: 'hr',
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `District — ${doc.title?.value || doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt || `${doc.title?.value || doc.title}`,
    }),
    formBuilderPlugin({
      formOverrides: {
        admin: {
          group: { en: 'Forms', hr: 'Obrasci' },
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: { en: 'Forms', hr: 'Obrasci' },
        },
      },
    }),
    s3Storage({
      collections: {
        media: true,
        documents: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        ...(s3Endpoint ? { endpoint: s3Endpoint, forcePathStyle: true } : {}),
      },
    }),
  ],
  onInit: async (payload) => {
    if ((payload as any).express) {
      ;(payload as any).express.get('/rentlio/options', async (req: any, res: any) => {
        try {
          const options = await loadRentlioOptions()
          res.json(options)
        } catch (error) {
          console.error('[Rentlio] Failed to serve options via Payload route:', error)
          res.json({ propertyOptions: [], unitTypeOptions: [], unitTypesByProperty: {} })
        }
      })
    }
  },
})
