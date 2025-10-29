import { Block } from 'payload'

const RealEstateProjects: Block = {
  slug: 'real-estate-projects',
  labels: {
    singular: 'Real Estate Projects',
    plural: 'Real Estate Projects',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'headingLine1',
      type: 'text',
      label: 'Heading Line 1',
      defaultValue: 'Dosadašnji',
      required: true,
    },
    {
      name: 'headingLine2',
      type: 'text',
      label: 'Heading Line 2',
      defaultValue: 'Projekti',
      required: true,
    },
    {
      name: 'projects',
      type: 'array',
      label: 'Projects',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Project Name',
          required: true,
          defaultValue: 'Sunset Residences',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue: 'Moderan stambeni kompleks u srcu grada',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Project Image',
        },
      ],
      defaultValue: [
        {
          name: 'Sunset Residences',
          description: 'Moderan stambeni kompleks u srcu grada',
        },
        {
          name: 'Riverside Apartments',
          description: 'Luksuzni stanovi s pogledom na rijeku',
        },
        {
          name: 'Green Valley Estate',
          description: 'Eko-friendly projekat u zelenoj zoni',
        },
        {
          name: 'City Center Towers',
          description: 'Visokostambeni kompleks u poslovnom centru',
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

export default RealEstateProjects
