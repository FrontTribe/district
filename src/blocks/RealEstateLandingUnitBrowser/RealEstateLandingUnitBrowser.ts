import type { Block } from 'payload'
import {
  reLandingBlockMeta,
  reLandingHeadingPartsField,
  reLandingSectionIdField,
} from '@/blocks/real-estate-landing-shared'

const RealEstateLandingUnitBrowser: Block = {
  slug: 'real-estate-landing-unit-browser',
  dbName: 're_ub',
  interfaceName: 'RealEstateLandingUnitBrowserBlock',
  labels: {
    singular: { en: 'RE Landing — Unit browser', hr: 'RE landing — pregled stanova' },
    plural: { en: 'RE Landing — Unit browser', hr: 'RE landing — pregled stanova' },
  },
  admin: reLandingBlockMeta({
    en: 'Filters units by dilatation & floor; opens PDF modal from the linked building document.',
    hr: 'Filtrira stanove po dilataciji i katu; PDF modal iz dokumenta zgrade.',
  }),
  fields: [
    reLandingSectionIdField,
    { name: 'eyebrow', type: 'text', required: true },
    reLandingHeadingPartsField,
    {
      name: 'introHtml',
      type: 'textarea',
      required: true,
      label: { en: 'Intro (HTML)', hr: 'Uvod (HTML)' },
    },
    {
      name: 'legendHtml',
      type: 'textarea',
      label: { en: 'Legend / status key (HTML)', hr: 'Legenda statusa (HTML)' },
      admin: {
        description: {
          en: 'Optional copy next to the intro (e.g. colour dots for sold/reserved).',
          hr: 'Opcionalni tekst uz uvod (npr. objašnjenje boja statusa).',
        },
      },
    },
    {
      name: 'detailPanelNoteHtml',
      type: 'textarea',
      label: { en: 'Detail panel note (HTML)', hr: 'Bilješka u donjem panelu (HTML)' },
      admin: {
        description: {
          en: 'Replaces the default “click unit for PDF” hint when set.',
          hr: 'Zamjenjuje zadanu poruku o kliku na stan kad je postavljeno.',
        },
      },
    },
    {
      name: 'building',
      type: 'relationship',
      relationTo: 'buildings',
      required: true,
      label: { en: 'Building', hr: 'Zgrada' },
      admin: {
        description: {
          en: 'Must include unitDetailsPdf and units with floor/dilatacija for filters.',
          hr: 'Mora imati PDF jedinica i jedinice s kat/dilatacija za filtere.',
        },
      },
    },
    {
      name: 'pdfMetaLine',
      type: 'text',
      label: { en: 'PDF modal meta line', hr: 'Meta red u PDF modalu' },
      admin: {
        description: {
          en: 'Optional line above unit title in PDF modal, e.g. project name.',
          hr: 'Opcionalni red iznad naslova u PDF modalu.',
        },
      },
    },
    {
      name: 'browserCopy',
      type: 'group',
      label: { en: 'Unit hub copy (optional)', hr: 'Tekstovi pregleda stanova (opc.)' },
      admin: {
        description: {
          en: 'Leave empty to use Croatian defaults. Fill for EN/DE or custom wording — all managed in CMS.',
          hr: 'Prazno = hrvatske zadane vrijednosti. Ispunite za EN/DE ili prilagođene tekstove.',
        },
      },
      fields: [
        { name: 'dilatationLabel', type: 'text', label: { en: 'Dilatation column title', hr: 'Naslov stupca dilatacija' } },
        { name: 'floorLabel', type: 'text', label: { en: 'Floor column title', hr: 'Naslov stupca etaža' } },
        { name: 'floorButtonWord', type: 'text', label: { en: 'Floor button word (e.g. FLOOR)', hr: 'Riječ na tipki etaže (npr. KAT)' } },
        { name: 'stageFloorWord', type: 'text', label: { en: 'Stage headline floor word', hr: 'Riječ „kat“ u naslovu ploče' } },
        { name: 'unitsTotalSuffix', type: 'text', label: { en: 'Suffix after unit count', hr: 'Sufiks nakon broja stanova' } },
        {
          name: 'dilatationStagePrefix',
          type: 'text',
          label: { en: 'Stage dilatation prefix', hr: 'Prefiks dilatacije u naslovu' },
          admin: {
            description: { en: 'Before letter, e.g. "· Dilatacija " (space at end).', hr: 'Prije slova, npr. „· Dilatacija ".' },
          },
        },
        { name: 'statusAvailable', type: 'text', label: { en: 'Available', hr: 'Dostupno' } },
        { name: 'statusReserved', type: 'text', label: { en: 'Reserved', hr: 'Rezervirano' } },
        { name: 'statusSold', type: 'text', label: { en: 'Sold', hr: 'Prodano' } },
        {
          name: 'loadingInProgress',
          type: 'text',
          label: { en: 'Loading message', hr: 'Poruka tijekom učitavanja' },
        },
        {
          name: 'loadingErrorTemplate',
          type: 'text',
          label: { en: 'Load error (use {status})', hr: 'Greška učitavanja ({status})' },
          admin: {
            description: { en: 'HTTP status inserted at {status}.', hr: 'HTTP kod na mjestu {status}.' },
          },
        },
        { name: 'pdfCardBadge', type: 'text', label: { en: 'PDF badge on unit card', hr: 'Oznaka PDF na kartici' } },
        { name: 'adminHint', type: 'textarea', label: { en: 'CMS admin hint (below stats)', hr: 'Savjet adminu (ispod statistike)' } },
        {
          name: 'defaultDetailLead',
          type: 'textarea',
          label: { en: 'Default detail hint (no CMS note)', hr: 'Zadani tekst donjeg panela' },
        },
        {
          name: 'pagesRangeTemplate',
          type: 'text',
          label: { en: 'Page range (use {from} {to})', hr: 'Raspon stranica ({from}–{to})' },
          admin: {
            description: { en: 'Example: Pages {from}–{to}.', hr: 'Primjer: Stranice {from}–{to}.' },
          },
        },
        {
          name: 'unexpectedResponse',
          type: 'text',
          label: { en: 'Unexpected JSON message', hr: 'Poruka za neočekivani odgovor' },
        },
        {
          name: 'networkFailure',
          type: 'text',
          label: { en: 'Network / fetch failure', hr: 'Greška mreže / fetch' },
        },
      ],
    },
    {
      name: 'pdfModalCopy',
      type: 'group',
      label: { en: 'PDF modal copy (optional)', hr: 'PDF modal — tekstovi (opc.)' },
      fields: [
        {
          name: 'metaTemplate',
          type: 'text',
          label: { en: 'Meta line if page meta empty', hr: 'Meta red ako nema pdfMetaLine' },
          admin: {
            description: {
              en: 'Use placeholders {dil} and {floor}. Shown when “PDF modal meta line” is empty.',
              hr: 'Zamjenski znakovi {dil} i {floor}. Prikaz ako „PDF modal meta line“ nije postavljen.',
            },
          },
        },
        { name: 'closeLabel', type: 'text', label: { en: 'Close button', hr: 'Gumb zatvori' } },
        { name: 'modalUnitWord', type: 'text', label: { en: '“Unit” word', hr: 'Riječ za stan' } },
        { name: 'netLabel', type: 'text', label: { en: 'Net area label', hr: 'Neto m²' } },
        { name: 'grossLabel', type: 'text', label: { en: 'Gross area label', hr: 'Obračunska' } },
        { name: 'pdfPagePrefix', type: 'text', label: { en: 'PDF page prefix', hr: 'Prefiks stranice PDF-a' } },
        { name: 'emptyDocumentMessage', type: 'textarea', label: { en: 'No PDF document', hr: 'Poruka kad nema PDF-a' } },
        { name: 'openInNewTab', type: 'text', label: { en: 'Open in new tab', hr: 'Otvori u novom tabu' } },
        { name: 'sendInquiryCta', type: 'text', label: { en: 'Send inquiry CTA', hr: 'Pošalji upit' } },
        {
          name: 'embedTitleTemplate',
          type: 'text',
          label: { en: 'Embed title (use {id})', hr: 'Naslov ugrađenog PDF-a ({id})' },
        },
      ],
    },
  ],
}

export default RealEstateLandingUnitBrowser
