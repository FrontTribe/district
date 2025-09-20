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
}

type Block = NonNullable<Page['layout']>[number]

export const BlockRenderer: React.FC<{ blocks: Page['layout'] | undefined | null }> = ({
  blocks,
}) => {
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
          // @ts-expect-error
          return <BlockComponent key={key} {...block} />
        }

        console.warn(`[BlockRenderer] No component found for block type: ${blockType}`)
        return (
          <div key={index}>
            The component for block type &quot;{blockType}&quot; does not exist.
          </div>
        )
      })}
    </div>
  )
}
