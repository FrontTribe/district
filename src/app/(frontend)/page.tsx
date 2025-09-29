import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const supportedLocales = ['hr', 'en', 'de']

  const acceptLang = (await headers()).get('accept-language') || ''
  const userLocale = acceptLang.split(',')[0].split('-')[0].toLowerCase()
  const locale = supportedLocales.includes(userLocale) ? userLocale : 'hr'

  redirect(`/${locale}`)
}
