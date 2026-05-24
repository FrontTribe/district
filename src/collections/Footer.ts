import { CollectionConfig } from 'payload'
import { revalidateFooterDeleteHook, revalidateFooterHook } from '@/utils/revalidate'

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
      en:
        'Per-tenant marketing footer (multi-column). Used on the public site for tenant pages, including RE landing. Suggested first line in Main heading: your brand, then a line with tenant name · subdomain · Real Estate.',
      hr:
        'Marketinško podnožje po tenantu (više stupaca). Koristi se na javnoj stranici za tenanta, uključujući RE landing. U „Glavni naslov” tipično: marka, zatim redak s nazivom tenanta · subdomain · Real Estate.',
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
    create: ({ req }) =>
      (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
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
    delete: ({ req }) => {
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
    afterChange: [revalidateFooterHook],
    afterDelete: [revalidateFooterDeleteHook],
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
      admin: {
        description: {
          en: 'Which organization this footer belongs to. Content (headings, address, links) should match that tenant.',
          hr: 'Za koju organizaciju je ovo podnožje. Tekstovi i kontakt trebaju odgovarati tom tenantu.',
        },
      },
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
          admin: {
            description: {
              en: 'RE landing: usually one line with <b>district.</b> (HTML allowed). Boutique/other: brand headline.',
              hr: 'RE landing: tipično jedan red s <b>district.</b> (dozvoljen HTML). Boutique/ostalo: naslov marke.',
            },
          },
        },
        {
          name: 'subheading',
          type: 'text',
          label: { en: 'Tagline (optional)', hr: 'Tagline (opcionalno)' },
          localized: true,
          admin: {
            description: {
              en: 'RE landing: second line under the brand, e.g. Tenant name · subdomain · Real Estate (plain text).',
              hr: 'RE landing: drugi red ispod marke, npr. Naziv tenanta · subdomain · Real Estate (običan tekst).',
            },
          },
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
      admin: {
        description: {
          en: 'RE landing: copyright (left), optional links (next to ©), optional right tail. Matches District footer bar.',
          hr: 'RE landing: copyright (lijevo), opcionalni linkovi pokraj ©, opcionalni desni rep — kao District donja traka.',
        },
      },
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
          label: { en: 'Right tail (optional)', hr: 'Desni rep (opcionalno)' },
          required: false,
          localized: true,
          admin: {
            description: {
              en: 'RE landing: small caps line on the bottom-right (e.g. credits). Leave empty to hide.',
              hr: 'RE landing: mali tekst dolje desno (npr. krediti). Prazno = sakrij.',
            },
          },
        },
      ],
    },
  ],
}

export default Footer
