import { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const Intro: Block = {
  slug: 'intro',
  admin: { group: districtAdminGroups.hub },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      label: 'Intro Text',
      required: true,
      admin: {
        description: 'Enter the intro text that will be displayed centered in black',
      },
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

export default Intro
