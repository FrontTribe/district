'use client'

import React from 'react'

/** Isti BEM kao `RealEstateLandingPageFooter` — stilovi u `real-estate-landing.scss` (`.re-footer`). */
export function ZigicaPageFooter({ brand, line2, line3 }: { brand: string; line2: string; line3: string }) {
  return (
    <footer className="re-footer">
      <div className="re-footer__brand">{brand}</div>
      <div className="re-footer__line">{line2}</div>
      <div className="re-footer__tail">
        {line3.trim() ? <div className="re-footer__tagline">{line3}</div> : null}
      </div>
    </footer>
  )
}
