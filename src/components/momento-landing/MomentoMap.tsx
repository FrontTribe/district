'use client'

import { useEffect, useRef } from 'react'
import {
  googleMapsEmbedUrl,
  isValidMapCoordinates,
  loadGoogleMapsScript,
  openStreetMapEmbedUrl,
} from '@/utils/googleMapsLoader'

const MOMENTO_MAP_STYLES = [
  { featureType: 'all', elementType: 'geometry.fill', stylers: [{ color: '#ebe4d8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e0e4' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#ebe4d8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#ddd5c8' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

type Props = {
  lat: number
  lng: number
  label?: string
}

function mountIframe(container: HTMLElement, src: string, title: string) {
  container.replaceChildren()
  const iframe = document.createElement('iframe')
  iframe.src = src
  iframe.title = title
  iframe.loading = 'lazy'
  iframe.referrerPolicy = 'no-referrer-when-downgrade'
  iframe.setAttribute('allowfullscreen', 'true')
  iframe.style.cssText = 'border:0;width:100%;height:100%;display:block;'
  container.appendChild(iframe)
}

function initInteractiveMap(container: HTMLElement, lat: number, lng: number, label: string) {
  const maps = (window as any).google.maps

  const map = new maps.Map(container, {
    center: { lat, lng },
    zoom: 17,
    styles: MOMENTO_MAP_STYLES,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'cooperative',
    clickableIcons: false,
  })

  new maps.Marker({
    position: { lat, lng },
    map,
    title: label,
    icon: {
      path: maps.SymbolPath.CIRCLE,
      scale: 14,
      fillColor: '#3d6b5a',
      fillOpacity: 1,
      strokeColor: '#f6f0e6',
      strokeWeight: 3,
    },
  })
}

export function MomentoMap({ lat, lng, label = 'Momento' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !isValidMapCoordinates(lat, lng)) return

    let cancelled = false
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    const showFallback = () => {
      if (cancelled) return
      const src = apiKey
        ? googleMapsEmbedUrl(lat, lng, apiKey)
        : openStreetMapEmbedUrl(lat, lng)
      mountIframe(container, src, label)
    }

    loadGoogleMapsScript()
      .then(() => {
        if (cancelled) return
        container.replaceChildren()
        initInteractiveMap(container, lat, lng, label)
      })
      .catch(showFallback)

    return () => {
      cancelled = true
      container.replaceChildren()
    }
  }, [lat, lng, label])

  return <div className="momento-map" ref={containerRef} aria-label={label} role="img" />
}
