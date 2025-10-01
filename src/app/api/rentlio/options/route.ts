import { NextResponse } from 'next/server'
import { loadRentlioOptions } from '@/utils/rentlio'

export async function GET() {
  try {
    const options = await loadRentlioOptions()
    return NextResponse.json(options)
  } catch (error) {
    console.error('[Rentlio] Failed to serve options endpoint:', error)
    return NextResponse.json(
      { propertyOptions: [], unitTypeOptions: [], unitTypesByProperty: {} },
      { status: 500 },
    )
  }
}
