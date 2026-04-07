'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type RealEstateContactProps = {
  eyebrow?: string
  heading: string
  leftText?: string
  address?: string
  email?: string
  phone?: string
  sectionId?: string
}

export function RealEstateContact({
  eyebrow,
  heading,
  leftText,
  address,
  email,
  phone,
  sectionId = 'contact',
}: RealEstateContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(q('.re-contact__eyebrow, .re-contact__heading, .re-contact__left, .re-contact__form'), {
        opacity: 0,
        y: 24,
      })
      gsap.to(q('.re-contact__eyebrow, .re-contact__heading, .re-contact__left, .re-contact__form'), {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 82%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const form = e.currentTarget
      const data = new FormData(form)
      const body = Object.fromEntries(
        ['name', 'email', 'message'].map((key) => [key, data.get(key) ?? '']),
      )
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionData: body }),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setSubmitted(true)
      form.reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id={sectionId} className="re-contact">
      <div className="re-contact__container">
        <div className="re-contact__header">
          {eyebrow && <p className="re-contact__eyebrow">{eyebrow}</p>}
          <h2 className="re-contact__heading">{heading}</h2>
        </div>
        <div className="re-contact__grid">
          <div className="re-contact__left">
            {leftText && <p className="re-contact__intro">{leftText}</p>}
            <div className="re-contact__details">
              {address && <span className="re-contact__address">{address}</span>}
              {email && (
                <a className="re-contact__email" href={`mailto:${email}`}>
                  {email}
                </a>
              )}
              {phone && (
                <a className="re-contact__phone" href={`tel:${phone.replace(/\s/g, '')}`}>
                  {phone}
                </a>
              )}
            </div>
          </div>
          <div className="re-contact__right">
            {submitted ? (
              <div className="re-contact__success">
                Thank you. We will get back to you shortly.
              </div>
            ) : (
              <form className="re-contact__form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  className="re-contact__input"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="re-contact__input"
                  placeholder="Email"
                  required
                />
                <textarea
                  name="message"
                  className="re-contact__textarea"
                  rows={5}
                  placeholder="Message"
                  required
                />
                {error && <div className="re-contact__error">{error}</div>}
                <button type="submit" className="re-contact__submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
