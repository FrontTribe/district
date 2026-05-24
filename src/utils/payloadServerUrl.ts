/** Payload API / admin origin (for live-preview postMessage matching). */
export function getPayloadServerURL(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_PAYLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_SERVER_URL?.trim()

  if (fromEnv) {
    return normalizeDevServerUrl(fromEnv)
  }

  return 'http://localhost:3000'
}

function normalizeDevServerUrl(url: string): string {
  const trimmed = url.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'development' && process.env.LIVE_PREVIEW_HTTPS !== 'true') {
    return trimmed.replace(/^https:\/\//i, 'http://')
  }
  return trimmed
}

/**
 * Origin used for Payload live-preview postMessage.
 * Must match the admin tab origin exactly.
 */
export function resolvePayloadServerURL(): string {
  if (typeof window !== 'undefined') {
    return normalizeDevServerUrl(window.location.origin)
  }
  return getPayloadServerURL()
}
