import React from 'react'
import { HeroBlock } from '@/blocks/Hero'
import { FeaturesBlock } from '@/blocks/Features'
import { SectionBlock } from '@/blocks/Section'

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
            return (
              <HeroBlock
                key={index}
                heading={block.heading}
                subheading={block.subheading}
                sectionId={block.sectionId}
              />
            )
          case 'features':
            return (
              <FeaturesBlock
                key={index}
                features={block.features}
                heading={block.heading}
                sectionId={block.sectionId}
              />
            )
          case 'section':
            return (
              <SectionBlock
                key={index}
                title={block.title}
                sectionId={block.sectionId}
                backgroundColor={block.backgroundColor}
                blocks={block.blocks}
                padding={block.padding}
                height={block.height}
                customHeight={block.customHeight}
              />
            )
          default:
            console.warn(`Unknown block type: ${block.blockType}`)
            return null
        }
      })}
    </div>
  )
}
