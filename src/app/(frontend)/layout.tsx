import type { Metadata } from 'next'
import './styles.scss'
import LenisProvider from '@/components/LenisProvider'
import {
  marcellus,
  hubDisplay,
  hubAccent,
  hubMono,
  hubSans,
} from '@/app/(frontend)/fonts'
import { realEstateLandingSerifFont } from '@/components/real-estate-landing/landingFonts'

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
    realEstateLandingSerifFont.variable,
  ].join(' ')

  return (
    <html lang="hr" className={fontVariables}>
      <body className={marcellus.className}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
