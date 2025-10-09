// Rentlio Booking API utilities
export interface RentlioRate {
  date: string
  price: number
  // Additional fields that might be present in some responses
  id?: number
  unitTypeId?: number
  ratePlanId?: number
  currencyId?: number
  currencyCode?: string
  isAvailable?: boolean
  minStay?: number
  maxStay?: number
  closedToArrival?: boolean
  closedToDeparture?: boolean
}

export interface RentlioRestriction {
  date: string
  minStay: number
  // Additional fields that might be present in some responses
  maxStay?: number
  closedToArrival?: boolean
  closedToDeparture?: boolean
  isAvailable?: boolean
  id?: number
  unitTypeId?: number
  ratePlanId?: number
}

export interface UnitCapacityRestriction {
  maxOccupancy: number
  maxAdults: number
  maxChildren: number
  unitTypeId: number
  unitName: string
}

export interface RentlioBookingData {
  rates: RentlioRate[]
  restrictions: RentlioRestriction[]
  checkIn: string
  checkOut: string
  totalPrice: number
  currencyCode: string
  exchangeRate?: number
}

export interface BookingPricingData {
  checkIn: string
  checkInDay: string
  checkOut: string
  checkOutDay: string
  accommodationPrice: number
  accommodationPricePerNight: number // Price per night
  servicesPrice: number
  totalPrice: number
  totalPriceHRK: number
  exchangeRate: number
  checkInTime: string
  checkOutTime: string
  minStay: number
  maxStay: number
  isAvailable: boolean
  closedToArrival: boolean
  closedToDeparture: boolean
  nights: number // Number of nights to stay
  // Additional availability information
  unavailableDates?: string[]
  closedToArrivalDates?: string[]
  closedToDepartureDates?: string[]
}

export interface AvailabilityData {
  date: string
  available: boolean
  availability?: number // Number of available units
  price?: number
  minStay?: number
  maxStay?: number
  closedToArrival?: boolean
  closedToDeparture?: boolean
}

export interface RentlioAvailabilityResponse {
  data: AvailabilityData[]
}

/**
 * Fetch unit type rates from Rentlio API
 */
export async function fetchUnitTypeRates(
  unitTypeId: string,
  checkIn: string,
  checkOut: string,
  apiKey?: string,
): Promise<RentlioRate[]> {
  try {
    const params = new URLSearchParams({
      dateFrom: checkIn,
      dateTo: checkOut,
      order_by: 'timestamp',
      order_direction: 'ASC',
    })

    const url = `/api/rentlio/unit-types/${unitTypeId}/rates?${params}`
    console.log('🌐 Rates API Request:', {
      url,
      unitTypeId,
      checkIn,
      checkOut,
      apiKey: apiKey ? 'Present' : 'Not needed (using proxy)',
    })

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('📡 Rates API Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Rates API Error Response:', errorText)
      throw new Error(`Rentlio API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('📊 Rates API Raw Response:', data)
    console.log('📊 Rates Data:', data.data || [])

    return data.data || []
  } catch (error) {
    console.error('❌ Error fetching unit type rates:', error)
    throw error
  }
}

/**
 * Fetch unit type restrictions from Rentlio API
 */
export async function fetchUnitTypeRestrictions(
  unitTypeId: string,
  checkIn: string,
  checkOut: string,
  apiKey?: string,
): Promise<RentlioRestriction[]> {
  try {
    const params = new URLSearchParams({
      dateFrom: checkIn,
      dateTo: checkOut,
      order_by: 'timestamp',
      order_direction: 'ASC',
    })

    const response = await fetch(`/api/rentlio/unit-types/${unitTypeId}/restrictions?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Rentlio API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('📊 Restrictions API Raw Response:', data)
    console.log('📊 Restrictions Data:', data.data || [])

    // Return the data array from the response
    return data.data || []
  } catch (error) {
    console.error('Error fetching unit type restrictions:', error)
    throw error
  }
}

/**
 * Fetch unit type capacity restrictions from Rentlio API
 * This would typically come from a unit-types endpoint that provides capacity info
 */
export async function fetchUnitCapacityRestrictions(
  unitTypeId: string,
  apiKey?: string,
): Promise<UnitCapacityRestriction | null> {
  try {
    // For now, we'll simulate this with mock data
    // In a real implementation, this would call an endpoint like:
    // `/api/rentlio/unit-types/${unitTypeId}/capacity` or similar
    
    console.log('🏠 Fetching capacity restrictions for unit type:', unitTypeId)
    
    // Mock capacity data - in production this would come from API
    const mockCapacityData: UnitCapacityRestriction = {
      maxOccupancy: 2, // Maximum total guests
      maxAdults: 2,    // Maximum adults
      maxChildren: 1,  // Maximum children
      unitTypeId: parseInt(unitTypeId),
      unitName: 'Standard Room'
    }
    
    console.log('📊 Capacity restrictions:', mockCapacityData)
    return mockCapacityData
    
    // Real API call would look like this:
    /*
    const response = await fetch(`/api/rentlio/unit-types/${unitTypeId}/capacity`, {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Rentlio API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || null
    */
  } catch (error) {
    console.error('Error fetching unit capacity restrictions:', error)
    return null
  }
}

/**
 * Fetch unit type availability from Rentlio API
 * Based on: https://docs.rentl.io/#unit-types-list-unit-type-availability-get
 */
export async function fetchUnitTypeAvailability(
  unitTypeId: string,
  checkIn: string,
  checkOut: string,
  apiKey?: string,
): Promise<AvailabilityData[]> {
  try {
    // Validate required parameters (apiKey is optional since we use proxy)
    if (!unitTypeId || !checkIn || !checkOut) {
      throw new Error('Missing required parameters: unitTypeId, checkIn, or checkOut')
    }

    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD')
    }

    const params = new URLSearchParams({
      dateFrom: checkIn,
      dateTo: checkOut,
      order_by: 'timestamp',
      order_direction: 'ASC',
    })

    const url = `/api/rentlio/unit-types/${unitTypeId}/availability?${params}`
    console.log('🌐 Availability API Request:', {
      url,
      unitTypeId,
      checkIn,
      checkOut,
      apiKey: apiKey ? 'Present' : 'Missing',
    })

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('📡 Availability API Response Status:', response.status)
    console.log(
      '📡 Availability API Response Headers:',
      Object.fromEntries(response.headers.entries()),
    )

    // Check rate limiting headers
    const rateLimitSecond = response.headers.get('x-ratelimit-remaining-second')
    const rateLimitHour = response.headers.get('x-ratelimit-remaining-hour')
    if (rateLimitSecond && parseInt(rateLimitSecond) < 3) {
      console.warn('⚠️ Rate limit approaching for seconds:', rateLimitSecond)
    }
    if (rateLimitHour && parseInt(rateLimitHour) < 100) {
      console.warn('⚠️ Rate limit approaching for hour:', rateLimitHour)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Availability API Error Response:', errorText)

      // Handle specific error cases
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else if (response.status === 401) {
        throw new Error('Invalid API key')
      } else if (response.status === 404) {
        throw new Error('Unit type not found')
      } else {
        throw new Error(`Rentlio API error: ${response.status} - ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('📊 Availability API Raw Response:', data)
    console.log('📊 Availability Data:', data.data || [])

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from Rentlio API')
    }

    const availability = data.data || []

    // Validate each availability entry
    const validatedAvailability = availability.map((item, index) => {
      if (!item.date || typeof item.availability !== 'number') {
        console.warn(`⚠️ Invalid availability entry at index ${index}:`, item)
      }
      return {
        date: item.date || '',
        available: (item.availability || 0) > 0, // available if availability count > 0
        availability: item.availability || 0,
        price: item.price || undefined,
        minStay: item.minStay || undefined,
        maxStay: item.maxStay || undefined,
        closedToArrival: item.closedToArrival || false,
        closedToDeparture: item.closedToDeparture || false,
      }
    })

    console.log('✅ Processed availability data:', validatedAvailability)
    return validatedAvailability
  } catch (error) {
    console.error('❌ Error fetching unit type availability:', error)
    throw error
  }
}

/**
 * Get exchange rate for currency conversion (mock implementation)
 * In production, this should call a real exchange rate API
 */
export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  // Mock exchange rate - in production, use a real API like exchangerate-api.com
  const mockRates: Record<string, number> = {
    EUR_HRK: 7.5345,
    USD_HRK: 6.8,
    GBP_HRK: 8.5,
  }

  const key = `${fromCurrency}_${toCurrency}`
  return mockRates[key] || 1
}

/**
 * Calculate total price from rates
 */
export function calculateTotalPrice(rates: RentlioRate[]): number {
  // In hotel booking, you pay for nights, not days
  // If you have 3 days (Dec 1-3), you only pay for 2 nights (Dec 1-2)
  // The checkout day (Dec 3) is not charged as you check out in the morning
  return rates.slice(0, -1).reduce((total, rate) => total + rate.price, 0)
}

/**
 * Calculate price per night from rates
 */
export function calculatePricePerNight(rates: RentlioRate[]): number {
  if (rates.length === 0) return 0

  // Calculate total price for all nights (excluding checkout day)
  const totalPrice = calculateTotalPrice(rates)

  // Calculate number of nights (rates.length - 1 because checkout day is not charged)
  const nights = rates.length - 1

  // Return price per night
  return nights > 0 ? totalPrice / nights : 0
}

/**
 * Analyze availability data to determine booking feasibility
 */
export function analyzeAvailability(availability: AvailabilityData[]): {
  isAvailable: boolean
  unavailableDates: string[]
  minStayRequired: number
  maxStayAllowed: number
  closedToArrivalDates: string[]
  closedToDepartureDates: string[]
} {
  if (availability.length === 0) {
    return {
      isAvailable: false,
      unavailableDates: [],
      minStayRequired: 1,
      maxStayAllowed: 30,
      closedToArrivalDates: [],
      closedToDepartureDates: [],
    }
  }

  const unavailableDates: string[] = []
  const closedToArrivalDates: string[] = []
  const closedToDepartureDates: string[] = []
  let minStayRequired = 1
  let maxStayAllowed = 30

  availability.forEach((day) => {
    if (!day.available) {
      unavailableDates.push(day.date)
    }
    if (day.closedToArrival) {
      closedToArrivalDates.push(day.date)
    }
    if (day.closedToDeparture) {
      closedToDepartureDates.push(day.date)
    }
    if (day.minStay && day.minStay > minStayRequired) {
      minStayRequired = day.minStay
    }
    if (day.maxStay && day.maxStay < maxStayAllowed) {
      maxStayAllowed = day.maxStay
    }
  })

  const isAvailable = unavailableDates.length === 0

  return {
    isAvailable,
    unavailableDates,
    minStayRequired,
    maxStayAllowed,
    closedToArrivalDates,
    closedToDepartureDates,
  }
}

/**
 * Format date for Croatian locale
 */
export function formatDateForCroatian(dateString: string): { date: string; day: string } {
  // Parse the date string and create a date in local timezone
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed

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

  const dayOfMonth = date.getDate()
  const monthName = months[date.getMonth()]
  const yearValue = date.getFullYear()
  const dayOfWeek = days[date.getDay()]

  return {
    date: `${dayOfMonth} ${monthName}, ${yearValue}`,
    day: dayOfWeek,
  }
}

/**
 * Process Rentlio data into booking pricing data
 */
export async function processRentlioBookingData(
  unitTypeId: string,
  checkIn: string,
  checkOut: string,
  apiKey?: string,
): Promise<BookingPricingData> {
  try {
    console.log('Fetching data for:', { unitTypeId, checkIn, checkOut })

    // Fetch rates, restrictions, and availability in parallel
    const [rates, restrictions, availability] = await Promise.all([
      fetchUnitTypeRates(unitTypeId, checkIn, checkOut),
      fetchUnitTypeRestrictions(unitTypeId, checkIn, checkOut),
      fetchUnitTypeAvailability(unitTypeId, checkIn, checkOut),
    ])

    console.log('API Response:', { rates, restrictions, availability })

    // Analyze availability data for more detailed information
    const availabilityAnalysis = analyzeAvailability(availability)
    console.log('📊 Availability Analysis:', availabilityAnalysis)

    // Check if all dates in the range are available
    const isAvailable =
      availabilityAnalysis.isAvailable || (availability.length === 0 && rates.length > 0)

    // Calculate number of nights (checkout day is not charged)
    const nights = rates.length > 0 ? rates.length - 1 : 2 // Fallback to 2 nights

    // Calculate total price from rates (excluding checkout day)
    // If no rates from API, use a fallback price for development
    const totalPrice = rates.length > 0 ? calculateTotalPrice(rates) : 120.0 // Fallback price
    const pricePerNight = rates.length > 0 ? calculatePricePerNight(rates) : 60.0 // Fallback price per night
    const currencyCode = rates[0]?.currencyCode || 'EUR'

    // Get exchange rate for HRK conversion
    const exchangeRate = await getExchangeRate(currencyCode, 'HRK')
    const totalPriceHRK = totalPrice * exchangeRate

    // Format dates for Croatian locale
    const checkInFormatted = formatDateForCroatian(checkIn)
    const checkOutFormatted = formatDateForCroatian(checkOut)

    // Get restrictions for the first day or use availability analysis
    const firstDayRestriction = restrictions[0]
    const minStay = firstDayRestriction?.minStay || availabilityAnalysis.minStayRequired
    const maxStay = firstDayRestriction?.maxStay || availabilityAnalysis.maxStayAllowed

    const result = {
      checkIn: checkInFormatted.date,
      checkInDay: checkInFormatted.day,
      checkOut: checkOutFormatted.date,
      checkOutDay: checkOutFormatted.day,
      accommodationPrice: totalPrice,
      accommodationPricePerNight: pricePerNight,
      servicesPrice: 0, // Services would be calculated separately
      totalPrice,
      totalPriceHRK,
      exchangeRate,
      checkInTime: '15:00 - 21:00', // Default check-in time
      checkOutTime: '6:00 - 11:00', // Default check-out time
      minStay,
      maxStay,
      nights, // Number of nights to stay
      isAvailable,
      closedToArrival: firstDayRestriction?.closedToArrival || false,
      closedToDeparture: firstDayRestriction?.closedToDeparture || false,
      // Additional availability information
      unavailableDates: availabilityAnalysis.unavailableDates,
      closedToArrivalDates: availabilityAnalysis.closedToArrivalDates,
      closedToDepartureDates: availabilityAnalysis.closedToDepartureDates,
    }

    console.log('Processed result:', result)
    return result
  } catch (error) {
    console.error('Error processing Rentlio booking data:', error)
    throw error
  }
}
