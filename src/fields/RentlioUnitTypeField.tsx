'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { getTranslation } from '@payloadcms/translations'
import { useTranslation, useField, SelectInput } from '@payloadcms/ui'

type Option<T = string> = {
  label: string
  value: T
}

type Props = {
  path: string
  label?: string | Record<string, string>
  description?: string | Record<string, string>
  required?: boolean
  unitTypesByProperty?: Record<string, Option[]>
}

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
    if (unitTypesCache.promise) return unitTypesCache.promise
    unitTypesCache.promise = (async () => {
      const res = await fetch('/api/rentlio/options')
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      if (data.unitTypesByProperty && typeof data.unitTypesByProperty === 'object') {
        unitTypesCache.data = data.unitTypesByProperty
        return data.unitTypesByProperty
      }
      throw new Error('Invalid data structure')
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
      .catch(() => setIsLoading(false))
  }, [unitTypesByProperty])

  useEffect(() => {
    console.log('[UnitType] Subscribing to property state manager')

    const unsubscribe = import('@/utils/propertyStateManager').then(({ propertyStateManager }) => {
      return propertyStateManager.subscribe((newPropertyId) => {
        console.log('[UnitType] Property state manager notified with ID:', newPropertyId)
        setSelectedPropertyId(newPropertyId)

        // Don't clear the value if no property is selected - let it work independently
        if (!newPropertyId) {
          console.log('[UnitType] No property ID, but keeping unit type value')
          return
        }

        const currentMap = unitTypesCache.data || {}
        const availableOptions = currentMap[newPropertyId] || []

        if (value && !availableOptions.find((opt: Option) => opt.value === value)) {
          console.log('[UnitType] Clearing invalid unit type selection')
          setValue(null)
        }
      })
    })

    return () => {
      unsubscribe.then((unsub) => unsub?.())
    }
  }, [value, setValue])
  useEffect(() => {
    console.log('[UnitType] selectedPropertyId changed to:', selectedPropertyId)
  }, [selectedPropertyId])

  useEffect(() => {
    console.log('[UnitType] value changed to:', value)
  }, [value])

  const availableOptions = useMemo(() => {
    console.log('[UnitType] Computing availableOptions:', {
      selectedPropertyId,
      resolvedMapKeys: Object.keys(resolvedMap || {}),
      cacheKeys: Object.keys(unitTypesCache.data || {}),
      resolvedMapData: resolvedMap,
      cacheData: unitTypesCache.data,
    })

    const currentMap = resolvedMap || unitTypesCache.data || {}

    if (selectedPropertyId) {
      const options = currentMap[selectedPropertyId] || []
      return options
    } else {
      const allOptions: Option[] = []
      Object.entries(currentMap).forEach(([propId, propertyOptions]) => {
        console.log('[UnitType] Adding', propertyOptions.length, 'options from property', propId)
        allOptions.push(...propertyOptions)
      })

      const uniqueOptions = allOptions.filter(
        (option, index, self) => index === self.findIndex((o) => o.value === option.value),
      )

      return uniqueOptions
    }
  }, [selectedPropertyId, resolvedMap])

  return (
    <div className="field-type rentlio-unit-type">
      <label htmlFor={path} className="field-label">
        {translatedLabel}
        {required && <span className="required">*</span>}
      </label>

      <select
        id={path}
        name={path}
        value={value || ''}
        onChange={(e) => {
          const nextValue = e.target.value || null
          console.log('[UnitType] onChange triggered:', {
            selectedValue: e.target.value,
            nextValue,
            currentValue: value,
          })
          setValue(nextValue)
        }}
        disabled={isLoading}
        className="field-input"
      >
        <option value="">
          {isLoading
            ? 'Loading Rentlio unit types...'
            : availableOptions.length > 0
              ? selectedPropertyId
                ? 'Select unit type for this property'
                : 'Select unit type (all properties shown)'
              : 'No Rentlio unit types available'}
        </option>
        {availableOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === 'string' ? option.label : getTranslation(option.label, i18n)}
          </option>
        ))}
      </select>

      {translatedDescription && <div className="field-description">{translatedDescription}</div>}
    </div>
  )
}

export default RentlioUnitTypeField
