/**
 * Graditelj `pages.layout` za seed (`buildRealEstateLandingPayloadLayout`).
 * Početni tekstovi za Payload dolaze iz `reLandingSeedDefaults.ts` — produkcija čita samo CMS.
 *
 * Završni blok je **RE Landing — Inquiry** (`#kontakt`). Tamno podnožje dolazi iz kolekcije **Podnožja** (`footer`),
 * ne iz layout bloka.
 *
 * Slike: `public/re-landing/` — isti JPEG-i kao u `District Real Estate.html` (bundler manifest).
 * Ažuriraj datoteke: `node scripts/extract-district-html-images.mjs`
 */

import type { TypologyFromPdfItem } from '@/utils/deriveTypologyFromStanoviPdf'
import {
  getReLandingLocalePack,
  typologyDemoRows,
  translateTypologyPdfRows,
  type ReLandingLocale,
} from '@/data/realEstateLandingLocales'

/** Statičke slike u `public/re-landing/` (iz bundla `District Real Estate.html`). */
export const reLandingDemoImageUrls = {
  hero: '/re-landing/real-estate-hero.jpg',
  tzd018: '/re-landing/tzd_018.jpg',
  tzd019: '/re-landing/tzd_019.jpg',
  tzd021: '/re-landing/tzd_021.jpg',
  tzd026: '/re-landing/tzd_026.jpg',
} as const

export type ReLandingDemoMediaKey = keyof typeof reLandingDemoImageUrls

const lines = (arr: string[]) => arr.map((line) => ({ line }))

const DEMO_MARQUEE_ITEMS = [
  { text: 'kvart' },
  { text: 'žigica', italic: true },
  { text: 'Osijek' },
  { text: 'zajednica', italic: true },
] as const

const HERO_CORNER = {
  heroSectionId: 'top',
  layout: 'default' as const,
  topLeftLines: ['OSIJEK', '45.5551° N'] as const,
  topRightLines: ['2026', 'KVART ŽIGICA'] as const,
  showScrollCue: true as const,
}

const SECTION_IDS = {
  manifesto: 'projekt',
  typology: 'tipologija',
  unitBrowser: 'kat',
  gallery: 'galerija',
  currentProject: 'trenutni',
  past: 'projekti',
  partner: 'partner',
  inquiry: 'kontakt',
} as const

/** Tri različita kadra galerije (isti set kao u HTML exportu). */
const GALLERY_IMAGE_KEYS: readonly ReLandingDemoMediaKey[] = ['tzd018', 'tzd019', 'tzd021']

const PAST_SHELL = [
  {
    name: 'Marina Heights',
    location: 'Split',
    year: '2023',
    statusActive: false,
    previewKey: 'tzd018' as const,
    previewImageAlt: 'Marina Heights — visualization',
    gallery: [
      { imageKey: 'tzd019' as const, captionKey: 'marina1' as const },
      { imageKey: 'tzd026' as const, captionKey: 'marina2' as const },
    ],
  },
  {
    name: 'Green Park',
    location: 'Zagreb',
    year: '2022',
    statusActive: false,
    previewKey: 'tzd021' as const,
    previewImageAlt: 'Green Park',
    gallery: [{ imageKey: 'hero' as const, captionKey: 'green' as const }],
  },
] as const

const UNIT_BROWSER_PDF_META = 'KVART ŽIGICA'

const MANIFESTO_LABEL_NUM = '01'
const CURRENT_PROJECT_BIG_NUM = '02'

type MediaIds = Record<ReLandingDemoMediaKey, number>

export type RealEstateLandingLayoutSeedOptions = {
  buildingId?: number
  typologyItems?: TypologyFromPdfItem[]
  typologyIntro?: string
}

function mediaPick(media: MediaIds, key: ReLandingDemoMediaKey): number {
  return media[key]
}

function typologyItemsForPayload(
  opts: RealEstateLandingLayoutSeedOptions | undefined,
  locale: ReLandingLocale,
): Pick<TypologyFromPdfItem, 'unitCode' | 'name' | 'size' | 'description' | 'count' | 'highlight'>[] {
  const raw =
    opts?.typologyItems != null
      ? (translateTypologyPdfRows(opts.typologyItems, locale) ?? opts.typologyItems)
      : typologyDemoRows[locale]
  return raw.map((it) => ({
    unitCode: it.unitCode,
    name: it.name,
    size: it.size,
    description: it.description,
    count: it.count,
    highlight: Boolean(it.highlight),
  }))
}

/** Layout blokova za Payload (media = ID-evi uploada). */
export function buildRealEstateLandingPayloadLayout(
  media: MediaIds,
  opts?: RealEstateLandingLayoutSeedOptions,
  locale: ReLandingLocale = 'hr',
) {
  const pack = getReLandingLocalePack(locale)

  const pastPayload = PAST_SHELL.map((p) => ({
    name: p.name,
    location: p.location,
    year: p.year,
    statusLabel: pack.pastStatus,
    statusActive: p.statusActive,
    previewImage: mediaPick(media, p.previewKey),
    previewImageAlt: p.previewImageAlt,
    gallery: p.gallery.map((g) => ({
      image: mediaPick(media, g.imageKey),
      caption: pack.pastCaptions[g.captionKey],
    })),
  }))

  const typIntro = opts?.typologyIntro ?? pack.typology.intro
  const typItems = typologyItemsForPayload(opts, locale)

  return [
    {
      blockType: 'real-estate-landing-nav' as const,
      brandHtml: pack.nav.brandHtml,
      showLangLine: pack.nav.showLangLine,
      langLine: pack.nav.langLine,
      links: pack.nav.links.map((l) => ({ ...l })),
    },
    {
      blockType: 'real-estate-landing-hero' as const,
      heroSectionId: HERO_CORNER.heroSectionId,
      layout: HERO_CORNER.layout,
      topLeftLines: lines([...HERO_CORNER.topLeftLines]),
      topRightLines: lines([...HERO_CORNER.topRightLines]),
      eyebrow: pack.hero.eyebrow,
      titleLine1: pack.hero.titleLine1,
      titleLine2Html: pack.hero.titleLine2Html,
      heroImage: media.hero,
      imageAlt: pack.hero.imageAlt,
      mediaCaption: pack.hero.mediaCaption,
      lead: pack.hero.lead,
      showScrollCue: HERO_CORNER.showScrollCue,
      scrollCueLabel: pack.hero.scrollCueLabel,
      metaRows: pack.hero.metaRows.map((m) => ({ ...m })),
    },
    {
      blockType: 'real-estate-landing-marquee' as const,
      items: DEMO_MARQUEE_ITEMS.map((x) => ({ ...x })),
    },
    {
      blockType: 'real-estate-landing-manifesto' as const,
      sectionId: SECTION_IDS.manifesto,
      labelLeft: pack.manifesto.labelLeft,
      labelNum: MANIFESTO_LABEL_NUM,
      rows: pack.manifesto.rows.map((row) => ({
        segments: row.segments.map((s) => ({ ...s })),
      })),
    },
    {
      blockType: 'real-estate-landing-typology' as const,
      sectionId: SECTION_IDS.typology,
      eyebrow: pack.typology.eyebrow,
      headingParts: pack.typology.headingParts.map((h) => ({ ...h })),
      intro: typIntro,
      countSuffixWord: pack.typology.countSuffixWord,
      items: typItems,
    },
    {
      blockType: 'real-estate-landing-gallery' as const,
      sectionId: SECTION_IDS.gallery,
      eyebrow: pack.gallery.eyebrow,
      headingParts: pack.gallery.headingParts.map((h) => ({ ...h })),
      intro: pack.gallery.intro,
      slides: pack.gallery.slides.map((s, i) => ({
        image: mediaPick(media, GALLERY_IMAGE_KEYS[i] ?? 'tzd018'),
        name: s.name,
        location: s.location,
      })),
    },
    {
      blockType: 'real-estate-landing-current-project' as const,
      sectionId: SECTION_IDS.currentProject,
      eyebrow: pack.currentProject.eyebrow,
      headingParts: pack.currentProject.headingParts.map((h) => ({ ...h })),
      bigNumber: CURRENT_PROJECT_BIG_NUM,
      projectMeta: pack.currentProject.projectMeta,
      projectNameHtml: pack.currentProject.projectNameHtml,
      description: pack.currentProject.description,
      image: media.tzd019,
      imageAlt: pack.currentProject.imageAlt,
      ctaLabel: pack.currentProject.ctaLabel,
      ctaHref: '#kontakt',
      ctaOpenInNewTab: false,
      stats: pack.currentProject.stats.map((s) => ({ ...s })),
    },
    ...(opts?.buildingId != null
      ? ([
          {
            blockType: 'real-estate-landing-unit-browser' as const,
            sectionId: SECTION_IDS.unitBrowser,
            eyebrow: pack.unitBrowser.eyebrow,
            headingParts: pack.unitBrowser.headingParts.map((h) => ({ ...h })),
            introHtml: pack.unitBrowser.introHtml,
            legendHtml: pack.unitBrowser.legendHtml,
            detailPanelNoteHtml: pack.unitBrowser.detailPanelNoteHtml,
            building: opts.buildingId,
            pdfMetaLine: UNIT_BROWSER_PDF_META,
            browserCopy: { ...pack.unitBrowserCopy },
            pdfModalCopy: { ...pack.pdfModalCopy },
          },
        ] as const)
      : []),
    {
      blockType: 'real-estate-landing-past-projects' as const,
      sectionId: SECTION_IDS.past,
      layout: 'rows' as const,
      eyebrow: pack.pastHead.eyebrow,
      headingParts: pack.pastHead.headingParts.map((h) => ({ ...h })),
      introHtml: pack.pastHead.introHtml,
      projects: pastPayload,
    },
    {
      blockType: 'real-estate-landing-partner' as const,
      sectionId: SECTION_IDS.partner,
      image: media.tzd026,
      imageAlt: pack.partner.imageAlt,
      eyebrow: pack.partner.eyebrow,
      headingParts: pack.partner.headingParts.map((h) => ({ ...h })),
      paragraphs: pack.partner.paragraphs.map((text) => ({ text })),
      ctaLabel: pack.partner.ctaLabel,
      ctaHref: '#kontakt',
      ctaOpenInNewTab: false,
      signatureBold: 'District',
      signatureSub: 'Real Estate',
    },
    {
      blockType: 'real-estate-landing-inquiry' as const,
      sectionId: SECTION_IDS.inquiry,
      eyebrow: pack.inquiry.eyebrow,
      headingParts: pack.inquiry.headingParts.map((h) => ({ ...h })),
      introHtml: pack.inquiry.introHtml ?? null,
      formActionUrl: pack.inquiry.formActionUrl,
      formMethod: pack.inquiry.formMethod,
      submitButtonLabel: pack.inquiry.submitButtonLabel,
      disabledSubmitHelp: pack.inquiry.disabledSubmitHelp,
      nameFieldLabel: pack.inquiry.nameFieldLabel,
      emailFieldLabel: pack.inquiry.emailFieldLabel,
      phoneFieldLabel: pack.inquiry.phoneFieldLabel,
      interestFieldLabel: pack.inquiry.interestFieldLabel,
      messageFieldLabel: pack.inquiry.messageFieldLabel,
      interestPlaceholder: pack.inquiry.interestPlaceholder,
      messagePlaceholder: pack.inquiry.messagePlaceholder,
      privacyHtml: pack.inquiry.privacyHtml,
      interestOptions: pack.inquiry.interestOptions.map((o) => ({ ...o })),
      contacts: pack.inquiry.contacts.map((c) => ({ ...c })),
    },
  ]
}
