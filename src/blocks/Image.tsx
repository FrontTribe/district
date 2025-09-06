import { Block } from 'payload'
import React from 'react'
import ImageAnimated from '@/blocks/ImageAnimated'

const Image: Block = {
  slug: 'image',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Contained (max 1200px)', value: 'contained' },
      ],
      defaultValue: 'full',
    },
    {
      name: 'align',
      type: 'select',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export const ImageBlock: React.FC<{
  media: any
  alt?: string
  caption?: string
  layout?: 'full' | 'contained'
  align?: 'left' | 'center' | 'right'
  sectionId?: string
}> = ({ media, alt, caption, layout = 'contained', align = 'center', sectionId }) => {
  const url = typeof media === 'string' ? media : media?.url
  const width = typeof media === 'string' ? undefined : media?.width
  const height = typeof media === 'string' ? undefined : media?.height

  const wrapperClass = ['image-block']
  if (layout === 'full') wrapperClass.push('image-block--full')
  if (layout === 'contained') wrapperClass.push('image-block--contained')
  if (align) wrapperClass.push(`image-block--align-${align}`)

  return (
    <section id={sectionId} className={wrapperClass.join(' ')}>
      <div className="image-block__inner">
        {url && (
          <ImageAnimated
            src={url}
            alt={alt || ''}
            width={width}
            height={height}
            caption={caption}
            className="image-block__img"
          />
        )}
        {!url && caption && <figcaption className="image-block__caption">{caption}</figcaption>}
      </div>
    </section>
  )
}

export default Image
