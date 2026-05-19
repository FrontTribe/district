import React from 'react'
import type { Footer } from '@/payload-types'
import { buildHubSocialLinks } from '@/utils/hubSocialLinks'
import './HubBottombar.scss'

type HubBottombarProps = {
  footer: Footer
}

function formatAddressLine(footer: Footer): string {
  const { street, city } = footer.rightContent.address
  const parts = [street?.trim(), city?.trim()].filter(Boolean)
  return parts.join(' · ')
}

export function HubBottombar({ footer }: HubBottombarProps) {
  const addressLine = formatAddressLine(footer)
  const { email, phone } = footer.rightContent.contact
  const telHref = phone?.replace(/\s+/g, '') ? `tel:${phone.replace(/\s+/g, '')}` : undefined
  const socials = buildHubSocialLinks(footer)

  return (
    <footer className="district-hub-bottombar" aria-label="Site">
      {addressLine ? <span className="district-hub-bottombar__line">{addressLine}</span> : null}
      <div className="district-hub-bottombar__center">
        <a href={`mailto:${email}`}>{email}</a>
        {phone && telHref ? <a href={telHref}>{phone}</a> : null}
      </div>
      <div className="district-hub-bottombar__center district-hub-bottombar__socials">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
