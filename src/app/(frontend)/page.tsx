import { redirect } from 'next/navigation'

// added test comment for deployment test

export default async function RootPage() {
  // Always redirect to Croatian (hr) as the default locale
  redirect('/hr')
}
