import { NextRequest, NextResponse } from 'next/server'

const RENTLIO_API_BASE = 'https://api.rentl.io/v1'
const RENTLIO_API_KEY = process.env.RENTAL_SECRET

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params
    const searchParams = request.nextUrl.searchParams

    if (!RENTLIO_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Construct the Rentlio API URL
    const apiPath = path.join('/')
    const url = new URL(`${RENTLIO_API_BASE}/${apiPath}`)

    // Copy search parameters
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ApiKey: RENTLIO_API_KEY,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Rentlio API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Rentlio API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, ApiKey',
    }

    return NextResponse.json(data, { headers: corsHeaders })
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, ApiKey',
    },
  })
}
