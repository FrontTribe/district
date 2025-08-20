import { Block } from 'payload'
import React from 'react'

const ThreeColumns: Block = {
  slug: 'three-columns',
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          admin: {
            description: 'Optional background image for this column',
          },
        },
        {
          name: 'fullHeight',
          type: 'checkbox',
          label: 'Full Height Column',
          defaultValue: false,
          admin: {
            description: 'Make this column take the full viewport height',
          },
        },
        {
          name: 'gradient',
          type: 'group',
          label: 'Gradient Overlay',
          admin: {
            description: 'Optional gradient overlay for this column',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Enable Gradient',
              defaultValue: false,
            },
            {
              name: 'type',
              type: 'select',
              label: 'Gradient Type',
              defaultValue: 'linear',
              options: [
                { label: 'Linear', value: 'linear' },
                { label: 'Radial', value: 'radial' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'direction',
              type: 'select',
              label: 'Gradient Direction',
              defaultValue: 'to-bottom',
              options: [
                { label: 'To Bottom', value: 'to-bottom' },
                { label: 'To Top', value: 'to-top' },
                { label: 'To Right', value: 'to-right' },
                { label: 'To Left', value: 'to-left' },
                { label: 'To Bottom Right', value: 'to-bottom-right' },
                { label: 'To Bottom Left', value: 'to-bottom-left' },
                { label: 'To Top Right', value: 'to-top-right' },
                { label: 'To Top Left', value: 'to-top-left' },
              ],
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.enabled === true && siblingData?.type === 'linear',
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Gradient Position',
              defaultValue: 'center',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top Left', value: 'top-left' },
                { label: 'Top Right', value: 'top-right' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
              ],
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.enabled === true && siblingData?.type === 'radial',
              },
            },
            {
              name: 'startColor',
              type: 'text',
              label: 'Start Color',
              defaultValue: '#000000',
              admin: {
                description: 'Hex color code (e.g., #000000)',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'endColor',
              type: 'text',
              label: 'End Color',
              defaultValue: '#ffffff',
              admin: {
                description: 'Hex color code (e.g., #ffffff)',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'opacity',
              type: 'number',
              label: 'Opacity',
              defaultValue: 0.7,
              min: 0,
              max: 1,
              admin: {
                description: 'Gradient opacity (0 = transparent, 1 = opaque)',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
            {
              name: 'text',
              type: 'text',
              label: 'Link Text',
              required: true,
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
            },
          ],
        },
      ],
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

export const ThreeColumnsBlock: React.FC<{
  columns: Array<{
    title: string
    subtitle?: string
    backgroundImage?: {
      id: string
      url: string
      alt: string
    }
    fullHeight?: boolean
    gradient?: {
      enabled: boolean
      type?: 'linear' | 'radial'
      direction?:
        | 'to-bottom'
        | 'to-top'
        | 'to-right'
        | 'to-left'
        | 'to-bottom-right'
        | 'to-bottom-left'
        | 'to-top-right'
        | 'to-top-left'
      position?:
        | 'center'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
      startColor?: string
      endColor?: string
      opacity?: number
    }
    link: {
      url: string
      text: string
      openInNewTab?: boolean
    }
  }>
  sectionId?: string
}> = ({ columns, sectionId }) => {
  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return (
    <section id={sectionId} className="three-columns-block">
      <div className="three-columns-content">
        {columns?.map((column, index) => (
          <div
            key={index}
            className={`column ${column.fullHeight ? 'column-full-height' : ''} ${
              column.gradient?.enabled
                ? `has-gradient gradient-${column.gradient.type || 'linear'} ${
                    column.gradient.type === 'linear'
                      ? `direction-${column.gradient.direction || 'to-bottom'}`
                      : `position-${column.gradient.position || 'center'}`
                  }`
                : ''
            }`}
            style={{
              ...(column.backgroundImage
                ? {
                    backgroundImage: `url(${column.backgroundImage.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : {}),
              ...(column.gradient?.enabled
                ? {
                    '--gradient-start': column.gradient.startColor || '#000000',
                    '--gradient-end': column.gradient.endColor || '#ffffff',
                    '--gradient-opacity': column.gradient.opacity || 0.7,
                  }
                : {}),
            }}
          >
            <div className="column-content">
              <h2 className="column-title">{column.title}</h2>
              {column.subtitle && <p className="column-subtitle">{column.subtitle}</p>}
              <a
                href={column.link.url}
                className="column-link"
                target={column.link.openInNewTab ? '_blank' : undefined}
                rel={column.link.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {column.link.text}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ThreeColumns
