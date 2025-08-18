import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { seoPlugin } from '@payloadcms/plugin-seo'

import Tenants from './collections/tenants'
import Users from './collections/Users'
import Pages from './collections/pages'
import Media from './collections/Media'
import Menu from './globals/menu'
import Footer from './globals/footer'
import { localeLang } from './utils/locale'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },

    livePreview: {
      collections: ['pages'],
      url: ({ data, req, locale }) => {
        const { user } = req
        console.log('data from live url:', data)

        let tenantSubdomain = null

        // Case 1 (Best): The tenant data is fully populated on the page document.
        if (typeof data.tenant === 'object' && data.tenant !== null && data.tenant.subdomain) {
          tenantSubdomain = data.tenant.subdomain
        }
        // Case 2 (Fallback for Tenant Admins): The tenant data is not populated on the page,
        // so we use the tenant information from the logged-in user's profile.
        else if (
          user &&
          user.role === 'tenant-admin' &&
          typeof user.tenant === 'object' &&
          user.tenant !== null
        ) {
          tenantSubdomain = user.tenant.subdomain
        }

        // Construct the base URL for the frontend application.
        // It defaults to localhost for superadmins if the tenant isn't populated.
        const frontendURL = tenantSubdomain
          ? `http://${tenantSubdomain}.test:3000` // Assumes local dev format like hotels.test:3000
          : 'http://localhost:3000'

        // Construct the path to the specific page, including the locale.
        const pagePath = locale ? `/${locale.code}/${data.slug}` : `/${data.slug}`

        // Build the full draft URL for Next.js preview mode.
        const draftURL = new URL(`${frontendURL}/api/draft`)
        draftURL.searchParams.set('url', pagePath)
        draftURL.searchParams.set('secret', process.env.DRAFT_SECRET || '')
        if (locale) {
          draftURL.searchParams.set('locale', locale.code)
        }

        return draftURL.toString()
      },
      globals: ['menu', 'footer'],
    },
  },
  collections: [Users, Media, Tenants, Pages],
  globals: [Menu, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  cors: [
    'http://restaurants.test:3000',
    'http://localhost:3000', // Good to keep this for other tools
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
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
      generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
})
