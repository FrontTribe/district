import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { resolvePayloadFileUrl } from '@/utils/resolvePayloadFileUrl'

export const runtime = 'nodejs'

function pdfResponse(body: ArrayBuffer | Uint8Array, extraHeaders?: Record<string, string>) {
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      ...extraHeaders,
    },
  })
}

/**
 * Jednostranični PDF (isti origin kao stranica).
 * GET /api/pdf-file/:id?page=N — **obavezno** `page` (1-based); vraća PDF s točno jednom stranicom (nema cijelog elaborata).
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
    if (pageParam == null || pageParam === '') {
      return NextResponse.json(
        { error: 'Missing required query: page (single-page export only)' },
        { status: 400 },
      )
    }
    const n = Number.parseInt(pageParam, 10)
    if (!Number.isFinite(n) || n < 1) {
      return NextResponse.json({ error: 'Invalid page' }, { status: 400 })
    }
    const pageOneBased = n

    let payload: Awaited<ReturnType<typeof getPayload>>
    try {
      payload = await getPayload({ config })
    } catch (e) {
      console.error('[pdf-file] getPayload failed', e)
      return NextResponse.json({ error: 'CMS unavailable', detail: String(e) }, { status: 503 })
    }

    const docId = /^\d+$/.test(String(id)) ? Number(id) : id

    let doc: unknown
    try {
      doc = await payload.findByID({
        collection: 'documents',
        id: docId,
        depth: 0,
        overrideAccess: true,
      })
    } catch (e) {
      console.error('[pdf-file] findByID', id, e)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

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

    const absoluteUrl = resolvePayloadFileUrl(url, new URL(req.url).origin)
    const forwardCookie = req.headers.get('cookie')
    let fileRes: Response
    try {
      fileRes = await fetch(absoluteUrl, {
        redirect: 'follow',
        ...(forwardCookie ? { headers: { cookie: forwardCookie } } : {}),
      })
    } catch (e) {
      console.error('[pdf-file] fetch failed', absoluteUrl, e)
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
    }
    if (!fileRes.ok) {
      console.error('[pdf-file] upstream not ok', absoluteUrl, fileRes.status)
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
    }

    const buf = await fileRes.arrayBuffer()

    try {
      const { PDFDocument } = await import('pdf-lib')
      const sourcePdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      const pageCount = sourcePdf.getPageCount()
      if (pageOneBased > pageCount) {
        return NextResponse.json({ error: 'Page out of range' }, { status: 400 })
      }
      const outPdf = await PDFDocument.create()
      const [copied] = await outPdf.copyPages(sourcePdf, [pageOneBased - 1])
      outPdf.addPage(copied)
      const singlePageBytes = await outPdf.save()
      return pdfResponse(singlePageBytes)
    } catch (e) {
      console.error('[pdf-file] single-page PDF build failed', e)
      return NextResponse.json(
        {
          error: 'pdf_single_page_failed',
          message:
            'Izdvajanje jedne stranice iz PDF-a nije uspjelo. Provjerite elaborat ili kontaktirajte administratora.',
        },
        { status: 422 },
      )
    }
  } catch (err) {
    console.error('[pdf-file]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: 'Server error',
        detail: process.env.NODE_ENV === 'production' ? undefined : message,
      },
      { status: 500 },
    )
  }
}
