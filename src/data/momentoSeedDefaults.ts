/**
 * Početne vrijednosti za `pnpm run seed:momento` — upisuju se u Payload (`pages.layout`, `menu`).
 * Produkcija čita isključivo iz CMS-a.
 *
 * Cjenik i posebne ponude iz `Momento by District.html` (window.MENU_DATA / window.OFFERS).
 * Tekstovi hero / o-nama / karijera / lokacija usklađeni s live stranicom i redizajnom.
 */

import menuJson from '@/data/momentoMenuSeedData.json'
import { translateMenuItem, translateOfferPop } from '@/data/momentoMenuI18n'

export type MomentoLocale = 'hr' | 'en' | 'de'

export type MomentoMenuItemSeed = {
  itemName: string
  itemDescription?: string
  itemPrice?: string
  isPopular?: boolean
}

export type MomentoMenuCategorySeed = {
  categoryName: string
  categoryDescription?: string
  menuItems: MomentoMenuItemSeed[]
}

export type MomentoSeedLocalePack = {
  pageTitle: string
  metaTitle: string
  metaDescription: string
  nav: {
    logoText: string
    links: { label: string; scrollTarget: string }[]
  }
  hero: {
    heading: string
    subheading: string
    sectionId: string
  }
  intro: {
    content: string
    sectionId: string
  }
  imageGrid: {
    title: string
    subtitle: string
    sectionId: string
  }
  menu: {
    title: string
    subtitle: string
    popularBadgeText: string
    sectionId: string
    categories: MomentoMenuCategorySeed[]
  }
  career: {
    title: string
    subtitle: string
    description: string
    buttonText: string
    buttonUrl: string
    badgeText: string
    features: string[]
    ctaNote: string
    sectionId: string
  }
  location: {
    title: string
    description: string
    address: string
    lat: number
    lng: number
    sectionId: string
    workingHours: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
      isOpen: boolean
      openTime: string
      closeTime: string
    }[]
  }
  footer: {
    logoText: string
    tagline: string
    pagesHeading: string
    contactHeading: string
    socialHeading: string
    email: string
    phone: string
    instagram: string
    megaLine: string
    madeBy: string
  }
}

const WORKING_HOURS = [
  { day: 'monday' as const, isOpen: true, openTime: '07:00', closeTime: '23:00' },
  { day: 'tuesday' as const, isOpen: true, openTime: '07:00', closeTime: '23:00' },
  { day: 'wednesday' as const, isOpen: true, openTime: '07:00', closeTime: '23:00' },
  { day: 'thursday' as const, isOpen: true, openTime: '07:00', closeTime: '23:00' },
  { day: 'friday' as const, isOpen: true, openTime: '07:00', closeTime: '00:00' },
  { day: 'saturday' as const, isOpen: true, openTime: '07:00', closeTime: '00:00' },
  { day: 'sunday' as const, isOpen: true, openTime: '07:00', closeTime: '23:00' },
]

const CATEGORY_TITLE_EN: Record<string, string> = {
  Slatko: 'Sweet',
  'Cijeđeni Mix / Smoothie': 'Fresh Mix / Smoothie',
  Kava: 'Coffee',
  'Kava — dodatci': 'Coffee — extras',
  'Čaj & topla čokolada': 'Tea & hot chocolate',
  'Hladno cijeđeni sokovi': 'Cold-pressed juices',
  Sokovi: 'Soft drinks',
  Voda: 'Water',
  Whiskey: 'Whiskey',
  Tequila: 'Tequila',
  Votka: 'Vodka',
  Gin: 'Gin',
  Rum: 'Rum',
  'Cognac & liker': 'Cognac & liqueurs',
  'Pivo — boca': 'Beer — bottle',
  'Pivo — točeno': 'Beer — on tap',
  Vino: 'Wine',
  'Aperitiv Aura 0,03L': 'Aura aperitif 0.03L',
  Tobacco: 'Tobacco',
  'Posebna ponuda': 'Special offers',
}

const CATEGORY_TITLE_DE: Record<string, string> = {
  Slatko: 'Süßes',
  'Cijeđeni Mix / Smoothie': 'Frisch Mix / Smoothie',
  Kava: 'Kaffee',
  'Kava — dodatci': 'Kaffee — Extras',
  'Čaj & topla čokolada': 'Tee & heiße Schokolade',
  'Hladno cijeđeni sokovi': 'Kaltgepresste Säfte',
  Sokovi: 'Erfrischungsgetränke',
  Voda: 'Wasser',
  Whiskey: 'Whiskey',
  Tequila: 'Tequila',
  Votka: 'Wodka',
  Gin: 'Gin',
  Rum: 'Rum',
  'Cognac & liker': 'Cognac & Liköre',
  'Pivo — boca': 'Bier — Flasche',
  'Pivo — točeno': 'Bier — vom Fass',
  Vino: 'Wein',
  'Aperitiv Aura 0,03L': 'Aura Aperitif 0,03L',
  Tobacco: 'Tabak',
  'Posebna ponuda': 'Sonderangebote',
}

function buildMenuCategories(locale: MomentoLocale): MomentoMenuCategorySeed[] {
  const titleMap = locale === 'en' ? CATEGORY_TITLE_EN : locale === 'de' ? CATEGORY_TITLE_DE : null

  const offersCategory: MomentoMenuCategorySeed = {
    categoryName: titleMap?.['Posebna ponuda'] ?? 'Posebna ponuda',
    categoryDescription:
      locale === 'en'
        ? 'Combo deals for every part of the day.'
        : locale === 'de'
          ? 'Kombi-Angebote für jeden Tageszeitpunkt.'
          : 'Kombinacije koje nas razmaze.',
    menuItems: menuJson.offers.map((o) => {
      const row = translateMenuItem(
        { name: o.name, price: o.price, desc: o.pop, featured: o.featured },
        locale,
      )
      return {
        itemName: row.itemName,
        itemPrice: row.itemPrice,
        itemDescription: translateOfferPop(o.pop, locale) ?? row.itemDescription,
        isPopular: row.isPopular,
      }
    }),
  }

  const fromMenu = menuJson.menuData.map((cat) => ({
    categoryName: titleMap?.[cat.title] ?? cat.title,
    menuItems: cat.items.map((item) => {
      const row = translateMenuItem(item, locale)
      return {
        itemName: row.itemName,
        itemPrice: row.itemPrice,
        itemDescription: row.itemDescription,
        isPopular: row.isPopular,
      }
    }),
  }))

  return [offersCategory, ...fromMenu]
}

const hrPack: MomentoSeedLocalePack = {
  pageTitle: 'Momento by DISTRICT',
  metaTitle: 'Momento by District - lounge & caffe bar u srcu Retfale',
  metaDescription:
    'Momento lounge & caffe bar u prizemlju District Boutique-a — kava, slastice, craft pivo, vina i opuštena atmosfera u srcu Retfale, Osijek.',
  nav: {
    logoText: 'Momento.',
    links: [
      { label: 'O nama', scrollTarget: 'o-nama' },
      { label: 'Naš meni', scrollTarget: 'menu' },
      { label: 'Karijera', scrollTarget: 'karijera' },
      { label: 'Lokacija', scrollTarget: 'lokacija' },
    ],
  },
  hero: {
    heading: 'Momento by District',
    subheading:
      'Od jutarnjeg espressa i doručka do večernjeg pića: kave s okusima, matcha/latte, fresh sokovi, craft i točeno pivo, dobro izabrana vina, slastice, ukusne sendviče i tople kroasane.',
    sectionId: 'top',
  },
  intro: {
    content:
      'Momento lounge & caffe bar smješten je u prizemlju zgrade District Boutique smještaja.',
    sectionId: 'intro',
  },
  imageGrid: {
    title: 'Momento — vaš dnevni ritam u srcu Retfale',
    subtitle:
      'U prizemlju zgrade District Boutique-a, nalazi se Momento lounge & caffe bar – ugodan i prostran prostor stvoren za jutarnju kavu, dnevni predah i večernje opuštanje. Velike staklene stijene, obilje zelenila i topla rasvjeta stvaraju opuštenu i elegantnu atmosferu, idealnu za brzi espresso, druženje ili neformalan poslovni sastanak. Momento nudi pažljivo odabrane kave, raznolike napitke, ukusne sendviče, svježe kroasane i bogatu ponudu kolača, uz raznolik bar program koji upotpunjuje uživanje u svakom trenutku dana.',
    sectionId: 'o-nama',
  },
  menu: {
    title: 'Naš meni.',
    subtitle: 'Od jutarnje kave do večernjeg pića.',
    popularBadgeText: 'Popularno',
    sectionId: 'menu',
    categories: buildMenuCategories('hr'),
  },
  career: {
    title: 'Tražiš posao?',
    subtitle: 'Pridruži se našem timu u Momento',
    description:
      'Uvijek tražimo strastvene ljude koji će se pridružiti našem timu. Ako volite gostoprimstvo, odličnu hranu i stvaranje nezaboravnih iskustava, voljeli bismo čuti vaše mišljenje.',
    buttonText: 'Prijavi se',
    buttonUrl: 'mailto:support@district.hr?subject=Momento%20—%20prijava%20za%20posao',
    badgeText: '05 / Momento zapošljava',
    features: ['Odličan tim', 'Ugodna atmosfera', 'Kompetitivna plaća'],
    ctaNote: 'Pošalji nam svoj CV sada!',
    sectionId: 'karijera',
  },
  location: {
    title: 'Gdje nas pronaći',
    description:
      'Momento lounge & caffe bar nalazi se u prizemlju zgrade, neposredno uz District Boutique, na lako dostupnoj lokaciji bilo da dolazite pješice ili automobilom. Smješten je odmah nasuprot Opus Arena, a u blizini se nalazi i dovoljno parkirnih mjesta. Centar Osijeka udaljen je svega nekoliko minuta, što Momento čini idealnim mjestom za kavu, slasticu ili opušteno večernje druženje u ugodnoj atmosferi.',
    address: 'Ulica Ljudevita Posavskog 7, 31000 Osijek, Hrvatska',
    lat: 45.5551,
    lng: 18.6955,
    sectionId: 'lokacija',
    workingHours: WORKING_HOURS,
  },
  footer: {
    logoText: 'Momento.',
    tagline: 'Lounge & caffe bar u prizemlju District Boutique-a. Vaš trenutak, svaki dan.',
    pagesHeading: 'Stranice',
    contactHeading: 'Kontakt',
    socialHeading: 'Pratite nas',
    email: 'support@district.hr',
    phone: '+385 99 554 4337',
    instagram: 'momentobydistrict',
    megaLine: '— Vaš trenutak, vaš Momento —',
    madeBy: 'Kreirao Front Tribe',
  },
}

const enPack: MomentoSeedLocalePack = {
  ...hrPack,
  pageTitle: 'Momento by DISTRICT',
  metaTitle: 'Momento by District — lounge & coffee bar in the heart of Retfala',
  metaDescription:
    'Momento lounge & coffee bar on the ground floor of District Boutique — coffee, pastries, craft beer, wines and a relaxed atmosphere in Retfala, Osijek.',
  nav: {
    logoText: 'Momento.',
    links: [
      { label: 'About', scrollTarget: 'o-nama' },
      { label: 'Our menu', scrollTarget: 'menu' },
      { label: 'Careers', scrollTarget: 'karijera' },
      { label: 'Location', scrollTarget: 'lokacija' },
    ],
  },
  hero: {
    ...hrPack.hero,
    subheading:
      'From morning espresso and breakfast to evening drinks: flavoured coffees, matcha/latte, fresh juices, craft and draught beer, a curated wine list, pastries, sandwiches and warm croissants.',
  },
  intro: {
    content: 'Momento lounge & coffee bar is located on the ground floor of District Boutique.',
    sectionId: 'intro',
  },
  imageGrid: {
    title: 'Momento — your daily rhythm in the heart of Retfala',
    subtitle:
      'On the ground floor of District Boutique, Momento lounge & coffee bar is a spacious, welcoming place for morning coffee, a midday break and evening relaxation. Large glass walls, greenery and warm lighting create a relaxed, elegant atmosphere — ideal for a quick espresso, meeting friends or an informal business chat. Momento offers carefully selected coffees, a wide range of drinks, sandwiches, fresh croissants and a rich selection of cakes, complemented by a varied bar programme throughout the day.',
    sectionId: 'o-nama',
  },
  menu: {
    title: 'Our menu.',
    subtitle: 'From morning coffee to evening drinks.',
    popularBadgeText: 'Popular',
    sectionId: 'menu',
    categories: buildMenuCategories('en'),
  },
  career: {
    title: 'Looking for a job?',
    subtitle: 'Join our team at Momento',
    description:
      "We're always looking for passionate people to join our team. If you love hospitality, great food and creating memorable experiences, we'd love to hear from you.",
    buttonText: 'Apply now',
    buttonUrl: 'mailto:support@district.hr?subject=Momento%20—%20job%20application',
    badgeText: '05 / Now hiring',
    features: ['Great team', 'Welcoming atmosphere', 'Competitive pay'],
    ctaNote: 'Send us your CV today!',
    sectionId: 'karijera',
  },
  location: {
    title: 'Find us',
    description:
      'Momento lounge & coffee bar is on the ground floor, right next to District Boutique, easy to reach on foot or by car. It sits opposite Opus Arena with plenty of parking nearby. Osijek city centre is just minutes away — ideal for coffee, something sweet or a relaxed evening out.',
    address: 'Ulica Ljudevita Posavskog 7, 31000 Osijek, Croatia',
    sectionId: 'lokacija',
    lat: 45.5551,
    lng: 18.6955,
    workingHours: WORKING_HOURS,
  },
  footer: {
    logoText: 'Momento.',
    tagline: 'Lounge & coffee bar on the ground floor of District Boutique. Your moment, every day.',
    pagesHeading: 'Pages',
    contactHeading: 'Contact',
    socialHeading: 'Follow us',
    email: 'support@district.hr',
    phone: '+385 99 554 4337',
    instagram: 'momentobydistrict',
    megaLine: '— Your moment, your Momento —',
    madeBy: 'Made by Front Tribe',
  },
}

const dePack: MomentoSeedLocalePack = {
  ...hrPack,
  pageTitle: 'Momento by DISTRICT',
  metaTitle: 'Momento by District — Lounge & Coffee Bar im Herzen von Retfala',
  metaDescription:
    'Momento Lounge & Coffee Bar im Erdgeschoss des District Boutique — Kaffee, Süßes, Craft-Bier, Weine und entspannte Atmosphäre in Retfala, Osijek.',
  nav: {
    logoText: 'Momento.',
    links: [
      { label: 'Über uns', scrollTarget: 'o-nama' },
      { label: 'Speisekarte', scrollTarget: 'menu' },
      { label: 'Karriere', scrollTarget: 'karijera' },
      { label: 'Standort', scrollTarget: 'lokacija' },
    ],
  },
  hero: {
    ...hrPack.hero,
    subheading:
      'Vom Morgenespresso und Frühstück bis zum Abendgetränk: aromatisierter Kaffee, Matcha/Latte, frische Säfte, Craft- und Fassbier, ausgewählte Weine, Süßes, Sandwiches und warme Croissants.',
  },
  intro: {
    content: 'Momento Lounge & Coffee Bar befindet sich im Erdgeschoss des District Boutique.',
    sectionId: 'intro',
  },
  imageGrid: {
    title: 'Momento — Ihr Tagesrhythmus im Herzen von Retfala',
    subtitle:
      'Im Erdgeschoss des District Boutique erwartet Sie Momento — ein großzügiger, einladender Ort für Morgenkaffee, eine Pause am Tag und entspannte Abende. Große Glasfronten, viel Grün und warmes Licht schaffen eine elegante, lockere Atmosphäre. Momento bietet sorgfältig ausgewählten Kaffee, vielfältige Getränke, Sandwiches, frische Croissants und eine reiche Auswahl an Kuchen — ergänzt durch ein abwechslungsreiches Barprogramm.',
    sectionId: 'o-nama',
  },
  menu: {
    title: 'Unsere Karte.',
    subtitle: 'Vom Morgenkaffee bis zum Abendgetränk.',
    popularBadgeText: 'Beliebt',
    sectionId: 'menu',
    categories: buildMenuCategories('de'),
  },
  career: {
    title: 'Suchen Sie einen Job?',
    subtitle: 'Werden Sie Teil unseres Momento-Teams',
    description:
      'Wir suchen ständig engagierte Menschen für unser Team. Wenn Sie Gastfreundschaft, gutes Essen und unvergessliche Erlebnisse lieben, freuen wir uns auf Ihre Nachricht.',
    buttonText: 'Jetzt bewerben',
    buttonUrl: 'mailto:support@district.hr?subject=Momento%20—%20Bewerbung',
    badgeText: '05 / Wir stellen ein',
    features: ['Tolles Team', 'Angenehme Atmosphäre', 'Attraktive Bezahlung'],
    ctaNote: 'Senden Sie uns jetzt Ihren Lebenslauf!',
    sectionId: 'karijera',
  },
  location: {
    title: 'So finden Sie uns',
    description:
      'Momento befindet sich im Erdgeschoss direkt neben dem District Boutique — gut erreichbar zu Fuß oder mit dem Auto, gegenüber der Opus Arena mit ausreichend Parkplätzen. Das Zentrum von Osijek ist nur wenige Minuten entfernt.',
    address: 'Ulica Ljudevita Posavskog 7, 31000 Osijek, Kroatien',
    sectionId: 'lokacija',
    lat: 45.5551,
    lng: 18.6955,
    workingHours: WORKING_HOURS,
  },
  footer: {
    logoText: 'Momento.',
    tagline:
      'Lounge & Coffee Bar im Erdgeschoss des District Boutique. Ihr Moment, jeden Tag.',
    pagesHeading: 'Seiten',
    contactHeading: 'Kontakt',
    socialHeading: 'Folgen Sie uns',
    email: 'support@district.hr',
    phone: '+385 99 554 4337',
    instagram: 'momentobydistrict',
    megaLine: '— Ihr Moment, Ihr Momento —',
    madeBy: 'Erstellt von Front Tribe',
  },
}

const momentoSeedPacks: Record<MomentoLocale, MomentoSeedLocalePack> = {
  hr: hrPack,
  en: enPack,
  de: dePack,
}

export function getMomentoLocalePack(locale: MomentoLocale): MomentoSeedLocalePack {
  return momentoSeedPacks[locale] ?? hrPack
}
