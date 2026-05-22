/**
 * Graditelj `pages.layout` za Momento seed (`buildMomentoPayloadLayout`).
 * Početni tekstovi iz `momentoSeedDefaults.ts` — produkcija čita samo CMS.
 *
 * Blokovi (redoslijed kao u Payload adminu):
 * 1. Hero  2. Intro  3. Image Grid  4. Concept Bar Menu  5. Job Opportunity  6. Location
 *
 * Slike: `public/momento-landing/` — iz `Momento by District.html` bundler manifesta.
 * Ažuriraj: `pnpm run extract:momento-images`
 */

import { getMomentoLocalePack, type MomentoLocale } from '@/data/momentoSeedDefaults'

export const momentoDemoImageUrls = {
  hero: '/momento-landing/hero.jpg',
  interior1: '/momento-landing/interior-1.jpg',
  interior2: '/momento-landing/interior-2.jpg',
  interior3: '/momento-landing/interior-3.jpg',
  terrace: '/momento-landing/terrace.jpg',
  career: '/momento-landing/career.jpg',
} as const

export type MomentoDemoMediaKey = keyof typeof momentoDemoImageUrls

type MediaIds = Record<MomentoDemoMediaKey, number>

const GRID_IMAGE_KEYS: readonly MomentoDemoMediaKey[] = [
  'interior1',
  'interior2',
  'interior3',
  'terrace',
]

const CATEGORY_IMAGE_KEYS: readonly MomentoDemoMediaKey[] = [
  'interior1',
  'interior2',
  'interior3',
  'terrace',
  'hero',
  'career',
]

function mediaPick(media: MediaIds, key: MomentoDemoMediaKey): number {
  return media[key]
}

export function buildMomentoPayloadLayout(media: MediaIds, locale: MomentoLocale = 'hr') {
  const pack = getMomentoLocalePack(locale)

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
      blockType: 'intro' as const,
      content: pack.intro.content,
      sectionId: pack.intro.sectionId,
    },
    {
      blockType: 'image-grid' as const,
      title: pack.imageGrid.title,
      subtitle: pack.imageGrid.subtitle,
      images: [
        { image: mediaPick(media, 'interior1'), position: 'top-left' as const },
        { image: mediaPick(media, 'interior2'), position: 'top-right' as const },
        { image: mediaPick(media, 'interior3'), position: 'bottom-left' as const },
        { image: mediaPick(media, 'terrace'), position: 'bottom-right' as const },
        { image: mediaPick(media, 'hero'), position: 'top-left' as const },
        { image: mediaPick(media, 'career'), position: 'bottom-right' as const },
      ],
      sectionId: pack.imageGrid.sectionId,
    },
    {
      blockType: 'concept-bar-menu' as const,
      title: pack.menu.title,
      subtitle: pack.menu.subtitle,
      popularBadgeText: pack.menu.popularBadgeText,
      sectionId: pack.menu.sectionId,
      menuCategories: pack.menu.categories.map((cat, i) => ({
        categoryName: cat.categoryName,
        categoryDescription: cat.categoryDescription ?? '',
        categoryImage: mediaPick(media, CATEGORY_IMAGE_KEYS[i % CATEGORY_IMAGE_KEYS.length]!),
        menuItems: cat.menuItems.map((item) => ({
          itemName: item.itemName,
          itemDescription: item.itemDescription ?? '',
          itemPrice: item.itemPrice ?? '',
          isPopular: Boolean(item.isPopular),
        })),
      })),
    },
    {
      blockType: 'job-opportunity' as const,
      title: pack.career.title,
      subtitle: pack.career.subtitle,
      description: pack.career.description,
      buttonText: pack.career.buttonText,
      buttonUrl: pack.career.buttonUrl,
      badgeText: pack.career.badgeText,
      features: pack.career.features.map((featureText) => ({ featureText })),
      ctaNote: pack.career.ctaNote,
      backgroundImage: mediaPick(media, 'career'),
      sectionId: pack.career.sectionId,
    },
    {
      blockType: 'location' as const,
      title: pack.location.title,
      description: pack.location.description,
      address: pack.location.address,
      coordinates: {
        lat: pack.location.lat,
        lng: pack.location.lng,
      },
      workingHours: pack.location.workingHours.map((row) => ({
        day: row.day,
        isOpen: row.isOpen,
        openTime: row.openTime,
        closeTime: row.closeTime,
      })),
      sectionId: pack.location.sectionId,
    },
  ]
}

export function momentoPageTitle(locale: MomentoLocale): string {
  return getMomentoLocalePack(locale).pageTitle
}

export function momentoPageMeta(locale: MomentoLocale) {
  const pack = getMomentoLocalePack(locale)
  return {
    title: pack.metaTitle,
    description: pack.metaDescription,
  }
}
