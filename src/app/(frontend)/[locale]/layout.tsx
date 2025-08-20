import '../styles.scss'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
