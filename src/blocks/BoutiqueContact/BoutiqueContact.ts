import { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const BoutiqueContact: Block = {
  slug: 'boutique-contact',
  admin: { group: districtAdminGroups.boutique },
  fields: [
    {
      name: 'chapterNum',
      type: 'text',
      label: { en: 'Chapter number', hr: 'Broj poglavlja' },
    },
    {
      name: 'chapterLabel',
      type: 'text',
      label: { en: 'Chapter label', hr: 'Oznaka poglavlja' },
    },
    {
      name: 'headingEyebrow',
      type: 'text',
      label: 'Eyebrow (small heading)',
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks; *italic*)',
      required: true,
    },
    {
      name: 'leadText',
      type: 'textarea',
      label: { en: 'Lead text', hr: 'Uvodni tekst' },
    },
    {
      name: 'leftText',
      type: 'textarea',
      label: 'Left description text',
    },
    {
      name: 'channels',
      type: 'array',
      label: { en: 'Contact channels', hr: 'Kanali kontakta' },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'intelRows',
      type: 'array',
      label: { en: 'Info rows', hr: 'Info redovi' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email (legacy fallback)',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone (legacy fallback)',
    },
    {
      name: 'formNote',
      type: 'text',
      label: { en: 'Form note below submit', hr: 'Napomena ispod gumba' },
      localized: true,
    },
    {
      name: 'successHeading',
      type: 'text',
      label: { en: 'Success heading', hr: 'Naslov uspjeha' },
      localized: true,
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: { en: 'Success message', hr: 'Poruka uspjeha' },
      localized: true,
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
      defaultValue: 'kontakt',
    },
  ],
}

export default BoutiqueContact
