/**
 * Payload upload polja često vraćaju relativni `url` (npr. `/api/documents/file/…`).
 * Node `fetch()` traži apsolutni URL — spoji s originom aplikacije.
 */
export function resolvePayloadFileUrl(fileUrl: string, requestOriginOrBase: string): string {
  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl
  }
  const pathname = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`
  const base = (
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') ||
    (requestOriginOrBase.startsWith('http')
      ? new URL(requestOriginOrBase).origin
      : requestOriginOrBase.replace(/\/$/, ''))
  ).replace(/\/$/, '')
  return `${base}${pathname}`
}
