import { Marcellus, Fraunces, Instrument_Serif, JetBrains_Mono, Inter } from 'next/font/google'

export const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-marcellus',
  preload: true,
})

/** Fraunces — hub landing (glavna domena). */
export const hubDisplay = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-hub-display',
})

export const hubAccent = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-hub-accent',
})

export const hubMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-hub-mono',
})

export const hubSans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-hub-sans',
})

/** Fraunces — boutique tenant. Koristi `var(--font-boutique-heading)` u CSS-u (varijabla na `<html>`). */
export const boutiqueHeading = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-boutique-heading',
})
