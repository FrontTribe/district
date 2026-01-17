'use client'

import React from 'react'

export default function RealEstateSpecs() {
  return (
    <section className="re-specs">
      <div className="re-specs__container">
        <div className="re-specs__header">
          <div className="re-specs__eyebrow">SPECIFIKACIJE</div>
          <h2 className="re-specs__heading">
            <span className="re-specs__heading-line">Tehnički Opis i</span>
            <span className="re-specs__heading-line">Specifikacija Stanova</span>
          </h2>
        </div>
        <div className="re-specs__grid">
          <div className="re-specs__left">
            <h3 className="re-specs__subheading">Opis</h3>
            <p className="re-specs__text">
              Naši stanovi dizajnirani su prema najvišim standardima suvremene arhitekture i
              graditeljstva. Svaki prostor je pažljivo planiran kako bi maksimalno iskoristio
              dostupnu površinu, pružajući funkcionalan i udoban životni prostor.
            </p>
            <p className="re-specs__text">
              Svi stanovi uključuju visokokvalitetne materijale, energijski učinkovite sustave i
              pametne kućne tehnologije koje osiguravaju optimalnu razinu komfora i održivosti.
            </p>
            <ul className="re-specs__list">
              <li>Premium podne obloge (parket, keramika)</li>
              <li>Kvalitetna stolarija i izolacija</li>
              <li>Klima uređaji u svakoj sobi</li>
              <li>Podno grijanje u kupaonici</li>
              <li>Suvremeni kuhinjski elementi</li>
              <li>Balkoni i terase s predviđenim priključcima</li>
            </ul>
          </div>
          <div className="re-specs__right">
            <h3 className="re-specs__subheading">Specifikacija</h3>
            <div className="re-specs__table">
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Konstrukcija</div>
                <div className="re-specs__table-value">Armirano-betonska konstrukcija</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Zidovi</div>
                <div className="re-specs__table-value">Gips-kartonski s izolacijom</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Podovi</div>
                <div className="re-specs__table-value">Parket ili keramičke pločice</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Stolarija</div>
                <div className="re-specs__table-value">PVC s trostrukim staklom</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Elektroinstalacija</div>
                <div className="re-specs__table-value">3-fazni priključak, pametna instalacija</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Sanitarije</div>
                <div className="re-specs__table-value">Premium sanitarne keramičke pločice</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Grijanje</div>
                <div className="re-specs__table-value">Centralno grijanje, klima uređaji</div>
              </div>
              <div className="re-specs__table-row">
                <div className="re-specs__table-label">Parking</div>
                <div className="re-specs__table-value">Podzemni parking, garažno mjesto</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
