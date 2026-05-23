import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

type SupportedLocale = 'hr' | 'en' | 'de'

function normalizeLocale(raw: string | null): SupportedLocale {
  if (raw === 'en' || raw === 'de') return raw
  return 'hr'
}

/** Full Form Builder document for RE landing (public REST `/api/forms` strips block field data). */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim()
  if (!id) {
    return NextResponse.json({ error: 'Missing form id' }, { status: 400 })
  }

  const locale = normalizeLocale(req.nextUrl.searchParams.get('locale'))

  try {
    const payload = await getPayload({ config })
    const form = await payload.findByID({
      collection: 'forms',
      id,
      locale,
      depth: 0,
      overrideAccess: true,
    })

    return NextResponse.json(form)
  } catch {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }
}
