import type { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const MomentoFooter: Block = {
  slug: 'momento-footer',
  dbName: 'mmnt_ft',
  interfaceName: 'MomentoFooterBlock',
  labels: {
    singular: { en: 'Momento — Footer', hr: 'Momento — podnožje' },
    plural: { en: 'Momento — Footer', hr: 'Momento — podnožje' },
  },
  admin: {
    group: districtAdminGroups.momento,
    description: {
      en: 'Momento landing footer — logo, links, contact and credits.',
      hr: 'Podnožje Momento landingske stranice — logo, linkovi, kontakt i credits.',
    },
  },
  fields: [
    {
      name: 'logoText',
      type: 'text',
      label: { en: 'Logo text', hr: 'Tekst logotipa' },
      defaultValue: 'Momento.',
    },
    {
      name: 'tagline',
      type: 'textarea',
      label: { en: 'Tagline', hr: 'Tagline' },
    },
    {
      name: 'navLinks',
      type: 'array',
      label: { en: 'Page links', hr: 'Linkovi stranica' },
      fields: [
        { name: 'label', type: 'text', required: true, label: { en: 'Label', hr: 'Oznaka' } },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: { en: 'Link (URL or #anchor)', hr: 'Link (URL ili #sidro)' },
        },
      ],
    },
    {
      name: 'pagesHeading',
      type: 'text',
      label: { en: 'Pages column heading', hr: 'Naslov stupca stranica' },
      defaultValue: 'Stranice',
    },
    {
      name: 'contactHeading',
      type: 'text',
      label: { en: 'Contact column heading', hr: 'Naslov stupca kontakt' },
      defaultValue: 'Kontakt',
    },
    {
      name: 'email',
      type: 'email',
      label: { en: 'Email', hr: 'E-mail' },
    },
    {
      name: 'phone',
      type: 'text',
      label: { en: 'Phone', hr: 'Telefon' },
    },
    {
      name: 'socialHeading',
      type: 'text',
      label: { en: 'Social column heading', hr: 'Naslov stupca društvene mreže' },
      defaultValue: 'Pratite nas',
    },
    {
      name: 'instagram',
      type: 'text',
      label: { en: 'Instagram handle or URL', hr: 'Instagram korisničko ime ili URL' },
      admin: {
        description: {
          en: 'e.g. district.hr or full https://instagram.com/…',
          hr: 'npr. district.hr ili puni https://instagram.com/…',
        },
      },
    },
    {
      name: 'megaLine',
      type: 'text',
      label: { en: 'Decorative line', hr: 'Dekorativni red' },
      defaultValue: '— Vaš trenutak, vaš Momento —',
    },
    {
      name: 'copyright',
      type: 'text',
      label: { en: 'Copyright', hr: 'Copyright' },
    },
    {
      name: 'madeBy',
      type: 'text',
      label: { en: 'Credits', hr: 'Credits' },
      defaultValue: 'Kreirao Front Tribe',
    },
  ],
}

export default MomentoFooter
