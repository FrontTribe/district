import { Block } from 'payload'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

const Text: Block = {
  slug: 'text',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for this section (used for menu navigation)',
      },
    },
  ],
}

export const TextBlock: React.FC<{
  heading: string
  content: any
  sectionId?: string
}> = ({ heading, content, sectionId }) => {
  return (
    <section id={sectionId} className="text-block">
      <div className="text-content">
        <h2 className="text-heading">{heading}</h2>
        <div className="text-body">
          <RichText data={content} />
        </div>
      </div>
    </section>
  )
}

export default Text
