import React from 'react'
import { Page } from '@/payload-types'
import { HeroBlock } from '@/blocks/Hero'
import { FeaturesBlock } from '@/blocks/Features'
import { SectionBlock } from '@/blocks/Section'
import { ThreeColumnsBlock } from '@/blocks/ThreeColumns'
import { BotiqueIntroBlock } from '@/blocks/BotiqueIntro'
import { BoutiqueContactBlock } from '@/blocks/BoutiqueContact'
import { RoomsBlock } from '@/blocks/Rooms'
import { ImageBlock } from '@/blocks/Image'
import { RooftopBlock } from '@/blocks/Rooftop'
import { RooftopFeaturesBlock } from '@/blocks/RooftopFeatures'
import { LocationBlock } from '@/blocks/Location'
import { ConceptBarMenuBlock } from '@/blocks/ConceptBarMenu'
import { JobOpportunityBlock } from '@/blocks/JobOpportunity'
import { ImageGridBlock } from '@/blocks/ImageGrid'
import { IntroBlock } from '@/blocks/Intro'
import { FloorPlanBlock } from '@/blocks/FloorPlan'
import { RealEstateHeroBlock } from '@/blocks/RealEstateHero'
import { RealEstateAboutUsBlock } from '@/blocks/RealEstateAboutUs'
import { RealEstateProjectsWeDidBlock } from '@/blocks/RealEstateProjectsWeDid'
import { RealEstateCurrentProjectsBlock } from '@/blocks/RealEstateCurrentProjects'
import { RealEstateLiveCameraBlock } from '@/blocks/RealEstateLiveCamera'
import { RealEstateLookingForJobBlock } from '@/blocks/RealEstateLookingForJob'
import { RealEstateContactBlock } from '@/blocks/RealEstateContact'
import { AnchorBlock } from '@/blocks/Anchor'

const blockComponents = {
  section: SectionBlock,
  hero: HeroBlock,
  features: FeaturesBlock,
  'three-columns': ThreeColumnsBlock,
  'botique-intro': BotiqueIntroBlock,
  'boutique-contact': BoutiqueContactBlock,
  rooms: RoomsBlock,
  image: ImageBlock,
  rooftop: RooftopBlock,
  'rooftop-features': RooftopFeaturesBlock,
  location: LocationBlock,
  'concept-bar-menu': ConceptBarMenuBlock,
  'job-opportunity': JobOpportunityBlock,
  intro: IntroBlock,
  'image-grid': ImageGridBlock,
  'floor-plan': FloorPlanBlock,
  'real-estate-hero': RealEstateHeroBlock,
  'real-estate-about-us': RealEstateAboutUsBlock,
  'real-estate-projects-we-did': RealEstateProjectsWeDidBlock,
  'real-estate-current-projects': RealEstateCurrentProjectsBlock,
  'real-estate-live-camera': RealEstateLiveCameraBlock,
  'real-estate-looking-for-job': RealEstateLookingForJobBlock,
  'real-estate-contact': RealEstateContactBlock,
  anchor: AnchorBlock,
}

type _Block = NonNullable<Page['layout']>[number]

export const BlockRenderer: React.FC<{
  blocks: Page['layout'] | undefined | null
  locale?: string
}> = ({ blocks, locale = 'en' }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const BlockComponent = blockComponents[blockType as keyof typeof blockComponents]
          const key = block.id ? `${block.id}-${index}` : index
          // @ts-expect-error - Block component props are dynamically typed based on block type
          return <BlockComponent key={key} {...block} locale={locale} />
        }

        return (
          <div key={index}>
            The component for block type &quot;{blockType}&quot; does not exist.
          </div>
        )
      })}
    </div>
  )
}
