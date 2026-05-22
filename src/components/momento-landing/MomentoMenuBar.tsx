'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  active: string
  onSelect: (value: string) => void
  categories: { categoryName: string }[]
}

export function MomentoMenuBar({ active, onSelect, categories }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateHints = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 6)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateHints()
    el.addEventListener('scroll', updateHints, { passive: true })
    const ro = new ResizeObserver(updateHints)
    ro.observe(el)
    window.addEventListener('resize', updateHints, { passive: true })
    return () => {
      el.removeEventListener('scroll', updateHints)
      ro.disconnect()
      window.removeEventListener('resize', updateHints)
    }
  }, [categories.length, updateHints])

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.min(280, el.clientWidth * 0.75), behavior: 'smooth' })
  }

  return (
    <div
      className={[
        'menu-bar-wrap',
        canScrollLeft ? 'menu-bar-wrap--more-left' : '',
        canScrollRight ? 'menu-bar-wrap--more-right' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {canScrollLeft ? (
        <button
          type="button"
          className="menu-bar-hint menu-bar-hint--left"
          aria-label="Prethodne kategorije"
          onClick={() => scrollBy(-1)}
        >
          <span aria-hidden>←</span>
        </button>
      ) : null}

      <div className="menu-bar" ref={trackRef}>
        <button type="button" className={active === 'all' ? 'active' : ''} onClick={() => onSelect('all')}>
          Sve
        </button>
        {categories.map((c) => (
          <button
            key={c.categoryName}
            type="button"
            className={active === c.categoryName ? 'active' : ''}
            onClick={() => onSelect(c.categoryName)}
          >
            {c.categoryName}
          </button>
        ))}
      </div>

      {canScrollRight ? (
        <button
          type="button"
          className="menu-bar-hint menu-bar-hint--right"
          aria-label="Više kategorija"
          onClick={() => scrollBy(1)}
        >
          <span aria-hidden>→</span>
        </button>
      ) : null}
    </div>
  )
}
