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
      url: ({ data, collectionConfig, locale }) => {
        const frontendURL = data.tenant?.url || 'http://localhost:3000'
        const pagePath =
          collectionConfig?.slug === 'pages'
            ? `/${locale.code}/${data.slug}`
            : `/${locale.code}/${data.slug}`

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
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Arabic',
        code: 'ar',
        rtl: true,
      },
      {
        label: 'French',
        code: 'fr',
      },
      {
        label: 'Spanish',
        code: 'es',
      },
    ],
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
