import { CollectionConfig } from 'payload'

const Footer: CollectionConfig = {
  slug: 'footer',
  labels: {
    singular: { en: 'Footer', hr: 'Podnožje' },
    plural: { en: 'Footers', hr: 'Podnožja' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Site Content', hr: 'Sadržaj stranice' },
    description: {
      en: 'Manage footer content for tenants and main domain',
      hr: 'Upravljanje sadržajem podnožja za stanare i glavnu domenu',
    },
  },
  access: {
    read: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
    update: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && (req.user as any)?.role === 'tenant-admin') {
          data.tenant = (req.user as any)?.tenant?.id || (req.user as any)?.tenant
          return data
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'Internal title for this footer (e.g., "Hotel ABC Footer", "Restaurant XYZ Footer")',
          hr: 'Interni naslov podnožja (npr. "Podnožje hotela ABC", "Podnožje restorana XYZ")',
        },
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      access: {
        create: ({ req }) =>
          (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
        update: ({ req }) => (req.user as any)?.role === 'superadmin',
      },
    },
    {
      name: 'leftContent',
      type: 'group',
      label: { en: 'Left Content', hr: 'Lijevi sadržaj' },
      localized: true,
      fields: [
        {
          name: 'heading',
          type: 'textarea',
          label: { en: 'Main Heading', hr: 'Glavni naslov' },
          required: true,
          localized: true,
        },
        {
          name: 'subheading',
          type: 'text',
          label: { en: 'Subheading (optional)', hr: 'Podnaslov (opcionalno)' },
          localized: true,
        },
      ],
    },
    {
      name: 'rightContent',
      type: 'group',
      label: { en: 'Right Content', hr: 'Desni sadržaj' },
      localized: true,
      fields: [
        {
          name: 'contact',
          type: 'group',
          label: { en: 'Contact Information', hr: 'Kontakt podaci' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: { en: 'Contact Heading', hr: 'Kontakt naslov' },
              required: true,
              localized: true,
            },
            {
              name: 'email',
              type: 'email',
              label: { en: 'Email Address', hr: 'Email adresa' },
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
              label: { en: 'Phone Number', hr: 'Broj telefona' },
            },
            {
              name: 'instagram',
              type: 'text',
              label: { en: 'Instagram Handle', hr: 'Instagram račun' },
              admin: {
                description: {
                  en: 'Enter without @ symbol (e.g., legendslounge)',
                  hr: 'Unesite bez simbola @ (npr. legendslounge)',
                },
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          label: { en: 'Address Information', hr: 'Podaci o adresi' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: { en: 'Address Heading', hr: 'Naslov adrese' },
              required: true,
              localized: true,
            },
            {
              name: 'venue',
              type: 'text',
              label: { en: 'Venue Name', hr: 'Naziv lokacije' },
              required: true,
              localized: true,
            },
            {
              name: 'street',
              type: 'text',
              label: { en: 'Street Address', hr: 'Ulica i broj' },
              required: true,
              localized: true,
            },
            {
              name: 'city',
              type: 'text',
              label: { en: 'City and Postal Code', hr: 'Grad i poštanski broj' },
              required: true,
              localized: true,
            },
            {
              name: 'country',
              type: 'text',
              label: { en: 'Country', hr: 'Država' },
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'bottomContent',
      type: 'group',
      label: { en: 'Bottom Content', hr: 'Donji sadržaj' },
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: { en: 'Copyright Text', hr: 'Tekst autorskih prava' },
          required: true,
          defaultValue: 'All Rights Reserved © 2025',
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: { en: 'Footer Links', hr: 'Linkovi u podnožju' },
          localized: true,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: { en: 'Link Text', hr: 'Tekst linka' },
              required: true,
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              label: { en: 'Link URL', hr: 'URL linka' },
              required: true,
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              label: { en: 'Open in new tab', hr: 'Otvori u novoj kartici' },
              defaultValue: false,
            },
          ],
        },
        {
          name: 'madeBy',
          type: 'text',
          label: { en: 'Made By Text', hr: 'Tekst „Izradio"' },
          required: true,
          defaultValue: 'Designed with passion by De Jongens van Boven',
          localized: true,
        },
      ],
    },
  ],
}

export default Footer
