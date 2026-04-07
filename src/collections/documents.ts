import { CollectionConfig } from 'payload'

/**
 * Stores PDF files (e.g. floor plan PDF, unit details PDF where each page = one unit).
 * Use this collection for PDFs — do not use Media (images only).
 */
const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: { en: 'Document', hr: 'Dokument' },
    plural: { en: 'Documents', hr: 'Dokumenti' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'updatedAt'],
    group: { en: 'Media & Assets', hr: 'Mediji i datoteke' },
    description: {
      en: 'PDF documents only. Upload unit-details PDFs here. For Buildings, use "Unit details PDF" or add a document from this collection.',
      hr: 'Samo PDF dokumenti. Ovdje prenesite PDF-ove s detaljima jedinica. Za Zgrade koristite "PDF s detaljima jedinica" ili dodajte dokument iz ove kolekcije.',
    },
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
    update: ({ req }) => (req.user as any)?.role === 'superadmin',
    delete: ({ req }) => (req.user as any)?.role === 'superadmin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: {
          en: 'Optional label (e.g. "Unit details – Building A")',
          hr: 'Opcionalna oznaka (npr. "Detalji jedinica – Zgrada A")',
        },
      },
    },
  ],
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['application/pdf'],
    adminThumbnail: 'default',
  },
}

export default Documents
