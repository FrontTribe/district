import React from 'react'
import { HeroBlock } from '@/blocks/Hero'
import { FeaturesBlock } from '@/blocks/Features'

type BlockData = {
  blockType: string
  [key: string]: any
}

type BlockRendererProps = {
  blocks: BlockData[]
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className="blocks-container">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={index} heading={block.heading} subheading={block.subheading} />
          case 'features':
            return <FeaturesBlock key={index} features={block.features} />
          default:
            console.warn(`Unknown block type: ${block.blockType}`)
            return null
        }
      })}
    </div>
  )
}
