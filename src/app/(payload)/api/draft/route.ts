import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const redirectUrl = searchParams.get('url')

  if (secret !== process.env.DRAFT_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  if (!redirectUrl) {
    return new Response('Missing redirect URL', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()
  return redirect(redirectUrl)
}
