import { Block } from 'payload'

const JobOpportunity: Block = {
  slug: 'job-opportunity',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      required: true,
      defaultValue: 'Looking for a job?',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Join our team at Concept Bar',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      defaultValue:
        "We're always looking for passionate people to join our team. If you love hospitality, great food, and creating memorable experiences, we'd love to hear from you.",
      localized: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      required: true,
      defaultValue: 'Apply Now',
      localized: true,
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Button URL',
      required: true,
      defaultValue: 'mailto:jobs@conceptbar.com',
    },
    {
      name: 'badgeText',
      type: 'text',
      label: 'Badge Text',
      required: true,
      defaultValue: "We're Hiring",
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 3,
      maxRows: 3,
      localized: true,
      fields: [
        {
          name: 'featureText',
          type: 'text',
          label: 'Feature Text',
          required: true,
        },
      ],
      defaultValue: [
        { featureText: 'Great Team' },
        { featureText: 'Amazing Food' },
        { featureText: 'Fun Environment' },
      ],
    },
    {
      name: 'ctaNote',
      type: 'text',
      label: 'CTA Note',
      required: true,
      defaultValue: "Send us your CV and let's talk!",
      localized: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Optional background image for the block',
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for this section (used for navigation)',
      },
    },
  ],
}

export default JobOpportunity
