'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'

export function RealEstateLandingPartner({
  sectionId = 'partner',
  imageUrl,
  imageAlt = '',
  eyebrow,
  headingParts,
  paragraphs,
  ctaLabel,
  ctaHref,
  ctaOpenInNewTab = false,
  secondaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaOpenInNewTab = false,
  signatureBold,
  signatureSub,
}: {
  sectionId?: string
  imageUrl: string
  imageAlt?: string
  eyebrow: string
  headingParts: { text: string; italic?: boolean; lineBreak?: boolean }[]
  paragraphs: string[]
  ctaLabel: string
  ctaHref: string
  ctaOpenInNewTab?: boolean
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  secondaryCtaOpenInNewTab?: boolean
  signatureBold: string
  signatureSub: string
}) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const h2 = ref.current?.querySelector('.partner__copy h2')
      if (h2) revealWordsIn(h2 as HTMLElement, { trigger: ref.current, start: 'top 70%' })
      const clip = ref.current?.querySelector('.partner__media .clip')
      if (clip) {
        gsap.fromTo(
          clip,
          { scaleY: 1 },
          { scaleY: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'top 20%', scrub: 1 } },
        )
      }
      const img = ref.current?.querySelector('.partner__media img')
      if (img) {
        gsap.to(img, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      gsap.from(ref.current?.querySelectorAll('.partner__copy p, .partner__signature, .partner__ctas a') || [], {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const hasSecondary = Boolean(secondaryCtaHref?.trim() && secondaryCtaLabel?.trim())

  return (
    <section ref={ref} id={sectionId} className="partner">
      <div className="partner__media">
        <img src={imageUrl} alt={imageAlt} />
        <div className="clip" />
      </div>
      <div className="partner__copy">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="serif">
          {headingParts.map((p, i) => (
            <React.Fragment key={i}>
              {p.italic ? (
                <span className="it">
                  <SplitWords text={p.text} />
                </span>
              ) : (
                <SplitWords text={p.text} />
              )}
              {p.lineBreak ? <br /> : null}{' '}
            </React.Fragment>
          ))}
        </h2>
        {paragraphs.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
        <div className="partner__ctas">
          <a
            href={ctaHref}
            className="partner__cta btn-ghost"
            {...(ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {ctaLabel} <i>→</i>
          </a>
          {hasSecondary ? (
            <a
              href={secondaryCtaHref!}
              className="partner__cta partner__cta--ghost2 btn-ghost"
              {...(secondaryCtaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {secondaryCtaLabel} <i>→</i>
            </a>
          ) : null}
        </div>
        <div className="partner__signature">
          <b>{signatureBold}</b>
          <span>{signatureSub}</span>
        </div>
      </div>
    </section>
  )
}
