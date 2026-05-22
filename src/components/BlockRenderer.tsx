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
import type { TenantVisualTheme } from '@/utils/tenantVisualTheme'
import { RealEstateLandingNavBlock } from '@/blocks/RealEstateLandingNav'
import { RealEstateLandingHeroBlock } from '@/blocks/RealEstateLandingHero'
import { RealEstateLandingMarqueeBlock } from '@/blocks/RealEstateLandingMarquee'
import { RealEstateLandingManifestoBlock } from '@/blocks/RealEstateLandingManifesto'
import { RealEstateLandingTypologyBlock } from '@/blocks/RealEstateLandingTypology'
import { RealEstateLandingGalleryBlock } from '@/blocks/RealEstateLandingGallery'
import { RealEstateLandingCurrentProjectBlock } from '@/blocks/RealEstateLandingCurrentProject'
import { RealEstateLandingPartnerBlock } from '@/blocks/RealEstateLandingPartner'
import { RealEstateLandingInquiryBlock } from '@/blocks/RealEstateLandingInquiry'
import { RealEstateLandingUnitBrowserBlock } from '@/blocks/RealEstateLandingUnitBrowser'
import { RealEstateLandingPastProjectsBlock } from '@/blocks/RealEstateLandingPastProjects'

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
  'real-estate-landing-nav': RealEstateLandingNavBlock,
  'real-estate-landing-hero': RealEstateLandingHeroBlock,
  'real-estate-landing-marquee': RealEstateLandingMarqueeBlock,
  'real-estate-landing-manifesto': RealEstateLandingManifestoBlock,
  'real-estate-landing-typology': RealEstateLandingTypologyBlock,
  'real-estate-landing-gallery': RealEstateLandingGalleryBlock,
  'real-estate-landing-current-project': RealEstateLandingCurrentProjectBlock,
  'real-estate-landing-partner': RealEstateLandingPartnerBlock,
  'real-estate-landing-inquiry': RealEstateLandingInquiryBlock,
  'real-estate-landing-unit-browser': RealEstateLandingUnitBrowserBlock,
  'real-estate-landing-past-projects': RealEstateLandingPastProjectsBlock,
}

type _Block = NonNullable<Page['layout']>[number]

const LANDING_PREFIX = 'real-estate-landing-'

function isLandingBlockType(blockType?: string | null) {
  return !!blockType?.startsWith(LANDING_PREFIX)
}

function renderSingleBlock(
  block: _Block,
  index: number,
  locale: string,
  tenantVisualTheme: TenantVisualTheme,
) {
  const { blockType } = block

  /** Podnožje RE landingske stranice dolazi iz kolekcije `footer`, ne iz layout bloka (stari zapisi mogu još imati blok). */
  if (blockType === 'real-estate-landing-page-footer') {
    return null
  }

  if (blockType && blockType in blockComponents) {
    const BlockComponent = blockComponents[blockType as keyof typeof blockComponents]
    const key = block.id ? `${block.id}-${index}` : index
    return (
      // @ts-expect-error - Block component props are dynamically typed based on block type
      <BlockComponent key={key} {...block} locale={locale} tenantVisualTheme={tenantVisualTheme} />
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
  tenantVisualTheme?: TenantVisualTheme
}> = ({ blocks, locale = 'en', tenantVisualTheme = 'default' }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  const proseClassName =
    tenantVisualTheme === 'boutique' ? 'boutique-page-blocks' : proseBlockWrapperClass

  const nodes: React.ReactNode[] = []
  let proseBuffer: _Block[] = []

  const flushProse = (key: string) => {
    if (proseBuffer.length === 0) return
    nodes.push(
      <div key={key} className={proseClassName}>
        {proseBuffer.map((block, idx) => renderSingleBlock(block, idx, locale, tenantVisualTheme))}
      </div>,
    )
    proseBuffer = []
  }

  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    const t = block.blockType ?? ''

    if (i === 0 && t === 'three-columns') {
      flushProse(`prose-before-${i}`)
      nodes.push(renderSingleBlock(block, i, locale, tenantVisualTheme))
      i++
      continue
    }

    if (isLandingBlockType(t)) {
      flushProse(`prose-before-${i}`)
      nodes.push(renderSingleBlock(block, i, locale, tenantVisualTheme))
      i++
      continue
    }

    proseBuffer.push(block)
    i++
  }

  flushProse('prose-tail')

  return <>{nodes}</>
}
