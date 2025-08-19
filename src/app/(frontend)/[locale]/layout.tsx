import MainPageLanguageSwitcher from '@/components/mainPageLanguageSwitcher'
import '../styles.css'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  return (
    <html>
      <body>
        <MainPageLanguageSwitcher locale={locale} />
        {children}
      </body>
    </html>
  )
}
