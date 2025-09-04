import type { Metadata } from 'next'
import { Space_Grotesk, Libre_Baskerville, Marcellus } from 'next/font/google'
import './styles.scss'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
  preload: true,
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-libre-baskerville',
  preload: true,
})

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-marcellus',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Disctrict',
  description: 'District is a group of brands.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${libreBaskerville.variable} ${marcellus.variable}`}
    >
      <body className={spaceGrotesk.className}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
