import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 },
      )
    }

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

    // Make API call to Rentlio to get sales channels
    const rentlioResponse = await fetch(
      `https://api.rentl.io/v1/properties/${propertyId}/sales-channels`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ApiKey: apiKey,
        },
      },
    )

    if (!rentlioResponse.ok) {
      const errorText = await rentlioResponse.text()
      console.error('Rentlio API error response:', errorText)

      let errorMessage = `Rentlio API error: ${rentlioResponse.status} ${rentlioResponse.statusText}`
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch {
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

    return NextResponse.json(
      {
        success: true,
        data: result.data || [],
        total: result.total || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sales groups',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
