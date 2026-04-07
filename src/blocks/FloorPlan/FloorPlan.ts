import type { Block } from 'payload'

const FloorPlan: Block = {
  slug: 'floor-plan',
  labels: {
    singular: 'Floor Plan',
    plural: 'Floor Plans',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section title',
      admin: {
        description: 'Optional heading above the floor plan',
      },
    },
    {
      name: 'building',
      type: 'relationship',
      relationTo: 'buildings',
      required: true,
      label: 'Building',
      admin: {
        description: 'Building with floor plan image and unit regions',
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for anchor links',
      },
    },
  ],
}

export default FloorPlan
