import type { Block } from 'payload'
import {
  reLandingBlockMeta,
  reLandingHeadingPartsField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingPastProjects: Block = {
  slug: 'real-estate-landing-past-projects',
  /** Short DB prefix: nested `projects → gallery` FK names hit Postgres 63-char / duplicate constraint issues. */
  dbName: 're_past',
  interfaceName: 'RealEstateLandingPastProjectsBlock',
  labels: {
    singular: { en: 'RE Landing — Past projects', hr: 'RE landing — prošli projekti' },
    plural: { en: 'RE Landing — Past projects', hr: 'RE landing — prošli projekti' },
  },
  admin: reLandingBlockMeta({
    en: 'Portfolio list or grid; each project can open an image gallery modal.',
    hr: 'Portfolio u retcima ili mreži; projekt može otvoriti modal galerije.',
  }),
  fields: [
    reLandingSectionIdField,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'rows',
      label: { en: 'Layout', hr: 'Raspored' },
      options: [
        { label: 'Rows', value: 'rows' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    {
      name: 'introHtml',
      type: 'textarea',
      required: true,
      label: { en: 'Intro (HTML)', hr: 'Uvod (HTML)' },
    },
    {
      name: 'projects',
      type: 'array',
      dbName: 'pp_prj',
      label: { en: 'Projects', hr: 'Projekti' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: 'name', type: 'text', required: true, label: { en: 'Project name', hr: 'Naziv projekta' } },
        {
          name: 'subtitle',
          type: 'text',
          label: { en: 'Subtitle / tagline', hr: 'Podnaslov' },
        },
        { name: 'location', type: 'text', required: true, label: { en: 'Location', hr: 'Lokacija' } },
        { name: 'year', type: 'text', required: true, label: { en: 'Year', hr: 'Godina' } },
        {
          name: 'statusLabel',
          type: 'text',
          required: true,
          label: { en: 'Status label', hr: 'Status (tekst)' },
        },
        {
          name: 'statusActive',
          type: 'checkbox',
          label: { en: 'Highlight status', hr: 'Istakni status' },
          defaultValue: false,
        },
        {
          name: 'summaryHtml',
          type: 'textarea',
          label: { en: 'Short summary (HTML)', hr: 'Kratak sažetak (HTML)' },
          admin: {
            description: {
              en: 'Shown in grid cards under the title (optional).',
              hr: 'U karticama mreže ispod naslova (opcionalno).',
            },
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: { en: 'External project URL', hr: 'Vanjski URL projekta' },
        },
        {
          name: 'externalOpenInNewTab',
          type: 'checkbox',
          label: { en: 'Open external URL in new tab', hr: 'Vanjski URL u novom tabu' },
          defaultValue: true,
        },
        {
          name: 'previewImage',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Preview image', hr: 'Pregledna slika' },
          filterOptions: { mimeType: { contains: 'image' } },
        },
        {
          name: 'previewImageAlt',
          type: 'text',
          label: { en: 'Preview image alt', hr: 'Alt pregledne slike' },
        },
        {
          name: 'gallery',
          type: 'array',
          dbName: 'pp_gl',
          label: { en: 'Gallery', hr: 'Galerija' },
          admin: { initCollapsed: true },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: { mimeType: { contains: 'image' } },
            },
            { name: 'caption', type: 'textarea', label: { en: 'Caption', hr: 'Opis' } },
            { name: 'alt', type: 'text', label: { en: 'Image alt', hr: 'Alt slike' } },
            { name: 'credit', type: 'text', label: { en: 'Photo credit', hr: 'Kredit fotografije' } },
          ],
        },
      ],
    },
  ],
}

export default RealEstateLandingPastProjects
