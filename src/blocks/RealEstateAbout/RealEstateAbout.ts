import { Block } from 'payload'

const RealEstateAbout: Block = {
  slug: 'real-estate-about',
  labels: {
    singular: 'Real Estate About',
    plural: 'Real Estate About',
  },
  admin: {
    group: 'Real Estate',
  },
  fields: [
    {
      name: 'headingLine1',
      type: 'text',
      label: 'Heading Line 1',
      defaultValue: 'Izvrsnost u',
      required: true,
    },
    {
      name: 'headingLine2',
      type: 'text',
      label: 'Heading Line 2',
      defaultValue: 'real estate',
      required: true,
    },
    {
      name: 'headingLine3',
      type: 'text',
      label: 'Heading Line 3',
      defaultValue: 'projektiranju',
      required: true,
    },
    {
      name: 'paragraph1',
      type: 'textarea',
      label: 'First Paragraph',
      defaultValue:
        'District Real Estate je vodeća agencija za nekretnine koja se specializira za razvoj i prodaju luksuznih stambenih projekata. Naša misija je stvoriti prostor gdje se suvremeni dizajn susreće s funkcionalnošću, gdje svaki detalj ima svoj smisao i gdje se kvaliteta ne kompromitira.',
    },
    {
      name: 'paragraph2',
      type: 'textarea',
      label: 'Second Paragraph',
      defaultValue:
        'S višegodišnjim iskustvom i timom strastvenih profesionalaca, preobrazili smo više od 50 projekata u Zagrebu i okolici, osiguravajući našim klijentima vrhunsku kvalitetu življenja i investicijsku vrijednost.',
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for this section (used for menu navigation)',
      },
    },
  ],
}

export default RealEstateAbout
