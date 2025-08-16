import MainPageLanguageSwitcher from '@/components/mainPageLanguageSwitcher'
import '../styles.css'

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={params.locale}>
      <body>
        <MainPageLanguageSwitcher locale={params.locale} />
        {children}
      </body>
    </html>
  )
}
