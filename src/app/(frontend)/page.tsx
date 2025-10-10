import { redirect } from 'next/navigation'

export default async function RootPage() {
  // Always redirect to Croatian (hr) as the default locale
  redirect('/hr')
}
