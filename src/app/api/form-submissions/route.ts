import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/utils/getPayloadClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { form, submissionData } = body || {}
    if (!form) return NextResponse.json({ error: 'Missing form id' }, { status: 400 })

    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'form-submissions',
      data: {
        form,
        submissionData,
      },
    })

    return NextResponse.json({ ok: true, id: doc.id })
  } catch (e: any) {
    console.error('Form submit error', e)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
