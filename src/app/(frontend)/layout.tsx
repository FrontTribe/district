import type { Metadata } from 'next'
import { Marcellus, Fraunces, Instrument_Serif, JetBrains_Mono, Inter } from 'next/font/google'
import './styles.scss'
import LenisProvider from '@/components/LenisProvider'

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-marcellus',
  preload: true,
})

const hubDisplay = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-hub-display',
})

const hubAccent = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-hub-accent',
})

const hubMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-hub-mono',
})

const hubSans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-hub-sans',
})

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://district.hr'
const metadataBase = (() => {
  try {
    return new URL(siteUrl)
  } catch {
    return new URL('https://district.hr')
  }
})()

export const metadata: Metadata = {
  title: 'Disctrict',
  description: 'District is a group of brands.',
  metadataBase,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVariables = [
    marcellus.variable,
    hubDisplay.variable,
    hubAccent.variable,
    hubMono.variable,
    hubSans.variable,
  ].join(' ')

  return (
    <html lang="hr" className={fontVariables}>
      <body className={marcellus.className}>
        <LenisProvider>
          <div className="min-h-screen flex flex-col">{children}</div>
        </LenisProvider>
      </body>
    </html>
  )
}
