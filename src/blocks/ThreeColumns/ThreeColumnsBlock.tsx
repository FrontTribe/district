'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ThreeColumnsBlockProps } from './types'
import { generateTenantUrl } from '@/utils/generateTenantUrl'
import { getTranslation } from '@/utils/translations'

function buildSocialNavItems(
  nets?: { facebook?: string | null; instagram?: string | null } | null,
): { label: string; href: string }[] {
  const items: { label: string; href: string }[] = []
  const igRaw = nets?.instagram?.trim()
  const fbRaw = nets?.facebook?.trim()
  if (igRaw) {
    const href =
      igRaw.startsWith('http://') || igRaw.startsWith('https://')
        ? igRaw
        : `https://www.instagram.com/${igRaw.replace(/^@/, '')}/`
    items.push({ label: 'Instagram', href })
  }
  if (fbRaw) {
    const href =
      fbRaw.startsWith('http://') || fbRaw.startsWith('https://')
        ? fbRaw
        : `https://www.facebook.com/${fbRaw.replace(/^\//, '')}`
    items.push({ label: 'Facebook', href })
  }
  return items
}

function SocialRow({ items, locale }: { items: { label: string; href: string }[]; locale: string }) {
  if (items.length === 0) return null

  const linksInner = items.map((item, i) => (
    <React.Fragment key={`${item.label}-${item.href}`}>
      {i > 0 ? (
        <span className="district-hub__socials-dot" aria-hidden>
          ·
        </span>
      ) : null}
      <a
        href={item.href}
        className="district-hub__socials-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {item.label}
      </a>
    </React.Fragment>
  ))

  return (
    <div
      className="district-hub__socials"
      role="navigation"
      aria-label={getTranslation('hubColumnSocials', locale)}
    >
      {linksInner}
    </div>
  )
}

export const ThreeColumnsBlock: React.FC<ThreeColumnsBlockProps> = ({
  columns,
  sectionId,
  locale = 'en',
}) => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const cols = sectionRef.current?.querySelectorAll('.district-hub__col')
    if (!cols?.length) return

    gsap.set(cols, { opacity: 0, y: 24 })
    gsap.to(cols, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.15,
    })
  }, [columns])

  return (
    <section
      ref={sectionRef}
      id={sectionId || undefined}
      className="district-hub three-columns-section"
      aria-label={getTranslation('districtHubSection', locale)}
    >
      <div className="district-hub__cols">
        {columns?.map((column, index) => {
          const isComingSoon = column.comingSoon === true
          const href =
            !isComingSoon && column.link?.tenant?.subdomain
              ? generateTenantUrl(column.link.tenant.subdomain)
              : undefined
          const numberLine =
            column.numberLabel?.trim() || String(index + 1).padStart(2, '0')
          const bgUrl = column.backgroundImage?.url
          const socialItems = buildSocialNavItems(column.socialNetworks)
          const hasSocial = socialItems.length > 0
          const useSurfaceLink = Boolean(href)
          const visitLabel = `${column.title}: ${column.link?.text || getTranslation('visitSite', locale)}`

          const ctaNode = column.link?.text ? (
            <span className="district-hub__cta">
              {column.link.text}
              <span className="district-hub__cta-arr" aria-hidden>
                {isComingSoon ? '—' : '→'}
              </span>
            </span>
          ) : null

          const inner = (
            <>
              {bgUrl ? (
                <div className="district-hub__media" aria-hidden>
                  <img
                    src={bgUrl}
                    alt=""
                    className="district-hub__img"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ) : (
                <div className="district-hub__media district-hub__media--empty" aria-hidden />
              )}
              <div className="district-hub__veil" aria-hidden />
              {useSurfaceLink ? (
                <a
                  href={href}
                  className="district-hub__col-surface"
                  aria-label={visitLabel}
                  tabIndex={0}
                  target={column.link?.openInNewTab ? '_blank' : undefined}
                  rel={column.link?.openInNewTab ? 'noopener noreferrer' : undefined}
                />
              ) : null}
              {isComingSoon && (
                <div className="district-hub__badge">{getTranslation('comingSoon', locale)}</div>
              )}
              <div className="district-hub__num">{numberLine}</div>
              <div className="district-hub__content">
                {useSurfaceLink ? (
                  <div className="district-hub__pass-through">
                    {column.kicker?.trim() ? (
                      <div className="district-hub__kicker">{column.kicker.trim()}</div>
                    ) : null}
                    <h2 className="district-hub__name">
                      {column.title}
                      {column.titleItalic?.trim() ? (
                        <>
                          {' '}
                          <em>{column.titleItalic.trim()}</em>
                        </>
                      ) : null}
                    </h2>
                    {column.subtitle?.trim() ? (
                      <p className="district-hub__desc">{column.subtitle.trim()}</p>
                    ) : null}
                    {ctaNode}
                  </div>
                ) : (
                  <>
                    {column.kicker?.trim() ? (
                      <div className="district-hub__kicker">{column.kicker.trim()}</div>
                    ) : null}
                    <h2 className="district-hub__name">
                      {column.title}
                      {column.titleItalic?.trim() ? (
                        <>
                          {' '}
                          <em>{column.titleItalic.trim()}</em>
                        </>
                      ) : null}
                    </h2>
                    {column.subtitle?.trim() ? (
                      <p className="district-hub__desc">{column.subtitle.trim()}</p>
                    ) : null}
                    {ctaNode}
                  </>
                )}
                {hasSocial ? <SocialRow items={socialItems} locale={locale} /> : null}
              </div>
            </>
          )

          const className = [
            'district-hub__col',
            isComingSoon ? 'district-hub__col--soon' : '',
            useSurfaceLink ? 'district-hub__col--linked' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={index}
              className={className}
              role="group"
              aria-label={column.title}
              tabIndex={isComingSoon ? 0 : undefined}
            >
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
