'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useField } from '@payloadcms/ui'

interface RentlioSalesChannelFieldProps {
  path: string
  label?: string
  required?: boolean
  salesChannelsByProperty?: Record<string, Array<{ label: string; value: string }>>
}

type Option<T = string> = {
  label: string
  value: T
}

const salesChannelsCache = {
  data: null as Record<string, Option[]> | null,
  promise: null as Promise<Record<string, Option[]>> | null,
}

export const RentlioSalesChannelField: React.FC<RentlioSalesChannelFieldProps> = ({
  path,
  label = 'Sales Channel',
  required = false,
  salesChannelsByProperty = {},
}) => {
  const { value, setValue } = useField<string>({ path })
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [resolvedMap, setResolvedMap] = useState<Record<string, Option[]>>(
    Object.keys(salesChannelsByProperty).length > 0
      ? salesChannelsByProperty
      : salesChannelsCache.data || {},
  )
  const [isLoading, setIsLoading] = useState<boolean>(
    !Object.keys(salesChannelsByProperty).length && !salesChannelsCache.data,
  )

  const loadSalesChannels = async (): Promise<Record<string, Option[]>> => {
    if (salesChannelsCache.promise) return salesChannelsCache.promise
    salesChannelsCache.promise = (async () => {
      const res = await fetch('/api/rentlio/options')
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      if (data.salesChannelsByProperty && typeof data.salesChannelsByProperty === 'object') {
        salesChannelsCache.data = data.salesChannelsByProperty
        return data.salesChannelsByProperty
      }
      throw new Error('Invalid data structure')
    })()
    return salesChannelsCache.promise
  }

  useEffect(() => {
    if (Object.keys(salesChannelsByProperty).length > 0) {
      setResolvedMap(salesChannelsByProperty)
      setIsLoading(false)
      return
    }
    if (salesChannelsCache.data) {
      setResolvedMap(salesChannelsCache.data)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    loadSalesChannels()
      .then((fetchedSalesChannels) => {
        setResolvedMap(fetchedSalesChannels)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [salesChannelsByProperty])

  // Subscribe to property state manager
  useEffect(() => {
    const unsubscribe = import('@/utils/propertyStateManager').then(({ propertyStateManager }) => {
      // Get the current property ID immediately
      const currentPropertyId = propertyStateManager.getCurrentPropertyId()
      setSelectedPropertyId(currentPropertyId)

      return propertyStateManager.subscribe((newPropertyId) => {
        setSelectedPropertyId(newPropertyId)

        // Don't clear the value if no property is selected - let it work independently
        if (!newPropertyId) {
          return
        }

        const currentMap = salesChannelsCache.data || {}
        const availableOptions = currentMap[newPropertyId] || []

        if (value && !availableOptions.find((opt: Option) => opt.value === value)) {
          setValue(null)
        }
      })
    })

    return () => {
      unsubscribe.then((unsub) => unsub?.())
    }
  }, [value, setValue])

  const availableOptions = useMemo(() => {
    const currentMap = resolvedMap || salesChannelsCache.data || {}

    if (selectedPropertyId) {
      const options = currentMap[selectedPropertyId] || []
      return options
    } else {
      const allOptions: Option[] = []
      Object.entries(currentMap).forEach(([propId, propertyOptions]) => {
        allOptions.push(...propertyOptions)
      })

      const uniqueOptions = allOptions.filter(
        (option, index, self) => index === self.findIndex((o) => o.value === option.value),
      )

      return uniqueOptions.length > 0
        ? uniqueOptions
        : [{ label: 'Default Channel (ID: 45)', value: '45' }]
    }
  }, [selectedPropertyId, resolvedMap])

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
      </label>

      {isLoading && (
        <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
          Loading sales channels...
        </div>
      )}

      <select
        id={path}
        name={path}
        value={value || '45'}
        onChange={(e) => {
          const nextValue = e.target.value || '45'
          setValue(nextValue)
        }}
        required={required}
        disabled={isLoading}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        {availableOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
        Select a sales channel for this room. This will be used for all reservations.
        {selectedPropertyId && ` (Property ID: ${selectedPropertyId})`}
      </div>
    </div>
  )
}

export default RentlioSalesChannelField
