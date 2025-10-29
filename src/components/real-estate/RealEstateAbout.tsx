'use client'

import React from 'react'

export default function RealEstateAbout() {
  return (
    <section className="re-about">
      <div className="re-about__container">
        <div className="re-about__grid">
          <div className="re-about__left">
            <div className="re-about__eyebrow">O NAMA</div>
            <h2 className="re-about__heading">
              <span className="re-about__heading-line">Izvrsnost u</span>
              <span className="re-about__heading-line">real estate</span>
              <span className="re-about__heading-line">projektiranju</span>
            </h2>
          </div>
          <div className="re-about__right">
            <p className="re-about__text">
              District Real Estate je vodeća agencija za nekretnine koja se specializira za razvoj i
              prodaju luksuznih stambenih projekata. Naša misija je stvoriti prostor gdje se
              suvremeni dizajn susreće s funkcionalnošću, gdje svaki detalj ima svoj smisao i gdje
              se kvaliteta ne kompromitira.
            </p>
            <p className="re-about__text">
              S višegodišnjim iskustvom i timom strastvenih profesionalaca, preobrazili smo više od
              50 projekata u Zagrebu i okolici, osiguravajući našim klijentima vrhunsku kvalitetu
              življenja i investicijsku vrijednost.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
