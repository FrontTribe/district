import { Block } from 'payload'
import React from 'react'
import { Page } from '@/payload-types'
import Hero from '@/blocks/Hero'
import Features from '@/blocks/Features'
import Text from '@/blocks/Text'
import { ThreeColumns } from '@/blocks/ThreeColumns'
import { HeroBlock } from '@/blocks/Hero'
import { FeaturesBlock } from '@/blocks/Features'
import { TextBlock } from '@/blocks/Text'
import { ThreeColumnsBlock } from '@/blocks/ThreeColumns'

const Section: Block = {
  slug: 'section',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              label: 'Section Content',
              blocks: [Hero, Features, Text, ThreeColumns],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'isFullHeight',
              type: 'checkbox',
              label: 'Full Height Section',
              defaultValue: false,
              admin: {
                description: 'Make this section take up the full viewport height',
              },
            },
            {
              name: 'container',
              type: 'select',
              label: 'Container Width',
              options: [
                { label: 'Full Width', value: 'full' },
                { label: '1440px Max Width', value: 'container' },
              ],
              defaultValue: 'container',
              admin: {
                description: 'Choose the container width for section content',
              },
            },
            {
              name: 'padding',
              type: 'group',
              label: 'Padding',
              fields: [
                {
                  name: 'top',
                  type: 'number',
                  label: 'Top (px)',
                  defaultValue: 40,
                },
                {
                  name: 'right',
                  type: 'number',
                  label: 'Right (px)',
                  defaultValue: 20,
                },
                {
                  name: 'bottom',
                  type: 'number',
                  label: 'Bottom (px)',
                  defaultValue: 40,
                },
                {
                  name: 'left',
                  type: 'number',
                  label: 'Left (px)',
                  defaultValue: 20,
                },
              ],
            },
          ],
        },
        {
          label: 'Background',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Background Color',
              admin: {
                description: 'CSS color value (e.g., #000000, rgb(0,0,0), black)',
              },
            },
            {
              name: 'backgroundMedia',
              type: 'group',
              label: 'Background Media',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Media Type',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Image', value: 'image' },
                    { label: 'Video', value: 'video' },
                  ],
                  defaultValue: 'none',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'image',
                  },
                },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'video',
                  },
                },
                {
                  name: 'overlay',
                  type: 'select',
                  label: 'Overlay',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Light', value: 'light' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Dark', value: 'dark' },
                  ],
                  defaultValue: 'none',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type !== 'none',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'sectionId',
              type: 'text',
              label: 'Section ID',
              admin: {
                description: 'Optional ID for this section (used for menu navigation)',
              },
            },
          ],
        },
      ],
    },
  ],
}

export const SectionBlock: React.FC<{
  isFullHeight?: boolean
  container?: 'full' | 'container'
  backgroundColor?: string
  backgroundMedia?: {
    type: 'none' | 'image' | 'video'
    image?: string | any
    video?: string | any
    overlay?: 'none' | 'light' | 'medium' | 'dark'
  }
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  blocks?: Page['layout']
  sectionId?: string
}> = ({
  isFullHeight = false,
  container = 'container',
  backgroundColor,
  backgroundMedia,
  padding = { top: 40, right: 20, bottom: 40, left: 20 },
  blocks,
  sectionId,
}) => {
  const sectionStyle: React.CSSProperties = {
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    backgroundColor: backgroundColor || undefined,
    position: 'relative',
    overflow: 'hidden',
  }

  if (isFullHeight) {
    sectionStyle.minHeight = '100vh'
    sectionStyle.display = 'flex'
    sectionStyle.alignItems = 'center'
  }

  const renderBackgroundMedia = () => {
    if (!backgroundMedia || backgroundMedia.type === 'none') {
      return null
    }

    if (backgroundMedia.type === 'image' && backgroundMedia.image) {
      const imageUrl =
        typeof backgroundMedia.image === 'string'
          ? backgroundMedia.image
          : backgroundMedia.image.url

      return (
        <div className="section-background-image">
          <img
            src={imageUrl}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          />
        </div>
      )
    }

    if (backgroundMedia.type === 'video' && backgroundMedia.video) {
      const videoUrl =
        typeof backgroundMedia.video === 'string'
          ? backgroundMedia.video
          : backgroundMedia.video.url

      return (
        <div className="section-background-video">
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )
    }

    return null
  }

  const contentClassName =
    container === 'full'
      ? 'section-content section-content--full'
      : 'section-content section-content--container'

  // Build section classes including overlay
  const sectionClasses = ['section-block']
  if (backgroundMedia?.overlay && backgroundMedia.overlay !== 'none') {
    sectionClasses.push(`section-overlay--${backgroundMedia.overlay}`)
  }

  return (
    <section id={sectionId} className={sectionClasses.join(' ')} style={sectionStyle}>
      {renderBackgroundMedia()}
      <div className={contentClassName} style={{ position: 'relative', zIndex: 10 }}>
        {blocks && blocks.length > 0 && <SectionBlockRenderer blocks={blocks} />}
      </div>
    </section>
  )
}

// Local block renderer to avoid circular dependency
const SectionBlockRenderer: React.FC<{ blocks: Page['layout'] | undefined | null }> = ({
  blocks,
}) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  const blockComponents = {
    hero: HeroBlock,
    features: FeaturesBlock,
    text: TextBlock,
    'three-columns': ThreeColumnsBlock,
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

        return (
          <div key={index}>
            The component for block type &quot;{blockType}&quot; does not exist.
          </div>
        )
      })}
    </div>
  )
}

export default Section
