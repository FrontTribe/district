import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

/**
 * Returns the public URL for a media document by ID.
 * Path uses _media-url so Payload's api/[...slug] does not catch it.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ url: null }, { status: 400 })
    }
    const payload = await getPayload({ config: payloadConfig })
    const doc = await payload.findByID({
      collection: 'media',
      id,
      depth: 0,
    })
    if (!doc) {
      return NextResponse.json({ url: null }, { status: 404 })
    }
    const url =
      (doc as { url?: string }).url ??
      (doc.filename &&
        process.env.S3_BUCKET &&
        process.env.S3_REGION &&
        `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${doc.filename}`)
    return NextResponse.json({ url: url ?? null })
  } catch (err) {
    console.error('[_media-url]', err)
    return NextResponse.json({ url: null }, { status: 500 })
  }
}
