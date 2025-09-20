import { Block } from 'payload'

const Location: Block = {
  slug: 'location',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description: 'Main title for the location section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Short description about the location',
      },
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
      required: true,
      admin: {
        description: 'Full address for the location',
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Map Coordinates',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Latitude',
          required: true,
          admin: {
            step: 0.000001,
            description: 'Latitude coordinate for the map pin',
          },
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Longitude',
          required: true,
          admin: {
            step: 0.000001,
            description: 'Longitude coordinate for the map pin',
          },
        },
      ],
    },
    {
      name: 'workingHours',
      type: 'array',
      label: 'Working Hours',
      minRows: 7,
      maxRows: 7,
      fields: [
        {
          name: 'day',
          type: 'select',
          label: 'Day',
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'isOpen',
          type: 'checkbox',
          label: 'Open this day',
          defaultValue: true,
        },
        {
          name: 'openTime',
          type: 'text',
          label: 'Opening Time',
          admin: {
            condition: (data, siblingData) => siblingData?.isOpen,
            description: 'Format: HH:MM (e.g., 09:00)',
          },
        },
        {
          name: 'closeTime',
          type: 'text',
          label: 'Closing Time',
          admin: {
            condition: (data, siblingData) => siblingData?.isOpen,
            description: 'Format: HH:MM (e.g., 18:00)',
          },
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          label: 'Closed all day',
          admin: {
            condition: (data, siblingData) => !siblingData?.isOpen,
          },
        },
      ],
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

export default Location
