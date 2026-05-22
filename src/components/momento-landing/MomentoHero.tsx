'use client'

import React from 'react'
import { MomentoSplit } from './shared/MomentoSplit'
import { resolveMediaUrl, splitHeroHeading } from './utils'

type Props = {
  heading: string
  subheading?: string | null
  sectionId?: string
  backgroundMedia?: {
    type?: 'none' | 'image' | 'video' | null
    image?: unknown
    video?: unknown
  }
}

export function MomentoHero({ heading, subheading, sectionId = 'top', backgroundMedia }: Props) {
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
              <span>Lounge &amp; Caffe Bar</span>
              <span className="dot-sep" />
              <span>Osijek · Retfala</span>
              <span className="dot-sep" />
              <span>est. 2024</span>
            </div>
            <div className="right">
              <span>by District —</span>
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
            <span>Lounge &amp; Caffe Bar u srcu Retfale</span>
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
            <span className="lbl">Otvoreno svaki dan</span>
          </div>
          <div className="stat reveal" data-delay="4">
            <span className="num">
              <em>200+</em>
            </span>
            <span className="lbl">Stavki na meniju</span>
          </div>
          <div className="scroll-cue reveal" data-delay="5">
            <span>Skrolaj</span>
            <span className="line" />
          </div>
        </div>
      </div>
    </section>
  )
}
