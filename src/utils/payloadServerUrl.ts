/** Payload API / admin origin (for live-preview postMessage matching). */
export function getPayloadServerURL(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_PAYLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_SERVER_URL?.trim()

  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

/**
 * In the browser, postMessage origin must match the open admin tab (not env drift http/https).
 */
export function resolvePayloadServerURL(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return getPayloadServerURL()
}
