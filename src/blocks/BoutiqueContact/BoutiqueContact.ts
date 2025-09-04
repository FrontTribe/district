import { Block } from 'payload'

const BoutiqueContact: Block = {
  slug: 'boutique-contact',
  fields: [
    {
      name: 'headingEyebrow',
      type: 'text',
      label: 'Eyebrow (small heading)',
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks)',
      required: true,
    },
    {
      name: 'leftText',
      type: 'textarea',
      label: 'Left description text',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Select Form (Form Builder)',
      required: true,
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default BoutiqueContact
