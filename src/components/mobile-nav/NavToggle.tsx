'use client'

import React from 'react'

type NavToggleProps = {
  isOpen: boolean
  onToggle: () => void
  controlsId: string
  openLabel?: string
  closeLabel?: string
  className?: string
}

export function NavToggle({
  isOpen,
  onToggle,
  controlsId,
  openLabel = 'Open menu',
  closeLabel = 'Close menu',
  className,
}: NavToggleProps) {
  return (
    <button
      type="button"
      className={['nav-toggle', isOpen ? 'nav-toggle--open' : '', className].filter(Boolean).join(' ')}
      aria-label={isOpen ? closeLabel : openLabel}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      <span className="nav-toggle__line" />
      <span className="nav-toggle__line" />
    </button>
  )
}
