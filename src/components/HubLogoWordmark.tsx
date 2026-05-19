import React from 'react'

type HubLogoProps = {
  logo?: {
    url: string
    alt: string
    width: number
    height: number
  }
  logoText?: string
}

/**
 * District Landing topbar wordmark: Fraunces “district” + italic gold “.”
 * (Instrument Serif). Falls back to CMS logo image / logoText when set.
 */
export function HubLogoWordmark({ logo, logoText }: HubLogoProps) {
  if (logo) {
    return <img src={logo.url} alt={logo.alt} width={logo.width} height={logo.height} />
  }
  if (logoText) {
    return <h1 className="hub-logo-wordmark">{logoText}</h1>
  }
  return (
    <h1 className="hub-logo-wordmark">
      district<span className="hub-logo-wordmark__accent">.</span>
    </h1>
  )
}
