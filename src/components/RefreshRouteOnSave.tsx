'use client'

import { isDocumentEvent, ready } from '@payloadcms/live-preview'
import { useRouter } from 'next/navigation.js'
import React, { useCallback, useEffect, useRef } from 'react'
import { resolvePayloadServerURL } from '@/utils/payloadServerUrl'

/**
 * Refreshes server components when a document is saved in Payload admin.
 * Does NOT refresh on mount — that would overwrite useLivePreview unsaved edits.
 */
export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  const serverURL = resolvePayloadServerURL()
  const hasSentReadyMessage = useRef(false)

  const onMessage = useCallback(
    (event: MessageEvent) => {
      if (isDocumentEvent(event, serverURL)) {
        router.refresh()
      }
    },
    [router, serverURL],
  )

  useEffect(() => {
    window.addEventListener('message', onMessage)

    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true
      ready({ serverURL })
    }

    return () => window.removeEventListener('message', onMessage)
  }, [onMessage, serverURL])

  return null
}
