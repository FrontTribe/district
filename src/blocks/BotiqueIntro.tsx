import { Block } from 'payload'
import React from 'react'

// Boutique Intro block
// Editable fields are kept minimal but flexible to match the provided design
// which features a left text column and three editorial images placed to the right and bottom.
const BotiqueIntro: Block = {
  slug: 'botique-intro',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow / Small Heading',
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks)',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Intro text',
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
        },
        {
          name: 'href',
          type: 'text',
          label: 'URL',
        },
      ],
    },
    {
      name: 'mediaTopRight',
      type: 'upload',
      relationTo: 'media',
      label: 'Top Right Image',
    },
    {
      name: 'mediaBottomLeft',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom Left Large Image',
    },
    {
      name: 'mediaBottomRight',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom Right Small Image',
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export const BotiqueIntroBlock: React.FC<{
  eyebrow?: string
  heading: string
  body?: string
  cta?: { label?: string; href?: string }
  mediaTopRight?: any
  mediaBottomLeft?: any
  mediaBottomRight?: any
  sectionId?: string
}> = ({
  eyebrow,
  heading,
  body,
  cta,
  mediaTopRight,
  mediaBottomLeft,
  mediaBottomRight,
  sectionId,
}) => {
  const img = (m: any) => {
    if (!m) return undefined
    if (typeof m === 'string') return m
    return m.url
  }

  return (
    <section id={sectionId} className="botique-intro">
      <div className="botique-intro__grid">
        <div className="botique-intro__text">
          {eyebrow && <span className="botique-intro__eyebrow">{eyebrow}</span>}
          <h2 className="botique-intro__heading">
            {heading?.split('\n').map((line, i) => (
              <span key={i} className="botique-intro__heading-line">
                {line}
              </span>
            ))}
          </h2>
          {body && <p className="botique-intro__body">{body}</p>}
          {cta?.label && cta?.href && (
            <a className="botique-intro__cta" href={cta.href}>
              {cta.label}
            </a>
          )}
        </div>

        {img(mediaTopRight) && (
          <div className="botique-intro__media botique-intro__media--top-right">
            <img src={img(mediaTopRight)} alt="" />
          </div>
        )}

        {img(mediaBottomLeft) && (
          <div className="botique-intro__media botique-intro__media--bottom-left">
            <img src={img(mediaBottomLeft)} alt="" />
          </div>
        )}

        {img(mediaBottomRight) && (
          <div className="botique-intro__media botique-intro__media--bottom-right">
            <img src={img(mediaBottomRight)} alt="" />
          </div>
        )}
      </div>
    </section>
  )
}

export default BotiqueIntro
