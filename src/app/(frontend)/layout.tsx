import type { Metadata } from 'next'
import { Marcellus } from 'next/font/google'
import './styles.scss'
import LenisProvider from '@/components/LenisProvider'

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
    <html lang="en" className={marcellus.variable}>
      <body className={marcellus.className}>
        <LenisProvider>
          <div className="min-h-screen flex flex-col">{children}</div>
        </LenisProvider>
      </body>
    </html>
  )
}
