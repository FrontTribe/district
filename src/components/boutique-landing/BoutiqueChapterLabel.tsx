import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  chapterNum?: string | null
  chapterLabel?: string | null
  className?: string
}

export function BoutiqueChapterLabel({
  chapterNum,
  chapterLabel,
  className = '',
  ...rest
}: Props) {
  if (!chapterNum && !chapterLabel) return null
  return (
    <div className={`chapter-label ${className}`.trim()} {...rest}>
      {chapterNum ? <span className="chapter-num">{chapterNum}</span> : null}
      {chapterLabel ? <span>{chapterLabel}</span> : null}
    </div>
  )
}
