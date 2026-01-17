'use client'

import React, { useState } from 'react'

export default function RealEstateContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setSubmitting(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 1000)
  }

  return (
    <section className="re-contact">
      <div className="re-contact__container">
        <div className="re-contact__grid">
          <div className="re-contact__left">
            <div className="re-contact__eyebrow">KONTAKT</div>
            <h2 className="re-contact__heading">
              <span className="re-contact__heading-line">Javite nam se</span>
            </h2>
            <p className="re-contact__text">
              Imate pitanja o našim projektima? Želite rezervirati pregled stana? Kontaktirajte nas
              putem bilo koje od dostupnih metoda komunikacije.
            </p>
            <div className="re-contact__info">
              <div className="re-contact__info-item">
                <span className="re-contact__info-label">Adresa:</span>
                <span className="re-contact__info-value">Ilica 123, 10000 Zagreb, Hrvatska</span>
              </div>
              <div className="re-contact__info-item">
                <span className="re-contact__info-label">Email:</span>
                <a href="mailto:info@district-realestate.com" className="re-contact__info-link">
                  info@district-realestate.com
                </a>
              </div>
              <div className="re-contact__info-item">
                <span className="re-contact__info-label">Telefon:</span>
                <a href="tel:+385123456789" className="re-contact__info-link">
                  +385 1 234 567 89
                </a>
              </div>
              <div className="re-contact__social">
                <a
                  href="https://instagram.com/districtrealestate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="re-contact__social-link"
                >
                  Instagram
                </a>
                <a
                  href="https://facebook.com/districtrealestate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="re-contact__social-link"
                >
                  Facebook
                </a>
              </div>
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
                  <input
                    type="text"
                    name="name"
                    placeholder="Ime i Prezime"
                    value={formData.name}
                    onChange={handleChange}
                    className="re-contact__input"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="re-contact__input"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={handleChange}
                    className="re-contact__input"
                  />
                  <textarea
                    name="message"
                    placeholder="Poruka"
                    value={formData.message}
                    onChange={handleChange}
                    className="re-contact__textarea"
                    rows={7}
                    required
                  />
                </div>
                <button type="submit" className="re-contact__submit" disabled={submitting}>
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
