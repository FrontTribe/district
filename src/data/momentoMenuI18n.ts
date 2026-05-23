import type { MomentoLocale } from '@/data/momentoSeedDefaults'

type LocaleMap = Record<MomentoLocale, string>

function pick(map: LocaleMap, locale: MomentoLocale): string {
  return map[locale] ?? map.hr
}

const OFFER_NAMES: Record<string, LocaleMap> = {
  'Sendvič + sok + kolač + kava': {
    hr: 'Sendvič + sok + kolač + kava',
    en: 'Sandwich + juice + cake + coffee',
    de: 'Sandwich + Saft + Kuchen + Kaffee',
  },
  'Kava + monoporcija': {
    hr: 'Kava + monoporcija',
    en: 'Coffee + single portion',
    de: 'Kaffee + Monoportion',
  },
  'Kava + torta': {
    hr: 'Kava + torta',
    en: 'Coffee + cake slice',
    de: 'Kaffee + Torte',
  },
  'Kava + kolač': {
    hr: 'Kava + kolač',
    en: 'Coffee + pastry',
    de: 'Kaffee + Kuchen',
  },
  'Cijeđeni sok + torta': {
    hr: 'Cijeđeni sok + torta',
    en: 'Fresh juice + cake slice',
    de: 'Frischsaft + Torte',
  },
  'Cijeđeni sok + monoporcija': {
    hr: 'Cijeđeni sok + monoporcija',
    en: 'Fresh juice + single portion',
    de: 'Frischsaft + Monoportion',
  },
  'Kava + cijeđeni sok': {
    hr: 'Kava + cijeđeni sok',
    en: 'Coffee + fresh juice',
    de: 'Kaffee + Frischsaft',
  },
  'Kava + croissant': {
    hr: 'Kava + croissant',
    en: 'Coffee + croissant',
    de: 'Kaffee + Croissant',
  },
  'Kava + Coca Cola': {
    hr: 'Kava + Coca Cola',
    en: 'Coffee + Coca-Cola',
    de: 'Kaffee + Coca-Cola',
  },
  'Kava + Jamnica / Romerquelle': {
    hr: 'Kava + Jamnica / Romerquelle',
    en: 'Coffee + Jamnica / Romerquelle',
    de: 'Kaffee + Jamnica / Romerquelle',
  },
  'Kava + Cedevita': {
    hr: 'Kava + Cedevita',
    en: 'Coffee + Cedevita',
    de: 'Kaffee + Cedevita',
  },
}

const OFFER_POP: Record<string, LocaleMap> = {
  'All day': { hr: 'Cijeli dan', en: 'All day', de: 'Den ganzen Tag' },
  'Sweet pick': { hr: 'Slatki izbor', en: 'Sweet pick', de: 'Süße Wahl' },
  Refresh: { hr: 'Osvježenje', en: 'Refresh', de: 'Erfrischung' },
  Jutarnji: { hr: 'Jutarnji', en: 'Morning', de: 'Morgens' },
}

const ITEM_NAMES: Record<string, LocaleMap> = {
  Kolač: { hr: 'Kolač', en: 'Pastry', de: 'Kuchen' },
  Torta: { hr: 'Torta', en: 'Cake slice', de: 'Torte' },
  Monoporcija: { hr: 'Monoporcija', en: 'Single portion', de: 'Monoportion' },
  Muffin: { hr: 'Muffin', en: 'Muffin', de: 'Muffin' },
  Brownie: { hr: 'Brownie', en: 'Brownie', de: 'Brownie' },
  Soufle: { hr: 'Soufle', en: 'Soufflé', de: 'Soufflé' },
  Kroasan: { hr: 'Kroasan', en: 'Croissant', de: 'Croissant' },
  Wafli: { hr: 'Wafli', en: 'Waffles', de: 'Waffeln' },
  'Kava sa mlijekom': { hr: 'Kava sa mlijekom', en: 'Coffee with milk', de: 'Kaffee mit Milch' },
  'Kava sa šlagom': { hr: 'Kava sa šlagom', en: 'Coffee with whipped cream', de: 'Kaffee mit Sahne' },
  'Bijela kava': { hr: 'Bijela kava', en: 'White coffee', de: 'Weißer Kaffee' },
  'Kava bez kofeina': { hr: 'Kava bez kofeina', en: 'Decaf coffee', de: 'Entkoffeinierter Kaffee' },
  'Kava sa okusom': { hr: 'Kava sa okusom', en: 'Flavoured coffee', de: 'Aromatisierter Kaffee' },
  'Mlijeko 3.8% punomasno': {
    hr: 'Mlijeko 3.8% punomasno',
    en: 'Whole milk 3.8%',
    de: 'Vollmilch 3,8 %',
  },
  'Mlijeko bademovo': { hr: 'Mlijeko bademovo', en: 'Almond milk', de: 'Mandelmilch' },
  'Mlijeko sojino': { hr: 'Mlijeko sojino', en: 'Soy milk', de: 'Sojamilch' },
  'Mlijeko zobeno': { hr: 'Mlijeko zobeno', en: 'Oat milk', de: 'Hafermilch' },
  'Mlijeko bez laktoze': { hr: 'Mlijeko bez laktoze', en: 'Lactose-free milk', de: 'Laktosefreie Milch' },
  Šlag: { hr: 'Šlag', en: 'Whipped cream', de: 'Sahne' },
  Med: { hr: 'Med', en: 'Honey', de: 'Honig' },
  'Topla čokolada': { hr: 'Topla čokolada', en: 'Hot chocolate', de: 'Heiße Schokolade' },
  Naranča: { hr: 'Naranča', en: 'Orange', de: 'Orange' },
  Jabuka: { hr: 'Jabuka', en: 'Apple', de: 'Apfel' },
  Grejp: { hr: 'Grejp', en: 'Grapefruit', de: 'Grapefruit' },
  Limun: { hr: 'Limun', en: 'Lemon', de: 'Zitrone' },
  'Mix 1 / 2 / 3 / 4': { hr: 'Mix 1 / 2 / 3 / 4', en: 'Mix 1 / 2 / 3 / 4', de: 'Mix 1 / 2 / 3 / 4' },
  'Ledeni čaj': { hr: 'Ledeni čaj', en: 'Iced tea', de: 'Eistee' },
  'Prirodni sok': { hr: 'Prirodni sok', en: 'Natural juice', de: 'Natursaft' },
  'Jamnica gazirana': { hr: 'Jamnica gazirana', en: 'Jamnica sparkling', de: 'Jamnica spritzig' },
  'Jamnica Sensation': { hr: 'Jamnica Sensation', en: 'Jamnica Sensation', de: 'Jamnica Sensation' },
  'Jana negazirana': { hr: 'Jana negazirana', en: 'Jana still', de: 'Jana still' },
  'Jana Vitamin': { hr: 'Jana Vitamin', en: 'Jana Vitamin', de: 'Jana Vitamin' },
  'Romerquelle gazirana': { hr: 'Romerquelle gazirana', en: 'Romerquelle sparkling', de: 'Romerquelle spritzig' },
  'Romerquelle negazirana': { hr: 'Romerquelle negazirana', en: 'Romerquelle still', de: 'Romerquelle still' },
  'Romerquelle Emotion': { hr: 'Romerquelle Emotion', en: 'Romerquelle Emotion', de: 'Romerquelle Emotion' },
  'Jamnica narančada': { hr: 'Jamnica narančada', en: 'Jamnica orangeade', de: 'Jamnica Orangenlimonade' },
  'Jamnica limunada': { hr: 'Jamnica limunada', en: 'Jamnica lemonade', de: 'Jamnica Limonade' },
  Pelinkovac: { hr: 'Pelinkovac', en: 'Pelinkovac', de: 'Pelinkovac' },
  'Pelinkovac Antique': { hr: 'Pelinkovac Antique', en: 'Pelinkovac Antique', de: 'Pelinkovac Antique' },
  'Karlovačko 0,50': { hr: 'Karlovačko 0,50', en: 'Karlovačko 0.50 L', de: 'Karlovačko 0,50 L' },
  'Karlovačko 0,33': { hr: 'Karlovačko 0,33', en: 'Karlovačko 0.33 L', de: 'Karlovačko 0,33 L' },
  'Karlovačko crno 0,50': { hr: 'Karlovačko crno 0,50', en: 'Karlovačko dark 0.50 L', de: 'Karlovačko Dunkel 0,50 L' },
  'Karlovačko limun radler 0,50': {
    hr: 'Karlovačko limun radler 0,50',
    en: 'Karlovačko lemon radler 0.50 L',
    de: 'Karlovačko Zitrone Radler 0,50 L',
  },
  'Karlovačko grejp radler 0,50': {
    hr: 'Karlovačko grejp radler 0,50',
    en: 'Karlovačko grapefruit radler 0.50 L',
    de: 'Karlovačko Grapefruit Radler 0,50 L',
  },
  'Stari lisac 0,50': { hr: 'Stari lisac 0,50', en: 'Stari lisac 0.50 L', de: 'Stari lisac 0,50 L' },
  'Osječko 0,50': { hr: 'Osječko 0,50', en: 'Osječko 0.50 L', de: 'Osječko 0,50 L' },
  'Osječko radler 0,50': { hr: 'Osječko radler 0,50', en: 'Osječko radler 0.50 L', de: 'Osječko Radler 0,50 L' },
  'Momento — po izboru — max. 4 sastojka': {
    hr: 'Momento — po izboru — max. 4 sastojka',
    en: 'Momento — your choice — up to 4 ingredients',
    de: 'Momento — nach Wahl — max. 4 Zutaten',
  },
}

const DESC_WORDS: Record<string, LocaleMap> = {
  jabuka: { hr: 'jabuka', en: 'apple', de: 'Apfel' },
  mrkva: { hr: 'mrkva', en: 'carrot', de: 'Karotte' },
  naranča: { hr: 'naranča', en: 'orange', de: 'Orange' },
  grejp: { hr: 'grejp', en: 'grapefruit', de: 'Grapefruit' },
  limun: { hr: 'limun', en: 'lemon', de: 'Zitrone' },
  đumbir: { hr: 'đumbir', en: 'ginger', de: 'Ingwer' },
  med: { hr: 'med', en: 'honey', de: 'Honig' },
  borovnica: { hr: 'borovnica', en: 'blueberry', de: 'Heidelbeere' },
  banana: { hr: 'banana', en: 'banana', de: 'Banane' },
  ananas: { hr: 'ananas', en: 'pineapple', de: 'Ananas' },
  limeta: { hr: 'limeta', en: 'lime', de: 'Limette' },
  menta: { hr: 'menta', en: 'mint', de: 'Minze' },
  malina: { hr: 'malina', en: 'raspberry', de: 'Himbeere' },
  jogurt: { hr: 'jogurt', en: 'yogurt', de: 'Joghurt' },
  plazma: { hr: 'plazma', en: 'Plazma biscuits', de: 'Plazma Kekse' },
  mlijeko: { hr: 'mlijeko', en: 'milk', de: 'Milch' },
  kakao: { hr: 'kakao', en: 'cocoa', de: 'Kakao' },
  badem: { hr: 'badem', en: 'almond', de: 'Mandel' },
  datulja: { hr: 'datulja', en: 'date', de: 'Dattel' },
  karamela: { hr: 'karamela', en: 'caramel', de: 'Karamell' },
  lješnjak: { hr: 'lješnjak', en: 'hazelnut', de: 'Haselnuss' },
  cimet: { hr: 'cimet', en: 'cinnamon', de: 'Zimt' },
  vanilija: { hr: 'vanilija', en: 'vanilla', de: 'Vanille' },
  kokos: { hr: 'kokos', en: 'coconut', de: 'Kokos' },
  crno: { hr: 'crno', en: 'red', de: 'rot' },
  bijelo: { hr: 'bijelo', en: 'white', de: 'weiß' },
  rose: { hr: 'rose', en: 'rosé', de: 'Rosé' },
  desertno: { hr: 'desertno', en: 'dessert', de: 'Dessert' },
  pjenušavo: { hr: 'pjenušavo', en: 'sparkling', de: 'Schaumwein' },
  voćne: { hr: 'voćne', en: 'fruit', de: 'Frucht' },
  biljne: { hr: 'biljne', en: 'herbal', de: 'Kräuter' },
  'tamna ili bijela': {
    hr: 'tamna ili bijela',
    en: 'dark or white',
    de: 'dunkel oder weiß',
  },
  'tamna čok.': { hr: 'tamna čok.', en: 'dark choc.', de: 'dunkle Schok.' },
  'bijela čok.': { hr: 'bijela čok.', en: 'white choc.', de: 'weiße Schok.' },
  'sok od naranče': { hr: 'sok od naranče', en: 'orange juice', de: 'Orangensaft' },
  cookies: { hr: 'cookies', en: 'cookies', de: 'Kekse' },
  kamilica: { hr: 'kamilica', en: 'chamomile', de: 'Kamille' },
  matičnjak: { hr: 'matičnjak', en: 'lemon balm', de: 'Melisse' },
  šipak: { hr: 'šipak', en: 'rosehip', de: 'Hagebutte' },
  oranžmint: { hr: 'oranžmint', en: 'orange mint', de: 'Orangenminze' },
}

function translateDesc(desc: string, locale: MomentoLocale): string {
  if (locale === 'hr') return desc

  let out = desc
  for (const [hrWord, map] of Object.entries(DESC_WORDS)) {
    const translated = pick(map, locale)
    out = out.replace(new RegExp(hrWord, 'gi'), translated)
  }

  if (locale === 'en' && out.includes('po izboru')) {
    out = out.replace(/po izboru — max\. 4 sastojka/i, 'your choice — up to 4 ingredients')
  }
  if (locale === 'de' && out.includes('po izboru')) {
    out = out.replace(/po izboru — max\. 4 sastojka/i, 'nach Wahl — max. 4 Zutaten')
  }

  return out
}

function translateMenuItemName(name: string, locale: MomentoLocale): string {
  if (locale === 'hr') return name
  const exact = ITEM_NAMES[name] ?? OFFER_NAMES[name]
  if (exact) return pick(exact, locale)
  return name
}

function translateMenuItemDesc(desc: string | undefined, locale: MomentoLocale): string | undefined {
  if (!desc?.trim()) return desc
  return translateDesc(desc.trim(), locale)
}

export function translateOfferPop(pop: string | undefined, locale: MomentoLocale): string | undefined {
  if (!pop?.trim()) return pop
  const map = OFFER_POP[pop.trim()]
  return map ? pick(map, locale) : pop
}

export function translateMenuItem(
  item: { name: string; price: string; desc?: string; pop?: string; featured?: boolean },
  locale: MomentoLocale,
): { itemName: string; itemPrice: string; itemDescription?: string; isPopular?: boolean } {
  return {
    itemName: translateMenuItemName(item.name, locale),
    itemPrice: item.price,
    itemDescription: translateMenuItemDesc(item.desc ?? item.pop, locale),
    isPopular: Boolean(item.featured),
  }
}
