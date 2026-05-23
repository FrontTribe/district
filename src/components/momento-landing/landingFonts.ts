import { JetBrains_Mono, Inter } from 'next/font/google'
import { realEstateLandingSerifFont } from '@/components/real-estate-landing/landingFonts'

/** Isti serif kao RE landing (DM Serif Text). */
export const momentoSerifFont = realEstateLandingSerifFont

export const momentoMonoFont = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-momento-mono',
  display: 'swap',
})

export const momentoSansFont = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-momento-sans',
  display: 'swap',
})
