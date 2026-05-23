'use client'

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import type { Form } from '@/payload-types'
import { InquirySelectField } from './InquirySelectField'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'
import {
  inquiryFormFieldsAreUsable,
  resolveInquiryFormFields,
} from '@/utils/reLandingInquiryFormFallback'

type FormField = NonNullable<Form['fields']>[number]

function resolveFormId(form: string | number | Form | null | undefined): string | undefined {
  if (form == null) return undefined
  if (typeof form === 'string' || typeof form === 'number') return String(form)
  return String(form.id)
}

function formHasFields(form: Form | null | undefined): form is Form {
  return inquiryFormFieldsAreUsable(form?.fields ?? undefined)
}

function renderFormField(
  field: FormField,
  values: Record<string, string>,
  onChange: (name: string, value: string) => void,
  uid: string,
) {
  if (field.blockType === 'message') return null

  const name = 'name' in field ? field.name : ''
  if (!name) return null

  const inputId = `re-inq-${name}-${uid}`
  const label = ('label' in field ? field.label?.trim() : undefined) || name
  const required = 'required' in field ? Boolean(field.required) : false
  const value = values[name] ?? ''
  const onFieldChange = (next: string) => onChange(name, next)

  if (field.blockType === 'textarea') {
    return (
      <div key={inputId} className="cta__field">
        <label htmlFor={inputId}>{label}</label>
        <textarea
          id={inputId}
          name={name}
          rows={3}
          required={required}
          placeholder={'placeholder' in field ? field.placeholder ?? undefined : undefined}
          value={value}
          onChange={(e) => onFieldChange(e.target.value)}
        />
      </div>
    )
  }

  if (field.blockType === 'select') {
    const selectField = field as {
      placeholder?: string | null
      options?: Array<{ label?: string | null; value?: string | null }>
    }
    const placeholder = selectField.placeholder?.trim() || '…'
    const options = (selectField.options ?? []).filter((opt) => opt.label && opt.value)
    return (
      <InquirySelectField
        key={inputId}
        id={inputId}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        value={value}
        options={options.map((opt) => ({ label: opt.label!, value: opt.value! }))}
        onChange={onFieldChange}
      />
    )
  }

  const inputType =
    field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'
  const autoComplete =
    name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'phone' ? 'tel' : undefined

  return (
    <div key={inputId} className="cta__field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        type={inputType}
        autoComplete={autoComplete}
        required={required}
        placeholder={'placeholder' in field ? field.placeholder ?? undefined : undefined}
        value={value}
        onChange={(e) => onFieldChange(e.target.value)}
      />
    </div>
  )
}

export function RealEstateLandingInquiry({
  sectionId = 'kontakt',
  eyebrow,
  headingParts,
  introHtml,
  form,
  locale = 'hr',
  submitButtonLabel,
  disabledSubmitHelp,
  successMessage,
}: {
  sectionId?: string
  eyebrow?: string | null
  headingParts: { text: string; italic?: boolean }[]
  introHtml?: string | null
  form?: string | number | Form | null
  locale?: string
  submitButtonLabel?: string | null
  disabledSubmitHelp?: string | null
  successMessage?: string | null
}) {
  const formId = resolveFormId(form)
  const [resolvedForm, setResolvedForm] = useState<Form | null>(() =>
    form && typeof form === 'object' && formHasFields(form) ? form : null,
  )
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    const seed = form && typeof form === 'object' ? form : null
    if (formHasFields(seed)) {
      setResolvedForm(seed)
      return
    }
    if (!formId) {
      setResolvedForm(null)
      return
    }

    const controller = new AbortController()
    setFormLoading(true)

    fetch(`/api/re-landing/inquiry-form?id=${encodeURIComponent(formId)}&locale=${locale}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc: Form | null) => {
        if (formHasFields(doc)) setResolvedForm(doc)
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setFormLoading(false)
      })

    return () => controller.abort()
  }, [form, formId, locale])

  const fields = useMemo(
    () => resolveInquiryFormFields(resolvedForm, locale),
    [resolvedForm, locale],
  )

  const ref = useRef<HTMLElement>(null)
  const uid = useId().replace(/:/g, '')
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const head = ref.current?.querySelector('.cta h2')
      if (head) revealWordsIn(head as HTMLElement, { trigger: head, start: 'top 82%' })
    }, ref)
    return () => ctx.revert()
  }, [])

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formId) return
    try {
      setSubmitting(true)
      setError(null)
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData: values }),
      })
      if (!res.ok) throw new Error('Failed to submit form')
      setSubmitted(true)
      setValues({})
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={ref} id={sectionId} className="cta">
      <div className="cta__inner">
        <div>
          {eyebrow?.trim() ? <div className="eyebrow">{eyebrow}</div> : null}
          <h2 className="serif">
            {headingParts.map((p, i) =>
              p.italic ? (
                <span key={i} className="it ac">
                  <SplitWords text={p.text} />{' '}
                </span>
              ) : (
                <span key={i}>
                  <SplitWords text={p.text} />{' '}
                </span>
              ),
            )}
          </h2>
          {introHtml?.trim() ? (
            <div className="cta__intro sans" dangerouslySetInnerHTML={{ __html: introHtml }} />
          ) : null}
        </div>

        {submitted ? (
          <div className="cta__success sans">
            {successMessage?.trim() ?? 'Hvala — javit ćemo vam se uskoro.'}
          </div>
        ) : (
          <form className="cta__form" onSubmit={handleSubmit}>
            {fields.map((field) => renderFormField(field, values, handleChange, uid))}
            {!fields.length && formId && formLoading ? (
              <div className="cta__form-loading sans">…</div>
            ) : null}
            {error ? <div className="cta__error sans">{error}</div> : null}
            <button type="submit" className="cta__submit" disabled={!formId || submitting}>
              <span>
                {!formId
                  ? (disabledSubmitHelp?.trim() ?? '')
                  : submitting
                    ? '…'
                    : (submitButtonLabel?.trim() ?? 'Pošalji')}
              </span>
              <i />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
