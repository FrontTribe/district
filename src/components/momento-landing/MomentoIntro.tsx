'use client'

import React from 'react'

type Props = {
  content: string
  sectionId?: string
}

/** Kratki intro red između heroa i o-nama sekcije. */
export function MomentoIntro({ content, sectionId = 'intro' }: Props) {
  if (!content?.trim()) return null

  return (
    <section className="section momento-intro-strip" id={sectionId} style={{ padding: '48px 0' }}>
      <div className="shell">
        <p className="reveal" style={{ margin: 0, fontSize: '17px', lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '62ch' }}>
          {content}
        </p>
      </div>
    </section>
  )
}
