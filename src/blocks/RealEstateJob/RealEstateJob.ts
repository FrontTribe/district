import { Block } from 'payload'

const RealEstateJob: Block = {
  slug: 'real-estate-job',
  labels: {
    singular: 'Real Estate Job',
    plural: 'Real Estate Jobs',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'KARIJERA',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Tražiš posao?',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Kod nas kao izvođač?',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'Tražimo strastvene profesionalce koji dijele našu viziju izvrsnosti u real estate projektiranju. Pridružite se našem timu izvođača i uključite se u transformaciju gradskog prostora kroz inovativne i kvalitetne projekte.',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        {
          name: 'featureText',
          type: 'text',
          label: 'Feature Text',
          required: true,
        },
      ],
      defaultValue: [
        { featureText: 'Konkurentne plaće i beneficije' },
        { featureText: 'Profesionalni razvoj i edukacija' },
        { featureText: 'Raznolika portfelja projekata' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Contact Email',
      defaultValue: 'careers@district-realestate.com',
      required: true,
    },
    {
      name: 'ctaNote',
      type: 'textarea',
      label: 'CTA Note',
      defaultValue: 'Pošaljite nam svoj CV i motivacijsko pismo',
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default RealEstateJob
