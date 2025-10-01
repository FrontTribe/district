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

  // Listen for property changes
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
      if (value && !availableOptions.find((opt) => opt.value === value)) {
        setValue(null)
      }
    }
    window.addEventListener('rentlio:propertyChanged', handler)
    return () => window.removeEventListener('rentlio:propertyChanged', handler)
  }, [resolvedMap, value, setValue])

  const availableOptions = selectedPropertyId ? resolvedMap[selectedPropertyId] || [] : []

  const handleChange = (selected: Option | Option[]) => {
    if (Array.isArray(selected)) return
    const nextValue = selected?.value ?? null
    setValue(nextValue)
  }

  return (
    <div className="field-type rentlio-unit-type">
      <SelectInput
        path={path}
        name={path}
        label={translatedLabel}
        required={required}
        value={value || undefined}
        onChange={(selected) => {
          if (Array.isArray(selected)) return
          const nextValue = selected?.value ?? null
          setValue(nextValue)
        }}
        options={availableOptions.map((option) => ({
          label:
            typeof option.label === 'string' ? option.label : getTranslation(option.label, i18n),
          value: option.value,
        }))}
        isClearable
        readOnly={!selectedPropertyId || isLoading}
        placeholder={
          !selectedPropertyId
            ? 'Select a property first'
            : isLoading
              ? 'Loading Rentlio unit types...'
              : availableOptions.length > 0
                ? 'Select unit type'
                : 'No Rentlio unit types available'
        }
      />

      {translatedDescription && <div className="field-description">{translatedDescription}</div>}
    </div>
  )
}

export default RentlioUnitTypeField
