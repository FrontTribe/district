'use client'

import React, { useEffect, useRef } from 'react'
import { getTranslation } from '@/utils/translations'

// Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        Marker: any
        InfoWindow: any
        SymbolPath: {
          CIRCLE: any
        }
      }
    }
  }
}

type WorkingHours = {
  day: string
  isOpen: boolean
  openTime?: string
  closeTime?: string
  isClosed?: boolean
}

type Props = {
  title: string
  description?: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  workingHours: WorkingHours[]
  sectionId?: string
  locale?: string
}

export const LocationBlock: React.FC<Props> = ({
  title,
  description,
  address,
  coordinates,
  workingHours,
  sectionId,
  locale = 'hr',
}) => {
  const mapRef = useRef<HTMLDivElement>(null)

  // Validate coordinates
  const validateCoordinates = (lat: number, lng: number) => {
    const isValidLat = lat >= -90 && lat <= 90
    const isValidLng = lng >= -180 && lng <= 180
    const hasDecimals = lat.toString().includes('.') && lng.toString().includes('.')

    return isValidLat && isValidLng && hasDecimals
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    // Validate coordinates before proceeding
    if (!validateCoordinates(coordinates.lat, coordinates.lng)) {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: #f5f5f5;
            color: #ff6b6b;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <p>Invalid Coordinates</p>
              <p>Lat: ${coordinates.lat}</p>
              <p>Lng: ${coordinates.lng}</p>
              <p style="font-size: 12px; margin-top: 10px;">Please check coordinates in Payload CMS</p>
            </div>
          </div>
        `
      }
      return
    }

    // Initialize Google Maps
    const initMap = () => {
      try {
        const map = new (window as any).google.maps.Map(mapRef.current!, {
          zoom: 18,
          center: { lat: coordinates.lat, lng: coordinates.lng },
          draggable: false,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f5f5f5' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }],
            },
            // Hide all POI (Points of Interest) - removes pins, labels, etc.
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide business POI
            {
              featureType: 'poi.business',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide attraction POI
            {
              featureType: 'poi.attraction',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide government POI
            {
              featureType: 'poi.government',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide medical POI
            {
              featureType: 'poi.medical',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide park POI
            {
              featureType: 'poi.park',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide place of worship POI
            {
              featureType: 'poi.place_of_worship',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide school POI
            {
              featureType: 'poi.school',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide sports complex POI
            {
              featureType: 'poi.sports_complex',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide transit POI
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide transit station POI
            {
              featureType: 'transit.station',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            // Hide labels for POI
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            // Hide labels for POI business
            {
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
        })

        // Add circular pin marker
        const _marker = new (window as any).google.maps.Marker({
          position: { lat: coordinates.lat, lng: coordinates.lng },
          map: map,
          title: title,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#000000',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        })
      } catch (error) {
        // Fallback: show a placeholder with coordinates
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              background: #f5f5f5;
              color: #666;
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            ">
              <div>
                <p>Map Location</p>
                <p>Lat: ${coordinates.lat.toFixed(6)}</p>
                <p>Lng: ${coordinates.lng.toFixed(6)}</p>
                <p style="font-size: 12px; margin-top: 10px;">Google Maps API key required</p>
              </div>
            </div>
          `
        }
      }
    }

    // Load Google Maps script if not already loaded
    if (!(window as any).google) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (!apiKey) {
        // Show fallback placeholder
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              background: #f5f5f5;
              color: #666;
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            ">
              <div>
                <p>Map Location</p>
                <p>Lat: ${coordinates.lat.toFixed(6)}</p>
                <p>Lng: ${coordinates.lng.toFixed(6)}</p>
                <p style="font-size: 12px; margin-top: 10px; color: #ff6b6b;">Google Maps API key required</p>
              </div>
            </div>
          `
        }
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        initMap()
      }
      script.onerror = () => {
        // Show fallback with Google Maps embed
        if (mapRef.current) {
          const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coordinates.lat},${coordinates.lng}&zoom=15`
          mapRef.current.innerHTML = `
            <iframe 
              src="${embedUrl}" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          `
        }
      }
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [coordinates.lat, coordinates.lng, title, address])

  const getDayTranslation = (day: string) => {
    const dayKey = day.toLowerCase()
    return getTranslation(dayKey, locale)
  }

  const formatWorkingHours = (hours: WorkingHours[]) => {
    const closedText = getTranslation('closed', locale)

    if (!hours || !Array.isArray(hours)) {
      return []
    }

    return hours.map((day, index) => {
      // Ensure we have a valid day object
      if (!day || typeof day !== 'object') {
        return { day: `Day ${index + 1}`, display: closedText }
      }

      // If explicitly marked as closed
      if (day.isClosed === true) {
        return { ...day, display: closedText }
      }

      // If open and has both times
      if (day.isOpen === true && day.openTime && day.closeTime) {
        const timeDisplay = `${day.openTime} - ${day.closeTime}`
        return { ...day, display: timeDisplay }
      }

      // If open but missing times, show as closed
      if (day.isOpen === true && (!day.openTime || !day.closeTime)) {
        return { ...day, display: closedText }
      }

      // If not open, show as closed
      if (day.isOpen === false) {
        return { ...day, display: closedText }
      }

      // Default to closed
      return { ...day, display: closedText }
    })
  }

  const formattedHours = formatWorkingHours(workingHours)

  return (
    <section id={sectionId} className="location-block">
      <div className="location-block__container">
        {/* Map Section - 60% */}
        <div className="location-block__map">
          <div ref={mapRef} className="location-block__map-container" />
        </div>

        {/* Content Section - 40% */}
        <div className="location-block__content">
          <div className="location-block__info">
            <h2 className="location-block__title">{title}</h2>

            {description && <p className="location-block__description">{description}</p>}

            <div className="location-block__address">
              <h3 className="location-block__address-title">{getTranslation('address', locale)}</h3>
              <p className="location-block__address-text">{address}</p>
            </div>

            <div className="location-block__hours">
              <h3 className="location-block__hours-title">
                {getTranslation('workingHours', locale)}
              </h3>
              <div className="location-block__hours-list">
                {formattedHours && formattedHours.length > 0 ? (
                  formattedHours.map((day, index) => {
                    // Ensure we have valid data
                    const dayName = day?.day ? getDayTranslation(day.day) : `Day ${index + 1}`
                    const displayTime = day?.display || getTranslation('closed', locale)

                    return (
                      <div key={index} className="location-block__hours-item">
                        <span className="location-block__hours-day">{dayName}</span>
                        <span className="location-block__hours-time">{displayTime}</span>
                      </div>
                    )
                  })
                ) : (
                  <div className="location-block__hours-item">
                    <span className="location-block__hours-day">No hours available</span>
                    <span className="location-block__hours-time">-</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
