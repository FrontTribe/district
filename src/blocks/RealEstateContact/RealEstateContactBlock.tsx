'use client'

import React, { useMemo } from 'react'
import type { Form } from '@/payload-types'

export const RealEstateContactBlock: React.FC<{
  heading: string
  description?: string
  address?: string
  email?: string
  phone?: string
  instagramUrl?: string
  facebookUrl?: string
  form?: string | Form
  sectionId?: string
}> = ({
  heading,
  description,
  address,
  email,
  phone,
  instagramUrl,
  facebookUrl,
  form,
  sectionId,
}) => {
  const formId = useMemo(() => {
    if (!form) return undefined
    if (typeof form === 'string') return form
    return form.id
  }, [form])

  const fields = useMemo(() => {
    if (!form || typeof form === 'string') return []
    return (form.fields || []).map((f: any) => ({ ...f }))
  }, [form])

  const [values, setValues] = React.useState<Record<string, any>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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
    <section className="re-contact" id={sectionId}>
      <div className="re-contact__container">
        <div className="re-contact__grid">
          <div className="re-contact__left">
            <div className="re-contact__eyebrow">KONTAKT</div>
            <h2 className="re-contact__heading">
              <span className="re-contact__heading-line">{heading}</span>
            </h2>
            {description && <p className="re-contact__text">{description}</p>}
            <div className="re-contact__info">
              {address && (
                <div className="re-contact__info-item">
                  <span className="re-contact__info-label">Adresa:</span>
                  <span className="re-contact__info-value">{address}</span>
                </div>
              )}
              {email && (
                <div className="re-contact__info-item">
                  <span className="re-contact__info-label">Email:</span>
                  <a href={`mailto:${email}`} className="re-contact__info-link">
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="re-contact__info-item">
                  <span className="re-contact__info-label">Telefon:</span>
                  <a href={`tel:${phone}`} className="re-contact__info-link">
                    {phone}
                  </a>
                </div>
              )}
              {(instagramUrl || facebookUrl) && (
                <div className="re-contact__social">
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="re-contact__social-link"
                    >
                      Instagram
                    </a>
                  )}
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="re-contact__social-link"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="re-contact__right">
            {submitted ? (
              <div className="re-contact__success">
                <h3>Hvala vam!</h3>
                <p>Vaša poruka je poslana. Kontaktirat ćemo vas uskoro.</p>
              </div>
            ) : (
              <form className="re-contact__form" onSubmit={handleSubmit}>
                <div className="re-contact__fields">
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
                      return (
                        <input key={key} className="re-contact__input" type="text" {...common} />
                      )
                    }
                    if (field.blockType === 'email') {
                      return (
                        <input key={key} className="re-contact__input" type="email" {...common} />
                      )
                    }
                    if (field.blockType === 'textarea') {
                      return (
                        <textarea key={key} className="re-contact__textarea" rows={7} {...common} />
                      )
                    }
                    if (field.blockType === 'select') {
                      return (
                        <select key={key} className="re-contact__input" {...common}>
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
                {error && <div className="re-contact__error">{error}</div>}
                <button className="re-contact__submit" type="submit" disabled={submitting}>
                  {submitting ? 'Slanje...' : 'POŠALJI'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
