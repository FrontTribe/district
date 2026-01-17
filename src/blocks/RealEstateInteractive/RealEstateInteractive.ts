import { Block } from 'payload'

const RealEstateInteractive: Block = {
  slug: 'real-estate-interactive',
  labels: {
    singular: 'Real Estate Interactive',
    plural: 'Real Estate Interactive',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'headingLine1',
      type: 'text',
      label: 'Heading Line 1',
      defaultValue: 'Interaktivni',
      required: true,
    },
    {
      name: 'headingLine2',
      type: 'text',
      label: 'Heading Line 2',
      defaultValue: 'Pregled Zgrade',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      defaultValue: 'Kliknite na stan u tlocrta da vidite detalje i opcije rezervacije',
    },
    {
      name: 'floorPlanImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Floor Plan Image',
    },
    {
      name: 'apartments',
      type: 'array',
      label: 'Apartments on Floor Plan',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Apartment Name',
          required: true,
          defaultValue: 'Stan 2.5+1',
        },
        {
          name: 'area',
          type: 'text',
          label: 'Area',
          defaultValue: '68 m²',
        },
        {
          name: 'rooms',
          type: 'text',
          label: 'Rooms',
          defaultValue: '2 sobe, kuhinja, dnevni boravak',
        },
        {
          name: 'floor',
          type: 'text',
          label: 'Floor',
          defaultValue: '2. kat',
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price',
          defaultValue: '€185,000',
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          options: [
            { label: 'Slobodno', value: 'slobodno' },
            { label: 'Rezervirano', value: 'rezervirano' },
            { label: 'Prodano', value: 'prodano' },
          ],
          defaultValue: 'slobodno',
          required: true,
        },
        {
          name: 'positionX',
          type: 'number',
          label: 'Position X (%)',
          defaultValue: 20,
          admin: {
            description: 'Horizontal position on floor plan (0-100%)',
          },
        },
        {
          name: 'positionY',
          type: 'number',
          label: 'Position Y (%)',
          defaultValue: 20,
          admin: {
            description: 'Vertical position on floor plan (0-100%)',
          },
        },
        {
          name: 'floorPlanImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Floor Plan Image for this Apartment',
        },
      ],
      defaultValue: [
        {
          name: 'Stan 2.5+1',
          area: '68 m²',
          rooms: '2 sobe, kuhinja, dnevni boravak',
          floor: '2. kat',
          price: '€185,000',
          status: 'slobodno',
          positionX: 20,
          positionY: 20,
        },
        {
          name: 'Stan 3+1',
          area: '85 m²',
          rooms: '3 sobe, kuhinja, dnevni boravak',
          floor: '3. kat',
          price: '€225,000',
          status: 'slobodno',
          positionX: 80,
          positionY: 20,
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

export default RealEstateInteractive
