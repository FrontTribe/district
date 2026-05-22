'use client'

import React from 'react'

export function SplitWords({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={`sw ${className}`.trim()}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="word">
            <i dangerouslySetInnerHTML={{ __html: w }} />
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  )
}
