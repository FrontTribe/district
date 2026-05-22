import type { Field } from 'payload'

import { districtAdminGroups } from '@/blocks/district-admin-groups'

/** Admin — svi novi RE landing blokovi (jedna vertikala). */
export const reLandingAdminGroup = districtAdminGroups.realEstate

/** Zastarjeli RE blokovi — i dalje pod istom vertikalom. */
export const reDeprecatedAdminGroup = {
  en: `${districtAdminGroups.realEstate.en} (deprecated)`,
  hr: `${districtAdminGroups.realEstate.hr} (zastarjelo)`,
} as const

export const reLandingBlockAdmin = {
  group: reLandingAdminGroup,
}

/** Block admin with sidebar description (Payload 3). */
export function reLandingBlockMeta(description: { en: string; hr: string }) {
  return {
    group: reLandingAdminGroup,
    description,
  }
}

export const reDeprecatedBlockAdmin = {
  group: reDeprecatedAdminGroup,
}

export const reLandingSectionIdField: Field = {
  name: 'sectionId',
  type: 'text',
  label: { en: 'Section ID (anchor)', hr: 'ID sekcije (sidro)' },
  admin: {
    description: {
      en: 'HTML id for in-page links, e.g. kat, kontakt',
      hr: 'HTML id za poveznice na stranici, npr. kat, kontakt',
    },
  },
}

export const reLandingHeadingPartsField: Field = {
  name: 'headingParts',
  type: 'array',
  label: { en: 'Heading parts', hr: 'Dijelovi naslova' },
  minRows: 1,
  admin: {
    description: {
      en: 'Build the main heading from ordered fragments (plain or italic).',
      hr: 'Složite glavni naslov iz fragmenata (obični ili kurziv).',
    },
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: { en: 'Text', hr: 'Tekst' },
    },
    {
      name: 'italic',
      type: 'checkbox',
      label: { en: 'Italic', hr: 'Kurziv' },
      defaultValue: false,
    },
    {
      name: 'lineBreak',
      type: 'checkbox',
      label: { en: 'Line break after', hr: 'Prijelom retka nakon' },
      defaultValue: false,
    },
  ],
}

/** Optional HTML block shown when filled (overrides or extends plain intro depending on block). */
export const reLandingIntroHtmlField: Field = {
  name: 'introHtml',
  type: 'textarea',
  label: { en: 'Intro (HTML)', hr: 'Uvod (HTML)' },
  admin: {
    description: {
      en: 'Optional. When set, some sections render this instead of the plain intro field.',
      hr: 'Opcionalno. Kad je postavljeno, neke sekcije prikazuju ovo umjesto običnog uvoda.',
    },
  },
}

/** Intro under the inquiry heading, before the form (same shape as `introHtml`, inquiry-specific copy in admin). */
export const reLandingInquiryIntroHtmlField: Field = {
  name: 'introHtml',
  type: 'textarea',
  label: { en: 'Intro under heading (HTML)', hr: 'Uvod ispod naslova (HTML)' },
  admin: {
    description: {
      en: 'Optional. One short paragraph between the headline and the form fields.',
      hr: 'Opcionalno. Kratak odlomak između naslova i polja obrasca.',
    },
  },
}

export const reLandingImageAltField: Field = {
  name: 'imageAlt',
  type: 'text',
  label: { en: 'Image alt text', hr: 'Alt tekst slike' },
  admin: {
    description: {
      en: 'Accessibility: short description of the image for screen readers.',
      hr: 'Pristupačnost: kratak opis slike za čitače ekrana.',
    },
  },
}

export const reLandingCtaFields: Field[] = [
  {
    name: 'ctaLabel',
    type: 'text',
    label: { en: 'CTA label', hr: 'Natpis gumba' },
    admin: { description: { en: 'Optional call-to-action in the nav bar.', hr: 'Opcionalni gumb u navigaciji.' } },
  },
  {
    name: 'ctaHref',
    type: 'text',
    label: { en: 'CTA link (href)', hr: 'CTA poveznica' },
  },
  {
    name: 'ctaOpenInNewTab',
    type: 'checkbox',
    label: { en: 'Open CTA in new tab', hr: 'CTA u novom tabu' },
    defaultValue: false,
  },
]
