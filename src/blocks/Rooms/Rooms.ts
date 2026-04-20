import { Block, type Condition } from 'payload'
import { loadRentlioOptions } from '@/utils/rentlio'

const DEFAULT_SALES_CHANNEL_ID = '45'

const normalizeOptionalRentlioId = (value: unknown): string | null | undefined => {
  if (value === null || value === undefined) return value as null | undefined
  if (typeof value === 'string' && value.trim() === '') return null
  return value as string
}

const roomsFieldCondition: Condition = () => true // Always show rooms since unit types are available without selecting property

const rentlioSalesChannelField: any = {
  name: 'rentlioSalesChannelId',
  type: 'text',
  label: 'Sales Channel',
  defaultValue: DEFAULT_SALES_CHANNEL_ID,
  admin: {
    description:
      'Sales channels are loading… If this remains a plain input, enter the ID manually or fix the API credentials.',
    components: {
      Field: '@/fields/RentlioSalesChannelField',
    },
    props: {
      // salesChannelsByProperty: salesChannelsByPropertyOptions,
    },
  },
  hooks: {
    beforeValidate: [
      ({ value }: { value: unknown }) => {
        if (value === null || value === undefined || value === '') {
          return DEFAULT_SALES_CHANNEL_ID
        }
        return value
      },
    ],
  },
}

const rentlioPropertyField: any = {
  name: 'rentlioPropertyId',
  type: 'text',
  label: 'Rentlio Property',
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
  hooks: {
    beforeValidate: [({ value }: { value: unknown }) => normalizeOptionalRentlioId(value)],
  },
}

const rentlioUnitTypeField: any = {
  name: 'rentlioUnitTypeId',
  type: 'text',
  label: 'Rentlio Unit Type',
  admin: {
    description:
      'Optional. Select a unit type to enable Rentlio bookings for this room. Leave empty if the room is informational only.',
    components: {
      Field: '@/fields/RentlioUnitTypeField',
    },
    props: {
      // options: rentlioUnitTypeOptions,
      // unitTypesByProperty: rentlioUnitTypesByProperty,
    },
  },
  hooks: {
    beforeValidate: [({ value }: { value: unknown }) => normalizeOptionalRentlioId(value)],
  },
}

if (typeof window === 'undefined') {
  loadRentlioOptions()
    .then(({ propertyOptions, unitTypeOptions, unitTypesByProperty, salesChannelsByProperty }) => {
      rentlioPropertyField.admin.props.options = propertyOptions
      rentlioUnitTypeField.admin.props.unitTypesByProperty = unitTypesByProperty
      rentlioSalesChannelField.admin.props.salesChannelsByProperty = salesChannelsByProperty
    })
    .catch((error) => {
      console.warn('[Rentlio] Failed to preload options. Falling back to manual entry.', error)
    })
}

const Rooms: Block = {
  slug: 'rooms',
  fields: [
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
        rentlioPropertyField,
        rentlioSalesChannelField,
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
        {
          name: 'images',
          type: 'array',
          label: 'Room Images',
          minRows: 1,
          localized: true,
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'alt', type: 'text', label: 'Alt Text' },
          ],
        },
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
