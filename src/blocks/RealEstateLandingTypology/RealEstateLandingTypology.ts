import type { Block } from 'payload'
import {
  reLandingAdminGroup,
  reLandingHeadingPartsField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingTypology: Block = {
  slug: 'real-estate-landing-typology',
  dbName: 're_tip',
  interfaceName: 'RealEstateLandingTypologyBlock',
  labels: {
    singular: { en: 'RE Landing — Typology', hr: 'RE landing — tipologija' },
    plural: { en: 'RE Landing — Typology', hr: 'RE landing — tipologija' },
  },
  admin: {
    group: reLandingAdminGroup,
    description: {
      en: 'Interactive list of unit types with counts and descriptions.',
      hr: 'Interaktivni popis tipova stanova s brojem i opisima.',
    },
  },
  fields: [
    reLandingSectionIdField,
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      label: { en: 'Intro (plain text)', hr: 'Uvod (obični tekst)' },
    },
    {
      name: 'countSuffixWord',
      type: 'text',
      label: { en: 'Count suffix (e.g. units)', hr: 'Sufiks broja (npr. stanova)' },
      admin: {
        description: {
          en: 'Shown after the count in each row (e.g. “units”, “stanova”). Leave empty for default “stanova”.',
          hr: 'Ispod broja u retku (npr. „stanova“, „units“). Prazno = „stanova“.',
        },
      },
    },
    {
      name: 'outroHtml',
      type: 'textarea',
      label: { en: 'Outro (HTML, optional)', hr: 'Zaključak (HTML, opc.)' },
      admin: { description: { en: 'Shown below the table when set.', hr: 'Ispod tablice kad je postavljeno.' } },
    },
    {
      name: 'items',
      type: 'array',
      label: { en: 'Unit types', hr: 'Tipovi' },
      minRows: 1,
      fields: [
        {
          name: 'unitCode',
          type: 'text',
          required: true,
          defaultValue: '',
          label: { en: 'Row id / code', hr: 'ID retka' },
        },
        { name: 'name', type: 'text', required: true, label: { en: 'Name', hr: 'Naziv' } },
        { name: 'size', type: 'text', required: true, label: { en: 'Size label', hr: 'Oznaka veličine' } },
        { name: 'description', type: 'text', required: true, label: { en: 'Description', hr: 'Opis' } },
        { name: 'count', type: 'number', required: true, min: 0, label: { en: 'Count', hr: 'Broj' } },
        {
          name: 'highlight',
          type: 'checkbox',
          label: { en: 'Highlight row', hr: 'Istakni red' },
          defaultValue: false,
          admin: { description: { en: 'Optional emphasis in the list UI.', hr: 'Opcionalni naglasak u listi.' } },
        },
      ],
    },
  ],
}

export default RealEstateLandingTypology
