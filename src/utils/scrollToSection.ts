import type { MouseEvent as ReactMouseEvent } from 'react'

type LenisLike = {
  start?: () => void
  scrollTo: (
    target: Element | string | number,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void
}

export type ScrollToSectionOptions = {
  offset?: number
  duration?: number
  /** Defer until mobile menu scroll-lock cleanup runs */
  afterMenuClose?: boolean
}

function getLenis(): LenisLike | undefined {
  return (window as Window & { lenis?: LenisLike }).lenis
}

export function restorePageScroll() {
  document.body.style.overflow = ''
  getLenis()?.start?.()
}

export function parseHashScrollTarget(href: string): string | null {
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) return null
  const hash = href.slice(hashIndex + 1)
  return hash.length > 0 ? decodeURIComponent(hash) : null
}

export function scrollToSectionById(
  sectionId: string,
  options: ScrollToSectionOptions = {},
): boolean {
  const el = document.getElementById(sectionId)
  if (!el) return false

  const offset = options.offset ?? -30
  const duration = options.duration ?? 1.2

  const performScroll = () => {
    restorePageScroll()
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(el, { offset, duration })
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (options.afterMenuClose) {
    requestAnimationFrame(() => requestAnimationFrame(performScroll))
  } else {
    performScroll()
  }

  return true
}

export function scrollToHrefTarget(
  href: string,
  options: ScrollToSectionOptions = {},
): boolean {
  const sectionId = parseHashScrollTarget(href)
  if (!sectionId) return false
  return scrollToSectionById(sectionId, options)
}

export function handleInPageNavClick(
  e: ReactMouseEvent,
  {
    scrollTarget,
    href,
    external,
    afterMenuClose = false,
    offset,
    duration,
    onAfterNavigate,
  }: {
    scrollTarget?: string | null
    href?: string
    external?: boolean
    afterMenuClose?: boolean
    offset?: number
    duration?: number
    onAfterNavigate?: () => void
  },
): boolean {
  if (external) {
    onAfterNavigate?.()
    return false
  }

  const targetId = scrollTarget || (href ? parseHashScrollTarget(href) : null)
  if (!targetId) {
    onAfterNavigate?.()
    return false
  }

  e.preventDefault()
  onAfterNavigate?.()
  return scrollToSectionById(targetId, { afterMenuClose, offset, duration })
}
