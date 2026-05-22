'use client'

import React, { useId, useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitWords } from './shared/SplitWords'
import { revealWordsIn } from './shared/revealWords'

export function RealEstateLandingInquiry({
  sectionId = 'kontakt',
  eyebrow,
  headingParts,
  introHtml,
  formActionUrl,
  formMethod,
  submitButtonLabel,
  disabledSubmitHelp,
  nameFieldLabel,
  emailFieldLabel,
  phoneFieldLabel,
  interestFieldLabel,
  messageFieldLabel,
  interestPlaceholder,
  messagePlaceholder,
  privacyHtml,
  interestOptions,
  contacts,
}: {
  sectionId?: string
  eyebrow: string
  headingParts: { text: string; italic?: boolean }[]
  introHtml?: string | null
  formActionUrl?: string | null
  formMethod?: 'GET' | 'POST' | null
  submitButtonLabel?: string | null
  disabledSubmitHelp?: string | null
  nameFieldLabel?: string | null
  emailFieldLabel?: string | null
  phoneFieldLabel?: string | null
  interestFieldLabel?: string | null
  messageFieldLabel?: string | null
  interestPlaceholder?: string | null
  messagePlaceholder?: string | null
  privacyHtml?: string | null
  interestOptions: { label: string; value: string }[]
  contacts: { label: string; valueHtml: string }[]
}) {
  const resolvedMethod: 'GET' | 'POST' = formMethod === 'GET' ? 'GET' : 'POST'
  const ref = useRef<HTMLElement>(null)
  const uid = useId().replace(/:/g, '')

  useLayoutEffect(() => {
    if (!ref.current || !gsap) return
    const ctx = gsap.context(() => {
      const head = ref.current?.querySelector('.cta h2')
      if (head) revealWordsIn(head as HTMLElement, { trigger: head, start: 'top 82%' })
    }, ref)
    return () => ctx.revert()
  }, [])

  const nameId = `re-inq-name-${uid}`
  const emailId = `re-inq-email-${uid}`
  const phoneId = `re-inq-phone-${uid}`
  const interestId = `re-inq-interest-${uid}`
  const messageId = `re-inq-msg-${uid}`

  return (
    <section ref={ref} id={sectionId} className="cta">
      <div className="cta__inner">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="serif">
            {headingParts.map((p, i) =>
              p.italic ? (
                <span key={i} className="it">
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

        <form
          className="cta__form"
          action={formActionUrl ?? undefined}
          method={formActionUrl ? resolvedMethod : undefined}
        >
          <div className="cta__field">
            <label htmlFor={nameId}>{nameFieldLabel ?? ''}</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required={!!formActionUrl} />
          </div>
          <div className="cta__field">
            <label htmlFor={emailId}>{emailFieldLabel ?? ''}</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required={!!formActionUrl} />
          </div>
          <div className="cta__field">
            <label htmlFor={phoneId}>{phoneFieldLabel ?? ''}</label>
            <input id={phoneId} name="phone" type="tel" autoComplete="tel" />
          </div>
          <div className="cta__field">
            <label htmlFor={interestId}>{interestFieldLabel ?? ''}</label>
            <select id={interestId} name="interest" defaultValue="" required={!!formActionUrl}>
              <option value="" disabled>
                {interestPlaceholder ?? ''}
              </option>
              {interestOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="cta__field">
            <label htmlFor={messageId}>{messageFieldLabel ?? ''}</label>
            <textarea
              id={messageId}
              name="message"
              rows={3}
              placeholder={messagePlaceholder ?? undefined}
            />
          </div>
          <button type="submit" className="cta__submit" disabled={!formActionUrl}>
            <span>
              {formActionUrl
                ? (submitButtonLabel?.trim() ?? '')
                : (disabledSubmitHelp?.trim() ?? '')}
            </span>
            <i />
          </button>
        </form>
      </div>

      {privacyHtml?.trim() ? (
        <div className="cta__privacy sans" dangerouslySetInnerHTML={{ __html: privacyHtml }} />
      ) : null}

      <div className="cta__contacts">
        {contacts.map((c) => (
          <div key={c.label} className="cell">
            <div className="lbl">{c.label}</div>
            <div className="v" dangerouslySetInnerHTML={{ __html: c.valueHtml }} />
          </div>
        ))}
      </div>
    </section>
  )
}
