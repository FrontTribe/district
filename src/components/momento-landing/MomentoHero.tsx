'use client'

import React from 'react'
import { MomentoSplit } from './shared/MomentoSplit'
import { resolveMediaUrl, splitHeroHeading } from './utils'
import { getMomentoUiCopy } from '@/data/momentoUiCopy'

type Props = {
  heading: string
  subheading?: string | null
  sectionId?: string
  locale?: string
  backgroundMedia?: {
    type?: 'none' | 'image' | 'video' | null
    image?: unknown
    video?: unknown
  }
}

export function MomentoHero({
  heading,
  subheading,
  sectionId = 'top',
  locale = 'hr',
  backgroundMedia,
}: Props) {
  const ui = getMomentoUiCopy(locale)
  const { line1, line2 } = splitHeroHeading(heading)
  const imageUrl =
    backgroundMedia?.type === 'image' ? resolveMediaUrl(backgroundMedia.image) : ''

  return (
    <section className="hero" id={sectionId}>
      <div className="hero-img-wrap">
        <div
          className="hero-img"
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        />
        <div className="hero-grain" aria-hidden="true" />
      </div>
      <div className="shell hero-inner">
        <div>
          <div className="hero-meta">
            <div className="left">
              <span>{ui.hero.metaLeft}</span>
              <span className="dot-sep" />
              <span>{ui.hero.metaLocation}</span>
              <span className="dot-sep" />
              <span>{ui.hero.metaEst}</span>
            </div>
            <div className="right">
              <span>{ui.hero.metaRight}</span>
            </div>
          </div>
          <h1 className="hero-title">
            <MomentoSplit className="l1" tag="span">
              {line1}
            </MomentoSplit>
            {line2 ? (
              <MomentoSplit className="l2" tag="span">
                {line2.endsWith('.') ? line2 : `${line2}.`}
              </MomentoSplit>
            ) : null}
          </h1>
          <div className="hero-flourish reveal" data-delay="3">
            <span className="line" />
            <span>{ui.hero.flourish}</span>
          </div>
        </div>
        <div className="hero-bottom">
          {subheading ? (
            <p className="reveal" data-delay="2">
              {subheading}
            </p>
          ) : null}
          <div className="stat reveal" data-delay="3">
            <span className="num">07—00</span>
            <span className="lbl">{ui.hero.hoursLabel}</span>
          </div>
          <div className="stat reveal" data-delay="4">
            <span className="num">
              <em>200+</em>
            </span>
            <span className="lbl">{ui.hero.menuItemsLabel}</span>
          </div>
          <div className="scroll-cue reveal" data-delay="5">
            <span>{ui.hero.scrollCue}</span>
            <span className="line" />
          </div>
        </div>
      </div>
    </section>
  )
}
