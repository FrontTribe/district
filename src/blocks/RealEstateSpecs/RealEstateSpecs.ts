import { Block } from 'payload'

const RealEstateSpecs: Block = {
  slug: 'real-estate-specs',
  labels: {
    singular: 'Real Estate Specs',
    plural: 'Real Estate Specs',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'headingLine1',
      type: 'text',
      label: 'Heading Line 1',
      defaultValue: 'Tehnički Opis i',
      required: true,
    },
    {
      name: 'headingLine2',
      type: 'text',
      label: 'Heading Line 2',
      defaultValue: 'Specifikacija Stanova',
      required: true,
    },
    {
      name: 'descriptionParagraph1',
      type: 'textarea',
      label: 'Description Paragraph 1',
      defaultValue:
        'Naši stanovi dizajnirani su prema najvišim standardima suvremene arhitekture i graditeljstva. Svaki prostor je pažljivo planiran kako bi maksimalno iskoristio dostupnu površinu, pružajući funkcionalan i udoban životni prostor.',
    },
    {
      name: 'descriptionParagraph2',
      type: 'textarea',
      label: 'Description Paragraph 2',
      defaultValue:
        'Svi stanovi uključuju visokokvalitetne materijale, energijski učinkovite sustave i pametne kućne tehnologije koje osiguravaju optimalnu razinu komfora i održivosti.',
    },
    {
      name: 'specItems',
      type: 'array',
      label: 'Specification Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'value',
          type: 'textarea',
          label: 'Value',
          required: true,
        },
      ],
      defaultValue: [
        { label: 'Konstrukcija', value: 'Armirano-betonska konstrukcija' },
        { label: 'Zidovi', value: 'Gips-kartonski s izolacijom' },
        { label: 'Podovi', value: 'Parket ili keramičke pločice' },
        { label: 'Stolarija', value: 'PVC s trostrukim staklom' },
        { label: 'Elektroinstalacija', value: '3-fazni priključak, pametna instalacija' },
        { label: 'Sanitarije', value: 'Premium sanitarne keramičke pločice' },
        { label: 'Grijanje', value: 'Centralno grijanje, klima uređaji' },
        { label: 'Parking', value: 'Podzemni parking, garažno mjesto' },
      ],
    },
    {
      name: 'featureList',
      type: 'array',
      label: 'Feature List Items',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Feature Text',
          required: true,
        },
      ],
      defaultValue: [
        { text: 'Premium podne obloge (parket, keramika)' },
        { text: 'Kvalitetna stolarija i izolacija' },
        { text: 'Klima uređaji u svakoj sobi' },
        { text: 'Podno grijanje u kupaonici' },
        { text: 'Suvremeni kuhinjski elementi' },
        { text: 'Balkoni i terase s predviđenim priključcima' },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },
  ],
}

export default RealEstateSpecs
