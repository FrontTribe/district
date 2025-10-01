import { Block, type Condition } from 'payload'
import { loadRentlioOptions } from '@/utils/rentlio'

const propertyFieldValidate = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return 'Provide a Rentlio property ID'
  }
  return true
}

const unitTypeFieldValidate = (value: unknown, { siblingData }: { siblingData?: any } = {}) => {
  if (!siblingData?.rentlioPropertyId) {
    return true
  }

  if (value === null || value === undefined || value === '') {
    return 'Provide a Rentlio unit type ID'
  }

  return true
}

const roomsFieldCondition: Condition = (_, __, { blockData }) =>
  Boolean((blockData as any)?.rentlioPropertyId)

const rentlioPropertyField: any = {
  name: 'rentlioPropertyId',
  type: 'text',
  label: 'Rentlio Property',
  validate: propertyFieldValidate,
  admin: {
    description:
      'Rentlio properties are loading… If this remains a plain input, enter the ID manually or fix the API credentials.',
    components: {
      Field: '@/fields/RentlioPropertyField',
    },
    props: {
      // options: rentlioPropertyOptions,
    },
  },
}

const rentlioUnitTypeField: any = {
  name: 'rentlioUnitTypeId',
  type: 'text',
  label: 'Rentlio Unit Type',
  validate: unitTypeFieldValidate,
  admin: {
    description:
      'Select a property first to load unit types. If options do not appear, enter the ID manually.',
    components: {
      Field: '@/fields/RentlioUnitTypeField',
    },
    props: {
      // options: rentlioUnitTypeOptions,
      // unitTypesByProperty: rentlioUnitTypesByProperty,
    },
  },
}

if (typeof window === 'undefined') {
  loadRentlioOptions()
    .then(({ propertyOptions, unitTypeOptions, unitTypesByProperty }) => {
      rentlioPropertyField.admin.props.options = propertyOptions
      rentlioUnitTypeField.admin.props.unitTypesByProperty = unitTypesByProperty
    })
    .catch((error) => {
      console.warn('[Rentlio] Failed to preload options. Falling back to manual entry.', error)
    })
}

const Rooms: Block = {
  slug: 'rooms',
  fields: [
    rentlioPropertyField,
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      localized: true,
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading (supports line breaks)',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      localized: true,
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
      localized: true,
    },
    {
      name: 'rooms',
      type: 'array',
      label: 'Rooms',
      minRows: 1,
      maxRows: 4,
      localized: true,
      fields: [
        rentlioUnitTypeField,
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        {
          name: 'badges',
          type: 'array',
          label: 'Badges (e.g., Double Bed, 2 Guests, 40m²-65m²)',
          localized: true,
          fields: [{ name: 'text', type: 'text', localized: true }],
        },
        { name: 'image', type: 'upload', relationTo: 'media', required: true, localized: true },
      ],
      admin: {
        description: 'Add up to 4 rooms: Premium, Deluxe, Suite, Apartment',
        condition: roomsFieldCondition,
      },
    },
    { name: 'sectionId', type: 'text', label: 'Section ID', localized: true },
  ],
}

export default Rooms
