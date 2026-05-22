/**
 * Cjenik i radno vrijeme iz `Momento by District.html` (usklađeno s momento.district.hr).
 * Generirano iz bundler exporta — ne uređivati ručno osim ako se HTML izvor ne promijeni.
 */

export type MomentoMenuItemSeed = {
  name: string
  price: string
  desc?: string
  isPopular?: boolean
}

export type MomentoMenuCategorySeed = {
  id: string
  categoryName: string
  menuItems: MomentoMenuItemSeed[]
}

export type MomentoOfferSeed = {
  name: string
  price: string
  desc?: string
  isPopular?: boolean
}

export type MomentoHoursSeed = {
  dayLabel: string
  openTime: string
  closeTime: string
}

export const momentoOffersHr: MomentoOfferSeed[] = [
  {
    "name": "Sendvič + sok + kolač + kava",
    "price": "€11.5",
    "desc": "All day",
    "isPopular": false
  },
  {
    "name": "Kava + monoporcija",
    "price": "€6.2",
    "desc": "Sweet pick",
    "isPopular": true
  },
  {
    "name": "Kava + torta",
    "price": "€6.0",
    "isPopular": false
  },
  {
    "name": "Kava + kolač",
    "price": "€5.2",
    "isPopular": false
  },
  {
    "name": "Cijeđeni sok + torta",
    "price": "€7.0",
    "isPopular": false
  },
  {
    "name": "Cijeđeni sok + monoporcija",
    "price": "€7.3",
    "isPopular": false
  },
  {
    "name": "Kava + cijeđeni sok",
    "price": "€5.0",
    "desc": "Refresh",
    "isPopular": false
  },
  {
    "name": "Kava + croissant",
    "price": "€3.6",
    "desc": "Jutarnji",
    "isPopular": false
  },
  {
    "name": "Kava + Coca Cola",
    "price": "€5.1",
    "isPopular": false
  },
  {
    "name": "Kava + Jamnica / Romerquelle",
    "price": "€4.4",
    "isPopular": false
  },
  {
    "name": "Kava + Cedevita",
    "price": "€4.7",
    "isPopular": false
  }
]

export const momentoMenuCategoriesHr: MomentoMenuCategorySeed[] = [
  {
    "id": "slatko",
    "categoryName": "Slatko",
    "menuItems": [
      {
        "name": "Kolač",
        "price": "€3.3"
      },
      {
        "name": "Torta",
        "price": "€4.1"
      },
      {
        "name": "Monoporcija",
        "price": "€4.5"
      },
      {
        "name": "Muffin",
        "price": "€2.4"
      },
      {
        "name": "Brownie",
        "price": "€2.4"
      },
      {
        "name": "Soufle",
        "price": "€3.5"
      },
      {
        "name": "Kroasan",
        "price": "€1.8"
      },
      {
        "name": "Wafli",
        "price": "€4.5"
      }
    ]
  },
  {
    "id": "smoothie",
    "categoryName": "Cijeđeni Mix / Smoothie",
    "menuItems": [
      {
        "name": "FRESH UP",
        "price": "€4.2",
        "desc": "jabuka, mrkva, naranča"
      },
      {
        "name": "AMBER",
        "price": "€4.2",
        "desc": "naranča, grejp, limun, đumbir"
      },
      {
        "name": "CITRUSINO",
        "price": "€4.2",
        "desc": "grejp, jabuka, limun, đumbir, med"
      },
      {
        "name": "AWAKE",
        "price": "€4.2",
        "desc": "borovnica, naranča, banana, jabuka"
      },
      {
        "name": "MINTY",
        "price": "€4.2",
        "desc": "ananas, limeta, jabuka, menta"
      },
      {
        "name": "BERRY",
        "price": "€4.2",
        "desc": "malina, borovnica, banana, naranča, jogurt"
      },
      {
        "name": "DREAMY",
        "price": "€4.2",
        "desc": "banana, plazma, mlijeko, med"
      },
      {
        "name": "JAFFY",
        "price": "€4.2",
        "desc": "naranča, kakao, badem, datulja, banana"
      },
      {
        "name": "MOMENTO",
        "price": "€4.2",
        "desc": "po izboru — max. 4 sastojka"
      }
    ]
  },
  {
    "id": "kava",
    "categoryName": "Kava",
    "menuItems": [
      {
        "name": "Ristretto",
        "price": "€1.8"
      },
      {
        "name": "Espresso",
        "price": "€2.1"
      },
      {
        "name": "Macchiato",
        "price": "€2.2"
      },
      {
        "name": "Cappucino",
        "price": "€2.4"
      },
      {
        "name": "Kava sa mlijekom",
        "price": "€2.3"
      },
      {
        "name": "Kava sa šlagom",
        "price": "€2.3"
      },
      {
        "name": "Bijela kava",
        "price": "€2.5"
      },
      {
        "name": "Melange",
        "price": "€2.4"
      },
      {
        "name": "Americano",
        "price": "€2.1"
      },
      {
        "name": "Latte macchiato",
        "price": "€2.9"
      },
      {
        "name": "Kava bez kofeina",
        "price": "€2.4"
      },
      {
        "name": "Ice coffee",
        "price": "€2.6"
      },
      {
        "name": "Nescaffe",
        "price": "€2.6"
      },
      {
        "name": "Hladni Nescaffe",
        "price": "€2.7"
      },
      {
        "name": "Kakao",
        "price": "€2.5"
      },
      {
        "name": "Kava sa okusom",
        "price": "€2.1",
        "desc": "karamela, lješnjak, cimet, vanilija, kokos"
      },
      {
        "name": "Matcha latte",
        "price": "€2.9"
      }
    ]
  },
  {
    "id": "kava-dodatci",
    "categoryName": "Kava — dodatci",
    "menuItems": [
      {
        "name": "Mlijeko 3.8% punomasno",
        "price": "€0.3"
      },
      {
        "name": "Mlijeko bademovo",
        "price": "€0.5"
      },
      {
        "name": "Mlijeko sojino",
        "price": "€0.5"
      },
      {
        "name": "Mlijeko zobeno",
        "price": "€0.5"
      },
      {
        "name": "Mlijeko bez laktoze",
        "price": "€0.5"
      },
      {
        "name": "Šlag",
        "price": "€0.2"
      },
      {
        "name": "Med",
        "price": "€0.2"
      }
    ]
  },
  {
    "id": "caj",
    "categoryName": "Čaj & topla čokolada",
    "menuItems": [
      {
        "name": "Čaj Odoressilenti",
        "price": "€2.9",
        "desc": "kamilica, menta, matičnjak, šipak, oranžmint (Gita, Lahor, Vidov san, Bakin dar)"
      },
      {
        "name": "Topla čokolada",
        "price": "€2.9",
        "desc": "tamna ili bijela"
      },
      {
        "name": "Gingerbread",
        "price": "€3.9",
        "desc": "tamna čok., monin vanilija, cimet, đumbir, mlijeko, šlag"
      },
      {
        "name": "Choco Orange",
        "price": "€3.9",
        "desc": "tamna čok., sok od naranče, kakao, mlijeko, šlag"
      },
      {
        "name": "White Winter",
        "price": "€3.9",
        "desc": "bijela čok., mlijeko, kokos, šlag"
      },
      {
        "name": "Black Jack",
        "price": "€5.7",
        "desc": "Jack Daniels Honey, tamna čok., šlag, cookies"
      }
    ]
  },
  {
    "id": "hladno",
    "categoryName": "Hladno cijeđeni sokovi",
    "menuItems": [
      {
        "name": "Naranča",
        "price": "€3.3"
      },
      {
        "name": "Jabuka",
        "price": "€3.3"
      },
      {
        "name": "Grejp",
        "price": "€3.2"
      },
      {
        "name": "Limun",
        "price": "€3.1"
      },
      {
        "name": "Mix 1 / 2 / 3 / 4",
        "price": "€3.3"
      }
    ]
  },
  {
    "id": "sokovi",
    "categoryName": "Sokovi",
    "menuItems": [
      {
        "name": "Coca Cola",
        "price": "€3.1"
      },
      {
        "name": "Coca Cola Zero",
        "price": "€3.1"
      },
      {
        "name": "Cockta",
        "price": "€3.1"
      },
      {
        "name": "Cockta Zero",
        "price": "€3.1"
      },
      {
        "name": "Hidra",
        "price": "€3.3"
      },
      {
        "name": "Fanta",
        "price": "€3.1"
      },
      {
        "name": "Sprite",
        "price": "€3.1"
      },
      {
        "name": "Orangina",
        "price": "€3.1"
      },
      {
        "name": "Schweppes",
        "price": "€3.1"
      },
      {
        "name": "Thomas Henry",
        "price": "€4.3"
      },
      {
        "name": "Ledeni čaj",
        "price": "€3.1"
      },
      {
        "name": "Red Bull",
        "price": "€3.9"
      },
      {
        "name": "Prirodni sok",
        "price": "€3.1"
      },
      {
        "name": "Cedevita",
        "price": "€2.7"
      },
      {
        "name": "Somersby",
        "price": "€4.0"
      }
    ]
  },
  {
    "id": "voda",
    "categoryName": "Voda",
    "menuItems": [
      {
        "name": "Jamnica gazirana",
        "price": "€2.6"
      },
      {
        "name": "Jamnica Sensation",
        "price": "€2.8"
      },
      {
        "name": "Jana negazirana",
        "price": "€2.6"
      },
      {
        "name": "Jana Vitamin",
        "price": "€2.8"
      },
      {
        "name": "Romerquelle gazirana",
        "price": "€2.6"
      },
      {
        "name": "Romerquelle negazirana",
        "price": "€2.6"
      },
      {
        "name": "Romerquelle Emotion",
        "price": "€2.8"
      },
      {
        "name": "Jamnica narančada",
        "price": "€2.8"
      },
      {
        "name": "Jamnica limunada",
        "price": "€2.8"
      }
    ]
  },
  {
    "id": "whiskey",
    "categoryName": "Whiskey",
    "menuItems": [
      {
        "name": "Jack Daniel's",
        "price": "€3.5"
      },
      {
        "name": "Jack Daniel's Honey / Apple / Fire",
        "price": "€3.7"
      },
      {
        "name": "Jack Daniel's Gentleman",
        "price": "€4.2"
      },
      {
        "name": "Jack Daniel's Single Barrel",
        "price": "€5.1"
      },
      {
        "name": "Glenfiddich 12",
        "price": "€3.9"
      },
      {
        "name": "Glenfiddich 15",
        "price": "€4.9"
      },
      {
        "name": "Glenfiddich 18",
        "price": "€7.5"
      },
      {
        "name": "Glenfiddich 21",
        "price": "€23.0"
      },
      {
        "name": "Glenfiddich 26",
        "price": "€55.0"
      },
      {
        "name": "Glenfiddich IPA",
        "price": "€5.5"
      },
      {
        "name": "Glenfiddich XX",
        "price": "€6.5"
      },
      {
        "name": "Chivas",
        "price": "€4.1"
      },
      {
        "name": "Chivas 15",
        "price": "€7.0"
      },
      {
        "name": "Chivas 18",
        "price": "€9.9"
      },
      {
        "name": "Chivas Royal Salute",
        "price": "€21.0"
      },
      {
        "name": "Johnnie Walker Red",
        "price": "€3.5"
      },
      {
        "name": "Johnnie Walker Black",
        "price": "€4.1"
      },
      {
        "name": "Johnnie Walker Green",
        "price": "€5.1"
      },
      {
        "name": "Johnnie Walker Blue",
        "price": "€19.5"
      },
      {
        "name": "The Macallan 12",
        "price": "€6.2"
      },
      {
        "name": "The Macallan 15",
        "price": "€10.2"
      },
      {
        "name": "Ballantines 12yo",
        "price": "€3.5"
      },
      {
        "name": "Monkey Shoulder",
        "price": "€3.9"
      },
      {
        "name": "Jameson",
        "price": "€3.5"
      },
      {
        "name": "Jameson 18 YO",
        "price": "€11.5"
      },
      {
        "name": "Jameson Black",
        "price": "€5.5"
      }
    ]
  },
  {
    "id": "tequila",
    "categoryName": "Tequila",
    "menuItems": [
      {
        "name": "Don Julio Blanco",
        "price": "€8.5"
      },
      {
        "name": "Don Julio Reposado",
        "price": "€8.5"
      },
      {
        "name": "Avion",
        "price": "€5.5"
      },
      {
        "name": "Sierra",
        "price": "€3.5"
      }
    ]
  },
  {
    "id": "votka",
    "categoryName": "Votka",
    "menuItems": [
      {
        "name": "Belvedere",
        "price": "€4.8"
      },
      {
        "name": "Grey Goose",
        "price": "€5.1"
      },
      {
        "name": "Old Pilot's",
        "price": "€4.5"
      }
    ]
  },
  {
    "id": "gin",
    "categoryName": "Gin",
    "menuItems": [
      {
        "name": "Bombay",
        "price": "€3.1"
      },
      {
        "name": "Hendrick's",
        "price": "€4.0"
      },
      {
        "name": "Tanqueray",
        "price": "€3.5"
      },
      {
        "name": "Gin Mare",
        "price": "€4.1"
      },
      {
        "name": "Monkey 47",
        "price": "€4.9"
      },
      {
        "name": "Aura Karbun",
        "price": "€3.9"
      },
      {
        "name": "Bulldog",
        "price": "€3.1"
      }
    ]
  },
  {
    "id": "rum",
    "categoryName": "Rum",
    "menuItems": [
      {
        "name": "Bacardi Negra",
        "price": "€3.1"
      },
      {
        "name": "Bacardi Blanca",
        "price": "€3.1"
      },
      {
        "name": "Malibu",
        "price": "€2.9"
      },
      {
        "name": "Zacappa XO",
        "price": "€18.0"
      },
      {
        "name": "Planteraj",
        "price": "€4.5"
      },
      {
        "name": "Havana Club 7YO",
        "price": "€4.9"
      }
    ]
  },
  {
    "id": "cognac",
    "categoryName": "Cognac & liker",
    "menuItems": [
      {
        "name": "Martell VS",
        "price": "€3.5"
      },
      {
        "name": "Martell VSOP",
        "price": "€5.9"
      },
      {
        "name": "Hennessy VS",
        "price": "€4.5"
      },
      {
        "name": "Hennessy XO",
        "price": "€28.0"
      },
      {
        "name": "Courvoisier VS",
        "price": "€3.6"
      },
      {
        "name": "Remy Martin VSOP",
        "price": "€4.9"
      },
      {
        "name": "Metaxa 12",
        "price": "€3.1"
      },
      {
        "name": "Aperol",
        "price": "€2.5"
      },
      {
        "name": "Aperol Spritz",
        "price": "€5.9"
      },
      {
        "name": "Jägermeister",
        "price": "€3.1"
      },
      {
        "name": "Jägermeister Orange",
        "price": "€3.1"
      },
      {
        "name": "Jägermeister Manifest",
        "price": "€4.5"
      },
      {
        "name": "Pelinkovac",
        "price": "€2.5"
      },
      {
        "name": "Pelinkovac Antique",
        "price": "€2.9"
      },
      {
        "name": "Martini Rossi",
        "price": "€3.2"
      },
      {
        "name": "Martini Bianco",
        "price": "€3.2"
      },
      {
        "name": "Bajadera",
        "price": "€2.5"
      },
      {
        "name": "Southern Comfort",
        "price": "€3.1"
      },
      {
        "name": "Baileys",
        "price": "€3.1"
      },
      {
        "name": "Campari",
        "price": "€2.5"
      }
    ]
  },
  {
    "id": "pivo-boca",
    "categoryName": "Pivo — boca",
    "menuItems": [
      {
        "name": "Karlovačko 0,50",
        "price": "€3.2"
      },
      {
        "name": "Heineken 0,33",
        "price": "€3.4"
      },
      {
        "name": "Heineken 0.0 0,33",
        "price": "€3.2"
      },
      {
        "name": "Laško Zlatorog 0,50",
        "price": "€3.2"
      },
      {
        "name": "Krušovice 0,50",
        "price": "€3.2"
      },
      {
        "name": "Karlovačko crno 0,50",
        "price": "€3.2"
      },
      {
        "name": "Edelweiss pšenično 0,50",
        "price": "€4.1"
      },
      {
        "name": "Karlovačko limun radler 0,50",
        "price": "€3.2"
      },
      {
        "name": "Karlovačko grejp radler 0,50",
        "price": "€3.2"
      },
      {
        "name": "Stari lisac 0,50",
        "price": "€3.2"
      },
      {
        "name": "Osječko 0,50",
        "price": "€3.2"
      },
      {
        "name": "Osječko radler 0,50",
        "price": "€3.2"
      }
    ]
  },
  {
    "id": "pivo-toceno",
    "categoryName": "Pivo — točeno",
    "menuItems": [
      {
        "name": "Heineken 0,25",
        "price": "€3.0"
      },
      {
        "name": "Heineken 0,50",
        "price": "€4.4"
      },
      {
        "name": "Karlovačko 0,33",
        "price": "€3.0"
      },
      {
        "name": "Karlovačko 0,50",
        "price": "€4.0"
      },
      {
        "name": "Laško 0,33",
        "price": "€3.0"
      },
      {
        "name": "Laško 0,50",
        "price": "€4.0"
      }
    ]
  },
  {
    "id": "vino",
    "categoryName": "Vino",
    "menuItems": [
      {
        "name": "Josić Cuvee 0,1",
        "price": "€6.1",
        "desc": "crno"
      },
      {
        "name": "Josić Cuvee 0,75",
        "price": "€30",
        "desc": "crno"
      },
      {
        "name": "Josić Grand Cuvee",
        "price": "€35",
        "desc": "crno"
      },
      {
        "name": "Testament Babić",
        "price": "€32",
        "desc": "crno"
      },
      {
        "name": "Skaramuča Dingač",
        "price": "€42",
        "desc": "crno"
      },
      {
        "name": "Plavac mali Grgić",
        "price": "€45",
        "desc": "crno"
      },
      {
        "name": "Josić Rose 0,1",
        "price": "€4.9",
        "desc": "rose"
      },
      {
        "name": "Josić Rose 0,75",
        "price": "€35",
        "desc": "rose"
      },
      {
        "name": "Enosophia Matarouge",
        "price": "€28",
        "desc": "rose"
      },
      {
        "name": "Kalazić Cabernet Sauvignon kasna berba",
        "price": "€65",
        "desc": "desertno"
      },
      {
        "name": "Iločki podrumi Traminac kasna berba",
        "price": "€41",
        "desc": "desertno"
      },
      {
        "name": "Josić Graševina 0,1",
        "price": "€5.2",
        "desc": "bijelo"
      },
      {
        "name": "Josić Graševina 0,75",
        "price": "€28",
        "desc": "bijelo"
      },
      {
        "name": "Josić Graševina Superior",
        "price": "€30",
        "desc": "bijelo"
      },
      {
        "name": "Josić Chardonnay Superior",
        "price": "€30",
        "desc": "bijelo"
      },
      {
        "name": "Kozlović Malvazija",
        "price": "€31",
        "desc": "bijelo"
      },
      {
        "name": "Kutjevo Vinkomir Graševina",
        "price": "€25",
        "desc": "bijelo"
      },
      {
        "name": "Moët & Chandon Impérial Brut",
        "price": "€90",
        "desc": "pjenušavo"
      },
      {
        "name": "Moët & Chandon Ice Impérial",
        "price": "€120",
        "desc": "pjenušavo"
      },
      {
        "name": "Moët & Chandon Nectar Impérial",
        "price": "€120",
        "desc": "pjenušavo"
      },
      {
        "name": "Moët & Chandon Nectar Impérial Rose",
        "price": "€180",
        "desc": "pjenušavo"
      },
      {
        "name": "Bottega Petalo Amore Moscato",
        "price": "€35",
        "desc": "pjenušavo"
      }
    ]
  },
  {
    "id": "aperitiv",
    "categoryName": "Aperitiv Aura 0,03L",
    "menuItems": [
      {
        "name": "Teranino",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Limoncello",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Orancello",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Divlja kruška",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Suha smokva",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Medenica",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Rogač",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Drijen",
        "price": "€3.9",
        "desc": "voćne"
      },
      {
        "name": "Travarica",
        "price": "€3.9",
        "desc": "biljne"
      },
      {
        "name": "Viljamovka",
        "price": "€3.9",
        "desc": "biljne"
      },
      {
        "name": "Biska",
        "price": "€3.9",
        "desc": "biljne"
      },
      {
        "name": "Ruža",
        "price": "€3.9",
        "desc": "biljne"
      },
      {
        "name": "Menta",
        "price": "€3.9",
        "desc": "biljne"
      },
      {
        "name": "Šljiva",
        "price": "€3.9",
        "desc": "biljne"
      },
      {
        "name": "Dunja",
        "price": "€3.9",
        "desc": "biljne"
      }
    ]
  },
  {
    "id": "tobacco",
    "categoryName": "Tobacco",
    "menuItems": [
      {
        "name": "Marlboro Touch",
        "price": "€5.0"
      },
      {
        "name": "Marlboro Fine Touch",
        "price": "€5.0"
      },
      {
        "name": "Marlboro Gold",
        "price": "€5.3"
      },
      {
        "name": "Marlboro Red",
        "price": "€5.3"
      },
      {
        "name": "Terea",
        "price": "€4.5"
      },
      {
        "name": "Veev",
        "price": "€7.69"
      }
    ]
  }
]

export const momentoHoursHr: MomentoHoursSeed[] = [
  {
    "dayLabel": "Ponedjeljak",
    "openTime": "07:00",
    "closeTime": "23:00"
  },
  {
    "dayLabel": "Utorak",
    "openTime": "07:00",
    "closeTime": "23:00"
  },
  {
    "dayLabel": "Srijeda",
    "openTime": "07:00",
    "closeTime": "23:00"
  },
  {
    "dayLabel": "Četvrtak",
    "openTime": "07:00",
    "closeTime": "23:00"
  },
  {
    "dayLabel": "Petak",
    "openTime": "07:00",
    "closeTime": "00:00"
  },
  {
    "dayLabel": "Subota",
    "openTime": "07:00",
    "closeTime": "00:00"
  },
  {
    "dayLabel": "Nedjelja",
    "openTime": "07:00",
    "closeTime": "23:00"
  }
]
