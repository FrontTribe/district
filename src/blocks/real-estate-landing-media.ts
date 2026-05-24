/** Resolve URL from Payload upload / populated media */
export function resolveMediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    const url = (media as { url?: string | null }).url
    if (typeof url === 'string' && url.length > 0) return url
  }
  return undefined
}
