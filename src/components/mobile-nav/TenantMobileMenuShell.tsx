'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { useMobileMenuLock } from './useMobileMenuLock'
import { useSyncMobileNavOffset } from './useSyncMobileNavOffset'

export type TenantMobileMenuVariant = 'boutique' | 'default' | 'hub'

type TenantMobileMenuShellProps = {
  isOpen: boolean
  onClose: () => void
  variant: TenantMobileMenuVariant
  menuId: string
  ariaLabel: string
  closeLabel?: string
  /** Sync drawer top offset to measured header height (boutique / district header menus). */
  syncNavOffset?: boolean
  children: React.ReactNode
}

export function TenantMobileMenuShell({
  isOpen,
  onClose,
  variant,
  menuId,
  ariaLabel,
  closeLabel = 'Close menu',
  syncNavOffset = false,
  children,
}: TenantMobileMenuShellProps) {
  useMobileMenuLock(isOpen, onClose)
  useSyncMobileNavOffset(isOpen, syncNavOffset)

  if (!isOpen) return null

  return createPortal(
    <div
      className={`tenant-mobile-menu tenant-mobile-menu--${variant} is-open`}
      id={menuId}
      role="presentation"
    >
      <button
        type="button"
        className="tenant-mobile-menu__backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div
        className="tenant-mobile-menu__panel"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
