import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    'district.test',
    'boutique.test',
    'concept-bar.test',
    'real-estate.test',
    'momento.test',
  ],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        port: '3000',
      },
      {
        hostname: 'boutique.test',
        port: '3000',
      },
      {
        hostname: 'momento.test',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'district.hr',
      },
      {
        protocol: 'https',
        hostname: '*.district.hr',
      },
    ],
  },
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
