'use client'

import React from 'react'
import RealEstateHero from './real-estate/RealEstateHero'
import RealEstateAbout from './real-estate/RealEstateAbout'
import RealEstateProjects from './real-estate/RealEstateProjects'
import RealEstateOffers from './real-estate/RealEstateOffers'
import RealEstateInteractive from './real-estate/RealEstateInteractive'
import RealEstateJob from './real-estate/RealEstateJob'
import RealEstateSpecs from './real-estate/RealEstateSpecs'
import RealEstateContact from './real-estate/RealEstateContact'
import './real-estate/RealEstateSections.scss'

export default function RealEstatePreview() {
  return (
    <div className="real-estate-preview">
      <RealEstateHero />
      <RealEstateAbout />
      <RealEstateProjects />
      <RealEstateOffers />
      <RealEstateInteractive />
      <RealEstateJob />
      <RealEstateSpecs />
      <RealEstateContact />
    </div>
  )
}
