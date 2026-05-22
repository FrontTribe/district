'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'

export type TipItem = {
  unitCode: string
  name: string
  size: string
  description: string
  count: number
  highlight?: boolean
}

export function RealEstateLandingTypology({
  sectionId = 'tipologija',
  eyebrow,
  headingParts,
  intro,
  outroHtml,
  items,
  countSuffixWord = 'stanova',
}: {
  sectionId?: string
  eyebrow: string
  headingParts: { text: string; italic?: boolean }[]
  intro: string
  outroHtml?: string | null
  items: TipItem[]
  /** Sufiks nakon broja u retku (npr. stanova / units). */
  countSuffixWord?: string | null
}) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const root = ref.current
      if (!root) return
      const head = root.querySelector('.tip__head')
      if (head) revealWordsIn(head, { trigger: root, start: 'top 75%' })
      const list = root.querySelector('.tip__list')
      const rows = list?.querySelectorAll('.tip__row')
      if (!rows?.length) return
      gsap.from(rows, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: list, start: 'top 75%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [items])

  return (
    <section ref={ref} id={sectionId} className="tip">
      <div className="tip__head">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="serif">
          {headingParts.map((p, i) =>
            p.italic ? (
              <span key={i} className="it">
                <SplitWords text={p.text} />{' '}
              </span>
            ) : (
              <span key={i}>
                <SplitWords text={p.text} />{' '}
              </span>
            ),
          )}
        </h2>
        <p>{intro}</p>
      </div>

      <div className="tip__list">
        {items.map((t, i) => (
          <div
            key={t.unitCode}
            className={`tip__row ${active === i ? 'active' : ''} ${t.highlight ? 'tip__row--highlight' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className="tip__idx mono">— {t.unitCode}</div>
            <div className="tip__name serif">{i % 2 ? <span className="it">{t.name}</span> : t.name}</div>
            <div className="tip__size mono">{t.size}</div>
            <div className="tip__desc">{t.description}</div>
            <div className="tip__count mono">
              {String(t.count).padStart(2, '0')} <small>{countSuffixWord || 'stanova'}</small>
            </div>
            <div className="tip__arrow">↗</div>
          </div>
        ))}
      </div>
      {outroHtml?.trim() ? (
        <div className="tip__outro mono" dangerouslySetInnerHTML={{ __html: outroHtml }} />
      ) : null}
    </section>
  )
}
