/**
 * Početne vrijednosti za `pnpm run seed:re-landing` — upisuju se u Payload (`pages.layout`).
 * Produkcija i preview čitaju isključivo iz CMS-a; ova datoteka nije runtime izvor istine.
 *
 * Blok **RE Landing — Inquiry** usklađen je s `District Real Estate.html` (`.cta`).
 * Jednoredno podnožje (`.footer`) dolazi iz kolekcije **Podnožja**, ne iz layout bloka.
 *
 * Uredi sadržaj u Adminu nakon prvog seeda; ponovni seed može pregaziti lokalizirane blokove.
 */

export type ReLandingLocale = 'hr' | 'en' | 'de'

export type ReLandingHeadingPart = { text: string; italic?: boolean; lineBreak?: boolean }

export type ReLandingUnitBrowserCopy = {
  dilatationLabel: string
  floorLabel: string
  floorButtonWord: string
  stageFloorWord: string
  unitsTotalSuffix: string
  dilatationStagePrefix: string
  statusAvailable: string
  statusReserved: string
  statusSold: string
  loadingInProgress: string
  loadingErrorTemplate: string
  pdfCardBadge: string
  adminHint: string
  defaultDetailLead: string
  pagesRangeTemplate: string
  unexpectedResponse: string
  networkFailure: string
}

export type ReLandingPdfModalCopy = {
  /** Kad `pdfMetaLine` nije u CMS-u — `{dil}` = dilatacija, `{floor}` = broj kata. */
  metaTemplate: string
  closeLabel: string
  modalUnitWord: string
  netLabel: string
  grossLabel: string
  pdfPagePrefix: string
  emptyDocumentMessage: string
  openInNewTab: string
  sendInquiryCta: string
  embedTitleTemplate: string
}

export type ReLandingSeedLocalePack = {
  nav: {
    brandHtml: string
    showLangLine: boolean
    langLine: string | null
    links: { label: string; href: string }[]
  }
  hero: {
    eyebrow: string
    titleLine1: string
    titleLine2Html: string
    imageAlt: string
    mediaCaption: string
    lead: string
    scrollCueLabel: string
    metaRows: { label: string; value: string }[]
  }
  manifesto: { labelLeft: string; rows: { segments: { text: string; style: 'plain' | 'mute' | 'accent' }[] }[] }
  typology: { eyebrow: string; headingParts: ReLandingHeadingPart[]; intro: string; countSuffixWord: string }
  unitBrowser: {
    eyebrow: string
    headingParts: ReLandingHeadingPart[]
    introHtml: string
    legendHtml: string
    detailPanelNoteHtml: string
  }
  /** Labele pregleda stanova / statusa — u CMS bloku „Unit browser“ (grupe browserCopy / pdfModalCopy). */
  unitBrowserCopy: ReLandingUnitBrowserCopy
  pdfModalCopy: ReLandingPdfModalCopy
  gallery: { eyebrow: string; headingParts: ReLandingHeadingPart[]; intro: string; slides: { name: string; location: string }[] }
  currentProject: {
    eyebrow: string
    headingParts: ReLandingHeadingPart[]
    projectMeta: string
    projectNameHtml: string
    description: string
    imageAlt: string
    ctaLabel: string
    stats: { label: string; value: string }[]
  }
  pastHead: { eyebrow: string; headingParts: ReLandingHeadingPart[]; introHtml: string }
  pastStatus: string
  pastCaptions: { marina1: string; marina2: string; green: string }
  partner: {
    imageAlt: string
    eyebrow: string
    headingParts: ReLandingHeadingPart[]
    paragraphs: string[]
    ctaLabel: string
  }
  inquiry: {
    eyebrow: string
    headingParts: ReLandingHeadingPart[]
    /** Ispod naslova, iznad obrasca (HTML). */
    introHtml?: string | null
    /** Vanjski endpoint (Formspark, Basin…). null = uredi u CMS-u. */
    formActionUrl: string | null
    formMethod: 'GET' | 'POST'
    submitButtonLabel: string
    disabledSubmitHelp: string
    nameFieldLabel: string
    emailFieldLabel: string
    phoneFieldLabel: string
    interestFieldLabel: string
    messageFieldLabel: string
    interestPlaceholder: string
    messagePlaceholder: string
    /** Ispod obrasca, iznad retka kontakt-ćelija (GDPR / privatnost). */
    privacyHtml: string
    interestOptions: { label: string; value: string }[]
    /** Dizajn: 4 ćelije u retku (`repeat(4, 1fr)`). */
    contacts: { label: string; valueHtml: string }[]
  }
  /** Zadano u seed paketu (vizualno podnožje dolazi iz kolekcije Podnožja, ne iz layout bloka). */
  footer: {
    brand: string
    brandHtml: string
    line3: string
    links?: { label: string; href: string; openInNewTab?: boolean }[]
  }
}

export const reLandingSeedPacks: Record<ReLandingLocale, ReLandingSeedLocalePack> = {
  hr: {
    nav: {
      brandHtml: '<b>district.</b>',
      showLangLine: false,
      langLine: null,
      links: [
        { label: 'O projektu', href: '#projekt' },
        { label: 'Tipologija', href: '#tipologija' },
        { label: 'Trenutni projekti', href: '#trenutni' },
        { label: 'Dosadašnji projekti', href: '#projekti' },
        { label: 'Kontakt', href: '#kontakt' },
      ],
    },
    hero: {
      eyebrow: 'Kvart ŽIGICA · editorial luxury',
      titleLine1: 'KVART',
      titleLine2Html: 'ŽIGICA.',
      imageAlt: 'Vizualizacija — KVART ŽIGICA',
      mediaCaption: 'Vizualizacija — ilustrativno',
      lead:
        'Novi stambeni projekt u gradskom jezgru Osijeka — miran ritam, precizna arhitektura i prostori usmjereni na dugoročnu vrijednost zajednice.',
      scrollCueLabel: 'Scroll to explore',
      metaRows: [
        { label: 'Adresa', value: 'Ulica Ljudevita Posavskog 7, 31000 Osijek' },
        { label: 'Status', value: 'U pripremi' },
      ],
    },
    manifesto: {
      labelLeft: 'O projektu',
      rows: [
        {
          segments: [
            { text: 'Mi gradimo', style: 'plain' },
            { text: 'prostore', style: 'accent' },
            { text: 'u kojima se život', style: 'plain' },
          ],
        },
        {
          segments: [
            { text: 'organizira oko', style: 'mute' },
            { text: 'svjetla', style: 'accent' },
            { text: 'i tišine.', style: 'plain' },
          ],
        },
      ],
    },
    typology: {
      eyebrow: 'Tipologija',
      headingParts: [{ text: 'Stanovi' }, { text: 'po mjeri', italic: true }],
      intro:
        'Od garsonijere do penthousea — tipologija je postavljena oko svjetla, proporcije i svakodnevne funkcije stanovanja.',
      countSuffixWord: 'stanova',
    },
    unitBrowser: {
      eyebrow: 'Dostupni stanovi',
      headingParts: [{ text: 'Kvart' }, { text: 'Žigica', italic: true }],
      introHtml:
        '<p>Odaberite dilataciju i etažu. Na kartici su tip, neto m² i status; klik otvara detaljan tlocrt iz tehničkog projekta.</p>',
      legendHtml:
        '<p><span style="opacity:.85">●</span> dostupno · <span style="opacity:.85">●</span> rezervirano · <span style="opacity:.85">●</span> prodano</p>',
      detailPanelNoteHtml:
        '<p>Klikom na stan otvara se njegov detaljan tlocrt iz tehničkog projekta (PDF stranica za tu jedinicu).</p>',
    },
    unitBrowserCopy: {
      dilatationLabel: 'Dilatacija',
      floorLabel: 'Etaža',
      floorButtonWord: 'KAT',
      stageFloorWord: 'kat',
      unitsTotalSuffix: 'stanova',
      dilatationStagePrefix: '· Dilatacija ',
      statusAvailable: 'dostupno',
      statusReserved: 'rezervirano',
      statusSold: 'prodano',
      loadingInProgress: 'Učitavanje pregleda stanova…',
      loadingErrorTemplate: 'Učitavanje zgrade nije uspjelo ({status}).',
      pdfCardBadge: 'PDF↗',
      adminHint:
        '{count} stanova u zgradi (Payload). Zadano: Dostupno — „Rezervirano“/„Prodano“ u Adminu → Buildings → Units → polje Status po retku.',
      defaultDetailLead: 'Klikom na stan otvara se tlocrt (PDF).',
      pagesRangeTemplate: 'Stranice {from}–{to}.',
      unexpectedResponse: 'Neočekivani odgovor poslužitelja za zgradu.',
      networkFailure: 'Učitavanje zgrade nije uspjelo (mreža).',
    },
    pdfModalCopy: {
      metaTemplate: '— Dilatacija {dil} · {floor}. kat',
      closeLabel: 'Zatvori',
      modalUnitWord: 'Stan',
      netLabel: 'neto',
      grossLabel: 'obračunska',
      pdfPagePrefix: 'PDF · str. ',
      emptyDocumentMessage: 'Nije postavljen PDF dokument za ovu zgradu.',
      openInNewTab: 'Otvori u novom tabu',
      sendInquiryCta: 'Pošalji upit za ovaj stan',
      embedTitleTemplate: 'Tlocrt stana {id}',
    },
    gallery: {
      eyebrow: 'Galerija',
      headingParts: [{ text: 'Atmosfera' }, { text: 'mjesta', italic: true }],
      intro: 'Horizontalni pregled odabranih kadrova — dojam prostora i materijala.',
      slides: [
        { name: 'Dnevni boravak', location: 'Prizemlje' },
        { name: 'Fasada', location: 'Ulica' },
        { name: 'Park', location: 'Dvorište' },
      ],
    },
    currentProject: {
      eyebrow: 'Trenutni projekti',
      headingParts: [{ text: 'KVART' }, { text: 'Žigica', italic: true }],
      projectMeta: 'Faza 1',
      projectNameHtml: 'Stambeni kvart <i>u centru Osijeka</i>',
      description:
        'Prva faza donosi visoku arhitektonsku razinu i miran ritam urbanog života — stambeni koncept usmjeren na kvalitetu dugoročnog boravka.',
      imageAlt: 'Pregled projekta KVART ŽIGICA',
      ctaLabel: 'Zatraži prezentaciju',
      stats: [
        { label: 'Jedinice', value: '120+' },
        { label: 'Završetak', value: '2027.' },
        { label: 'Parking', value: '1:1' },
      ],
    },
    pastHead: {
      eyebrow: 'Portfelj',
      headingParts: [{ text: 'Dosadašnji' }, { text: 'projekti', italic: true }],
      introHtml: '<p>Odabrani projekti iz našeg portfelja — kliknite red za galeriju.</p>',
    },
    pastStatus: 'Dovršeno',
    pastCaptions: {
      marina1: 'Dnevni boravak s pogledom na more.',
      marina2: 'Eksterijer — večernje svjetlo.',
      green: 'Park i zajednički prostori.',
    },
    partner: {
      imageAlt: 'Partnerstvo — ilustrativna fotografija',
      eyebrow: 'Partnerstvo',
      headingParts: [
        { text: 'Zajedno' },
        { text: 'gradimo', italic: true },
        { text: 'standard', lineBreak: true },
      ],
      paragraphs: [
        'Suradnja s arhitektima, izvođačima i investitorima temelji se na transparentnosti, predvidljivosti i dugoročnom odnosu.',
      ],
      ctaLabel: 'Kontaktiraj nas',
    },
    inquiry: {
      eyebrow: 'Kontakt',
      headingParts: [{ text: 'Javi' }, { text: 'nam se', italic: true }],
      formActionUrl: null,
      formMethod: 'POST',
      submitButtonLabel: 'Pošalji upit',
      disabledSubmitHelp: 'Postavite URL obrasca u CMS-u',
      nameFieldLabel: 'Ime i prezime',
      emailFieldLabel: 'E-pošta',
      phoneFieldLabel: 'Telefon',
      interestFieldLabel: 'Zanimanje',
      messageFieldLabel: 'Poruka',
      interestPlaceholder: 'Odaberite…',
      messagePlaceholder: 'Opcionalno',
      privacyHtml:
        'Podaci iz obrasca koriste se isključivo u svrhu odgovora na upit, u skladu s primjenjivim propisima o zaštiti osobnih podataka.',
      interestOptions: [
        { label: 'Stan', value: 'stan' },
        { label: 'Poslovni prostor', value: 'poslovni' },
        { label: 'Ostalo', value: 'ostalo' },
      ],
      contacts: [
        { label: 'Telefon', valueHtml: '<a href="tel:+38511234567">+385 1 234 5678</a>' },
        { label: 'E-pošta', valueHtml: '<a href="mailto:info@example.com">info@example.com</a>' },
        {
          label: 'Adresa',
          valueHtml: '<span>Ulica Ljudevita Posavskog 7<br>31000 Osijek</span>',
        },
        { label: 'Posjet', valueHtml: 'Po dogovoru' },
      ],
    },
    footer: {
      brand: 'district.',
      brandHtml: '<b>district.</b>',
      line3: 'Real Estate',
      links: [
        { label: 'Politika privatnosti', href: '/politika-privatnosti' },
        { label: 'Instagram', href: 'https://www.instagram.com/', openInNewTab: true },
      ],
    },
  },
  en: {
    nav: {
      brandHtml: '<b>district.</b>',
      showLangLine: false,
      langLine: null,
      links: [
        { label: 'About the project', href: '#projekt' },
        { label: 'Typology', href: '#tipologija' },
        { label: 'Current projects', href: '#trenutni' },
        { label: 'Past projects', href: '#projekti' },
        { label: 'Contact', href: '#kontakt' },
      ],
    },
    hero: {
      eyebrow: 'KVART ŽIGICA · editorial luxury',
      titleLine1: 'KVART',
      titleLine2Html: 'ŽIGICA.',
      imageAlt: 'Visualization — KVART ŽIGICA',
      mediaCaption: 'Visualization — illustrative',
      lead:
        'A new residential project in the heart of Osijek — a calm rhythm, precise architecture, and spaces built for long-term community value.',
      scrollCueLabel: 'Scroll to explore',
      metaRows: [
        { label: 'Address', value: 'Ljudevita Posavskog 7, 31000 Osijek' },
        { label: 'Status', value: 'In preparation' },
      ],
    },
    manifesto: {
      labelLeft: 'About the project',
      rows: [
        {
          segments: [
            { text: 'We build', style: 'plain' },
            { text: 'spaces', style: 'accent' },
            { text: 'where life', style: 'plain' },
          ],
        },
        {
          segments: [
            { text: 'is organised around', style: 'mute' },
            { text: 'light', style: 'accent' },
            { text: 'and calm.', style: 'plain' },
          ],
        },
      ],
    },
    typology: {
      eyebrow: 'Typology',
      headingParts: [{ text: 'Apartments' }, { text: 'tailored', italic: true }],
      intro:
        'From studio to penthouse — the typology is shaped around daylight, proportion, and everyday living.',
      countSuffixWord: 'units',
    },
    unitBrowser: {
      eyebrow: 'Available units',
      headingParts: [{ text: 'KVART' }, { text: 'Žigica', italic: true }],
      introHtml:
        '<p>Choose block and floor. Cards show type, net m² and status; click opens the detailed plan from the technical documentation.</p>',
      legendHtml:
        '<p><span style="opacity:.85">●</span> available · <span style="opacity:.85">●</span> reserved · <span style="opacity:.85">●</span> sold</p>',
      detailPanelNoteHtml:
        '<p>Click a unit to open its detailed floor plan from the technical project (PDF page for that unit).</p>',
    },
    unitBrowserCopy: {
      dilatationLabel: 'Expansion joint',
      floorLabel: 'Floor',
      floorButtonWord: 'FL',
      stageFloorWord: 'floor',
      unitsTotalSuffix: 'units',
      dilatationStagePrefix: '· Block ',
      statusAvailable: 'available',
      statusReserved: 'reserved',
      statusSold: 'sold',
      loadingInProgress: 'Loading units…',
      loadingErrorTemplate: 'Could not load building ({status}).',
      pdfCardBadge: 'PDF↗',
      adminHint:
        '{count} units in this building (Payload). Default: Available — set Reserved / Sold per row in Admin → Buildings → Units → Status.',
      defaultDetailLead: 'Click a unit to open the floor plan (PDF).',
      pagesRangeTemplate: 'Pages {from}–{to}.',
      unexpectedResponse: 'Unexpected server response for the building.',
      networkFailure: 'Could not load the building (network).',
    },
    pdfModalCopy: {
      metaTemplate: '— Expansion joint {dil} · floor {floor}.',
      closeLabel: 'Close',
      modalUnitWord: 'Unit',
      netLabel: 'net',
      grossLabel: 'gross',
      pdfPagePrefix: 'PDF · p. ',
      emptyDocumentMessage: 'No PDF document is linked for this building.',
      openInNewTab: 'Open in new tab',
      sendInquiryCta: 'Send inquiry for this unit',
      embedTitleTemplate: 'Floor plan — {id}',
    },
    gallery: {
      eyebrow: 'Gallery',
      headingParts: [{ text: 'Sense' }, { text: 'of place', italic: true }],
      intro: 'Horizontal tour of selected frames — materiality and atmosphere.',
      slides: [
        { name: 'Living room', location: 'Ground floor' },
        { name: 'Facade', location: 'Street' },
        { name: 'Park', location: 'Courtyard' },
      ],
    },
    currentProject: {
      eyebrow: 'Current projects',
      headingParts: [{ text: 'KVART' }, { text: 'Žigica', italic: true }],
      projectMeta: 'Phase 1',
      projectNameHtml: 'Residential quarter <i>in central Osijek</i>',
      description:
        'The first phase brings a high level of architecture and a calm urban rhythm — a residential concept focused on long-term quality of stay.',
      imageAlt: 'KVART ŽIGICA project overview',
      ctaLabel: 'Request a presentation',
      stats: [
        { label: 'Units', value: '120+' },
        { label: 'Completion', value: '2027' },
        { label: 'Parking', value: '1:1' },
      ],
    },
    pastHead: {
      eyebrow: 'Portfolio',
      headingParts: [{ text: 'Past' }, { text: 'projects', italic: true }],
      introHtml: '<p>Selected work from our portfolio — click a row to open the gallery.</p>',
    },
    pastStatus: 'Completed',
    pastCaptions: {
      marina1: 'Living room with sea view.',
      marina2: 'Exterior — evening light.',
      green: 'Park and shared spaces.',
    },
    partner: {
      imageAlt: 'Partnership — illustrative photo',
      eyebrow: 'Partnership',
      headingParts: [
        { text: 'Together' },
        { text: 'we build', italic: true },
        { text: 'the standard', lineBreak: true },
      ],
      paragraphs: [
        'Collaboration with architects, contractors and investors is built on transparency, predictability and long-term relationships.',
      ],
      ctaLabel: 'Contact us',
    },
    inquiry: {
      eyebrow: 'Contact',
      headingParts: [{ text: 'Get' }, { text: 'in touch', italic: true }],
      formActionUrl: null,
      formMethod: 'POST',
      submitButtonLabel: 'Send inquiry',
      disabledSubmitHelp: 'Set the form action URL in the CMS',
      nameFieldLabel: 'Full name',
      emailFieldLabel: 'Email',
      phoneFieldLabel: 'Phone',
      interestFieldLabel: 'Interest',
      messageFieldLabel: 'Message',
      interestPlaceholder: 'Choose…',
      messagePlaceholder: 'Optional',
      privacyHtml:
        'Information you submit is used only to respond to your inquiry, in line with applicable data protection law.',
      interestOptions: [
        { label: 'Apartment', value: 'stan' },
        { label: 'Commercial space', value: 'poslovni' },
        { label: 'Other', value: 'ostalo' },
      ],
      contacts: [
        { label: 'Phone', valueHtml: '<a href="tel:+38511234567">+385 1 234 5678</a>' },
        { label: 'Email', valueHtml: '<a href="mailto:info@example.com">info@example.com</a>' },
        {
          label: 'Address',
          valueHtml: '<span>Ljudevita Posavskog 7<br>31000 Osijek</span>',
        },
        { label: 'Visits', valueHtml: 'By appointment' },
      ],
    },
    footer: {
      brand: 'district.',
      brandHtml: '<b>district.</b>',
      line3: 'Real Estate',
      links: [
        { label: 'Privacy policy', href: '/politika-privatnosti' },
        { label: 'Instagram', href: 'https://www.instagram.com/', openInNewTab: true },
      ],
    },
  },
  de: {
    nav: {
      brandHtml: '<b>district.</b>',
      showLangLine: false,
      langLine: null,
      links: [
        { label: 'Über das Projekt', href: '#projekt' },
        { label: 'Typologie', href: '#tipologija' },
        { label: 'Aktuelle Projekte', href: '#trenutni' },
        { label: 'Frühere Projekte', href: '#projekti' },
        { label: 'Kontakt', href: '#kontakt' },
      ],
    },
    hero: {
      eyebrow: 'KVART ŽIGICA · editorial luxury',
      titleLine1: 'KVART',
      titleLine2Html: 'ŽIGICA.',
      imageAlt: 'Visualisierung — KVART ŽIGICA',
      mediaCaption: 'Visualisierung — illustrativ',
      lead:
        'Ein neues Wohnprojekt im Herzen von Osijek — ruhiger Rhythmus, präzise Architektur und Räume mit langfristigem Wert für die Gemeinschaft.',
      scrollCueLabel: 'Weiter scrollen',
      metaRows: [
        { label: 'Adresse', value: 'Ljudevita Posavskog 7, 31000 Osijek' },
        { label: 'Status', value: 'In Vorbereitung' },
      ],
    },
    manifesto: {
      labelLeft: 'Über das Projekt',
      rows: [
        {
          segments: [
            { text: 'Wir bauen', style: 'plain' },
            { text: 'Räume', style: 'accent' },
            { text: 'in denen sich das Leben', style: 'plain' },
          ],
        },
        {
          segments: [
            { text: 'um', style: 'mute' },
            { text: 'Licht', style: 'accent' },
            { text: 'und Ruhe ordnet.', style: 'plain' },
          ],
        },
      ],
    },
    typology: {
      eyebrow: 'Typologie',
      headingParts: [{ text: 'Wohnungen' }, { text: 'nach Maß', italic: true }],
      intro:
        'Von der Garsoniere bis zum Penthouse — die Typologie folgt Licht, Proportion und dem Alltag im Wohnen.',
      countSuffixWord: 'Wohnungen',
    },
    unitBrowser: {
      eyebrow: 'Verfügbare Wohnungen',
      headingParts: [{ text: 'KVART' }, { text: 'Žigica', italic: true }],
      introHtml:
        '<p>Block und Geschoss wählen. Auf den Karten: Typ, Netto-m² und Status; Klick öffnet den detaillierten Grundriss aus dem technischen Projekt.</p>',
      legendHtml:
        '<p><span style="opacity:.85">●</span> verfügbar · <span style="opacity:.85">●</span> reserviert · <span style="opacity:.85">●</span> verkauft</p>',
      detailPanelNoteHtml:
        '<p>Mit Klick auf die Wohnung öffnet sich der detaillierte Grundriss aus dem technischen Projekt (PDF-Seite für diese Einheit).</p>',
    },
    unitBrowserCopy: {
      dilatationLabel: 'Dehnfuge',
      floorLabel: 'Geschoss',
      floorButtonWord: 'OG',
      stageFloorWord: 'geschoss',
      unitsTotalSuffix: 'Wohnungen',
      dilatationStagePrefix: '· Block ',
      statusAvailable: 'verfügbar',
      statusReserved: 'reserviert',
      statusSold: 'verkauft',
      loadingInProgress: 'Wohnungen werden geladen…',
      loadingErrorTemplate: 'Gebäude konnte nicht geladen werden ({status}).',
      pdfCardBadge: 'PDF↗',
      adminHint:
        '{count} Einheiten in diesem Gebäude (Payload). Standard: verfügbar — „Reserviert“/„Verkauft“ in Admin → Buildings → Units → Status.',
      defaultDetailLead: 'Klicken Sie auf eine Wohnung, um den Grundriss (PDF) zu öffnen.',
      pagesRangeTemplate: 'Seiten {from}–{to}.',
      unexpectedResponse: 'Unerwartete Serverantwort für das Gebäude.',
      networkFailure: 'Gebäude konnte nicht geladen werden (Netzwerk).',
    },
    pdfModalCopy: {
      metaTemplate: '— Dehnfuge {dil} · {floor}. Geschoss',
      closeLabel: 'Schließen',
      modalUnitWord: 'Wohnung',
      netLabel: 'netto',
      grossLabel: 'berechnet',
      pdfPagePrefix: 'PDF · S. ',
      emptyDocumentMessage: 'Für dieses Gebäude ist kein PDF-Dokument verknüpft.',
      openInNewTab: 'In neuem Tab öffnen',
      sendInquiryCta: 'Anfrage für diese Wohnung senden',
      embedTitleTemplate: 'Grundriss {id}',
    },
    gallery: {
      eyebrow: 'Galerie',
      headingParts: [{ text: 'Atmosphäre' }, { text: 'des Ortes', italic: true }],
      intro: 'Horizontaler Überblick über ausgewählte Motive — Material und Raumgefühl.',
      slides: [
        { name: 'Wohnbereich', location: 'Erdgeschoss' },
        { name: 'Fassade', location: 'Straße' },
        { name: 'Park', location: 'Innenhof' },
      ],
    },
    currentProject: {
      eyebrow: 'Aktuelle Projekte',
      headingParts: [{ text: 'KVART' }, { text: 'Žigica', italic: true }],
      projectMeta: 'Phase 1',
      projectNameHtml: 'Wohnquartier <i>im Zentrum von Osijek</i>',
      description:
        'Die erste Phase bringt hohe architektonische Qualität und einen ruhigen urbanen Rhythmus — ein Wohnkonzept mit Fokus auf langfristige Aufenthaltsqualität.',
      imageAlt: 'Projektüberblick KVART ŽIGICA',
      ctaLabel: 'Präsentation anfragen',
      stats: [
        { label: 'Einheiten', value: '120+' },
        { label: 'Fertigstellung', value: '2027' },
        { label: 'Parkplätze', value: '1:1' },
      ],
    },
    pastHead: {
      eyebrow: 'Portfolio',
      headingParts: [{ text: 'Frühere' }, { text: 'Projekte', italic: true }],
      introHtml: '<p>Ausgewählte Projekte aus unserem Portfolio — Zeile anklicken für die Galerie.</p>',
    },
    pastStatus: 'Fertiggestellt',
    pastCaptions: {
      marina1: 'Wohnbereich mit Meerblick.',
      marina2: 'Außenansicht — Abendlicht.',
      green: 'Park und gemeinschaftliche Freiflächen.',
    },
    partner: {
      imageAlt: 'Partnerschaft — illustratives Foto',
      eyebrow: 'Partnerschaft',
      headingParts: [
        { text: 'Gemeinsam' },
        { text: 'schaffen wir', italic: true },
        { text: 'Standard', lineBreak: true },
      ],
      paragraphs: [
        'Die Zusammenarbeit mit Architekten, Bauunternehmen und Investoren basiert auf Transparenz, Planbarkeit und langfristigen Beziehungen.',
      ],
      ctaLabel: 'Kontakt aufnehmen',
    },
    inquiry: {
      eyebrow: 'Kontakt',
      headingParts: [{ text: 'Schreiben' }, { text: 'Sie uns', italic: true }],
      formActionUrl: null,
      formMethod: 'POST',
      submitButtonLabel: 'Anfrage senden',
      disabledSubmitHelp: 'Formular-URL im CMS eintragen',
      nameFieldLabel: 'Vor- und Nachname',
      emailFieldLabel: 'E-Mail',
      phoneFieldLabel: 'Telefon',
      interestFieldLabel: 'Interesse',
      messageFieldLabel: 'Nachricht',
      interestPlaceholder: 'Bitte wählen…',
      messagePlaceholder: 'Optional',
      privacyHtml:
        'Ihre Angaben werden ausschließlich zur Beantwortung Ihrer Anfrage gemäß den geltenden Datenschutzvorschriften verwendet.',
      interestOptions: [
        { label: 'Wohnung', value: 'stan' },
        { label: 'Gewerbefläche', value: 'poslovni' },
        { label: 'Sonstiges', value: 'ostalo' },
      ],
      contacts: [
        { label: 'Telefon', valueHtml: '<a href="tel:+38511234567">+385 1 234 5678</a>' },
        { label: 'E-Mail', valueHtml: '<a href="mailto:info@example.com">info@example.com</a>' },
        {
          label: 'Adresse',
          valueHtml: '<span>Ljudevita Posavskog 7<br>31000 Osijek</span>',
        },
        { label: 'Termine', valueHtml: 'Nach Vereinbarung' },
      ],
    },
    footer: {
      brand: 'district.',
      brandHtml: '<b>district.</b>',
      line3: 'Real Estate',
      links: [
        { label: 'Datenschutz', href: '/politika-privatnosti' },
        { label: 'Instagram', href: 'https://www.instagram.com/', openInNewTab: true },
      ],
    },
  },
}
