'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { getTranslation } from '@payloadcms/translations'
import { useTranslation, useField, SelectInput } from '@payloadcms/ui'
import { propertyStateManager } from '@/utils/propertyStateManager'

type Option<T = string> = {
  label: string
  value: T
}

type Props = {
  path: string
  label?: string | Record<string, string>
  description?: string | Record<string, string>
  required?: boolean
  options?: Option<string>[]
}

const optionsCache = {
  data: null as Option<string>[] | null,
  promise: null as Promise<Option<string>[]> | null,
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
  const [resolvedOptions, setResolvedOptions] = useState<Option<string>[]>(
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

  const loadOptions = async (): Promise<Option<string>[]> => {
    if (optionsCache.promise) return optionsCache.promise
    optionsCache.promise = (async () => {
      const res = await fetch('/api/rentlio/options')
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      if (data.propertyOptions && Array.isArray(data.propertyOptions)) {
        optionsCache.data = data.propertyOptions
        return data.propertyOptions
      }
      throw new Error('Invalid data structure')
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
      .catch(() => setIsLoading(false))
  }, [options])

  return (
    <div className="field-type rentlio-property">
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
          console.log('[Property] onChange triggered:', {
            selectedValue: e.target.value,
            nextValue,
            currentValue: value,
          })
          setValue(nextValue)

          const changeEvent = new CustomEvent('rentlio:propertyChanged', {
            detail: { propertyId: nextValue },
          })
          window.dispatchEvent(changeEvent)

          propertyStateManager.setPropertyId(nextValue as string | null)
        }}
        disabled={isLoading}
        className="field-input"
      >
        <option value="">
          {isLoading ? 'Loading Rentlio properties...' : 'Select a property'}
        </option>
        {resolvedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === 'string' ? option.label : getTranslation(option.label, i18n)}
          </option>
        ))}
      </select>

      {translatedDescription && <div className="field-description">{translatedDescription}</div>}
    </div>
  )
}

export default RentlioPropertyField
