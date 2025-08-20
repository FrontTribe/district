import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './styles.scss'

const mozillaHeadline = localFont({
  src: [
    {
      path: '../../fonts/MozzilaHeadline/MozillaHeadline-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/MozzilaHeadline/MozillaHeadline-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/MozzilaHeadline/MozillaHeadline-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/MozzilaHeadline/MozillaHeadline-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-headline',
  display: 'swap',
})

const mozillaText = localFont({
  src: [
    {
      path: '../../fonts/MozzilaText/MozillaText-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/MozzilaText/MozillaText-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/MozzilaText/MozillaText-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/MozzilaText/MozillaText-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Payload CMS',
  description: 'A modern CMS built with Payload and Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${mozillaHeadline.variable} ${mozillaText.variable}`}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
