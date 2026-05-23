import { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const RooftopFeatures: Block = {
  slug: 'rooftop-features',
  admin: { group: districtAdminGroups.boutique },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        { name: 'romanNumeral', type: 'text', label: { en: 'Roman numeral (I., II.)', hr: 'Rimski broj' } },
        { name: 'tag', type: 'text', label: { en: 'Image tag', hr: 'Oznaka slike' }, localized: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'media', type: 'upload', relationTo: 'media', label: { en: 'Image', hr: 'Slika' } },
        {
          name: 'reverseLayout',
          type: 'checkbox',
          label: { en: 'Reverse layout', hr: 'Obrnuti layout' },
          defaultValue: false,
        },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default RooftopFeatures
