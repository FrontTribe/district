'use client'

import React, { useEffect, useRef } from 'react'
import { momentoMonoFont, momentoSansFont, momentoSerifFont } from './landingFonts'
import { MomentoNav, type MomentoNavItem } from './MomentoNav'
import { useMomentoAnimations } from './useMomentoAnimations'
import './momento-landing.scss'

export type MomentoShellMenuProps = {
  logoText?: string
  menuItems: MomentoNavItem[]
  locale: string
}

export function MomentoLandingShell({
  children,
  footer,
  menu,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
  menu?: MomentoShellMenuProps
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  useMomentoAnimations(rootRef, true)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]')
      if (!a || !root.contains(a)) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const id = href.slice(1)
      const el = document.getElementById(id)
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o: object) => void } }).lenis
      if (el && lenis) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -30, duration: 1.4 })
      }
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [])

  const fontVars = `${momentoSerifFont.variable} ${momentoSansFont.variable} ${momentoMonoFont.variable}`

  return (
    <div
      ref={rootRef}
      className={`momento-landing ${fontVars}`}
      data-palette="emerald"
      style={{
        ['--serif' as string]: `var(${momentoSerifFont.variable}), "DM Serif Text", Georgia, serif`,
        ['--serif-display' as string]: `var(${momentoSerifFont.variable}), "DM Serif Text", Georgia, serif`,
        ['--sans' as string]: `var(${momentoSansFont.variable}), ui-sans-serif, sans-serif`,
        ['--mono' as string]: `var(${momentoMonoFont.variable}), ui-monospace, monospace`,
      }}
    >
      {menu ? (
        <MomentoNav
          logoText={menu.logoText}
          menuItems={menu.menuItems}
          locale={menu.locale}
        />
      ) : null}
      {children}
      {footer}
    </div>
  )
}
