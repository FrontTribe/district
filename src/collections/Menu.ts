import { CollectionConfig } from 'payload'
import { revalidateMenuDeleteHook, revalidateMenuHook } from '@/utils/revalidate'

const Menu: CollectionConfig = {
  slug: 'menu',
  labels: {
    singular: { en: 'Menu', hr: 'Izbornik' },
    plural: { en: 'Menus', hr: 'Izbornici' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Site Content', hr: 'Sadržaj stranice' },
    description: {
      en: 'Manage navigation menus for tenants and main domain',
      hr: 'Upravljanje izbornicima za stanare i glavnu domenu',
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
    afterChange: [revalidateMenuHook],
    afterDelete: [revalidateMenuDeleteHook],
  },
  fields: [
    {
      name: 'identifier',
      type: 'select',
      label: { en: 'Menu Identifier', hr: 'Identifikator izbornika' },
      required: true,
      defaultValue: 'main-menu',
      options: [
        {
          label: { en: 'Main Menu (Frontend)', hr: 'Glavni izbornik (frontend)' },
          value: 'main-menu',
        },
        {
          label: { en: 'Tenant Menu', hr: 'Izbornik stanara' },
          value: 'tenant-menu',
        },
      ],
      admin: {
        description: {
          en: 'Unique identifier for this menu type. Main Menu gets centered logo styling, Tenant Menu gets standard top-left styling.',
          hr: 'Jedinstveni identifikator za ovaj tip izbornika. Glavni izbornik ima centriran logo, Izbornik stanara standardni stil gore lijevo.',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'Internal title for this menu (e.g., "Hotel ABC Menu", "Restaurant XYZ Menu")',
          hr: 'Interni naslov izbornika (npr. "Izbornik hotela ABC", "Izbornik restorana XYZ")',
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
      name: 'menuItems',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: {
              en: 'URL or path for this menu item (required even if using scroll target)',
              hr: 'URL ili putanja za ovu stavku izbornika (obavezno čak i ako koristite scroll cilj)',
            },
          },
        },
        {
          name: 'scrollTarget',
          type: 'text',
          label: { en: 'Scroll Target (Section ID)', hr: 'Cilj skrolanja (ID sekcije)' },
          admin: {
            description: {
              en: 'Optional section ID to scroll to (e.g., "hero", "features"). Leave empty to use the link above.',
              hr: 'Opcionalni ID sekcije za skrolanje (npr. "hero", "features"). Ostavite prazno za link iznad.',
            },
          },
        },
        {
          name: 'external',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'children',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: {
                  en: 'URL or path for this menu item (required even if using scroll target)',
                  hr: 'URL ili putanja za ovu stavku izbornika (obavezno čak i ako koristite scroll cilj)',
                },
              },
            },
            {
              name: 'scrollTarget',
              type: 'text',
              label: { en: 'Scroll Target (Section ID)', hr: 'Cilj skrolanja (ID sekcije)' },
              admin: {
                description: {
                  en: 'Optional section ID to scroll to (e.g., "hero", "features"). Leave empty to use the link above.',
                  hr: 'Opcionalni ID sekcije za skrolanje (npr. "hero", "features"). Ostavite prazno za link iznad.',
                },
              },
            },
            {
              name: 'external',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoText',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'positioning',
      type: 'select',
      label: { en: 'Menu Positioning', hr: 'Pozicioniranje izbornika' },
      defaultValue: 'fixed',
      options: [
        {
          label: { en: 'Fixed (Stays at top when scrolling)', hr: 'Fiksno (ostaje na vrhu pri skrolanju)' },
          value: 'fixed',
        },
        {
          label: { en: 'Absolute (Scrolls with content)', hr: 'Apsolutno (skrola s sadržajem)' },
          value: 'absolute',
        },
        {
          label: { en: 'Relative (Normal document flow)', hr: 'Relativno (normalan tijek dokumenta)' },
          value: 'relative',
        },
      ],
      admin: {
        description: {
          en: 'Choose how the menu should be positioned on the page',
          hr: 'Odaberite kako će izbornik biti pozicioniran na stranici',
        },
      },
    },
  ],
}

export default Menu
