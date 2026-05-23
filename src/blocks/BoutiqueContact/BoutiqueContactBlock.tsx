'use client'

import React, { useMemo, useState } from 'react'
import type { Form } from '@/payload-types'
import { renderBoutiqueHeroHeading } from '@/blocks/BoutiqueHeroContent'
import { BoutiqueChapterLabel } from '@/components/boutique-landing/BoutiqueChapterLabel'

type Channel = {
  type?: string | null
  label: string
  value: string
  href: string
}

type IntelRow = { label: string; value: string }

type Props = {
  chapterNum?: string | null
  chapterLabel?: string | null
  headingEyebrow?: string
  heading: string
  leadText?: string | null
  leftText?: string
  channels?: Channel[] | null
  intelRows?: IntelRow[] | null
  address?: string
  email?: string
  phone?: string
  formNote?: string | null
  successHeading?: string | null
  successMessage?: string | null
  form?: string | Form
  sectionId?: string
  locale?: string
}

const COPY = {
  hr: {
    channelsTitle: 'Preferirani kanal',
    formTitle: 'Pošaljite poruku',
    newMessage: 'Nova poruka',
  },
  en: {
    channelsTitle: 'Preferred channel',
    formTitle: 'Send a message',
    newMessage: 'New message',
  },
  de: {
    channelsTitle: 'Bevorzugter Kanal',
    formTitle: 'Nachricht senden',
    newMessage: 'Neue Nachricht',
  },
} as const

function channelOpensNewTab(type?: string | null) {
  return type === 'instagram' || type === 'whatsapp'
}

export const BoutiqueContactBlock: React.FC<Props> = ({
  chapterNum,
  chapterLabel,
  heading,
  leadText,
  channels,
  intelRows,
  formNote,
  successHeading,
  successMessage,
  form,
  sectionId = 'kontakt',
  locale = 'hr',
}) => {
  const [activeChannel, setActiveChannel] = useState(0)
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.hr

  const formId = useMemo(() => {
    if (!form) return undefined
    if (typeof form === 'string') return form
    return form.id
  }, [form])

  const fieldMeta = useMemo(() => {
    if (!form || typeof form === 'string') return null
    const byName: Record<string, { label: string; required?: boolean; placeholder?: string; options?: { label: string; value: string }[] }> = {}
    for (const field of form.fields || []) {
      const f = field as Record<string, unknown>
      const name = String(f.name || '')
      if (!name) continue
      byName[name] = {
        label: String(f.label || name),
        required: Boolean(f.required),
        placeholder: f.placeholder ? String(f.placeholder) : undefined,
        options: (f.options as { label: string; value: string }[]) || undefined,
      }
    }
    return byName
  }, [form])

  const [values, setValues] = useState({
    naziv: '',
    email: '',
    telefon: '',
    tip: '',
    poruka: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayChannels =
    channels && channels.length > 0
      ? channels
      : [
          { type: 'email', label: 'E-mail', value: 'support@district.hr', href: 'mailto:support@district.hr' },
          { type: 'phone', label: 'Telefon', value: '+385 99 554 4337', href: 'tel:+385995544337' },
        ]

  const tipOptions = fieldMeta?.tip?.options ?? [
    { label: 'Rezervacija sobe', value: 'rezervacija' },
    { label: 'Najam rooftopa', value: 'rooftop' },
    { label: 'Poslovni boravak', value: 'poslovni' },
    { label: 'Posebna prilika', value: 'posebna' },
    { label: 'Drugo', value: 'drugo' },
  ]

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
      setValues({ naziv: '', email: '', telefon: '', tip: '', poruka: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id={sectionId} className="kontakt">
      <div className="kontakt-mast">
        <div className="kontakt-mast-inner">
          <BoutiqueChapterLabel chapterNum={chapterNum} chapterLabel={chapterLabel} data-reveal="fade-up" />
          <h2 className="kontakt-headline" data-reveal="lines">
            {renderBoutiqueHeroHeading(heading)}
          </h2>
          {leadText ? (
            <p className="kontakt-lead" data-reveal="fade-up" data-delay="0.1">
              {leadText}
            </p>
          ) : null}
        </div>
      </div>

      <div className="kontakt-grid">
        <aside className="kontakt-channels" data-reveal="fade-up">
          <span className="kontakt-col-num">No. 01</span>
          <h3>{copy.channelsTitle}</h3>
          <ul className="kontakt-channel-list">
            {displayChannels.map((ch, i) => (
              <li key={ch.label}>
                <a
                  href={ch.href}
                  className={`kontakt-channel${activeChannel === i ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveChannel(i)}
                  target={channelOpensNewTab(ch.type) ? '_blank' : undefined}
                  rel={channelOpensNewTab(ch.type) ? 'noopener noreferrer' : undefined}
                >
                  <span className="kontakt-channel-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="kontakt-channel-body">
                    <span className="kontakt-channel-label">{ch.label}</span>
                    <span className="kontakt-channel-val">{ch.value}</span>
                  </span>
                  <span className="kontakt-channel-arrow">→</span>
                </a>
              </li>
            ))}
          </ul>
          {intelRows && intelRows.length > 0 ? (
            <div className="kontakt-intel" data-reveal="stagger">
              {intelRows.map((row) => (
                <div key={row.label} className="kontakt-intel-row">
                  <span className="kontakt-intel-key">{row.label}</span>
                  <span className="kontakt-intel-val">{row.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </aside>

        <div className="kontakt-form-wrap" data-reveal="fade-up" data-delay="0.08">
          <span className="kontakt-col-num">No. 02</span>
          <h3>{copy.formTitle}</h3>

          {submitted ? (
            <div className="kontakt-sent">
              <div className="kontakt-sent-mark">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                  <circle cx="24" cy="24" r="22" />
                  <path
                    d="M14 24.5l7 7 13-14"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>{successHeading || 'Hvala vam.'}</h4>
              <p>
                {successMessage ||
                  'Poruka je zaprimljena. Javljamo se u roku od nekoliko sati, najčešće isti dan.'}
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSubmitted(false)
                  setValues({ naziv: '', email: '', telefon: '', tip: '', poruka: '' })
                }}
              >
                {copy.newMessage} <span className="arrow">→</span>
              </button>
            </div>
          ) : (
            <form className="kontakt-form" onSubmit={handleSubmit}>
              <label className="kfield">
                <span className="kfield-label">
                  {fieldMeta?.naziv?.label ?? 'Ime i prezime'} <em>·</em>
                </span>
                <input
                  type="text"
                  name="naziv"
                  required
                  value={values.naziv}
                  onChange={(e) => setValues((v) => ({ ...v, naziv: e.target.value }))}
                  placeholder={fieldMeta?.naziv?.placeholder ?? 'Ana Horvat'}
                />
              </label>
              <div className="kfield-row">
                <label className="kfield">
                  <span className="kfield-label">
                    {fieldMeta?.email?.label ?? 'E-mail'} <em>·</em>
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    placeholder={fieldMeta?.email?.placeholder ?? 'ana@email.hr'}
                  />
                </label>
                <label className="kfield">
                  <span className="kfield-label">{fieldMeta?.telefon?.label ?? 'Telefon'}</span>
                  <input
                    type="tel"
                    name="telefon"
                    value={values.telefon}
                    onChange={(e) => setValues((v) => ({ ...v, telefon: e.target.value }))}
                    placeholder={fieldMeta?.telefon?.placeholder ?? '+385 ...'}
                  />
                </label>
              </div>
              <label className="kfield">
                <span className="kfield-label">{fieldMeta?.tip?.label ?? 'Tip upita'}</span>
                <select
                  name="tip"
                  required
                  value={values.tip || tipOptions[0]?.value}
                  onChange={(e) => setValues((v) => ({ ...v, tip: e.target.value }))}
                >
                  {tipOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="kfield kfield-area">
                <span className="kfield-label">{fieldMeta?.poruka?.label ?? 'Poruka'}</span>
                <textarea
                  name="poruka"
                  rows={5}
                  value={values.poruka}
                  onChange={(e) => setValues((v) => ({ ...v, poruka: e.target.value }))}
                  placeholder={
                    fieldMeta?.poruka?.placeholder ??
                    'Recite nam što tražite — termine, posebne želje, broj gostiju, povod...'
                  }
                />
              </label>
              {error ? <p className="kontakt-error">{error}</p> : null}
              <div className="kontakt-form-foot">
                {formNote ? <span className="kontakt-form-note">{formNote}</span> : null}
                <button className="btn btn-solid" type="submit" disabled={submitting || !formId}>
                  <span className="btn__label">{submitting ? 'Šaljem…' : 'Pošalji upit'}</span>
                  <span className="arrow" aria-hidden>
                    →
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
