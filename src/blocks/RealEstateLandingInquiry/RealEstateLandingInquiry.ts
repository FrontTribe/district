import type { Block } from 'payload'
import {
  reLandingBlockMeta,
  reLandingHeadingPartsField,
  reLandingInquiryIntroHtmlField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingInquiry: Block = {
  slug: 'real-estate-landing-inquiry',
  dbName: 're_inq',
  interfaceName: 'RealEstateLandingInquiryBlock',
  labels: {
    singular: { en: 'RE Landing — Inquiry', hr: 'RE landing — upit' },
    plural: { en: 'RE Landing — Inquiry', hr: 'RE landing — upit' },
  },
  admin: reLandingBlockMeta({
    en:
      'Landing contact band: all copy and the form POST URL come from this block (or Menu defaults when URL is empty). Not the Forms collection — set Form action URL here or under Menu → RE landing defaults.',
    hr:
      'Kontakt traka: sav tekst i POST URL dolaze iz ovog bloka (ili zadano iz Izbornika ako je URL prazan). Nije kolekcija Obrasci — URL ovdje ili u Izbornik → RE landing zadane vrijednosti.',
  }),
  fields: [
    reLandingSectionIdField,
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    reLandingInquiryIntroHtmlField,
    {
      name: 'formActionUrl',
      type: 'text',
      label: { en: 'Form action URL', hr: 'URL obrasca' },
      admin: {
        description: {
          en:
            'POST endpoint where the browser submits the form (Formspark, Basin, Getform, …). If empty here, the public site uses the default URL from Menu → “RE landing — form & footer defaults” for this tenant. This block is not the Forms collection — edit under Pages → layout.',
          hr:
            'POST endpoint za slanje obrasca. Ako je ovdje prazno, na sajtu se koristi zadani URL iz Izbornik → „RE landing — zadani obrazac i podnožje”. Nije kolekcija Obrasci — uređuje se u Stranice → layout.',
        },
      },
    },
    {
      name: 'formMethod',
      type: 'select',
      defaultValue: 'POST',
      options: [
        { label: 'POST', value: 'POST' },
        { label: 'GET', value: 'GET' },
      ],
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      label: { en: 'Submit button label', hr: 'Natpis gumba za slanje' },
      defaultValue: 'Pošalji upit',
    },
    {
      name: 'disabledSubmitHelp',
      type: 'text',
      label: { en: 'Help text when URL missing', hr: 'Poruka kad nema URL' },
      defaultValue: 'Postavite URL obrasca u CMS-u',
    },
    {
      name: 'nameFieldLabel',
      type: 'text',
      label: { en: 'Label: full name', hr: 'Oznaka: ime i prezime' },
      defaultValue: 'Ime i prezime',
    },
    {
      name: 'emailFieldLabel',
      type: 'text',
      label: { en: 'Label: email', hr: 'Oznaka: email' },
      defaultValue: 'E-pošta',
    },
    {
      name: 'phoneFieldLabel',
      type: 'text',
      label: { en: 'Label: phone', hr: 'Oznaka: telefon' },
      defaultValue: 'Telefon',
    },
    {
      name: 'interestFieldLabel',
      type: 'text',
      label: { en: 'Label: inquiry type', hr: 'Oznaka: vrsta upita' },
      defaultValue: 'Inquiry type',
    },
    {
      name: 'messageFieldLabel',
      type: 'text',
      label: { en: 'Label: message', hr: 'Oznaka: poruka' },
      defaultValue: 'Poruka',
    },
    {
      name: 'interestPlaceholder',
      type: 'text',
      label: { en: 'Interest placeholder', hr: 'Placeholder odabira' },
      defaultValue: 'Odaberite…',
    },
    {
      name: 'messagePlaceholder',
      type: 'text',
      label: { en: 'Message placeholder', hr: 'Placeholder poruke' },
      defaultValue: 'Opcionalno',
    },
    {
      name: 'privacyHtml',
      type: 'textarea',
      label: { en: 'Privacy / GDPR note (HTML)', hr: 'Privatnost / GDPR (HTML)' },
      admin: {
        description: {
          en: 'Shown below the form fields, above the four contact cells (matches landing layout).',
          hr: 'Ispod polja obrasca, iznad četiriju kontakt-ćelija (usklađeno s landing layoutom).',
        },
      },
    },
    {
      name: 'interestOptions',
      type: 'array',
      label: { en: 'Inquiry type options', hr: 'Opcije vrste upita' },
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'contacts',
      type: 'array',
      label: { en: 'Contact cells', hr: 'Kontakt ćelije' },
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'valueHtml',
          type: 'textarea',
          required: true,
          label: { en: 'Value (HTML)', hr: 'Vrijednost (HTML)' },
        },
      ],
    },
  ],
}

export default RealEstateLandingInquiry
