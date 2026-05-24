import { localeLang } from '@/utils/locale'
import { notFound } from 'next/navigation'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const supported = localeLang.some((lang) => lang.code === locale)
  if (!supported) {
    notFound()
  }
  return (
    <>
      <RefreshRouteOnSave />
      {children}
    </>
  )
}
