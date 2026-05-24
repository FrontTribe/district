'use client'

export function BoutiqueFooterMap() {
  return (
    <svg viewBox="0 0 360 240" className="footer-map-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <pattern id="boutique-dotgrid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(244,239,231,0.12)" />
        </pattern>
      </defs>
      <rect width="360" height="240" fill="rgba(244,239,231,0.04)" />
      <rect width="360" height="240" fill="url(#boutique-dotgrid)" />
      <path
        d="M -10 70 C 60 50 120 95 200 80 S 320 60 380 90"
        stroke="rgba(244,239,231,0.5)"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
        opacity="0.18"
      />
      <path
        d="M -10 70 C 60 50 120 95 200 80 S 320 60 380 90"
        stroke="rgba(244,239,231,0.7)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="2 4"
      />
      <g stroke="rgba(244,239,231,0.35)" strokeWidth="0.6" fill="none">
        <line x1="0" y1="140" x2="360" y2="140" />
        <line x1="0" y1="170" x2="360" y2="170" />
        <line x1="0" y1="200" x2="360" y2="200" />
        <line x1="60" y1="100" x2="60" y2="240" />
        <line x1="120" y1="100" x2="120" y2="240" />
        <line x1="200" y1="100" x2="200" y2="240" />
        <line x1="260" y1="100" x2="260" y2="240" />
        <line x1="320" y1="100" x2="320" y2="240" />
      </g>
      <g transform="translate(180, 155)">
        <circle r="22" fill="none" stroke="var(--boutique-accent)" strokeWidth="0.8" opacity="0.4" />
        <circle r="4" fill="var(--boutique-accent)" />
        <circle r="9" fill="none" stroke="var(--boutique-accent)" strokeWidth="1" />
      </g>
      <text
        x="180"
        y="183"
        textAnchor="middle"
        fill="rgba(244,239,231,0.85)"
        fontSize="9"
        letterSpacing="2"
        fontFamily="ui-monospace, monospace"
      >
        DISTRICT.
      </text>
    </svg>
  )
}
