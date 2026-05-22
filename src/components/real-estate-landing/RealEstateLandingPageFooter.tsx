import React from 'react'

export type PageFooterLink = { label: string; href: string; openInNewTab?: boolean }

/**
 * Jednoredno podnožje kao u District RE exportu.
 * Koristi klase `re-footer*` da se ne sudaraju s globalnim `Footer.scss` (`.footer`).
 */
export function RealEstateLandingPageFooter({
  brand,
  brandHtml,
  line2,
  line3,
  links,
}: {
  brand: string
  brandHtml?: string | null
  line2: string
  line3: string
  links?: PageFooterLink[] | null
}) {
  return (
    <footer className="re-footer">
      {brandHtml?.trim() ? (
        <div className="re-footer__brand" dangerouslySetInnerHTML={{ __html: brandHtml }} />
      ) : (
        <div className="re-footer__brand">{brand}</div>
      )}
      <div className="re-footer__line">{line2}</div>
      <div className="re-footer__tail">
        {line3.trim() ? <div className="re-footer__tagline">{line3}</div> : null}
        {links?.length ? (
          <nav className="re-footer__links" aria-label="Footer links">
            {links.map((l) => (
              <a
                key={`${l.href}-${l.label}`}
                className="re-footer__link"
                href={l.href}
                {...(l.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  )
}
