'use client'

import React from 'react'

type SplitProps = {
  children: React.ReactNode
  className?: string
  tag?: React.ElementType
}

export function MomentoSplit({ children, className = '', tag: Tag = 'span' }: SplitProps) {
  if (typeof children !== 'string') {
    return (
      <Tag className={`split ${className}`.trim()}>
        <span className="word">
          <span className="inner">{children}</span>
        </span>
      </Tag>
    )
  }

  const words = children.split(' ').filter(Boolean)
  return (
    <Tag className={`split ${className}`.trim()}>
      {words.map((w, i) => (
        <span className="word" key={`${w}-${i}`}>
          <span className="inner">
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
