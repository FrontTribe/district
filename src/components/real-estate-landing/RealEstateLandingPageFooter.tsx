import React from 'react'

export type FooterLineLinkType = 'none' | 'url' | 'email' | 'phone'

export type FooterLine = {
  text: string
  linkType?: FooterLineLinkType | null
  href?: string | null
  openInNewTab?: boolean | null
}

export type FooterColumn = {
  label: string
  lines: FooterLine[]
}

function replaceCopyrightYear(text: string): string {
  return text.replace(/\d{4}/, new Date().getFullYear().toString())
}

function resolveLineHref(line: FooterLine): string | null {
  const linkType = line.linkType ?? 'none'
  if (linkType === 'none') return null
  if (linkType === 'url') return line.href?.trim() || null
  if (linkType === 'email') return `mailto:${line.text.trim()}`
  if (linkType === 'phone') return `tel:${line.text.replace(/[^\d+]/g, '')}`
  return null
}

function FooterLineItem({ line }: { line: FooterLine }) {
  const href = resolveLineHref(line)
  if (!href) return <>{line.text}</>

  const openInNewTab = Boolean(line.openInNewTab)
  return (
    <a
      href={href}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {line.text}
    </a>
  )
}

/**
 * RE landing podnozje — 4 stupca + donja traka (redizajn).
 */
export function RealEstateLandingPageFooter({
  columns,
  brandText,
  copyrightLine,
  addressLine,
}: {
  columns: FooterColumn[]
  brandText: string
  copyrightLine: string
  addressLine: string
}) {
  const copyright = replaceCopyrightYear(copyrightLine.trim())

  return (
    <footer className="footer">
      {columns.length ? (
        <div className="footer__columns">
          {columns.map((col) => (
            <div key={col.label} className="footer__col">
              <div className="footer__col-label">{col.label}</div>
              <div className="footer__col-value">
                {col.lines.map((line, i) => (
                  <React.Fragment key={`${line.text}-${i}`}>
                    {i > 0 ? <br /> : null}
                    <FooterLineItem line={line} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="footer__bar">
        <div className="footer__brand">
          <b>{brandText.trim()}</b>
        </div>
        <div className="footer__copyright">{copyright}</div>
        <div className="footer__address">{addressLine.trim()}</div>
      </div>
    </footer>
  )
}
