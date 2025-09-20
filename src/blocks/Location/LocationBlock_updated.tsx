'use client'

import React, { useEffect, useRef } from 'react'
import './Location.scss'

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
  photo?: {
    url: string
    alt?: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  workingHours: WorkingHours[]
  sectionId?: string
}

export const LocationBlock: React.FC<Props> = ({
  title,
  description,
  address,
  photo,
  coordinates,
  workingHours,
  sectionId,
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

    console.log('LocationBlock: Initializing map with coordinates:', coordinates)

    // Validate coordinates before proceeding
    if (!validateCoordinates(coordinates.lat, coordinates.lng)) {
      console.error('LocationBlock: Invalid coordinates provided:', coordinates)
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
        console.log('LocationBlock: Creating Google Maps instance')
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
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
        })

        // Add circular pin marker
        const marker = new (window as any).google.maps.Marker({
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

        // Add info window with photo
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 0; font-family: Arial, sans-serif; max-width: 300px;">
              ${
                photo
                  ? `
                <div style="width: 100%; height: 150px; overflow: hidden; border-radius: 8px 8px 0 0;">
                  <img src="${photo.url}" alt="${photo.alt || title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              `
                  : ''
              }
              <div style="padding: 12px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">${title}</h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">${address}</p>
                ${description ? `<p style="margin: 0; color: #888; font-size: 13px; line-height: 1.3;">${description}</p>` : ''}
              </div>
            </div>
          `,
          disableAutoPan: false,
        })

        // Add click listener to marker
        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        // Open info window by default
        infoWindow.open(map, marker)

        console.log('LocationBlock: Marker created at coordinates:', {
          lat: coordinates.lat,
          lng: coordinates.lng,
          title: title,
          address: address,
        })
      } catch (error) {
        console.error('Error initializing Google Maps:', error)
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
      console.log('LocationBlock: Google Maps not loaded, API key:', apiKey ? 'Present' : 'Missing')

      if (!apiKey) {
        console.warn(
          'Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.',
        )
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
        console.log('LocationBlock: Google Maps script loaded successfully')
        initMap()
      }
      script.onerror = () => {
        console.error('LocationBlock: Failed to load Google Maps script, falling back to embed')
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
      console.log('LocationBlock: Google Maps script added to document head')
    } else {
      console.log('LocationBlock: Google Maps already loaded, initializing map')
      initMap()
    }
  }, [coordinates.lat, coordinates.lng, title, address, photo, description])

  const formatWorkingHours = (hours: WorkingHours[]) => {
    return hours.map((day) => {
      if (day.isClosed) {
        return { ...day, display: 'Closed' }
      }
      if (day.isOpen && day.openTime && day.closeTime) {
        return { ...day, display: `${day.openTime} - ${day.closeTime}` }
      }
      return { ...day, display: 'Closed' }
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
              <h3 className="location-block__address-title">Address</h3>
              <p className="location-block__address-text">{address}</p>
            </div>

            <div className="location-block__hours">
              <h3 className="location-block__hours-title">Working Hours</h3>
              <div className="location-block__hours-list">
                {formattedHours.map((day, index) => (
                  <div key={index} className="location-block__hours-item">
                    <span className="location-block__hours-day">
                      {day.day.charAt(0).toUpperCase() + day.day.slice(1)}
                    </span>
                    <span className="location-block__hours-time">{day.display}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
