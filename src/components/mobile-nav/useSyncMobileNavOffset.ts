'use client'

import { useLayoutEffect } from 'react'

const HEADER_SELECTORS = [
  '.header--boutique-tenant',
  '.header--hub-landing',
  '.header--tenant',
  '.header',
] as const

function findMobileNavHeader(): HTMLElement | null {
  for (const selector of HEADER_SELECTORS) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el) return el
  }
  return null
}

export function useSyncMobileNavOffset(isOpen: boolean, enabled = true) {
  useLayoutEffect(() => {
    if (!isOpen || !enabled) return

    const header = findMobileNavHeader()
    if (!header) return

    const sync = () => {
      document.documentElement.style.setProperty(
        '--tenant-nav-mobile-height',
        `${header.offsetHeight}px`,
      )
    }

    sync()

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null
    resizeObserver?.observe(header)
    window.addEventListener('resize', sync)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', sync)
      document.documentElement.style.removeProperty('--tenant-nav-mobile-height')
    }
  }, [isOpen, enabled])
}
