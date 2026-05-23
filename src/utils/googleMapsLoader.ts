let loadPromise: Promise<void> | null = null

export function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps is only available in the browser'))
  }

  if (window.google?.maps) {
    return Promise.resolve()
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return Promise.reject(new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'))
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps'))
      document.head.appendChild(script)
    })
  }

  return loadPromise
}

export function isValidMapCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

export function googleMapsSearchUrl(lat: number, lng: number, address?: string): string {
  const query = address ? encodeURIComponent(address) : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export function openStreetMapEmbedUrl(lat: number, lng: number, delta = 0.012): string {
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
}

export function googleMapsEmbedUrl(lat: number, lng: number, apiKey: string): string {
  return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=16`
}
