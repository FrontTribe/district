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
}

type _Block = NonNullable<Page['layout']>[number]

function renderSingleBlock(block: _Block, index: number, locale: string) {
  const { blockType } = block

  if (blockType && blockType in blockComponents) {
    const BlockComponent = blockComponents[blockType as keyof typeof blockComponents]
    const key = block.id ? `${block.id}-${index}` : index
    return (
      // @ts-expect-error - Block component props are dynamically typed based on block type
      <BlockComponent key={key} {...block} locale={locale} />
    )
  }

  return (
    <div key={index}>
      The component for block type &quot;{blockType}&quot; does not exist.
    </div>
  )
}

const proseBlockWrapperClass = 'prose mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-10'

export const BlockRenderer: React.FC<{
  blocks: Page['layout'] | undefined | null
  locale?: string
}> = ({ blocks, locale = 'en' }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  const [first, ...rest] = blocks
  if (first?.blockType === 'three-columns') {
    return (
      <>
        {renderSingleBlock(first, 0, locale)}
        {rest.length > 0 ? (
          <div className={proseBlockWrapperClass}>{rest.map((b, i) => renderSingleBlock(b, i + 1, locale))}</div>
        ) : null}
      </>
    )
  }

  return <div className={proseBlockWrapperClass}>{blocks.map((block, index) => renderSingleBlock(block, index, locale))}</div>
}
