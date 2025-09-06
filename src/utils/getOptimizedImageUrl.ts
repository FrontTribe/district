export type ImageAspect = 'auto' | 'square' | 'portrait34' | 'landscape43' | 'landscape169'

type MediaWithSizes = {
  url?: string
  sizes?: Record<string, { url?: string; width?: number; height?: number }>
}

type Options = {
  widthHint?: number
  aspect?: ImageAspect
  fallback?: 'original' | 'auto'
}

export function getOptimizedImageUrl(
  media: MediaWithSizes | string | undefined,
  opts: Options = {},
) {
  if (!media) return undefined
  const m = typeof media === 'string' ? { url: media } : media
  const { widthHint, aspect = 'auto', fallback = 'auto' } = opts

  if (!m?.sizes) return m?.url

  const byAspect: Record<ImageAspect, string[]> = {
    auto: ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
    square: ['square', 'md', 'sm', 'xs'],
    portrait34: ['portrait34', 'md', 'sm', 'xs'],
    landscape43: ['landscape43', 'lg', 'md', 'sm'],
    landscape169: ['landscape169', 'xl', 'lg', 'md'],
  }

  const candidates = byAspect[aspect].map((k) => m.sizes?.[k]?.url).filter(Boolean) as string[]
  if (candidates.length === 0) return fallback === 'original' ? m.url : m.url

  if (!widthHint) return candidates[0]

  const order = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
  const nearest = order
    .map((k) => m.sizes?.[k])
    .filter(Boolean)
    .sort(
      (a: any, b: any) =>
        Math.abs((a?.width || 0) - widthHint) - Math.abs((b?.width || 0) - widthHint),
    )[0]

  return nearest?.url || candidates[0]
}
