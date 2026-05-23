'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

export type InquirySelectOption = { label: string; value: string }

export function InquirySelectField({
  id,
  name,
  label,
  placeholder,
  required,
  value,
  options,
  onChange,
}: {
  id: string
  name: string
  label: string
  placeholder: string
  required?: boolean
  value: string
  options: InquirySelectOption[]
  onChange: (value: string) => void
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = options.find((opt) => opt.value === value)
  const display = selected?.label ?? (value ? value : placeholder)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`cta__field cta__select${open ? ' is-open' : ''}`}>
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>

      <input type="hidden" name={name} value={value} required={required} readOnly />

      <button
        id={id}
        type="button"
        className={`cta__select-trigger sans${selected ? '' : ' is-placeholder'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{display}</span>
        <span className="cta__select-chevron" aria-hidden />
      </button>

      {open ? (
        <ul id={listId} className="cta__select-menu sans" role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`cta__select-option${isSelected ? ' is-selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
