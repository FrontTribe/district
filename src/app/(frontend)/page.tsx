import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const supportedLocales = ['en', 'hr', 'de']

  const acceptLang = (await headers()).get('accept-language') || ''
  const userLocale = acceptLang.split(',')[0].split('-')[0].toLowerCase()
  console.log(`Locale determined: ${userLocale}`)
  const locale = supportedLocales.includes(userLocale) ? userLocale : 'hr'

  redirect(`/${locale}`)
}
