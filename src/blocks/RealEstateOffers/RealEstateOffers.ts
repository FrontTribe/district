import { Block } from 'payload'

const RealEstateOffers: Block = {
  slug: 'real-estate-offers',
  labels: {
    singular: 'Real Estate Offers',
    plural: 'Real Estate Offers',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'headingLine1',
      type: 'text',
      label: 'Heading Line 1',
      defaultValue: 'Aktualne',
      required: true,
    },
    {
      name: 'headingLine2',
      type: 'text',
      label: 'Heading Line 2',
      defaultValue: 'Ponude',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      defaultValue: 'Pronađite savršen prostor za sebe u našim novim projektima',
    },
    {
      name: 'apartments',
      type: 'array',
      label: 'Apartments',
      minRows: 1,
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
          label: 'Rooms Description',
          defaultValue: '2 sobe, kuhinja, dnevni boravak',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Apartment Image',
        },
      ],
      defaultValue: [
        {
          name: 'Stan 2.5+1',
          area: '68 m²',
          rooms: '2 sobe, kuhinja, dnevni boravak',
          price: '€185,000',
          status: 'slobodno',
        },
        {
          name: 'Stan 3+1',
          area: '85 m²',
          rooms: '3 sobe, kuhinja, dnevni boravak',
          price: '€225,000',
          status: 'slobodno',
        },
        {
          name: 'Stan 2+1',
          area: '62 m²',
          rooms: '2 sobe, kuhinja, dnevni boravak',
          price: '€165,000',
          status: 'rezervirano',
        },
        {
          name: 'Stan 3.5+1',
          area: '92 m²',
          rooms: '3 sobe, kuhinja, dnevni boravak, terasa',
          price: '€265,000',
          status: 'slobodno',
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

export default RealEstateOffers
