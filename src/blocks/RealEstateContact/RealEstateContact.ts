import { Block } from 'payload'

const RealEstateContact: Block = {
  slug: 'real-estate-contact',
  labels: {
    singular: 'Real Estate Contact',
    plural: 'Real Estate Contact',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Javite nam se',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'Imate pitanja o našim projektima? Želite rezervirati pregled stana? Kontaktirajte nas putem bilo koje od dostupnih metoda komunikacije.',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
      defaultValue: 'Ilica 123, 10000 Zagreb, Hrvatska',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      defaultValue: 'info@district-realestate.com',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      defaultValue: '+385 1 234 567 89',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Instagram URL',
      defaultValue: 'https://instagram.com/districtrealestate',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook URL',
      defaultValue: 'https://facebook.com/districtrealestate',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Contact Form (Form Builder)',
      required: true,
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default RealEstateContact
