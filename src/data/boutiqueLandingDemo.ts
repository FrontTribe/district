/**
 * Graditelj `pages.layout` za Boutique seed.
 */

import { getBoutiqueLocalePack, type BoutiqueLocale } from '@/data/boutiqueSeedDefaults'

export const boutiqueDemoImageUrls = {
  hero: '/boutique-landing/hero.jpg',
  about1: '/boutique-landing/about1.jpg',
  about2: '/boutique-landing/about2.jpg',
  about3: '/boutique-landing/about3.jpg',
  rooftopHero: '/boutique-landing/rooftopHero.jpg',
  rooftop1: '/boutique-landing/rooftop1.jpg',
  rooftop2: '/boutique-landing/rooftop2.jpg',
  rooftop3: '/boutique-landing/rooftop3.jpg',
  rooftop4: '/boutique-landing/rooftop4.jpg',
  premium1: '/boutique-landing/premium1.jpg',
  premium2: '/boutique-landing/premium2.jpg',
  premium3: '/boutique-landing/premium3.jpg',
  premium4: '/boutique-landing/premium4.jpg',
  deluxe1: '/boutique-landing/deluxe1.jpg',
  deluxe2: '/boutique-landing/deluxe2.jpg',
  deluxe3: '/boutique-landing/deluxe3.jpg',
  deluxe4: '/boutique-landing/deluxe4.jpg',
  suite1: '/boutique-landing/suite1.jpg',
  suite2: '/boutique-landing/suite2.jpg',
  suite3: '/boutique-landing/suite3.jpg',
  suite4: '/boutique-landing/suite4.jpg',
  jacuzzi1: '/boutique-landing/jacuzzi1.jpg',
  jacuzzi2: '/boutique-landing/jacuzzi2.jpg',
  jacuzzi3: '/boutique-landing/jacuzzi3.jpg',
  jacuzzi4: '/boutique-landing/jacuzzi4.jpg',
} as const

export type BoutiqueDemoMediaKey = keyof typeof boutiqueDemoImageUrls

type MediaIds = Record<BoutiqueDemoMediaKey, number>

export type RentlioRoomPreserve = {
  rentlioPropertyId?: string | null
  rentlioSalesChannelId?: string | null
  rentlioUnitTypeId?: string | null
}[]

function mediaPick(media: MediaIds, key: BoutiqueDemoMediaKey): number {
  return media[key]
}

export function buildBoutiquePayloadLayout(
  media: MediaIds,
  locale: BoutiqueLocale = 'hr',
  rentlioPreserve: RentlioRoomPreserve = [],
) {
  const pack = getBoutiqueLocalePack(locale)

  return [
    {
      blockType: 'hero' as const,
      heading: pack.hero.heading,
      subheading: pack.hero.subheading,
      sectionId: pack.hero.sectionId,
      backgroundMedia: {
        type: 'image' as const,
        image: mediaPick(media, 'hero'),
        overlay: 'medium' as const,
      },
    },
    {
      blockType: 'botique-intro' as const,
      chapterNum: pack.intro.chapterNum,
      chapterLabel: pack.intro.chapterLabel,
      heading: pack.intro.heading,
      body: pack.intro.body,
      pullQuote: pack.intro.pullQuote,
      pullQuoteCite: pack.intro.pullQuoteCite,
      stats: pack.intro.stats,
      collageTags: pack.intro.collageTags.map((tag) => ({ tag })),
      mediaTopRight: mediaPick(media, 'about1'),
      mediaBottomLeft: mediaPick(media, 'about2'),
      mediaBottomRight: mediaPick(media, 'about3'),
      sectionId: pack.intro.sectionId,
    },
    {
      blockType: 'rooms' as const,
      chapterNum: pack.rooms.chapterNum,
      chapterLabel: pack.rooms.chapterLabel,
      heading: pack.rooms.heading,
      subheading: pack.rooms.subheading,
      sectionId: pack.rooms.sectionId,
      rooms: pack.rooms.items.map((room, i) => {
        const preserved = rentlioPreserve[i]
        return {
          roomNumber: room.roomNumber,
          title: room.title,
          description: room.description,
          displayPrice: room.displayPrice,
          displayPriceSuffix: room.displayPriceSuffix,
          badges: room.badges,
          images: room.imageKeys.map((key) => ({
            image: mediaPick(media, key as BoutiqueDemoMediaKey),
          })),
          rentlioPropertyId: preserved?.rentlioPropertyId ?? undefined,
          rentlioSalesChannelId: preserved?.rentlioSalesChannelId ?? '45',
          rentlioUnitTypeId: preserved?.rentlioUnitTypeId ?? undefined,
        }
      }),
    },
    {
      blockType: 'rooftop' as const,
      layoutVariant: 'editorial' as const,
      chapterNum: pack.rooftop.chapterNum,
      chapterLabel: pack.rooftop.chapterLabel,
      heading: pack.rooftop.heading,
      mastheadMedia: mediaPick(media, 'rooftopHero'),
      metaRows: pack.rooftop.metaRows.map((text) => ({ text })),
      manifestEyebrow: pack.rooftop.manifestEyebrow,
      manifestHeading: pack.rooftop.manifestHeading,
      manifestItems: pack.rooftop.manifestItems,
      stackImages: [
        { media: mediaPick(media, 'rooftop4') },
        { media: mediaPick(media, 'rooftop1') },
      ],
      cta: pack.rooftop.cta,
      sectionId: pack.rooftop.sectionId,
    },
    {
      blockType: 'rooftop-features' as const,
      features: pack.rooftop.features.map((f) => ({
        romanNumeral: f.romanNumeral,
        tag: f.tag,
        title: f.title,
        description: f.description,
        media: mediaPick(media, f.imageKey as BoutiqueDemoMediaKey),
        reverseLayout: f.reverseLayout ?? false,
      })),
    },
    {
      blockType: 'boutique-contact' as const,
      chapterNum: pack.contact.chapterNum,
      chapterLabel: pack.contact.chapterLabel,
      heading: pack.contact.heading,
      leadText: pack.contact.leadText,
      channels: pack.contact.channels,
      intelRows: pack.contact.intelRows,
      formNote: pack.contact.formNote,
      successHeading: pack.contact.successHeading,
      successMessage: pack.contact.successMessage,
      form: 0,
      sectionId: pack.contact.sectionId,
    },
    {
      blockType: 'boutique-footer' as const,
      timeLabel: pack.footer.timeLabel,
      signoffEyebrow: pack.footer.signoffEyebrow,
      signoffHeading: pack.footer.signoffHeading,
      addressHeading: pack.footer.addressHeading,
      addressHtml: pack.footer.addressHtml,
      addressMapUrl: 'https://maps.google.com/?q=Ljudevita+Posavskog+7+Osijek',
      infoRows: pack.footer.infoRows,
      contactHeading: pack.footer.contactHeading,
      contactLinks: pack.footer.contactLinks,
      newsletterHeading: pack.footer.newsletterHeading,
      newsletterNote: pack.footer.newsletterNote,
      mapHeading: pack.footer.mapHeading,
      mapCta: pack.footer.mapCta,
      distanceRows: pack.footer.distanceRows,
      marqueeItems: pack.footer.marqueeItems.map((text) => ({ text })),
      wordmark: 'district.',
      copyright: pack.footer.copyright,
      legalLinks: pack.footer.legalLinks,
      madeBy: pack.footer.madeBy,
    },
  ]
}

export function boutiquePageTitle(locale: BoutiqueLocale) {
  return getBoutiqueLocalePack(locale).pageTitle
}

export function boutiquePageMeta(locale: BoutiqueLocale) {
  const pack = getBoutiqueLocalePack(locale)
  return { title: pack.meta.title, description: pack.meta.description }
}

export function injectBoutiqueFormId(
  layout: ReturnType<typeof buildBoutiquePayloadLayout>,
  formId: number,
) {
  return layout.map((block) =>
    block.blockType === 'boutique-contact' ? { ...block, form: formId } : block,
  )
}

export function extractRentlioPreserveFromLayout(
  layout: { blockType?: string | null; rooms?: RentlioRoomPreserve }[] | null | undefined,
): RentlioRoomPreserve {
  const roomsBlock = layout?.find((b) => b.blockType === 'rooms')
  if (!roomsBlock?.rooms?.length) return []
  return roomsBlock.rooms.map((r) => ({
    rentlioPropertyId: r.rentlioPropertyId,
    rentlioSalesChannelId: r.rentlioSalesChannelId,
    rentlioUnitTypeId: r.rentlioUnitTypeId,
  }))
}
