'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'

export function RealEstateLandingCurrentProject({
  sectionId = 'trenutni',
  eyebrow,
  headingParts,
  bigNumber,
  projectMeta,
  projectNameHtml,
  description,
  imageUrl,
  imageAlt = '',
  ctaLabel,
  ctaHref,
  ctaOpenInNewTab = false,
  stats,
}: {
  sectionId?: string
  eyebrow: string
  headingParts: { text: string; italic?: boolean }[]
  bigNumber: string
  projectMeta: string
  projectNameHtml: string
  description: string
  imageUrl: string
  imageAlt?: string
  ctaLabel: string
  ctaHref: string
  ctaOpenInNewTab?: boolean
  stats: { label: string; value: string }[]
}) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const head = ref.current?.querySelector('.tp__head')
      if (head) revealWordsIn(head, { trigger: head, start: 'top 80%' })
      gsap.fromTo(
        '.tp__big .tp__num span',
        { yPercent: 102 },
        { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.tp__big', start: 'top 75%', once: true } },
      )
      gsap.fromTo(
        '.tp__big-img',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.tp__big', start: 'top 70%', once: true } },
      )
      gsap.fromTo(
        '.tp__big-img img',
        { scale: 1.2 },
        { scale: 1.02, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.tp__big', start: 'top 70%', once: true } },
      )
      gsap.from('.tp__meta-row', {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.tp__big', start: 'top 65%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id={sectionId} className="tp">
      <div className="tp__head">
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
      </div>

      <article className="tp__big">
        <div className="tp__big-meta">
          <div className="tp__num serif">
            {bigNumber.split('').map((ch, i) => (
              <span key={i} className="word">
                <i>{ch}</i>
              </span>
            ))}
          </div>
          <div className="tp__big-info">
            <div className="eyebrow">{projectMeta}</div>
            <div className="tp__big-name serif" dangerouslySetInnerHTML={{ __html: projectNameHtml }} />
            <div className="tp__big-desc">{description}</div>
          </div>
        </div>

        <div className="tp__big-img">
          <img src={imageUrl} alt={imageAlt} />
          <a
            href={ctaHref}
            className="tp__big-cta"
            {...(ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span>{ctaLabel}</span>
            <i>→</i>
          </a>
        </div>

        <div className="tp__big-stats">
          {stats.map((s) => (
            <div key={s.label} className="tp__meta-row">
              <div className="lbl mono">{s.label}</div>
              <div className="v serif">{s.value}</div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
