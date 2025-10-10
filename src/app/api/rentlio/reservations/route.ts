import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const reservationData = await request.json()

    console.log('Received reservation data:', reservationData)

    // Validate required fields
    const requiredFields = [
      'unitTypeId',
      'dateFrom',
      'dateTo',
      'email',
      'fullName',
      'persons',
      'rooms',
      'cardHolder',
      'cardNumber',
      'expiryMonth',
      'expiryYear',
      'adults',
    ]

    const missingFields = requiredFields.filter((field) => !reservationData[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields,
        },
        { status: 400 },
      )
    }

    // Validate unitTypeId is a number
    if (typeof reservationData.unitTypeId !== 'number') {
      reservationData.unitTypeId = parseInt(reservationData.unitTypeId, 10)
    }

    // Validate persons and rooms are numbers
    if (typeof reservationData.persons !== 'number') {
      reservationData.persons = parseInt(reservationData.persons, 10)
    }
    if (typeof reservationData.rooms !== 'number') {
      reservationData.rooms = parseInt(reservationData.rooms, 10)
    }
    if (typeof reservationData.adults !== 'number') {
      reservationData.adults = parseInt(reservationData.adults, 10)
    }

    // Remove propertyId as it's not needed in the request body
    delete reservationData.propertyId

    // Ensure salesChannelsId is set (Rentlio expects plural form)
    if (!reservationData.salesChannelsId) {
      reservationData.salesChannelsId = 45 // Default sales channel ID
    }

    // Fix expiry year format (convert 2-digit to 4-digit)
    if (reservationData.expiryYear && reservationData.expiryYear.length === 2) {
      const currentYear = new Date().getFullYear()
      const currentCentury = Math.floor(currentYear / 100) * 100
      const year = parseInt(reservationData.expiryYear, 10)

      // If the 2-digit year is greater than current year's last 2 digits + 10,
      // assume it's from the previous century, otherwise current century
      if (year > (currentYear % 100) + 10) {
        reservationData.expiryYear = (currentCentury - 100 + year).toString()
      } else {
        reservationData.expiryYear = (currentCentury + year).toString()
      }
    }

    // Ensure children array exists and is properly formatted
    if (!reservationData.children) {
      reservationData.children = []
    }

    // Filter out children with age 0 or invalid ages and ensure correct format
    reservationData.children = reservationData.children
      .filter((child: any) => child && typeof child.age === 'number' && child.age > 0)
      .map((child: any) => ({ age: child.age })) // Ensure only age property is included

    console.log('Validated reservation data:', reservationData)

    // Get API key from environment (use same pattern as other Rentlio APIs)
    const apiKey = process.env.RENTAL_SECRET
    if (!apiKey) {
      console.error('Rentlio API key not found in environment variables')
      return NextResponse.json(
        {
          success: false,
          error: 'API configuration error: Missing Rentlio API key',
        },
        { status: 500 },
      )
    }

    // Make actual API call to Rentlio
    console.log('Making API call to Rentlio...')
    const rentlioResponse = await fetch('https://api.rentl.io/v1/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: apiKey,
      },
      body: JSON.stringify(reservationData),
    })

    console.log('Rentlio API response status:', rentlioResponse.status)
    console.log(
      'Rentlio API response headers:',
      Object.fromEntries(rentlioResponse.headers.entries()),
    )

    if (!rentlioResponse.ok) {
      const errorText = await rentlioResponse.text()
      console.error('Rentlio API error response:', errorText)
      console.error('Request data sent to Rentlio:', reservationData)

      let errorMessage = `Rentlio API error: ${rentlioResponse.status} ${rentlioResponse.statusText}`
      try {
        const errorData = JSON.parse(errorText)
        console.error('Parsed Rentlio error data:', errorData)
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.errors) {
          errorMessage = JSON.stringify(errorData.errors)
        }
      } catch {
        // If we can't parse the error response, use the raw text
        errorMessage = `Rentlio API error: ${errorText}`
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          status: rentlioResponse.status,
          statusText: rentlioResponse.statusText,
        },
        { status: rentlioResponse.status },
      )
    }

    const result = await rentlioResponse.json()
    console.log('Rentlio API success response:', result)

    return NextResponse.json(
      {
        success: true,
        reservationId: result.id || result.reservationId || `RES-${Date.now()}`,
        message: 'Reservation created successfully',
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Reservation API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create reservation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
