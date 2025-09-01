import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './styles.scss'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Payload CMS',
  description: 'A modern CMS built with Payload and Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className={spaceGrotesk.className}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
