'use client'

import Link from 'next/link'
import React from 'react'

export type BoutiqueBrandmarkLogo = {
  url: string
  alt: string
  width: number
  height: number
}

type BoutiqueBrandmarkProps = {
  logo?: BoutiqueBrandmarkLogo
  logoText?: string
  brandSubtitle?: string | null
  onClick: React.MouseEventHandler<HTMLAnchorElement>
  className?: string
}

export function BoutiqueBrandmark({
  logo,
  logoText,
  brandSubtitle,
  onClick,
  className = '',
}: BoutiqueBrandmarkProps) {
  return (
    <Link href="/" onClick={onClick} className={`boutique-brandmark ${className}`.trim()}>
      {logo ? (
        <img
          className="boutique-brandmark__img"
          src={logo.url}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
        />
      ) : (
        <>
          <span className="boutique-brandmark__word">
            {(logoText || 'district.').replace(/\.\s*$/, '')}
            <span className="boutique-brandmark__dot">.</span>
          </span>
          {brandSubtitle ? (
            <span className="boutique-brandmark__sub">{brandSubtitle}</span>
          ) : null}
        </>
      )}
    </Link>
  )
}
