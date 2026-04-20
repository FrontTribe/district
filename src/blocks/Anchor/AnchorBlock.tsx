import React from 'react'

type Props = {
  anchorId?: string
}

/**
 * Empty, invisible block that only renders an element with an `id` attribute.
 * Used as a scroll target for in-page navigation (e.g. menu links to #section-id).
 */
export const AnchorBlock: React.FC<Props> = ({ anchorId }) => {
  if (!anchorId) return null

  const sanitizedId = anchorId.trim().replace(/^#/, '')
  if (!sanitizedId) return null

  return <div id={sanitizedId} aria-hidden="true" style={{ scrollMarginTop: '80px' }} />
}
