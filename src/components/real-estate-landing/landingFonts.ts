import { DM_Serif_Text } from 'next/font/google'

/** Serif za RE landing — DM Serif Text (isti obitelj kao DM Serif Display; podržava kurziv za `.it`). */
export const realEstateLandingSerifFont = DM_Serif_Text({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-re-landing-serif',
  display: 'swap',
})
