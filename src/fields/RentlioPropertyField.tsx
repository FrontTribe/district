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
      <SelectInput
        path={path}
        name={path}
        label={translatedLabel}
        required={required}
        value={value || ''}
        onChange={(val) => {
          const nextValue = Array.isArray(val) ? null : (val?.value ?? null)
          setValue(nextValue)
          const changeEvent = new CustomEvent('rentlio:propertyChanged', {
            detail: { propertyId: nextValue },
          })
          window.dispatchEvent(changeEvent)

          propertyStateManager.setPropertyId(nextValue as string | null)
        }}
        options={resolvedOptions.map((option) => ({
          label:
            typeof option.label === 'string' ? option.label : getTranslation(option.label, i18n),
          value: option.value,
        }))}
        isClearable
        readOnly={isLoading}
      />
      {translatedDescription && <div className="field-description">{translatedDescription}</div>}
    </div>
  )
}

export default RentlioPropertyField
