'use client'

import { useEffect } from 'react'

export function useMobileMenuLock(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis
    lenis?.stop?.()

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      lenis?.start?.()
    }
  }, [isOpen, onClose])
}
