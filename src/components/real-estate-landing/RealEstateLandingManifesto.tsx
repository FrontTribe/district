'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'

export type ManifestoSegment = { text: string; style?: 'plain' | 'mute' | 'accent' }

export type ManifestoRow = { segments: ManifestoSegment[] }

export function RealEstateLandingManifesto({
  sectionId = 'projekt',
  labelLeft,
  labelNum,
  topIntroHtml,
  rows,
  footnoteHtml,
}: {
  sectionId?: string
  labelLeft: string
  labelNum: string
  topIntroHtml?: string | null
  rows: ManifestoRow[]
  footnoteHtml?: string | null
}) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      revealWordsIn(ref.current!, { trigger: ref.current, start: 'top 75%', stagger: 0.025 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id={sectionId} className="manifesto">
      <div className="manifesto__label">
        <div>{labelLeft}</div>
        <div className="num">{labelNum}</div>
      </div>
      <div className="manifesto__copy">
        {topIntroHtml?.trim() ? (
          <div className="manifesto__intro mono" dangerouslySetInnerHTML={{ __html: topIntroHtml }} />
        ) : null}
        <div className="manifesto__body">
          {rows.map((row, ri) => (
            <React.Fragment key={ri}>
              {row.segments.map((seg, si) => {
                const cls = seg.style === 'mute' ? 'mute' : seg.style === 'accent' ? 'ac it' : undefined
                return (
                  <span key={si} className={cls}>
                    <SplitWords text={seg.text} />{' '}
                  </span>
                )
              })}
              {ri < rows.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </div>
        {footnoteHtml?.trim() ? (
          <div className="manifesto__footnote mono" dangerouslySetInnerHTML={{ __html: footnoteHtml }} />
        ) : null}
      </div>
    </section>
  )
}
