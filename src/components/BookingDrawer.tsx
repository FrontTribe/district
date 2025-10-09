'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mail, Phone, CreditCard } from 'lucide-react'
import flatpickr from 'flatpickr'
import { Croatian } from 'flatpickr/dist/l10n/hr.js'
import {
  processRentlioBookingData,
  BookingPricingData,
  fetchUnitTypeRestrictions,
  fetchUnitCapacityRestrictions,
  UnitCapacityRestriction,
} from '@/utils/rentlioBooking'
import './BookingDrawer.scss'
import 'flatpickr/dist/flatpickr.min.css'

interface RoomData {
  title: string
  description?: string
  rentlioUnitTypeId?: string
  image?: any
  badges?: Array<{ text?: string }>
}

interface BookingDrawerProps {
  isOpen: boolean
  onClose: () => void
  roomData: RoomData | null
  locale?: string
}

interface BookingFormData {
  // Date Selection
  checkIn: string
  checkOut: string

  // Booker Details
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  arrivalTime: string
  message: string

  // Guest Details
  persons: number
  rooms: number
  adults: number
  children: Array<{ age: number }>

  // Payment Details
  cardholderSameAsBooker: boolean
  cardholderName: string
  cardNumber: string
  cvv: string
  expiryDate: string
  acceptTerms: boolean
}

const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  roomData,
  locale = 'hr',
}) => {
  console.log('🚀 BookingDrawer rendered:', { isOpen, roomData, locale })

  // Translation function for frontend
  const t = (key: string, fallback: string = key) => {
    const translations: Record<string, Record<string, string>> = {
      hr: {
        // Main sections
        'Reservation Details': 'Detalji rezervacije',
        'Booker Details': 'Detalji bookera',
        'Reservation Confirmation': 'Potvrda rezervacije',
        Reservation: 'Rezervacija',

        // Date picker
        'Select dates': 'Odaberite datume',
        'Select check-in and check-out dates': 'Odaberite datume prijave i odjave',
        'Checking availability...': 'Provjeravam dostupnost...',

        // Selected dates
        'Selected dates': 'Odabrani datumi',
        Available: 'Dostupno',
        Unavailable: 'Nedostupno',
        'Check-in': 'Prijava',
        'Check-out': 'Odjava',

        // Pricing
        Accommodation: 'Smještaj',
        Total: 'Ukupno',
        'TOTAL PRICE': 'UKUPNA CIJENA',
        'per night': 'po noći',

        // Policies
        'Cancellation Policy:': 'Otkazna politika:',
        'Payment Dynamics:': 'Dinamika naplate:',
        'No show:': 'No show:',
        'You cannot cancel the reservation without charge. You will be charged':
          'Ne možete otkazati rezervaciju bez naknade. Naplatit će vam se',
        'EUR if you cancel at any time.': 'EUR ako otkažete u bilo kojem trenutku.',
        'After confirming the reservation,': 'Nakon potvrde rezervacije naplatit će se',
        'EUR will be charged.': 'EUR.',
        'In case of no-show, you will be charged': 'U slučaju nedolaska naplatit će vam se',
        EUR: 'EUR',

        // Tax info
        'VAT (13%) for accommodation is included in the price':
          'PDV (13%) za smještaj je uključen u cijenu',
        'VAT for services is included in the price': 'PDV za usluge je uključeno u cijenu',
        'Exchange rate:': 'Tečaj:',
        '1 EUR =': '1 EUR =',

        // Form fields
        'FIRST NAME': 'IME',
        'LAST NAME': 'PREZIME',
        'E-MAIL': 'E-MAIL',
        PHONE: 'TELEFON',
        COUNTRY: 'ZEMLJA',
        'Select country': 'Odaberite zemlju',
        'EXPECTED ARRIVAL TIME': 'PREDVIĐENO VRIJEME DOLASKA',
        'Select option': 'Odaberite stavku',
        MESSAGE: 'PORUKA',

        // Guest details
        'GUEST DETAILS': 'DETALJI GOSTIJU',
        'Number of persons': 'Broj osoba',
        'Number of rooms': 'Broj soba',
        Adults: 'Odrasli',
        Children: 'Djeca',
        'Add child': 'Dodaj dijete',
        'Remove child': 'Ukloni dijete',
        'Child age': 'Dob djeteta',

        // Payment
        'Cardholder same as booker': 'Vlasnik kartice isti kao i booker',
        CARDHOLDER: 'VLASNIK KARTICE',
        Cardholder: 'Vlasnik kartice',
        'CARD NUMBER': 'BROJ KARTICE',
        'Card number': 'Broj kartice',
        CVV: 'CVV',
        '123': '123',
        'CARD EXPIRY DATE': 'DATUM ISTEKA KARTICE',
        '10/25': '10/25',

        // Buttons
        RESERVE: 'REZERVIRAJ',
        'RESERVING...': 'REZERVIRANJE...',

        // Terms
        'I accept': 'Prihvaćam',
        'Terms of Use': 'Pravila korištenja',
        and: 'i',
        'Privacy Policy': 'Politika privatnosti',

        // Disclaimer
        'Your card will not be charged immediately. The property owner will charge your card according to the property conditions.':
          'Vaša kartica neće biti odmah terećena. Vlasnik objekta će teretiti vašu karticu sukladno s uvjetima objekta.',

        // Messages
        'Please select check-in and check-out dates to see prices':
          'Molimo odaberite datume prijave i odjave da biste vidjeli cijene',
        'Please enter cardholder name.': 'Molimo unesite ime vlasnika kartice.',

        // Warnings
        'Unavailable dates:': 'Nedostupni datumi:',
        'Closed to arrival:': 'Zatvoreno za dolazak:',
        'Closed to departure:': 'Zatvoreno za odlazak:',
        'Minimum stay requirement: {minStay} nights for selected dates':
          'Minimalni boravak: {minStay} noći za odabrane datume',
        'Not enough rooms: {persons} guests require at least {rooms} rooms':
          'Nedovoljno soba: {persons} gostiju zahtijeva najmanje {rooms} soba',
        'Unit accommodates maximum {maxOccupancy} people. Current selection: {currentGuests}':
          'Jedinica prima maksimalno {maxOccupancy} osoba. Trenutni odabir: {currentGuests}',
        'Maximum {maxAdults} adults allowed. Current selection: {currentAdults}':
          'Maksimalno {maxAdults} odraslih dozvoljeno. Trenutni odabir: {currentAdults}',
        'Maximum {maxChildren} children allowed. Current selection: {currentChildren}':
          'Maksimalno {maxChildren} djece dozvoljeno. Trenutni odabir: {currentChildren}',

        // Capacity display
        'Unit Capacity': 'Kapacitet jedinice',
        'Maximum Occupancy': 'Maksimalni kapacitet',
        'Maximum Adults': 'Maksimalno odraslih',
        'Maximum Children': 'Maksimalno djece',
        people: 'osoba',

        // Additional
        from: 'od',
        '€': '€',
        HRK: 'HRK',
        '→': '→',
        '✓': '✓',
        '✗': '✗',
        '⚠️': '⚠️',
        '≈': '≈',
      },
      en: {
        // Main sections
        'Reservation Details': 'Reservation Details',
        'Booker Details': 'Booker Details',
        'Reservation Confirmation': 'Reservation Confirmation',
        Reservation: 'Reservation',

        // Date picker
        'Select dates': 'Select dates',
        'Select check-in and check-out dates': 'Select check-in and check-out dates',
        'Checking availability...': 'Checking availability...',

        // Selected dates
        'Selected dates': 'Selected dates',
        Available: 'Available',
        Unavailable: 'Unavailable',
        'Check-in': 'Check-in',
        'Check-out': 'Check-out',

        // Pricing
        Accommodation: 'Accommodation',
        Total: 'Total',
        'TOTAL PRICE': 'TOTAL PRICE',
        'per night': 'per night',

        // Policies
        'Cancellation Policy:': 'Cancellation Policy:',
        'Payment Dynamics:': 'Payment Dynamics:',
        'No show:': 'No show:',
        'You cannot cancel the reservation without charge. You will be charged':
          'You cannot cancel the reservation without charge. You will be charged',
        'EUR if you cancel at any time.': 'EUR if you cancel at any time.',
        'After confirming the reservation,': 'After confirming the reservation,',
        'EUR will be charged.': 'EUR will be charged.',
        'In case of no-show, you will be charged': 'In case of no-show, you will be charged',
        EUR: 'EUR',

        // Tax info
        'VAT (13%) for accommodation is included in the price':
          'VAT (13%) for accommodation is included in the price',
        'VAT for services is included in the price': 'VAT for services is included in the price',
        'Exchange rate:': 'Exchange rate:',
        '1 EUR =': '1 EUR =',

        // Form fields
        'FIRST NAME': 'FIRST NAME',
        'LAST NAME': 'LAST NAME',
        'E-MAIL': 'E-MAIL',
        PHONE: 'PHONE',
        COUNTRY: 'COUNTRY',
        'Select country': 'Select country',
        'EXPECTED ARRIVAL TIME': 'EXPECTED ARRIVAL TIME',
        'Select option': 'Select option',
        MESSAGE: 'MESSAGE',

        // Guest details
        'GUEST DETAILS': 'GUEST DETAILS',
        'Number of persons': 'Number of persons',
        'Number of rooms': 'Number of rooms',
        Adults: 'Adults',
        Children: 'Children',
        'Add child': 'Add child',
        'Remove child': 'Remove child',
        'Child age': 'Child age',

        // Payment
        'Cardholder same as booker': 'Cardholder same as booker',
        CARDHOLDER: 'CARDHOLDER',
        Cardholder: 'Cardholder',
        'CARD NUMBER': 'CARD NUMBER',
        'Card number': 'Card number',
        CVV: 'CVV',
        '123': '123',
        'CARD EXPIRY DATE': 'CARD EXPIRY DATE',
        '10/25': '10/25',

        // Buttons
        RESERVE: 'RESERVE',
        'RESERVING...': 'RESERVING...',

        // Terms
        'I accept': 'I accept',
        'Terms of Use': 'Terms of Use',
        and: 'and',
        'Privacy Policy': 'Privacy Policy',

        // Disclaimer
        'Your card will not be charged immediately. The property owner will charge your card according to the property conditions.':
          'Your card will not be charged immediately. The property owner will charge your card according to the property conditions.',

        // Messages
        'Please select check-in and check-out dates to see prices':
          'Please select check-in and check-out dates to see prices',
        'Please enter cardholder name.': 'Please enter cardholder name.',

        // Warnings
        'Unavailable dates:': 'Unavailable dates:',
        'Closed to arrival:': 'Closed to arrival:',
        'Closed to departure:': 'Closed to departure:',
        'Minimum stay requirement: {minStay} nights for selected dates':
          'Minimum stay requirement: {minStay} nights for selected dates',
        'Not enough rooms: {persons} guests require at least {rooms} rooms':
          'Not enough rooms: {persons} guests require at least {rooms} rooms',
        'Unit accommodates maximum {maxOccupancy} people. Current selection: {currentGuests}':
          'Unit accommodates maximum {maxOccupancy} people. Current selection: {currentGuests}',
        'Maximum {maxAdults} adults allowed. Current selection: {currentAdults}':
          'Maximum {maxAdults} adults allowed. Current selection: {currentAdults}',
        'Maximum {maxChildren} children allowed. Current selection: {currentChildren}':
          'Maximum {maxChildren} children allowed. Current selection: {currentChildren}',

        // Additional
        from: 'from',
        '€': '€',
        HRK: 'HRK',
        '→': '→',
        '✓': '✓',
        '✗': '✗',
        '⚠️': '⚠️',
        '≈': '≈',
      },
      de: {
        // Main sections
        'Reservation Details': 'Reservierungsdetails',
        'Booker Details': 'Buchungsdetails',
        'Reservation Confirmation': 'Reservierungsbestätigung',
        Reservation: 'Reservierung',

        // Date picker
        'Select dates': 'Daten auswählen',
        'Select check-in and check-out dates': 'Check-in und Check-out Daten auswählen',
        'Checking availability...': 'Verfügbarkeit wird überprüft...',

        // Selected dates
        'Selected dates': 'Ausgewählte Daten',
        Available: 'Verfügbar',
        Unavailable: 'Nicht verfügbar',
        'Check-in': 'Check-in',
        'Check-out': 'Check-out',

        // Pricing
        Accommodation: 'Unterkunft',
        Total: 'Gesamt',
        'TOTAL PRICE': 'GESAMTPREIS',
        'per night': 'pro Nacht',

        // Policies
        'Cancellation Policy:': 'Stornierungsrichtlinie:',
        'Payment Dynamics:': 'Zahlungsdynamik:',
        'No show:': 'No show:',
        'You cannot cancel the reservation without charge. You will be charged':
          'Sie können die Reservierung nicht kostenlos stornieren. Ihnen werden',
        'EUR if you cancel at any time.': 'EUR berechnet, wenn Sie jederzeit stornieren.',
        'After confirming the reservation,': 'Nach Bestätigung der Reservierung werden',
        'EUR will be charged.': 'EUR berechnet.',
        'In case of no-show, you will be charged': 'Bei Nichterscheinen werden Ihnen',
        EUR: 'EUR',

        // Tax info
        'VAT (13%) for accommodation is included in the price':
          'MwSt (13%) für Unterkunft ist im Preis enthalten',
        'VAT for services is included in the price':
          'MwSt für Dienstleistungen ist im Preis enthalten',
        'Exchange rate:': 'Wechselkurs:',
        '1 EUR =': '1 EUR =',

        // Form fields
        'FIRST NAME': 'VORNAME',
        'LAST NAME': 'NACHNAME',
        'E-MAIL': 'E-MAIL',
        PHONE: 'TELEFON',
        COUNTRY: 'LAND',
        'Select country': 'Land auswählen',
        'EXPECTED ARRIVAL TIME': 'ERWARTETE ANKUNFTSZEIT',
        'Select option': 'Option auswählen',
        MESSAGE: 'NACHRICHT',

        // Guest details
        'GUEST DETAILS': 'GASTDETAILS',
        'Number of persons': 'Anzahl der Personen',
        'Number of rooms': 'Anzahl der Zimmer',
        Adults: 'Erwachsene',
        Children: 'Kinder',
        'Add child': 'Kind hinzufügen',
        'Remove child': 'Kind entfernen',
        'Child age': 'Alter des Kindes',

        // Payment
        'Cardholder same as booker': 'Karteninhaber ist derselbe wie Buchungsinhaber',
        CARDHOLDER: 'KARTENINHABER',
        Cardholder: 'Karteninhaber',
        'CARD NUMBER': 'KARTENNUMMER',
        'Card number': 'Kartennummer',
        CVV: 'CVV',
        '123': '123',
        'CARD EXPIRY DATE': 'KARTENABLAUFDATUM',
        '10/25': '10/25',

        // Buttons
        RESERVE: 'RESERVIEREN',
        'RESERVING...': 'RESERVIERUNG...',

        // Terms
        'I accept': 'Ich akzeptiere',
        'Terms of Use': 'Nutzungsbedingungen',
        and: 'und',
        'Privacy Policy': 'Datenschutzrichtlinie',

        // Disclaimer
        'Your card will not be charged immediately. The property owner will charge your card according to the property conditions.':
          'Ihre Karte wird nicht sofort belastet. Der Immobilienbesitzer wird Ihre Karte gemäß den Immobilienbedingungen belasten.',

        // Messages
        'Please select check-in and check-out dates to see prices':
          'Bitte wählen Sie Check-in und Check-out Daten aus, um Preise zu sehen',
        'Please enter cardholder name.': 'Bitte geben Sie den Namen des Karteninhabers ein.',

        // Warnings
        'Unavailable dates:': 'Nicht verfügbare Daten:',
        'Closed to arrival:': 'Geschlossen für Ankunft:',
        'Closed to departure:': 'Geschlossen für Abreise:',
        'Minimum stay requirement: {minStay} nights for selected dates':
          'Mindestaufenthalt: {minStay} Nächte für ausgewählte Daten',
        'Not enough rooms: {persons} guests require at least {rooms} rooms':
          'Nicht genügend Zimmer: {persons} Gäste benötigen mindestens {rooms} Zimmer',
        'Unit accommodates maximum {maxOccupancy} people. Current selection: {currentGuests}':
          'Einheit beherbergt maximal {maxOccupancy} Personen. Aktuelle Auswahl: {currentGuests}',
        'Maximum {maxAdults} adults allowed. Current selection: {currentAdults}':
          'Maximal {maxAdults} Erwachsene erlaubt. Aktuelle Auswahl: {currentAdults}',
        'Maximum {maxChildren} children allowed. Current selection: {currentChildren}':
          'Maximal {maxChildren} Kinder erlaubt. Aktuelle Auswahl: {currentChildren}',

        // Additional
        from: 'ab',
        '€': '€',
        HRK: 'HRK',
        '→': '→',
        '✓': '✓',
        '✗': '✗',
        '⚠️': '⚠️',
        '≈': '≈',
      },
    }

    return translations[locale]?.[key] || translations['hr']?.[key] || fallback
  }

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: '',
    checkOut: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    arrivalTime: '',
    message: '',
    persons: 1,
    rooms: 1,
    adults: 1,
    children: [],
    cardholderSameAsBooker: true,
    cardholderName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    acceptTerms: false,
  })

  const checkInRef = useRef<HTMLInputElement>(null)
  const checkInPickerRef = useRef<flatpickr.Instance | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pricingData, setPricingData] = useState<BookingPricingData | null>(null)
  const [restrictions, setRestrictions] = useState<Array<{ date: string; minStay: number }>>([])
  const [restrictionsWarning, setRestrictionsWarning] = useState<string>('')
  const [capacityRestrictions, setCapacityRestrictions] = useState<UnitCapacityRestriction | null>(
    null,
  )
  const [_isLoadingPricing, setIsLoadingPricing] = useState(false)
  const [_pricingError, setPricingError] = useState<string | null>(null)

  const rentlioApiKey = process.env.NEXT_PUBLIC_RENTLIO_API_KEY || ''
  console.log('🔑 API Key check:', {
    hasApiKey: !!rentlioApiKey,
    keyLength: rentlioApiKey?.length,
    keyPreview: rentlioApiKey ? `${rentlioApiKey.substring(0, 8)}...` : 'No key',
  })

  // Prevent body scroll when drawer is open using Lenis-compatible method
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY

      // Completely disable Lenis smooth scrolling
      const lenisInstance = (window as any).lenis
      if (lenisInstance) {
        lenisInstance.destroy()
      }

      // Disable body scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString())
    } else {
      // Get stored scroll position
      const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0')

      // Restore body styles
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''

      // Re-enable Lenis smooth scrolling
      const lenisInstance = (window as any).lenis
      if (lenisInstance) {
        lenisInstance.start()
      }

      // Restore scroll position after a brief delay to let Lenis initialize
      setTimeout(() => {
        window.scrollTo(0, scrollY)
      }, 50)
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.removeAttribute('data-scroll-y')

      // Re-enable Lenis on cleanup
      const lenisInstance = (window as any).lenis
      if (lenisInstance) {
        lenisInstance.start()
      }
    }
  }, [isOpen])

  // Initialize Flatpickr range picker
  useEffect(() => {
    if (isOpen && checkInRef.current) {
      // Initialize range picker on check-in input
      if (!checkInPickerRef.current) {
        checkInPickerRef.current = flatpickr(checkInRef.current, {
          locale: Croatian,
          mode: 'range',
          dateFormat: 'd.m.Y',
          minDate: 'today',
          showMonths: 2,
          static: true,
          inline: true,
          onChange: (selectedDates) => {
            console.log('📅 Flatpickr onChange triggered:', selectedDates)

            if (selectedDates.length === 2) {
              const [startDate, endDate] = selectedDates
              // Format dates correctly to avoid timezone issues
              const startFormatted = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
              const endFormatted = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

              console.log('📅 Selected date range:', { startFormatted, endFormatted })

              setFormData((prev) => ({
                ...prev,
                checkIn: startFormatted,
                checkOut: endFormatted,
              }))
            } else if (selectedDates.length === 1) {
              const startDate = selectedDates[0]
              const startFormatted = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`

              console.log('📅 Selected single date:', { startFormatted })

              setFormData((prev) => ({
                ...prev,
                checkIn: startFormatted,
                checkOut: '',
              }))
            }
          },
        })
      }
    }

    return () => {
      if (checkInPickerRef.current) {
        checkInPickerRef.current.destroy()
        checkInPickerRef.current = null
      }
    }
  }, [isOpen])

  // Fetch pricing data when dates change
  useEffect(() => {
    console.log('🔄 useEffect triggered:', {
      isOpen,
      hasRoomData: !!roomData,
      hasUnitTypeId: !!roomData?.rentlioUnitTypeId,
      hasApiKey: !!rentlioApiKey,
      hasCheckIn: !!formData.checkIn,
      hasCheckOut: !!formData.checkOut,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    })

    console.log('🔍 Detailed check:', {
      isOpen: isOpen,
      'roomData exists': !!roomData,
      rentlioUnitTypeId: roomData?.rentlioUnitTypeId,
      'apiKey length': rentlioApiKey?.length,
      'checkIn value': formData.checkIn,
      'checkOut value': formData.checkOut,
    })

    // Check each condition separately
    const conditions = {
      isOpen: isOpen,
      hasRoomData: !!roomData,
      hasUnitTypeId: !!roomData?.rentlioUnitTypeId,
      hasCheckIn: !!formData.checkIn,
      hasCheckOut: !!formData.checkOut,
    }

    console.log('✅ Conditions check:', conditions)

    if (isOpen && roomData?.rentlioUnitTypeId && formData.checkIn && formData.checkOut) {
      console.log('🏨 Room Object:', roomData)
      console.log('📅 Selected Dates:', { checkIn: formData.checkIn, checkOut: formData.checkOut })
      console.log('🔑 API Key:', rentlioApiKey ? 'Present' : 'Missing')
      console.log('🏷️ Unit Type ID:', roomData.rentlioUnitTypeId)
      console.log('🔍 All room data keys:', Object.keys(roomData || {}))

      setIsLoadingPricing(true)
      setPricingError(null)

      // Fetch pricing and restrictions in parallel
      Promise.all([
        processRentlioBookingData(roomData.rentlioUnitTypeId, formData.checkIn, formData.checkOut),
        fetchUnitTypeRestrictions(roomData.rentlioUnitTypeId, formData.checkIn, formData.checkOut),
      ])
        .then(([pricingData, restrictionsData]) => {
          console.log('💰 Pricing Data Result:', pricingData)
          console.log('🚫 Restrictions Data Result:', restrictionsData)

          setPricingData(pricingData)
          setRestrictions(restrictionsData)

          // Validate minimum stay requirements
          const checkInDate = new Date(formData.checkIn)
          const checkOutDate = new Date(formData.checkOut)
          const nights = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
          )

          const maxMinStay = Math.max(...restrictionsData.map((r) => r.minStay), 1)

          if (nights < maxMinStay) {
            const warningText = translations.minimumStayWarning.replace(
              '{minStay}',
              maxMinStay.toString(),
            )
            setRestrictionsWarning(warningText)
          } else {
            setRestrictionsWarning('')
          }
        })
        .catch((error) => {
          console.error('❌ Error fetching pricing or restrictions data:', error)
          setPricingError('Failed to load pricing information')
          setRestrictions([])
          setRestrictionsWarning('')

          // Fallback to mock data
          setPricingData({
            checkIn: '1 prosinac',
            checkInDay: 'ponedjeljak',
            checkOut: '3 prosinac',
            checkOutDay: 'srijeda',
            accommodationPrice: 240.0,
            accommodationPricePerNight: 120.0,
            servicesPrice: 0.0,
            totalPrice: 240.0,
            totalPriceHRK: 1808.28,
            exchangeRate: 7.5345,
            checkInTime: '15:00 - 21:00',
            checkOutTime: '6:00 - 11:00',
            minStay: 1,
            maxStay: 30,
            nights: 2,
            isAvailable: true,
            closedToArrival: false,
            closedToDeparture: false,
          })
        })
        .finally(() => {
          setIsLoadingPricing(false)
        })
    } else {
      console.log(
        '❌ API call not triggered. Missing conditions:',
        Object.entries(conditions).filter(([key, value]) => !value),
      )
    }
  }, [isOpen, roomData, formData.checkIn, formData.checkOut])

  // Create fallback pricing data from selected dates
  const createFallbackPricingData = (checkIn: string, checkOut: string): BookingPricingData => {
    // Parse dates correctly to avoid timezone issues
    const parseDate = (dateString: string) => {
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day) // month is 0-indexed
    }

    const checkInDate = parseDate(checkIn)
    const checkOutDate = parseDate(checkOut)

    const months = [
      'siječanj',
      'veljača',
      'ožujak',
      'travanj',
      'svibanj',
      'lipanj',
      'srpanj',
      'kolovoz',
      'rujan',
      'listopad',
      'studeni',
      'prosinac',
    ]

    const days = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota']

    const formatDate = (date: Date) => {
      const day = date.getDate()
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      const dayOfWeek = days[date.getDay()]
      return {
        date: `${day} ${month}, ${year}`,
        day: dayOfWeek,
      }
    }

    const checkInFormatted = formatDate(checkInDate)
    const checkOutFormatted = formatDate(checkOutDate)

    return {
      checkIn: checkInFormatted.date,
      checkInDay: checkInFormatted.day,
      checkOut: checkOutFormatted.date,
      checkOutDay: checkOutFormatted.day,
      accommodationPrice: 0,
      accommodationPricePerNight: 0,
      servicesPrice: 0,
      totalPrice: 0,
      totalPriceHRK: 0,
      exchangeRate: 7.5345,
      checkInTime: '15:00 - 21:00',
      checkOutTime: '6:00 - 11:00',
      minStay: 1,
      maxStay: 30,
      nights: 0,
      isAvailable: false,
      closedToArrival: false,
      closedToDeparture: false,
    }
  }

  const currentPricingData =
    pricingData ||
    (formData.checkIn && formData.checkOut
      ? createFallbackPricingData(formData.checkIn, formData.checkOut)
      : null)

  // Translation keys
  const translations = {
    // Main sections
    reservationDetails: t('Reservation Details'),
    bookerDetails: t('Booker Details'),
    reservationConfirmation: t('Reservation Confirmation'),

    // Date picker
    selectDates: t('Select dates'),
    selectCheckInOutDates: t('Select check-in and check-out dates'),
    checkingAvailability: t('Checking availability...'),

    // Selected dates
    selectedDates: t('Selected dates'),
    available: t('Available'),
    unavailable: t('Unavailable'),
    checkIn: t('Check-in'),
    checkOut: t('Check-out'),

    // Pricing
    accommodation: t('Accommodation'),
    total: t('Total'),
    totalPrice: t('TOTAL PRICE'),
    pricePerNight: t('per night'),

    // Policies
    cancellationPolicy: t('Cancellation Policy:'),
    paymentDynamics: t('Payment Dynamics:'),
    noShow: t('No show:'),
    cannotCancel: t('You cannot cancel the reservation without charge. You will be charged'),
    ifCancel: t('EUR if you cancel at any time.'),
    afterConfirmation: t('After confirming the reservation,'),
    willBeCharged: t('EUR will be charged.'),
    inCaseOfNoShow: t('In case of no-show, you will be charged'),
    eur: t('EUR'),

    // Tax info
    vatIncluded: t('VAT (13%) for accommodation is included in the price'),
    vatServicesIncluded: t('VAT for services is included in the price'),
    exchangeRate: t('Exchange rate:'),
    eurToHrk: t('1 EUR ='),

    // Form fields
    firstName: t('FIRST NAME'),
    lastName: t('LAST NAME'),
    email: t('E-MAIL'),
    phone: t('PHONE'),
    country: t('COUNTRY'),
    selectCountry: t('Select country'),
    arrivalTime: t('EXPECTED ARRIVAL TIME'),
    selectOption: t('Select option'),
    message: t('MESSAGE'),

    // Guest details
    guestDetails: t('GUEST DETAILS'),
    numberOfPersons: t('Number of persons'),
    numberOfRooms: t('Number of rooms'),
    adults: t('Adults'),
    children: t('Children'),
    addChild: t('Add child'),
    removeChild: t('Remove child'),
    childAge: t('Child age'),

    // Payment
    cardholderSame: t('Cardholder same as booker'),
    cardholderName: t('CARDHOLDER'),
    cardholderPlaceholder: t('Cardholder'),
    cardNumber: t('CARD NUMBER'),
    cardNumberPlaceholder: t('Card number'),
    cvv: t('CVV'),
    cvvPlaceholder: t('123'),
    expiryDate: t('CARD EXPIRY DATE'),
    expiryPlaceholder: t('10/25'),

    // Buttons
    reserve: t('RESERVE'),
    reserving: t('RESERVING...'),

    // Terms
    acceptTerms: t('I accept'),
    termsOfUse: t('Terms of Use'),
    and: t('and'),
    privacyPolicy: t('Privacy Policy'),

    // Disclaimer
    cardNotCharged: t(
      'Your card will not be charged immediately. The property owner will charge your card according to the property conditions.',
    ),

    // Messages
    pleaseSelectDates: t('Please select check-in and check-out dates to see prices'),
    enterCardholderName: t('Please enter cardholder name.'),

    // Warnings
    unavailableDates: t('Unavailable dates:'),
    closedToArrival: t('Closed to arrival:'),
    closedToDeparture: t('Closed to departure:'),
    minimumStayWarning: t('Minimum stay requirement: {minStay} nights for selected dates'),
    roomCapacityWarning: t('Not enough rooms: {persons} guests require at least {rooms} rooms'),
    unitCapacityWarning: t(
      'Unit accommodates maximum {maxOccupancy} people. Current selection: {currentGuests}',
    ),
    adultCapacityWarning: t(
      'Maximum {maxAdults} adults allowed. Current selection: {currentAdults}',
    ),
    childrenCapacityWarning: t(
      'Maximum {maxChildren} children allowed. Current selection: {currentChildren}',
    ),

    // Additional
    from: t('from'),
    reservation: t('Reservation'),
    euro: t('€'),
    hrk: t('HRK'),
    arrow: t('→'),
    checkmark: t('✓'),
    cross: t('✗'),
    warning: t('⚠️'),
    approximately: t('≈'),
  }

  const countries = [
    'Afganistan',
    'Albanija',
    'Alžir',
    'Andora',
    'Angola',
    'Antigva i Barbuda',
    'Argentina',
    'Armenija',
    'Australija',
    'Austrija',
    'Azerbajdžan',
    'Bahami',
    'Bahrein',
    'Bangladeš',
    'Barbados',
    'Belarus',
    'Belgija',
    'Belize',
    'Benin',
    'Bermuda',
    'Bocvana',
    'Bolivija',
    'Bosna i Hercegovina',
    'Brazil',
    'Brunei',
    'Bugarska',
    'Burkina Faso',
    'Burundi',
    'Butan',
    'Cabo Verde',
    'Čad',
    'Čile',
    'Kina',
    'Kolumbija',
    'Komori',
    'Kongo',
    'Kostarika',
    'Hrvatska',
    'Kuba',
    'Cipar',
    'Češka',
    'Demokratska Republika Kongo',
    'Danska',
    'Džibuti',
    'Dominika',
    'Dominikanska Republika',
    'Ekvador',
    'Egipat',
    'Ekvatorska Gvineja',
    'Eritreja',
    'Estonija',
    'Etiopija',
    'Fidži',
    'Finska',
    'Francuska',
    'Gabon',
    'Gambija',
    'Gruzija',
    'Njemačka',
    'Gana',
    'Grčka',
    'Grenada',
    'Gvatemala',
    'Gvineja',
    'Gvineja-Bissau',
    'Gvajana',
    'Haiti',
    'Honduras',
    'Mađarska',
    'Island',
    'Indija',
    'Indonezija',
    'Iran',
    'Irak',
    'Irska',
    'Izrael',
    'Italija',
    'Jamajka',
    'Japan',
    'Jordan',
    'Kazahstan',
    'Kenija',
    'Kiribati',
    'Kuvajt',
    'Kirgistan',
    'Laos',
    'Latvija',
    'Libanon',
    'Lesoto',
    'Liberija',
    'Libija',
    'Lihtenštajn',
    'Litva',
    'Luksemburg',
    'Madagaskar',
    'Malavi',
    'Malezija',
    'Maldivi',
    'Mali',
    'Malta',
    'Maršalovi Otoci',
    'Mauritanija',
    'Mauricijus',
    'Meksiko',
    'Mikronezija',
    'Moldavija',
    'Monako',
    'Mongolija',
    'Crna Gora',
    'Maroko',
    'Mozambik',
    'Mjanmar',
    'Namibija',
    'Nauru',
    'Nepal',
    'Nizozemska',
    'Novi Zeland',
    'Nikaragva',
    'Niger',
    'Nigerija',
    'Sjeverna Koreja',
    'Sjeverna Makedonija',
    'Norveška',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestina',
    'Panama',
    'Papua Nova Gvineja',
    'Paragvaj',
    'Peru',
    'Filipini',
    'Poljska',
    'Portugal',
    'Katar',
    'Rumunjska',
    'Rusija',
    'Ruanda',
    'Sveti Kristofor i Nevis',
    'Sveta Lucija',
    'Sveti Vincent i Grenadini',
    'Samoa',
    'San Marino',
    'Sao Tome i Principe',
    'Saudijska Arabija',
    'Senegal',
    'Srbija',
    'Sejšeli',
    'Sijera Leone',
    'Singapur',
    'Slovačka',
    'Slovenija',
    'Salomonski Otoci',
    'Somalija',
    'Južna Afrika',
    'Južna Koreja',
    'Južni Sudan',
    'Španjolska',
    'Šri Lanka',
    'Sudan',
    'Surinam',
    'Švedska',
    'Švicarska',
    'Sirija',
    'Tajvan',
    'Tadžikistan',
    'Tanzanija',
    'Tajland',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad i Tobago',
    'Tunis',
    'Turska',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukrajina',
    'Ujedinjeni Arapski Emirati',
    'Ujedinjeno Kraljevstvo',
    'Sjedinjene Američke Države',
    'Urugvaj',
    'Uzbekistan',
    'Vanuatu',
    'Vatikan',
    'Venezuela',
    'Vijetnam',
    'Jemen',
    'Zambija',
    'Zimbabve',
  ]

  const arrivalTimes = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]

  const handleInputChange = (field: keyof BookingFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Function to validate minimum stay requirements and guest capacity
  const validateMinimumStay = async (checkIn: string, checkOut: string) => {
    if (!roomData?.rentlioUnitTypeId || !checkIn || !checkOut) {
      setRestrictionsWarning('')
      return
    }

    try {
      // Fetch both restrictions and capacity data
      const [restrictionsData, capacityData] = await Promise.all([
        fetchUnitTypeRestrictions(roomData.rentlioUnitTypeId, checkIn, checkOut),
        capacityRestrictions || fetchUnitCapacityRestrictions(roomData.rentlioUnitTypeId),
      ])

      setRestrictions(restrictionsData)
      if (capacityData) {
        setCapacityRestrictions(capacityData)
      }

      // Calculate number of nights
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
      )

      // Check if any date in the range has a minimum stay requirement
      const maxMinStay = Math.max(...restrictionsData.map((r) => r.minStay), 1)

      let warningMessages = []

      // Validate minimum stay
      if (nights < maxMinStay) {
        warningMessages.push(
          translations.minimumStayWarning.replace('{minStay}', maxMinStay.toString()),
        )
      }

      // Validate capacity restrictions if available
      if (capacityData) {
        const totalGuests = formData.persons
        const totalAdults = formData.adults
        const totalChildren = formData.children.length

        // Check total occupancy
        if (totalGuests > capacityData.maxOccupancy) {
          warningMessages.push(
            translations.unitCapacityWarning
              .replace('{maxOccupancy}', capacityData.maxOccupancy.toString())
              .replace('{currentGuests}', totalGuests.toString()),
          )
        }

        // Check adult capacity
        if (totalAdults > capacityData.maxAdults) {
          warningMessages.push(
            translations.adultCapacityWarning
              .replace('{maxAdults}', capacityData.maxAdults.toString())
              .replace('{currentAdults}', totalAdults.toString()),
          )
        }

        // Check children capacity
        if (totalChildren > capacityData.maxChildren) {
          warningMessages.push(
            translations.childrenCapacityWarning
              .replace('{maxChildren}', capacityData.maxChildren.toString())
              .replace('{currentChildren}', totalChildren.toString()),
          )
        }
      } else {
        // Fallback to room-based validation if no capacity data
        const maxGuestsPerRoom = 4
        const requiredRooms = Math.ceil(formData.persons / maxGuestsPerRoom)
        const hasEnoughRooms = formData.rooms >= requiredRooms

        if (!hasEnoughRooms) {
          warningMessages.push(
            translations.roomCapacityWarning
              .replace('{persons}', formData.persons.toString())
              .replace('{rooms}', requiredRooms.toString()),
          )
        }
      }

      if (warningMessages.length > 0) {
        setRestrictionsWarning(warningMessages.join('. '))
      } else {
        setRestrictionsWarning('')
      }
    } catch (error) {
      console.error('Error fetching restrictions:', error)
      setRestrictionsWarning('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.checkIn || !formData.checkOut) {
        alert(translations.pleaseSelectDates)
        setIsSubmitting(false)
        return
      }

      if (!formData.firstName || !formData.lastName || !formData.email) {
        alert('Please fill in all required fields.')
        setIsSubmitting(false)
        return
      }

      if (!formData.cardholderSameAsBooker && !formData.cardholderName.trim()) {
        alert(translations.enterCardholderName)
        setIsSubmitting(false)
        return
      }

      if (!formData.acceptTerms) {
        alert('Please accept the terms and conditions.')
        setIsSubmitting(false)
        return
      }

      // Check minimum stay requirements
      if (restrictionsWarning) {
        alert(restrictionsWarning)
        setIsSubmitting(false)
        return
      }

      // Prepare reservation data according to API structure
      const reservationData = {
        unitTypeId: roomData?.rentlioUnitTypeId,
        dateFrom: formData.checkIn,
        dateTo: formData.checkOut,
        email: formData.email,
        fullName: `${formData.firstName} ${formData.lastName}`,
        persons: formData.persons,
        rooms: formData.rooms,
        note: formData.message || '',
        cardHolder: formData.cardholderSameAsBooker
          ? `${formData.firstName} ${formData.lastName}`
          : formData.cardholderName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryMonth: formData.expiryDate.split('/')[0],
        expiryYear: formData.expiryDate.split('/')[1],
        salesChannelsId: 45, // Default sales channel ID
        adults: formData.adults,
        children: formData.children.filter((child) => child.age > 0), // Only include children with valid ages
      }

      console.log('Submitting reservation:', reservationData)

      // Make API call to create reservation
      const response = await fetch('/api/rentlio/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Reservation failed')
      }

      const result = await response.json()
      console.log('Reservation successful:', result)

      // Show success message
      alert(`Reservation submitted successfully! Reservation ID: ${result.reservationId}`)

      // Close drawer
      onClose()
    } catch (error) {
      console.error('Reservation error:', error)
      alert('Failed to submit reservation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
  }

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(.{2})/, '$1/')
      .slice(0, 5)
  }

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="booking-drawer-overlay" onClick={handleOverlayClick}>
      <div className="booking-drawer">
        <div className="booking-drawer-header">
          <h2>{translations.reservation}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="booking-form-content">
            {/* First Section - Date Selection & Pricing */}
            <div className="reservation-details">
              <h3>{translations.reservationDetails}</h3>

              {/* Date Range Picker */}
              <div className="date-picker-section">
                <div className="date-picker-container">
                  <div className="date-picker-group">
                    <label>{translations.selectDates}</label>
                    <input
                      ref={checkInRef}
                      type="text"
                      placeholder={translations.selectCheckInOutDates}
                      className="date-picker-input"
                      readOnly
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                {_isLoadingPricing && (
                  <div className="loading-message">{translations.checkingAvailability}</div>
                )}
                {_pricingError && <div className="error-message">{_pricingError}</div>}
              </div>

              {/* Selected Dates Display */}
              {formData.checkIn && formData.checkOut && currentPricingData && (
                <div className="selected-dates-display">
                  <div className="selected-dates-header">
                    <h4>{translations.selectedDates}</h4>
                    <div className="availability-status">
                      {currentPricingData.isAvailable ? (
                        <span className="available">
                          {translations.checkmark} {translations.available}
                        </span>
                      ) : (
                        <span className="unavailable">
                          {translations.cross} {translations.unavailable}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="selected-dates-content">
                    <div className="date-range">
                      <div className="date-item">
                        <div className="date-label">{translations.checkIn}</div>
                        <div className="date-value">{currentPricingData.checkIn}</div>
                        <div className="date-day">{currentPricingData.checkInDay}</div>
                      </div>
                      <div className="date-arrow">{translations.arrow}</div>
                      <div className="date-item">
                        <div className="date-label">{translations.checkOut}</div>
                        <div className="date-value">{currentPricingData.checkOut}</div>
                        <div className="date-day">{currentPricingData.checkOutDay}</div>
                      </div>
                    </div>

                    {currentPricingData.isAvailable && (
                      <div className="pricing-summary">
                        <div className="price-item">
                          <span className="price-label">{translations.accommodation}</span>
                          <span className="price-value">
                            {translations.euro}
                            {currentPricingData.accommodationPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className="price-total">
                          <span className="total-label">{translations.total}</span>
                          <span className="total-value">
                            {translations.euro}
                            {currentPricingData.totalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className="price-hrk">
                          <span className="hrk-label">
                            {translations.approximately}{' '}
                            {currentPricingData.totalPriceHRK.toFixed(2).replace('.', ',')}{' '}
                            {translations.hrk}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Show availability warnings if any */}
                    {!currentPricingData.isAvailable &&
                      currentPricingData.unavailableDates &&
                      currentPricingData.unavailableDates.length > 0 && (
                        <div className="availability-warning">
                          <div className="warning-title">
                            {translations.warning} {translations.unavailableDates}
                          </div>
                          <div className="warning-dates">
                            {currentPricingData.unavailableDates.join(', ')}
                          </div>
                        </div>
                      )}

                    {currentPricingData.closedToArrivalDates &&
                      currentPricingData.closedToArrivalDates.length > 0 && (
                        <div className="availability-warning">
                          <div className="warning-title">
                            {translations.warning} {translations.closedToArrival}
                          </div>
                          <div className="warning-dates">
                            {currentPricingData.closedToArrivalDates.join(', ')}
                          </div>
                        </div>
                      )}

                    {currentPricingData.closedToDepartureDates &&
                      currentPricingData.closedToDepartureDates.length > 0 && (
                        <div className="availability-warning">
                          <div className="warning-title">
                            {translations.warning} {translations.closedToDeparture}
                          </div>
                          <div className="warning-dates">
                            {currentPricingData.closedToDepartureDates.join(', ')}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {!formData.checkIn || !formData.checkOut ? (
                <div className="no-dates-message">{translations.pleaseSelectDates}</div>
              ) : null}

              {/* Capacity Restrictions Display */}
              {capacityRestrictions && (
                <div className="capacity-restrictions">
                  <h4>{translations.unitCapacity}</h4>
                  <div className="capacity-info">
                    <div className="capacity-item">
                      <span className="capacity-label">{translations.maximumOccupancy}:</span>
                      <span className="capacity-value">
                        {capacityRestrictions.maxOccupancy} {translations.people}
                      </span>
                    </div>
                    <div className="capacity-item">
                      <span className="capacity-label">{translations.maximumAdults}:</span>
                      <span className="capacity-value">
                        {capacityRestrictions.maxAdults} {translations.adults}
                      </span>
                    </div>
                    <div className="capacity-item">
                      <span className="capacity-label">{translations.maximumChildren}:</span>
                      <span className="capacity-value">
                        {capacityRestrictions.maxChildren} {translations.children}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Restrictions Warning */}
              {restrictionsWarning && (
                <div className="restrictions-warning">
                  <div className="warning-icon">{translations.warning}</div>
                  <div className="warning-text">{restrictionsWarning}</div>
                </div>
              )}

              {currentPricingData && currentPricingData.isAvailable && (
                <div className="accommodation-details">
                  <div className="accommodation-item">
                    <div className="accommodation-label">{translations.accommodation}</div>
                    <div className="accommodation-price">
                      {currentPricingData.accommodationPrice.toFixed(2).replace('.', ',')}{' '}
                      {translations.eur}
                    </div>
                  </div>
                  <div className="accommodation-detail">
                    {currentPricingData.nights} x {roomData?.title}{' '}
                    {currentPricingData.accommodationPricePerNight.toFixed(2).replace('.', ',')}{' '}
                    {translations.eur}
                  </div>
                  <div className="check-times">
                    <div>
                      {translations.checkIn} {currentPricingData.checkInDay},{' '}
                      {currentPricingData.checkIn} 2025 ({translations.from}{' '}
                      {currentPricingData.checkInTime})
                    </div>
                    <div>
                      {translations.checkOut} {currentPricingData.checkOutDay},{' '}
                      {currentPricingData.checkOut} 2025 ({translations.from}{' '}
                      {currentPricingData.checkOutTime})
                    </div>
                  </div>
                </div>
              )}

              {currentPricingData && currentPricingData.isAvailable && (
                <div className="policy-section">
                  <div className="policy-item">
                    <div className="policy-label">{translations.cancellationPolicy}</div>
                    <div className="policy-text">
                      {translations.cannotCancel}{' '}
                      {currentPricingData.totalPrice.toFixed(2).replace('.', ',')}{' '}
                      {translations.ifCancel}
                    </div>
                  </div>
                  <div className="policy-item">
                    <div className="policy-label">{translations.paymentDynamics}</div>
                    <div className="policy-text">
                      {translations.afterConfirmation}{' '}
                      {currentPricingData.totalPrice.toFixed(2).replace('.', ',')}{' '}
                      {translations.willBeCharged}
                    </div>
                  </div>
                  <div className="policy-item">
                    <div className="policy-label">{translations.noShow}</div>
                    <div className="policy-text">
                      {translations.inCaseOfNoShow}{' '}
                      {currentPricingData.totalPrice.toFixed(2).replace('.', ',')}{' '}
                      {translations.eur}.
                    </div>
                  </div>
                </div>
              )}

              {currentPricingData && currentPricingData.isAvailable && (
                <>
                  <div className="total-section">
                    <div className="total-price">
                      <div className="total-label">{translations.totalPrice}</div>
                      <div className="total-amount">
                        {currentPricingData.totalPrice.toFixed(2).replace('.', ',')}{' '}
                        {translations.eur}
                      </div>
                    </div>
                    <div className="total-hrk">
                      {currentPricingData.totalPriceHRK.toFixed(2).replace('.', ',')}{' '}
                      {translations.hrk}
                    </div>
                  </div>

                  <div className="tax-info">
                    <div>{translations.vatIncluded}</div>
                    <div>{translations.vatServicesIncluded}</div>
                    <div>
                      {translations.exchangeRate} {translations.eurToHrk}{' '}
                      {currentPricingData.exchangeRate.toFixed(5).replace('.', ',')}{' '}
                      {translations.hrk}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Second Section - Booker Details */}
            <div className="booker-details">
              <h3>{translations.bookerDetails}</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">{translations.firstName}</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">{translations.lastName}</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">{translations.email}</label>
                <div className="input-with-icon">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Mail size={20} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">{translations.phone}</label>
                <div className="input-with-icon">
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                  <Phone size={20} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">{translations.country}</label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                >
                  <option value="">{translations.selectCountry}</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="arrivalTime">{translations.arrivalTime}</label>
                <select
                  id="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  required
                >
                  <option value="">{translations.selectOption}</option>
                  {arrivalTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">{translations.message}</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Guest Details Section */}
              <div className="guest-details-section">
                <h4>{translations.guestDetails}</h4>

                {/* Adults and Children Selector */}
                <div className="guest-selector">
                  <div className="guest-type">
                    <label>{translations.adults}</label>
                    <div className="quantity-selector">
                      <button
                        type="button"
                        onClick={() => {
                          const newAdults = Math.max(1, formData.adults - 1)
                          setFormData({
                            ...formData,
                            adults: newAdults,
                            persons: newAdults + formData.children.length,
                          })
                          // Trigger restrictions validation when guest count changes
                          if (formData.checkIn && formData.checkOut) {
                            validateMinimumStay(formData.checkIn, formData.checkOut)
                          }
                        }}
                        className="quantity-btn minus"
                        disabled={formData.adults <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-value">{formData.adults}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newAdults = Math.min(20, formData.adults + 1)
                          setFormData({
                            ...formData,
                            adults: newAdults,
                            persons: newAdults + formData.children.length,
                          })
                          // Trigger restrictions validation when guest count changes
                          if (formData.checkIn && formData.checkOut) {
                            validateMinimumStay(formData.checkIn, formData.checkOut)
                          }
                        }}
                        className="quantity-btn plus"
                        disabled={formData.adults >= 20}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="guest-type">
                    <label>{translations.children}</label>
                    <div className="quantity-selector">
                      <button
                        type="button"
                        onClick={() => {
                          const newChildren =
                            formData.children.length > 0 ? formData.children.slice(0, -1) : []
                          setFormData({
                            ...formData,
                            children: newChildren,
                            persons: formData.adults + newChildren.length,
                          })
                          // Trigger restrictions validation when guest count changes
                          if (formData.checkIn && formData.checkOut) {
                            validateMinimumStay(formData.checkIn, formData.checkOut)
                          }
                        }}
                        className="quantity-btn minus"
                        disabled={formData.children.length <= 0}
                      >
                        −
                      </button>
                      <span className="quantity-value">{formData.children.length}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newChildren = [...formData.children, { age: 0 }]
                          setFormData({
                            ...formData,
                            children: newChildren,
                            persons: formData.adults + newChildren.length,
                          })
                          // Trigger restrictions validation when guest count changes
                          if (formData.checkIn && formData.checkOut) {
                            validateMinimumStay(formData.checkIn, formData.checkOut)
                          }
                        }}
                        className="quantity-btn plus"
                        disabled={formData.children.length >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Children Ages Section */}
                {formData.children.length > 0 && (
                  <div className="children-ages-section">
                    <label>
                      {translations.children} {translations.childAge}
                    </label>
                    {formData.children.map((child, index) => (
                      <div key={index} className="child-age-input">
                        <label>
                          {translations.childAge} {index + 1}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="17"
                          value={child.age}
                          onChange={(e) => {
                            const newChildren = [...formData.children]
                            newChildren[index] = { age: parseInt(e.target.value) || 0 }
                            setFormData({ ...formData, children: newChildren })
                            // Trigger restrictions validation when child age changes
                            if (formData.checkIn && formData.checkOut) {
                              validateMinimumStay(formData.checkIn, formData.checkOut)
                            }
                          }}
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Rooms Selector */}
                <div className="rooms-selector">
                  <label>{translations.numberOfRooms}</label>
                  <div className="quantity-selector">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          rooms: Math.max(1, formData.rooms - 1),
                        })
                        // Trigger restrictions validation when room count changes
                        if (formData.checkIn && formData.checkOut) {
                          validateMinimumStay(formData.checkIn, formData.checkOut)
                        }
                      }}
                      className="quantity-btn minus"
                      disabled={formData.rooms <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{formData.rooms}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          rooms: Math.min(10, formData.rooms + 1),
                        })
                        // Trigger restrictions validation when room count changes
                        if (formData.checkIn && formData.checkOut) {
                          validateMinimumStay(formData.checkIn, formData.checkOut)
                        }
                      }}
                      className="quantity-btn plus"
                      disabled={formData.rooms >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="payment-section">
                <h4>{translations.reservationConfirmation}</h4>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="cardholderSame"
                    checked={formData.cardholderSameAsBooker}
                    onChange={(e) => handleInputChange('cardholderSameAsBooker', e.target.checked)}
                  />
                  <label htmlFor="cardholderSame">{translations.cardholderSame}</label>
                </div>

                {!formData.cardholderSameAsBooker && (
                  <div className="form-group">
                    <label htmlFor="cardholderName">{translations.cardholderName}</label>
                    <input
                      type="text"
                      id="cardholderName"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder={translations.cardholderPlaceholder}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="cardNumber">{translations.cardNumber}</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange('cardNumber', formatCardNumber(e.target.value))
                      }
                      placeholder={translations.cardNumberPlaceholder}
                      maxLength={19}
                    />
                    <CreditCard size={20} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cvv">{translations.cvv}</label>
                    <input
                      type="text"
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) =>
                        handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))
                      }
                      placeholder={translations.cvvPlaceholder}
                      maxLength={3}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expiryDate">{translations.expiryDate}</label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange('expiryDate', formatExpiryDate(e.target.value))
                      }
                      placeholder={translations.expiryPlaceholder}
                      maxLength={5}
                    />
                  </div>
                </div>

                <button type="submit" className="reserve-button" disabled={isSubmitting}>
                  {isSubmitting ? translations.reserving : translations.reserve}
                </button>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    required
                  />
                  <label htmlFor="acceptTerms">
                    {translations.acceptTerms}{' '}
                    <a href="#" className="link">
                      {translations.termsOfUse}
                    </a>{' '}
                    {translations.and}{' '}
                    <a href="#" className="link">
                      {translations.privacyPolicy}
                    </a>
                  </label>
                </div>

                <p className="disclaimer">{translations.cardNotCharged}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingDrawer
