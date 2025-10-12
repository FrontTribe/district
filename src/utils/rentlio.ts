import type { Option } from 'payload'

const RENTLIO_API_BASE =
  (process.env.RENTLIO_API_BASE && process.env.RENTLIO_API_BASE.trim()) || 'https://api.rentl.io/v1'
const RENTLIO_API_KEY = process.env.RENTAL_SECRET

type RentlioListResponse<T> = {
  data: T[]
  perPage: number
  total: number
}

type RentlioProperty = {
  id: number
  name: string
}

type RentlioUnitType = {
  id: number
  name: string
}

type RentlioSalesChannel = {
  id: number
  name: string
  provisionAmount: number
}

type RentlioOptions = {
  propertyOptions: Option[]
  unitTypeOptions: Option[]
  unitTypesByProperty: Record<string, Option[]>
  salesChannelsByProperty: Record<string, Option[]>
}

const logPrefix = '[Rentlio]'
let warningLogged = false

async function rentlioFetch<T>(input: string): Promise<T> {
  if (!RENTLIO_API_KEY) {
    throw new Error('Missing RENTAL_SECRET environment variable for Rentlio API access.')
  }

  const base = RENTLIO_API_BASE.replace(/\/$/, '')
  const url = input.startsWith('http')
    ? input
    : `${base}${input.startsWith('/') ? input : `/${input}`}`

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ApiKey: RENTLIO_API_KEY,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Rentlio request failed (${res.status} ${res.statusText}): ${body}`)
  }

  return (await res.json()) as T
}

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const items: T[] = []
  let page = 1

  while (true) {
    const url = new URL(`${RENTLIO_API_BASE.replace(/\/$/, '')}${path}`)
    url.searchParams.set('page', String(page))

    const response = await rentlioFetch<RentlioListResponse<T>>(url.toString())
    items.push(...response.data)

    if (items.length >= response.total || response.data.length === 0) {
      break
    }

    page += 1
  }

  return items
}

async function fetchRentlioOptions(): Promise<RentlioOptions> {
  if (!RENTLIO_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `${logPrefix} RENTAL_SECRET missing; property and unit type dropdowns will be empty.`,
      )
    }
    return {
      propertyOptions: [],
      unitTypeOptions: [],
      unitTypesByProperty: {},
      salesChannelsByProperty: {},
    }
  }

  try {
    const properties = await fetchAllPages<RentlioProperty>('/properties')

    const propertyOptions: Option[] = []
    const unitTypeOptions: Option[] = []
    const unitTypesByProperty: Record<string, Option[]> = {}
    const salesChannelsByProperty: Record<string, Option[]> = {}

    for (const property of properties) {
      const propertyValue = String(property.id)
      propertyOptions.push({
        label: property.name,
        value: propertyValue,
      })
      unitTypesByProperty[propertyValue] = []
      salesChannelsByProperty[propertyValue] = []

      try {
        const unitTypes = await fetchAllPages<RentlioUnitType>(
          `/properties/${property.id}/unit-types`,
        )

        for (const unitType of unitTypes) {
          const option = {
            label: `${property.name} — ${unitType.name}`,
            value: String(unitType.id),
          }
          unitTypeOptions.push(option)
          unitTypesByProperty[propertyValue].push(option)
        }
      } catch (unitTypeError) {
        console.error(
          `${logPrefix} Failed to load unit types for property ${property.id}:`,
          unitTypeError,
        )
      }

      try {
        const salesChannels = await fetchAllPages<RentlioSalesChannel>(
          `/properties/${property.id}/sales-channels`,
        )

        for (const salesChannel of salesChannels) {
          const option = {
            label: `${salesChannel.name} (ID: ${salesChannel.id})`,
            value: String(salesChannel.id),
          }
          salesChannelsByProperty[propertyValue].push(option)
        }
      } catch (salesChannelError) {
        console.error(
          `${logPrefix} Failed to load sales channels for property ${property.id}:`,
          salesChannelError,
        )
      }
    }

    warningLogged = false
    return {
      propertyOptions,
      unitTypeOptions,
      unitTypesByProperty,
      salesChannelsByProperty,
    }
  } catch (error) {
    if (!warningLogged) {
      console.warn(
        `${logPrefix} Failed to pre-load properties. Rooms dropdowns will stay empty until credentials are fixed.`,
        error,
      )
      warningLogged = true
    }
    return {
      propertyOptions: [],
      unitTypeOptions: [],
      unitTypesByProperty: {},
      salesChannelsByProperty: {},
    }
  }
}

let cachedOptions: RentlioOptions | null = null

export async function loadRentlioOptions(forceReload = false): Promise<RentlioOptions> {
  if (!cachedOptions || forceReload) {
    cachedOptions = await fetchRentlioOptions()
  }
  return cachedOptions
}
