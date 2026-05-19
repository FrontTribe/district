import type { Metadata } from 'next'
import './styles.scss'
import LenisProvider from '@/components/LenisProvider'
import {
  marcellus,
  hubDisplay,
  hubAccent,
  hubMono,
  hubSans,
  boutiqueHeading,
} from '@/app/(frontend)/fonts'

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
    boutiqueHeading.variable,
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
