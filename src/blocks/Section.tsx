import { Block } from 'payload'
import React from 'react'
import Hero from '@/blocks/Hero'
import Features from '@/blocks/Features'
import { BlockRenderer } from '@/components/BlockRenderer'

const Section: Block = {
  slug: 'section',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      required: true,
      admin: {
        description: 'Unique ID for this section (used for menu navigation)',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark Gray', value: 'dark-gray' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ],
      defaultValue: 'default',
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Section Blocks',
      blocks: [Hero, Features],
    },
    {
      name: 'padding',
      type: 'select',
      label: 'Padding',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'height',
      type: 'select',
      label: 'Section Height',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Full Screen', value: 'full' },
        { label: 'Custom', value: 'custom' },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'customHeight',
      type: 'text',
      label: 'Custom Height',
      admin: {
        description: 'Custom height value (e.g., "500px", "50vh", "100%")',
        condition: (data) => data.height === 'custom',
      },
    },
  ],
}

// React component to render the Section block
export const SectionBlock: React.FC<{
  title?: string
  sectionId: string
  backgroundColor?: string
  blocks?: any[]
  padding?: string
  height?: string
  customHeight?: string
}> = ({
  title,
  sectionId,
  backgroundColor = 'default',
  blocks,
  padding = 'medium',
  height = 'auto',
  customHeight,
}) => {
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'light-gray':
        return 'bg-gray-100'
      case 'dark-gray':
        return 'bg-gray-800 text-white'
      case 'primary':
        return 'bg-blue-600 text-white'
      case 'secondary':
        return 'bg-green-600 text-white'
      default:
        return 'bg-white'
    }
  }

  const getPaddingClass = () => {
    switch (padding) {
      case 'small':
        return 'py-8'
      case 'large':
        return 'py-16'
      case 'xl':
        return 'py-24'
      default:
        return 'py-12'
    }
  }

  const getHeightStyle = () => {
    if (height === 'custom' && customHeight) {
      return { minHeight: customHeight }
    }

    switch (height) {
      case 'small':
        return { minHeight: '200px' }
      case 'medium':
        return { minHeight: '400px' }
      case 'large':
        return { minHeight: '600px' }
      case 'full':
        return { minHeight: '100vh' }
      default:
        return {}
    }
  }

  return (
    <section
      id={sectionId}
      className={`section-block ${getBackgroundClass()} ${getPaddingClass()} scroll-margin-top-80`}
      style={getHeightStyle()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
        )}
        {blocks && blocks.length > 0 && (
          <div className="section-blocks">
            <BlockRenderer blocks={blocks} />
          </div>
        )}
      </div>
    </section>
  )
}

export default Section
