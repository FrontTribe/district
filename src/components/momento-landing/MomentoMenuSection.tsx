'use client'

import React, { useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MomentoMenuBar } from './MomentoMenuBar'
import { MomentoSplit } from './shared/MomentoSplit'
import { isOffersCategory, splitMenuHeading } from './utils'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'

type MenuItem = {
  itemName: string
  itemDescription?: string | null
  itemPrice?: string | null
  isPopular?: boolean | null
}

type MenuCategory = {
  categoryName: string
  categoryDescription?: string | null
  menuItems?: MenuItem[] | null
}

type Props = {
  title: string
  subtitle?: string | null
  menuCategories?: MenuCategory[] | null
  sectionId?: string
  locale?: string
}

function refreshScrollLayout() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    const lenis = (window as unknown as { lenis?: { resize?: () => void } }).lenis
    lenis?.resize?.()
  })
}

function menuFilterScrollOffset(sectionId: string): number {
  const nav = document.querySelector('.momento-landing .nav')
  const menuBar = document.querySelector(`#${sectionId} .menu-bar-wrap`)
  const navH = nav?.getBoundingClientRect().height ?? 96
  const barH = menuBar?.getBoundingClientRect().height ?? 64
  return -(navH + barH + 20)
}

function scrollMenuFilterTarget(sectionId: string, target: Element) {
  const offset = menuFilterScrollOffset(sectionId)
  const lenis = (
    window as unknown as {
      lenis?: { scrollTo: (t: Element, opts: { offset?: number; duration?: number }) => void }
    }
  ).lenis
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 0.55 })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function MomentoMenuSection({
  title,
  subtitle,
  menuCategories,
  sectionId = 'menu',
  locale = 'hr',
}: Props) {
  const ui = getMomentoUiCopy(locale)
  const categories = menuCategories ?? []
  const menuHeading = title?.trim()
    ? splitMenuHeading(title)
    : { lead: ui.menu.titleFallback, accent: ui.menu.menuEmphasis }
  const offersIndex = categories.findIndex((c) => isOffersCategory(c.categoryName))
  const offersCategory = offersIndex >= 0 ? categories[offersIndex] : null
  const menuCats = categories.filter((_, i) => i !== offersIndex)

  const [active, setActive] = useState('all')
  const isFiltered = active !== 'all'

  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section) return

    const rows = section.querySelectorAll(
      '.menu-section:not(.menu-section--hidden) .menu-item, .menu-section:not(.menu-section--hidden) .m-cat-head',
    )

    if (rows.length) {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.015, overwrite: true },
      )
    }

    const frame = requestAnimationFrame(() => {
      refreshScrollLayout()

      if (!isFiltered) return

      requestAnimationFrame(() => {
        const menuBar = section.querySelector('.menu-bar-wrap')
        const categoryHead = section.querySelector(
          '.menu-section:not(.menu-section--hidden) .m-cat-head',
        )
        const scrollTarget = menuBar ?? categoryHead
        if (scrollTarget) scrollMenuFilterTarget(sectionId, scrollTarget)
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [active, sectionId, isFiltered])

  return (
    <>
      {offersCategory ? (
        <section className="offers-wrap">
          <div className="shell">
            <div className="section-head">
              <div className="num reveal">{ui.offers.sectionLabel}</div>
              <h2>
                <MomentoSplit>{ui.offers.headingLine1}</MomentoSplit>
                <br />
                <MomentoSplit>
                  <em>{ui.offers.headingLine2}</em>
                </MomentoSplit>
              </h2>
            </div>
            <div className="offers-grid">
              {(offersCategory.menuItems ?? []).map((item, i) => (
                <div
                  key={`${item.itemName}-${i}`}
                  className={`offer-card ${item.isPopular ? 'featured' : ''}`}
                >
                  <div className="ix">— {String(i + 1).padStart(2, '0')}</div>
                  <div className="name">{item.itemName}</div>
                  <div className="price-row">
                    <span className="price">{item.itemPrice}</span>
                    {item.itemDescription ? <span className="pop">{item.itemDescription}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`section${isFiltered ? ' section--menu-filtered' : ''}`} id={sectionId}>
        <div className="shell">
          <div className="section-head">
            <div className="num reveal">{ui.menu.sectionLabel}</div>
            <h2>
              <MomentoSplit>{menuHeading.lead}</MomentoSplit>
              {menuHeading.accent ? (
                <>
                  {' '}
                  <MomentoSplit>
                    <em>{menuHeading.accent}</em>
                  </MomentoSplit>
                </>
              ) : null}
            </h2>
          </div>
          {subtitle ? (
            <p className="reveal" style={{ margin: '-40px 0 48px', color: 'var(--ink-soft)' }}>
              {subtitle}
            </p>
          ) : null}

          <MomentoMenuBar active={active} onSelect={setActive} categories={menuCats} locale={locale} />

          <div className="menu-editorial">
            {menuCats.map((cat, ci) => {
              const hidden = isFiltered && active !== cat.categoryName
              return (
                <div
                  className={`menu-section${hidden ? ' menu-section--hidden' : ''}`}
                  key={cat.categoryName}
                  aria-hidden={hidden}
                >
                  <div className="m-cat-head">
                    <span className="ix">— {String(ci + 1).padStart(2, '0')}</span>
                    <h3>{cat.categoryName}</h3>
                    <span className="count">{ui.menu.itemsCount(cat.menuItems?.length ?? 0)}</span>
                  </div>
                  <div className="menu-grid">
                    {(cat.menuItems ?? []).map((it, i) => (
                      <div className="menu-item" key={`${it.itemName}-${i}`}>
                        <div className="m-name">{it.itemName}</div>
                        <div className="leader" />
                        <div className="m-price">{it.itemPrice}</div>
                        {it.itemDescription ? <div className="m-desc">{it.itemDescription}</div> : null}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
