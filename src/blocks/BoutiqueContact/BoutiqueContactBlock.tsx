'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Form } from '@/payload-types'

type Props = {
  headingEyebrow?: string
  heading: string
  leftText?: string
  address?: string
  email?: string
  phone?: string
  form?: string | Form
  sectionId?: string
}

export const BoutiqueContactBlock: React.FC<Props> = ({
  headingEyebrow,
  heading,
  leftText,
  address,
  email,
  phone,
  form,
  sectionId,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      const targets = q(
        '.bc-eyebrow, .bc-heading-line, .bc-left p, .bc-contact a, .bc-contact span, .bc-form',
      )
      gsap.set(targets, { opacity: 0, y: 20 })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Resolve form ID
  const formId = useMemo(() => {
    if (!form) return undefined
    if (typeof form === 'string') return form
    return form.id
  }, [form])

  // Build fields by reading Form document (fields are included via depth=2 when pages load)
  const fields = useMemo(() => {
    if (!form || typeof form === 'string') return []
    return (form.fields || []).map((f: any) => ({ ...f }))
  }, [form])

  const [values, setValues] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: string, value: any) => setValues((v) => ({ ...v, [name]: value }))

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
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id={sectionId} className="boutique-contact">
      <div className="boutique-contact__grid">
        <div className="bc-header">
          {headingEyebrow && <div className="bc-eyebrow">{headingEyebrow}</div>}
          <h2 className="bc-heading">
            {heading.split('\n').map((line, i) => (
              <span key={i} className="bc-heading-line">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="bc-left">
          {leftText && <p>{leftText}</p>}
          <div className="bc-contact">
            {address && <span className="bc-address">{address}</span>}
            {email && (
              <a className="bc-email" href={`mailto:${email}`}>
                {email}
              </a>
            )}
            {phone && <span className="bc-phone">tel: {phone}</span>}
          </div>
        </div>

        <div className="bc-right">
          {submitted ? (
            <div className="bc-success">Thank you. We will get back to you shortly.</div>
          ) : (
            <form className="bc-form" onSubmit={handleSubmit}>
              <div className="bc-fields">
                {fields.map((field: any) => {
                  const key = `${field.blockType}-${field.name}-${field.id || field.label}`
                  const common = {
                    value: values[field.name] || '',
                    onChange: (e: any) => handleChange(field.name, e.target.value),
                    required: Boolean(field.required),
                    placeholder: field.placeholder || field.label || field.name,
                    name: field.name,
                  }
                  if (field.blockType === 'text') {
                    return <input key={key} className="bc-input" type="text" {...common} />
                  }
                  if (field.blockType === 'email') {
                    return <input key={key} className="bc-input" type="email" {...common} />
                  }
                  if (field.blockType === 'textarea') {
                    return <textarea key={key} className="bc-textarea" rows={7} {...common} />
                  }
                  if (field.blockType === 'select') {
                    return (
                      <select key={key} className="bc-input" {...common}>
                        {(field.options || []).map((opt: any) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )
                  }
                  return null
                })}
              </div>
              {error && <div className="bc-error">{error}</div>}
              <button className="bc-submit" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
