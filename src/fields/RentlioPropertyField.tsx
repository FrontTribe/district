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
  options?: Option[]
}

const optionsCache = {
  data: null as Option[] | null,
  promise: null as Promise<Option[]> | null,
}

const RentlioPropertyField: React.FC<Props> = ({
  path,
  label,
  description,
  required,
  options = [],
}) => {
  const { value, setValue } = useField<string>({ path })
  const { i18n } = useTranslation()
  const [resolvedOptions, setResolvedOptions] = useState<Option[]>(
    options.length > 0 ? options : optionsCache.data || [],
  )
  const [isLoading, setIsLoading] = useState<boolean>(!options?.length && !optionsCache.data)

  const translatedLabel = useMemo(
    () => getTranslation(label || 'Rentlio Property', i18n),
    [label, i18n],
  )
  const translatedDescription = useMemo(
    () => (description ? getTranslation(description, i18n) : null),
    [description, i18n],
  )

  const loadOptions = async (): Promise<Option[]> => {
    if (optionsCache.promise) {
      return optionsCache.promise
    }
    optionsCache.promise = (async () => {
      try {
        const res = await fetch('/api/rentlio/options')
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }

        const data = await res.json()

        if (data.propertyOptions && Array.isArray(data.propertyOptions)) {
          optionsCache.data = data.propertyOptions
          return data.propertyOptions
        } else {
          throw new Error('Invalid data structure')
        }
      } catch (error) {
        optionsCache.promise = null
        throw error
      }
    })()

    return optionsCache.promise
  }

  useEffect(() => {
    if (options.length > 0) {
      setResolvedOptions(options)
      setIsLoading(false)
      return
    }

    if (optionsCache.data) {
      setResolvedOptions(optionsCache.data)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    loadOptions()
      .then((fetchedOptions) => {
        setResolvedOptions(fetchedOptions)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [options])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value || null
    setValue(nextValue)

    // Dispatch property change event
    const changeEvent = new CustomEvent('rentlio:propertyChanged', {
      detail: { propertyId: nextValue },
    })
    window.dispatchEvent(changeEvent)
  }

  return (
    <div className="field-type rentlio-property">
      <label className="field-label" htmlFor={path}>
        {translatedLabel}
        {required ? ' *' : null}
      </label>
      <select
        id={path}
        name={path}
        value={value || ''}
        onChange={handleChange}
        disabled={isLoading}
        className="field-input"
        required={required}
      >
        <option value="">
          {isLoading ? 'Loading properties...' : 'Select a property'}
        </option>
        {resolvedOptions.map((option) =>
          typeof option.label === 'string' ? (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {getTranslation(option.label, i18n)}
            </option>
          ),
        )}
      </select>
      {translatedDescription && (
        <div className="field-description">{translatedDescription}</div>
      )}
    </div>
  )
}

export default RentlioPropertyField
