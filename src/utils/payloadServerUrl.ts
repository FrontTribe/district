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
