import type { Block } from 'payload'
import { districtAdminGroups } from '@/blocks/district-admin-groups'

const BoutiqueFooter: Block = {
  slug: 'boutique-footer',
  dbName: 'btq_ft',
  interfaceName: 'BoutiqueFooterBlock',
  labels: {
    singular: { en: 'Boutique — Footer', hr: 'Boutique — podnožje' },
    plural: { en: 'Boutique — Footer', hr: 'Boutique — podnožje' },
  },
  admin: {
    group: districtAdminGroups.boutique,
  },
  fields: [
    { name: 'timeLabel', type: 'text', label: { en: 'Time label', hr: 'Oznaka vremena' }, defaultValue: 'Vrijeme u Osijeku' },
    { name: 'signoffEyebrow', type: 'text', label: { en: 'Sign-off eyebrow', hr: 'Sign-off eyebrow' } },
    { name: 'signoffHeading', type: 'textarea', label: { en: 'Sign-off heading (*italic*)', hr: 'Sign-off naslov' } },
    { name: 'coordinatesLat', type: 'text', label: { en: 'Coordinates lat label', hr: 'Koordinate lat' }, defaultValue: '45.5550° N' },
    { name: 'coordinatesLng', type: 'text', label: { en: 'Coordinates lng label', hr: 'Koordinate lng' }, defaultValue: '18.6955° E' },
    { name: 'addressHeading', type: 'text', label: { en: 'Address card heading', hr: 'Naslov kartice adrese' }, defaultValue: 'Adresa & dolazak' },
    { name: 'addressHtml', type: 'textarea', label: { en: 'Address (HTML allowed)', hr: 'Adresa (HTML dozvoljen)' } },
    { name: 'addressMapUrl', type: 'text', label: { en: 'Maps URL', hr: 'Maps URL' } },
    {
      name: 'infoRows',
      type: 'array',
      label: { en: 'Address info rows', hr: 'Info redovi adrese' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    { name: 'contactHeading', type: 'text', label: { en: 'Contact card heading', hr: 'Naslov kartice kontakt' }, defaultValue: 'Razgovor' },
    {
      name: 'contactLinks',
      type: 'array',
      label: { en: 'Contact links', hr: 'Kontakt linkovi' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'mapHeading', type: 'text', label: { en: 'Map card heading', hr: 'Naslov kartice karte' }, defaultValue: 'Karta' },
    { name: 'mapCta', type: 'text', label: { en: 'Map CTA', hr: 'Map CTA' }, localized: true },
    {
      name: 'distanceRows',
      type: 'array',
      label: { en: 'Distance rows', hr: 'Udaljenosti' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'marqueeItems',
      type: 'array',
      label: { en: 'Marquee items', hr: 'Marquee stavke' },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    { name: 'wordmark', type: 'text', label: { en: 'Wordmark', hr: 'Wordmark' }, defaultValue: 'district.' },
    { name: 'copyright', type: 'text', label: { en: 'Copyright', hr: 'Copyright' } },
    {
      name: 'legalLinks',
      type: 'array',
      label: { en: 'Legal links', hr: 'Legal linkovi' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'madeBy', type: 'text', label: { en: 'Credits', hr: 'Credits' }, defaultValue: 'Kreirao Front Tribe' },
  ],
}

export default BoutiqueFooter
