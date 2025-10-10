import { NextRequest, NextResponse } from 'next/server'

const RENTLIO_API_BASE = process.env.RENTLIO_API_BASE || 'https://api.rentl.io/v1'
const RENTLIO_API_KEY = process.env.RENTAL_SECRET

if (!RENTLIO_API_KEY) {
  console.error('RENTAL_SECRET environment variable is not set')
}

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const allItems: T[] = []
  let page = 1
  const perPage = 30

  while (true) {
    const url = `${RENTLIO_API_BASE}${path}${path.includes('?') ? '&' : '?'}page=${page}&perPage=${perPage}`

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ApiKey: RENTLIO_API_KEY!,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Rentlio request failed (${response.status} ${response.statusText})`)
    }

    const data = await response.json()
    allItems.push(...data.data)

    if (data.data.length < perPage) {
      break
    }
    page++
  }

  return allItems
}

export async function GET(request: NextRequest) {
  try {
    if (!RENTLIO_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'RENTAL_SECRET environment variable is not set' },
        { status: 500 },
      )
    }

    // Fetch all properties
    const properties = await fetchAllPages<{ id: number; name: string }>('/properties')

    const salesChannelsByProperty: Record<
      string,
      Array<{ id: number; name: string; provisionAmount: number }>
    > = {}

    // Fetch sales channels for each property
    for (const property of properties) {
      try {
        const salesChannels = await fetchAllPages<{
          id: number
          name: string
          provisionAmount: number
        }>(`/properties/${property.id}/sales-channels`)

        salesChannelsByProperty[property.id.toString()] = salesChannels
      } catch (error) {
        console.error(`[API] Failed to fetch sales channels for property ${property.id}:`, error)
        salesChannelsByProperty[property.id.toString()] = []
      }
    }

    return NextResponse.json({
      success: true,
      data: salesChannelsByProperty,
    })
  } catch (error) {
    console.error('[API] Error fetching sales channels:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales channels' },
      { status: 500 },
    )
  }
}
