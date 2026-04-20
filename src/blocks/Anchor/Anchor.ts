import { Block } from 'payload'

const Anchor: Block = {
  slug: 'anchor',
  labels: {
    singular: { en: 'Anchor', hr: 'Sidro' },
    plural: { en: 'Anchors', hr: 'Sidra' },
  },
  fields: [
    {
      name: 'anchorId',
      type: 'text',
      label: { en: 'Anchor ID', hr: 'ID sidra' },
      required: true,
      admin: {
        description: {
          en: 'ID used as the scroll target (e.g. "contact" → links to #contact). Use lowercase letters, numbers, and dashes.',
          hr: 'ID koji se koristi kao odredište skrolanja (npr. "kontakt" → vodi na #kontakt). Koristite mala slova, brojeve i crtice.',
        },
      },
    },
  ],
}

export default Anchor
