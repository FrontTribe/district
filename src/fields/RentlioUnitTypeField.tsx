'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { getTranslation } from '@payloadcms/translations'
import { useTranslation, useField } from '@payloadcms/ui'

type Option = { label: string | Record<string, string>; value: string }
type Props = {
  path: string
  label?: string | Record<string, string>
  description?: string | Record<string, string>
  required?: boolean
  unitTypesByProperty?: Record<string, Option[]>
}

// Create a cache for unit types data
const unitTypesCache = {
  data: null as Record<string, Option[]> | null,
  promise: null as Promise<Record<string, Option[]>> | null,
}

const RentlioUnitTypeField: React.FC<Props> = ({
  path,
  label,
  description,
  required,
  unitTypesByProperty = {},
}) => {
  const { value, setValue } = useField<string>({ path })
  const { i18n } = useTranslation()
  const [resolvedMap, setResolvedMap] = useState<Record<string, Option[]>>(
    Object.keys(unitTypesByProperty).length > 0 ? unitTypesByProperty : unitTypesCache.data || {},
  )
  const [isLoading, setIsLoading] = useState<boolean>(
    !Object.keys(unitTypesByProperty).length && !unitTypesCache.data,
  )
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)

  const translatedLabel = useMemo(
    () => getTranslation(label || 'Rentlio Unit Type', i18n),
    [label, i18n],
  )
  const translatedDescription = useMemo(
    () => (description ? getTranslation(description, i18n) : null),
    [description, i18n],
  )

    const loadUnitTypes = async (): Promise<Record<string, Option[]>> => {
    if (unitTypesCache.promise) {
      return unitTypesCache.promise
    }
    unitTypesCache.promise = (async () => {
      try {
        const res = await fetch('/api/rentlio/options')
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }

        const data = await res.json()

        if (data.unitTypesByProperty && typeof data.unitTypesByProperty === 'object') {
          unitTypesCache.data = data.unitTypesByProperty
          return data.unitTypesByProperty
        } else {
          throw new Error('Invalid data structure')
        }
      } catch (error) {
        unitTypesCache.promise = null
        throw error
      }
    })()

    return unitTypesCache.promise
  }

  useEffect(() => {
    if (Object.keys(unitTypesByProperty).length > 0) {
      setResolvedMap(unitTypesByProperty)
      setIsLoading(false)
      return
    }

    if (unitTypesCache.data) {
      setResolvedMap(unitTypesCache.data)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    loadUnitTypes()
      .then((fetchedUnitTypes) => {
        setResolvedMap(fetchedUnitTypes)
        setIsLoading(false)
      })
      .catch((_error) => {
        setIsLoading(false)
      })
  }, [unitTypesByProperty])

  // Check for existing property selection on mount
  useEffect(() => {
    const checkForExistingProperty = () => {
      const selectors = [
        'select[name="rentlioPropertyId"]',
        'select[id*="rentlioPropertyId"]',
        'select[class*="rentlio"]',
        'input[name="rentlioPropertyId"]'
      ]
      
      for (const selector of selectors) {
        const element = document.querySelector(selector) as HTMLSelectElement | HTMLInputElement
        if (element && element.value) {
          setSelectedPropertyId(element.value)
          return true
        }
      }
      
      return false
    }

    // Check with multiple delays
    const timeouts = [0, 100, 500]
    const cleanupTimeouts: NodeJS.Timeout[] = []

    timeouts.forEach((delay) => {
      const timeout = setTimeout(() => {
        checkForExistingProperty()
      }, delay)
      cleanupTimeouts.push(timeout)
    })

    return () => {
      cleanupTimeouts.forEach(clearTimeout)
    }
  }, [])

  // Listen for property change events
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent
      const newPropertyId = customEvent.detail?.propertyId || null
      
      setSelectedPropertyId(newPropertyId)

      if (!newPropertyId) {
        setValue(null)
        return
      }

      const availableOptions = resolvedMap[newPropertyId] || []
      if (value && !availableOptions.find((option) => option.value === value)) {
        setValue(null)
      }
    }

    window.addEventListener('rentlio:propertyChanged', handler)

    return () => {
      window.removeEventListener('rentlio:propertyChanged', handler)
    }
  }, [resolvedMap, value, setValue])

  const availableOptions = selectedPropertyId ? resolvedMap[selectedPropertyId] || [] : []

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value || null
    setValue(nextValue)
  }

  return (
    <div className="field-type rentlio-unit-type">
      <label className="field-label" htmlFor={path}>
        {translatedLabel}
        {required ? ' *' : null}
      </label>
      <select
        id={path}
        value={value ?? ''}
        onChange={handleChange}
        className="field-input"
        disabled={!selectedPropertyId || availableOptions.length === 0}
      >
        <option value="">
          {!selectedPropertyId
            ? 'Select a property first'
            : availableOptions.length > 0
              ? 'Select unit type'
              : isLoading
                ? 'Loading Rentlio unit types...'
                : 'No Rentlio unit types available'}
        </option>
        {availableOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === 'string' ? option.label : getTranslation(option.label, i18n)}
          </option>
        ))}
      </select>
      {translatedDescription ? (
        <div className="field-description">{translatedDescription}</div>
      ) : null}
    </div>
  )
}

export default RentlioUnitTypeField
