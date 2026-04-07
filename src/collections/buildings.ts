import { CollectionConfig } from 'payload'

const Buildings: CollectionConfig = {
  slug: 'buildings',
  labels: {
    singular: { en: 'Building', hr: 'Zgrada' },
    plural: { en: 'Buildings', hr: 'Zgrade' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Site Content', hr: 'Sadržaj stranice' },
    description: {
      en: 'One building = one floor plan image + one unit-details PDF (e.g. STANOVI.pdf). Draw each unit on the plan, then set label (e.g. A.1.2) and PDF page number for each.',
      hr: 'Jedna zgrada = jedna slika tlocrta + jedan PDF s detaljima jedinica (npr. STANOVI.pdf). Nacrtajte svaku jedinicu na planu, zatim postavite oznaku (npr. A.1.2) i broj stranice u PDF-u.',
    },
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
    update: ({ req }) =>
      (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',
    delete: ({ req }) => (req.user as any)?.role === 'superadmin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: {
          en: 'e.g. "Building A", "Dilatacija A"',
          hr: 'npr. "Zgrada A", "Dilatacija A"',
        },
      },
    },
    {
      name: 'floorPlanImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        description: {
          en: 'Floor plan as image (PNG/JPG). If you have a PDF, export the first page as image. Save this document after uploading so you can draw units below.',
          hr: 'Tlocrt kao slika (PNG/JPG). Ako imate PDF, izvezite prvu stranicu kao sliku. Spremite dokument nakon učitavanja da biste mogli crtati jedinice ispod.',
        },
      },
    },
    {
      name: 'unitDetailsPdf',
      type: 'upload',
      relationTo: 'documents',
      required: true,
      admin: {
        description: {
          en: 'e.g. STANOVI.pdf — page 1 = first unit, page 2 = second, etc. Upload under Media & Assets → Documents, then select here.',
          hr: 'npr. STANOVI.pdf — stranica 1 = prva jedinica, stranica 2 = druga itd. Prenesite u Mediji i datoteke → Dokumenti, zatim odaberite ovdje.',
        },
      },
    },
    {
      name: 'units',
      type: 'array',
      label: { en: 'Units', hr: 'Jedinice' },
      admin: {
        description: {
          en: 'Each row = one unit (e.g. A.1.1, A.1.2). Draw regions on the plan above; set label and PDF page number here.',
          hr: 'Svaki red = jedna jedinica (npr. A.1.1, A.1.2). Nacrtajte regije na planu iznad; ovdje postavite oznaku i broj stranice u PDF-u.',
        },
        components: {
          Field: '@/components/floor-plan/UnitRegionsField#UnitRegionsField',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: {
              en: 'e.g. "A.1.1", "DVOSOBNI STAN A.1.1"',
              hr: 'npr. "A.1.1", "DVOSOBNI STAN A.1.1"',
            },
          },
        },
        {
          name: 'detailPageNumber',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: {
              en: 'Page number in Unit details PDF (1 = first page)',
              hr: 'Broj stranice u PDF-u s detaljima jedinica (1 = prva stranica)',
            },
          },
        },
        {
          name: 'shape',
          type: 'group',
          required: true,
          admin: {
            description: {
              en: 'Polygon: draw by clicking points on the plan, then "Complete unit".',
              hr: 'Poligon: crtajte klikom na točke na planu, zatim "Završi jedinicu".',
            },
          },
          fields: [
            {
              name: 'points',
              type: 'array',
              required: true,
              minRows: 3,
              admin: {
                description: {
                  en: 'Points (x,y %). Filled by drawing on the plan.',
                  hr: 'Točke (x,y %). Ispunjeno crtanjem na planu.',
                },
                readOnly: true,
                hidden: true,
              },
              fields: [
                { name: 'x', type: 'number', required: true, min: 0, max: 100, admin: { description: { en: 'x %', hr: 'x %' } } },
                { name: 'y', type: 'number', required: true, min: 0, max: 100, admin: { description: { en: 'y %', hr: 'y %' } } },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Buildings
