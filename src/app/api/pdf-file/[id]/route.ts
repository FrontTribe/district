import { PDFDocument } from 'pdf-lib'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

/**
 * Payload may store `url` as a site-relative path (e.g. `/api/documents/file/x.pdf`).
 * Node `fetch()` requires an absolute URL — resolve against this server.
 */
function resolvePayloadFileUrl(fileUrl: string, req: Request): string {
  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl
  }
  const path = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`
  const base =
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || new URL(req.url).origin
  return `${base}${path}`
}

/**
 * Same-origin PDF bytes (avoids CORS when file is on S3).
 * GET /api/pdf-file/:id — full document
 * GET /api/pdf-file/:id?page=N — **single-page** PDF (1-based N), for iframe without scrolling whole file
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const pageParam = new URL(req.url).searchParams.get('page')
    let pageOneBased: number | null = null
    if (pageParam != null && pageParam !== '') {
      const n = Number.parseInt(pageParam, 10)
      if (!Number.isFinite(n) || n < 1) {
        return NextResponse.json({ error: 'Invalid page' }, { status: 400 })
      }
      pageOneBased = n
    }

    const payload = await getPayload({ config: payloadConfig })
    const doc = await (payload as { findByID: (args: { collection: string; id: string; depth: number }) => Promise<unknown> }).findByID({
      collection: 'documents',
      id,
      depth: 0,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const url =
      (doc as { url?: string | null }).url ??
      ((doc as { filename?: string }).filename &&
      process.env.S3_BUCKET &&
      process.env.S3_REGION
        ? `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${(doc as { filename: string }).filename}`
        : null)

    if (!url) {
      return NextResponse.json({ error: 'No file URL' }, { status: 404 })
    }

    const absoluteUrl = resolvePayloadFileUrl(url, req)
    const fileRes = await fetch(absoluteUrl)
    if (!fileRes.ok) {
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
    }

    const buf = await fileRes.arrayBuffer()

    if (pageOneBased == null) {
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      })
    }

    let sourcePdf: PDFDocument
    try {
      sourcePdf = await PDFDocument.load(buf, { ignoreEncryption: false })
    } catch (e) {
      console.error('[pdf-file] PDFDocument.load failed', e)
      return NextResponse.json(
        { error: 'Could not read PDF (unsupported or encrypted)' },
        { status: 422 },
      )
    }

    const pageCount = sourcePdf.getPageCount()
    if (pageOneBased > pageCount) {
      return NextResponse.json({ error: 'Page out of range' }, { status: 400 })
    }

    const outPdf = await PDFDocument.create()
    const [copied] = await outPdf.copyPages(sourcePdf, [pageOneBased - 1])
    outPdf.addPage(copied)
    const singlePageBytes = await outPdf.save()

    return new NextResponse(singlePageBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (err) {
    console.error('[pdf-file]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
