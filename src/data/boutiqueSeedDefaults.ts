/**
 * Početne vrijednosti za `pnpm run seed:boutique` — upisuju se u Payload (`pages.layout`).
 */

export type BoutiqueLocale = 'hr' | 'en' | 'de'

export type BoutiqueRoomSeed = {
  roomNumber: string
  title: string
  description: string
  displayPrice: number
  displayPriceSuffix: string
  badges: { text: string }[]
  imageKeys: readonly string[]
}

export type BoutiqueSeedLocalePack = {
  pageTitle: string
  meta: { title: string; description: string }
  nav: { label: string; scrollTarget: string }[]
  hero: { heading: string; subheading: string; sectionId: string }
  intro: {
    chapterNum: string
    chapterLabel: string
    heading: string
    body: string
    pullQuote: string
    pullQuoteCite: string
    stats: { value: number; suffix?: string; label: string }[]
    collageTags: string[]
    sectionId: string
  }
  rooms: {
    chapterNum: string
    chapterLabel: string
    heading: string
    subheading: string
    sectionId: string
    items: BoutiqueRoomSeed[]
  }
  rooftop: {
    chapterNum: string
    chapterLabel: string
    heading: string
    metaRows: string[]
    manifestEyebrow: string
    manifestHeading: string
    manifestItems: { key: string; value: string }[]
    cta: { label: string; href: string }
    sectionId: string
    features: {
      romanNumeral: string
      tag: string
      title: string
      description: string
      imageKey: string
      reverseLayout?: boolean
    }[]
  }
  contact: {
    chapterNum: string
    chapterLabel: string
    heading: string
    leadText: string
    channels: { type: 'email' | 'phone' | 'whatsapp' | 'instagram'; label: string; value: string; href: string }[]
    intelRows: { label: string; value: string }[]
    formNote: string
    successHeading: string
    successMessage: string
    sectionId: string
  }
  footer: {
    timeLabel: string
    signoffEyebrow: string
    signoffHeading: string
    addressHeading: string
    addressHtml: string
    infoRows: { label: string; value: string }[]
    contactHeading: string
    contactLinks: { key: string; label: string; href: string }[]
    newsletterHeading: string
    newsletterNote: string
    mapHeading: string
    mapCta: string
    distanceRows: { label: string; value: string }[]
    marqueeItems: string[]
    copyright: string
    legalLinks: { label: string; href: string }[]
    madeBy: string
  }
  formSeed: {
    nameFieldLabel: string
    namePlaceholder: string
    emailFieldLabel: string
    emailPlaceholder: string
    phoneFieldLabel: string
    phonePlaceholder: string
    typeFieldLabel: string
    typePlaceholder: string
    typeOptions: { label: string; value: string }[]
    messageFieldLabel: string
    messagePlaceholder: string
    submitButtonLabel: string
    successMessage: string
  }
}

const HR: BoutiqueSeedLocalePack = {
  pageTitle: 'District Boutique — Osijek',
  meta: {
    title: 'District Boutique · Osijek',
    description:
      'Boutique smještaj u Osijeku — sezonski bazen i jacuzziji, besplatan parking i Wi-Fi, nekoliko minuta od Opus Arene.',
  },
  nav: [
    { label: 'O nama', scrollTarget: 'o-nama' },
    { label: 'Sobe', scrollTarget: 'sobe' },
    { label: 'Krov', scrollTarget: 'krov' },
    { label: 'Kontakt', scrollTarget: 'kontakt' },
  ],
  hero: {
    heading: 'District Boutique',
    subheading:
      'Moderan boutique smještaj u Osijeku sa sezonskim vanjskim bazenom i jacuzzijima, besplatnim parkingom i Wi-Fi-jem, smješten na svega nekoliko minuta od Opus Arene. Prostrane, elegantno uređene sobe i apartmani nude savršen spoj udobnosti, privatnosti i suvremenog dizajna, idealni za parove, poslovne goste i obitelji koje žele mir i vrhunsku lokaciju u srcu Slavonije.',
    sectionId: 'hero',
  },
  intro: {
    chapterNum: 'i.',
    chapterLabel: 'Capitulum · O nama',
    heading: 'District Boutique – *više od smještaja*.',
    body:
      'District Boutique u Osijeku spaja tihu, elegantnu atmosferu s praktičnostima koje putovanje čine bezbrižnim. Prostrane, pažljivo uređene sobe i apartman nude udobnost za parove, poslovne goste i obitelji, dok besplatan privatni parking i brzi Wi-Fi osiguravaju lagodan boravak od prvog trenutka. Smješteni smo na odličnoj lokaciji, nekoliko minuta od Opus Arene i glavnih gradskih sadržaja, pa je naš boutique idealna polazišna točka za istraživanje Slavonije.\n\nNaš tim rado preporučuje najbolje lokalne restorane, šetnje uz Dravu i aktualna događanja. Ako tražite smještaj u Osijeku koji nudi mir, stil i toplu uslugu, bez velikih hotela i gužvi, dobrodošli u District Boutique, vašu osječku adresu za dizajn, udobnost i opušten boravak.',
    pullQuote:
      'Tihi boutique nadomak Opus Arene koji vam vrati tjedan pred sobom — krov, jacuzzi i nečija pažnja za detalje koji se obično preskaču.',
    pullQuoteCite: '— Gost, kolovoz 2025.',
    stats: [
      { value: 4, label: 'kategorije soba' },
      { value: 37, suffix: 'm²', label: 'najveća suite' },
      { value: 2, label: 'jacuzzia & bazen' },
      { value: 3, suffix: "'", label: 'do Opus Arene' },
      { value: 100, suffix: '%', label: 'privatni parking' },
    ],
    collageTags: ['01 · Eksterijer uz Dravu', '02 · Sobe', '03 · Detalji'],
    sectionId: 'o-nama',
  },
  rooms: {
    chapterNum: 'ii.',
    chapterLabel: 'Naše sobe i apartman',
    heading:
      'Odaberite prostor udobnosti i profinjenog dizajna — Premium, Deluxe, Suite Deluxe, Suite Deluxe s hidromasažnom kadom ili Apartman',
    subheading:
      'Sve jedinice dizajnirane su za miran, ugodan boravak: vrhunski ležajevi, klimatizacija i privatne kupaonice, uz besplatan Wi-Fi i privatni parking. Za duže boravke tu su opcije s dodatnim prostorom i kuhinjom, a ljeti možete uživati i u sezonskom vanjskom bazenu i dva jacuzzia. Idealno za parove, poslovne goste i obitelji u srcu Osijeka.',
    sectionId: 'sobe',
    items: [
      {
        roomNumber: '01',
        title: 'Premium Room',
        description:
          'Ova elegantna klimatizirana dvokrevetna soba veličine 26 m² s ekstra king-size krevetom pruža neodoljiv pogled na grad na Dravi. Veliki prozori omogućuju pogled na osječku svakodnevicu. Soba je dizajnirana s modernim i luksuznim elementima, uključujući udoban ekstra king-size krevet prekriven visokokvalitetnim posteljinama. Soba je svijetla i prozračna. Uz to, prostrana kupaonica s tušem bez praga pruža dodatnu udobnost i funkcionalnost.',
        displayPrice: 120,
        displayPriceSuffix: 'noć',
        badges: [{ text: 'Ekstra king' }, { text: 'Pogled na grad' }, { text: '26 m²' }],
        imageKeys: ['premium1', 'premium2', 'premium3', 'premium4'],
      },
      {
        roomNumber: '02',
        title: 'Deluxe',
        description:
          'Ova moderna dvokrevetna soba, površine 30 m², sadrži ekstra king-size krevet, što garantira prostranost i udobnost za goste. Luksuzna kupaonica s tušem bez praga dodaje dašak elegancije i praktičnosti, stvarajući savršen ambijent za opuštanje. Cjelokupni prostor odiše modernim dizajnom i udobnošću, idealan za sve koji žele uživati u udobnom smještaju s pogledom na grad Osijek.',
        displayPrice: 150,
        displayPriceSuffix: 'noć',
        badges: [{ text: 'Ekstra king' }, { text: '30 m²' }, { text: 'Luksuzna kupaonica' }],
        imageKeys: ['deluxe1', 'deluxe2', 'deluxe3', 'deluxe4'],
      },
      {
        roomNumber: '03',
        title: 'Suite',
        description:
          'Ova luksuzna dvokrevetna soba u Osijeku nudi nevjerojatan pogled na grad, omogućujući gostima da uživaju u prelijepim panoramskim prizorima. Soba je klimatizirana i prostire se na 37 m², a nudi i ugodan prostor za sjedenje i kvalitetan odmor. Središnji element sobe je ekstra king-size krevet, koji vam osigurava maksimalnu udobnost. Kupaonica je moderna, s tušem bez praga, što pruža dodatnu funkcionalnost. Soba je idealna za opuštanje i uživanje u sofisticiranom ambijentu.',
        displayPrice: 210,
        displayPriceSuffix: 'noć',
        badges: [{ text: 'Ekstra king' }, { text: 'Lounge zona' }, { text: '37 m²' }],
        imageKeys: ['suite1', 'suite2', 'suite3', 'suite4'],
      },
      {
        roomNumber: '04',
        title: 'JACUZZI SUPERIOR',
        description:
          'Prekrasan pogled na grad Osijek s visoke pozicije, iz udobne i opuštajuće dvokrevetne sobe veličine 37 m². Soba je luksuzno uređena s udobnim ekstra king-size krevetom, prostorom za odmor i privatnim jacuzzi-jem koji pruža potpunu relaksaciju. Prozori omogućuju nevjerojatan pogled na gradsku užurbanost, dok stilski uređena kupaonica s kadom dodatno naglašava osjećaj luksuza. Osvjetljenje sobe je nježno, a prostor je savršeno dizajniran kako bi pružio miran ugođaj i kvalitetan odmor.',
        displayPrice: 290,
        displayPriceSuffix: 'noć',
        badges: [{ text: 'Privatni jacuzzi' }, { text: 'Kada u kupaonici' }, { text: '37 m²' }],
        imageKeys: ['jacuzzi1', 'jacuzzi2', 'jacuzzi3', 'jacuzzi4'],
      },
    ],
  },
  rooftop: {
    chapterNum: 'iii.',
    chapterLabel: 'Capitulum · Krov',
    heading: 'Krov s pogledom — *privatni Rooftop* za naše goste',
    metaRows: ['45.5550° N · 18.6955° E', 'Otvoreno svibanj — rujan', 'Najbolje · zalazak'],
    manifestEyebrow: 'Manifest',
    manifestHeading:
      'Opuštanje na krovu uz bazen i jacuzzi, zalazak sunca nad Osijekom i privatni najam za proslave, after-work druženja ili mini evente.',
    manifestItems: [
      { key: 'Bazen', value: 'sezonski, vanjski' },
      { key: 'Jacuzzia', value: 'dva, pod otvorenim nebom' },
      { key: 'Sjedenje', value: 'lounge + bean bags' },
      { key: 'Rasvjeta', value: 'ambijentalna, dimmable' },
      { key: 'Glazba', value: 'vlastiti playlist' },
      { key: 'Kapacitet', value: 'do 24 osobe za privatni najam' },
      { key: 'Wi-Fi', value: 'pokriva cijelu terasu' },
      { key: 'Otvoreno', value: 'svibanj — rujan' },
    ],
    cta: { label: 'Pošalji upit za rooftop →', href: '#kontakt' },
    sectionId: 'krov',
    features: [
      {
        romanNumeral: 'I.',
        tag: 'Sezonski · ljetni mjeseci',
        title: 'Jacuzzi & chill',
        description:
          'Uživajte u jacuzziju pod otvorenim nebom, okruženi udobnim lounge sjedalima i mekanim vrećama za sjedenje. Prostor je zamišljen za sporo popodne, čašu vina i razgovor bez žurbe. Kad padne mrak, ambijentalna rasvjeta pretvara rooftop u intimnu dnevnu sobu na nebu.',
        imageKey: 'rooftop1',
      },
      {
        romanNumeral: 'II.',
        tag: 'Najbolje · zalazak sunca',
        title: 'Panorama grada',
        description:
          'Otvoren pogled na Osijek pruža savršenu pozadinu za fotografije i video uspomene. Zalazak sunca i lampice iznad terase stvaraju poseban ugođaj koji je teško replicirati u zatvorenim prostorima.',
        imageKey: 'rooftop2',
        reverseLayout: true,
      },
      {
        romanNumeral: 'III.',
        tag: 'Za goste',
        title: 'Udobnost',
        description:
          'Rooftop prostor nudi dovoljno sjedećih mjesta, stabilan Wi-Fi i jednostavan pristup iz smještaja, što ga čini idealnim za opušten boravak. Gostima je osiguran privatni parking za bezbrižan dolazak, dok je naše osoblje na raspolaganju za podršku. Prostor je dostupan sezonski, uz mogućnost unaprijed rezerviranog termina za potpuno iskustvo u željenom okruženju.',
        imageKey: 'rooftop3',
      },
    ],
  },
  contact: {
    chapterNum: 'iv.',
    chapterLabel: 'Capitulum · Kontakt',
    heading: 'Tu smo za vaš *upit i rezervaciju*.',
    leadText:
      'Trebate ponudu za smještaj, privatni najam rooftopa ili imate posebne želje? Pošaljite nam poruku putem obrasca—odgovaramo čim prije, najčešće isti dan. Rado ćemo pomoći oko termina, cijena i preporuka za vaš boravak u Osijeku.',
    channels: [
      { type: 'email', label: 'E-mail', value: 'support@district.hr', href: 'mailto:support@district.hr' },
      { type: 'phone', label: 'Telefon', value: '+385 99 554 4337', href: 'tel:+385995544337' },
      {
        type: 'instagram',
        label: 'Instagram',
        value: '@momentobydistrict',
        href: 'https://instagram.com/momentobydistrict',
      },
    ],
    intelRows: [
      { label: 'Recepcija', value: '0 — 24h' },
      { label: 'Rooftop', value: 'svibanj — rujan' },
      { label: 'Adresa', value: 'Lj. Posavskog 7, Osijek' },
      { label: 'Parking', value: 'uključeno' },
    ],
    formNote: 'Odgovaramo unutar nekoliko sati. Bez auto-poruka.',
    successHeading: 'Hvala vam.',
    successMessage:
      'Poruka je zaprimljena. Javljamo se u roku od nekoliko sati, najčešće isti dan.',
    sectionId: 'kontakt',
  },
  footer: {
    timeLabel: 'Vrijeme u Osijeku',
    signoffEyebrow: 'Do skorog',
    signoffHeading: 'Vidimo se na *krovu*.',
    addressHeading: 'Adresa & dolazak',
    addressHtml: 'Ljudevita Posavskog 7<br />31000 Osijek, Hrvatska',
    infoRows: [
      { label: 'Privatni parking', value: 'uključeno' },
      { label: 'Wi-Fi', value: 'besplatan, brzi' },
      { label: 'Check-in', value: 'od 15:00' },
      { label: 'Check-out', value: 'do 11:00' },
      { label: 'Domaća životinja', value: 'na upit' },
    ],
    contactHeading: 'Razgovor',
    contactLinks: [
      { key: 'support@district.hr', label: 'Email', href: 'mailto:support@district.hr' },
      { key: '+385 99 554 4337', label: 'Telefon', href: 'tel:+385995544337' },
      {
        key: '@momentobydistrict',
        label: 'Instagram',
        href: 'https://instagram.com/momentobydistrict',
      },
      { key: '/district.boutique.osijek', label: 'Facebook', href: '#' },
    ],
    newsletterHeading: 'Bilten · jednom mjesečno',
    newsletterNote: 'Bez spama — samo novosti iz Boutiquea.',
    mapHeading: 'Karta',
    mapCta: 'Otvori u Mapama',
    distanceRows: [
      { label: 'Opus Arena', value: '3 min' },
      { label: 'Tvrđa', value: '8 min' },
      { label: 'Promenada', value: '2 min' },
      { label: 'Aerodrom Osijek', value: '20 min' },
    ],
    marqueeItems: ['Boutique', 'Osijek', 'Krov & Jacuzzi', 'Drava', 'Opus Arena', 'MMXXVI'],
    copyright: '© District d.o.o. · OIB 56282051463 · sva prava pridržana',
    legalLinks: [
      { label: 'Privatnost', href: '#' },
      { label: 'Uvjeti', href: '#' },
      { label: 'Politika otkaza', href: '#' },
      { label: 'Impressum', href: '#' },
    ],
    madeBy: 'Kreirao Front Tribe · redesign concept',
  },
  formSeed: {
    nameFieldLabel: 'Ime i prezime',
    namePlaceholder: 'Vaše ime',
    emailFieldLabel: 'E-mail',
    emailPlaceholder: 'email@primjer.hr',
    phoneFieldLabel: 'Telefon',
    phonePlaceholder: '+385 …',
    typeFieldLabel: 'Tip upita',
    typePlaceholder: 'Odaberite',
    typeOptions: [
      { label: 'Rezervacija sobe', value: 'rezervacija' },
      { label: 'Najam rooftopa', value: 'rooftop' },
      { label: 'Poslovni boravak', value: 'poslovni' },
      { label: 'Posebna prilika', value: 'posebna' },
      { label: 'Drugo', value: 'drugo' },
    ],
    messageFieldLabel: 'Poruka',
    messagePlaceholder: 'Kratko opišite što trebate…',
    submitButtonLabel: 'Pošalji upit',
    successMessage: 'Hvala — javit ćemo vam se uskoro.',
  },
}

const EN: BoutiqueSeedLocalePack = {
  ...HR,
  pageTitle: 'District Boutique — Osijek',
  meta: {
    title: 'District Boutique · Osijek',
    description:
      'Boutique accommodation in Osijek — seasonal pool and jacuzzis, free parking and Wi-Fi, minutes from Opus Arena.',
  },
  nav: [
    { label: 'About', scrollTarget: 'o-nama' },
    { label: 'Rooms', scrollTarget: 'sobe' },
    { label: 'Rooftop', scrollTarget: 'krov' },
    { label: 'Contact', scrollTarget: 'kontakt' },
  ],
  hero: {
    heading: 'District Boutique',
    subheading:
      'Modern boutique accommodation in Osijek with a seasonal outdoor pool and jacuzzis, free parking and Wi-Fi, located just minutes from Opus Arena. Spacious, elegantly decorated rooms and apartments offer the perfect blend of comfort, privacy and contemporary design, ideal for couples, business guests and families seeking peace and a prime location in the heart of Slavonia.',
    sectionId: 'hero',
  },
  intro: {
    ...HR.intro,
    chapterLabel: 'Chapter · About',
    heading: 'District Boutique – *more than just accommodation*.',
    body:
      'District Boutique in Osijek combines a quiet, elegant atmosphere with the conveniences that make travel carefree. Spacious, carefully decorated rooms and an apartment offer comfort for couples, business travelers and families, while free private parking and fast Wi-Fi ensure a comfortable stay from the first moment. With a prime location, just minutes from the Opus Arena and the city\'s main attractions, our boutique is an ideal starting point for exploring Slavonia.\n\nOur team is happy to recommend the best local restaurants, walks along the Drava River and current events. If you are looking for accommodation in Osijek that offers peace, style and warm service, without the big hotels and crowds, welcome to District Boutique, your Osijek address for design, comfort and a relaxed stay.',
    pullQuote:
      'A calm boutique retreat near Opus Arena — rooftop, jacuzzi and attention to detail you will remember.',
    pullQuoteCite: '— Guest, August 2025',
    collageTags: ['01 · Exterior on the Drava', '02 · Rooms', '03 · Details'],
    stats: [
      { value: 4, label: 'room categories' },
      { value: 37, suffix: 'm²', label: 'largest suite' },
      { value: 2, label: 'jacuzzis & pool' },
      { value: 3, suffix: "'", label: 'to Opus Arena' },
      { value: 100, suffix: '%', label: 'private parking' },
    ],
  },
  rooms: {
    ...HR.rooms,
    chapterLabel: 'Our rooms and apartment',
    heading:
      'Choose a space of comfort and refined design — Premium, Deluxe, Deluxe Suite, Deluxe Suite with Jacuzzi or Apartment',
    subheading:
      'All units are designed for a peaceful, comfortable stay: premium beds, air conditioning and private bathrooms, along with free Wi-Fi and private parking. For longer stays, there are options with additional space and a kitchen, and in the summer you can enjoy the seasonal outdoor pool and two jacuzzis. Ideal for couples, business guests and families in the heart of Osijek.',
    items: [
      {
        roomNumber: '01',
        title: 'Premium Room',
        description:
          'This elegant, air-conditioned double room measuring 26 m² with an extra king-size bed offers an irresistible view of the city on the Drava River. Large windows allow you to see the everyday life of Osijek. The room is designed with modern and luxurious elements, including a comfortable extra king-size bed covered with high-quality linens. The room is bright and airy. In addition, the spacious bathroom with a walk-in shower provides additional comfort and functionality.',
        displayPrice: 120,
        displayPriceSuffix: 'night',
        badges: [{ text: 'Extra king' }, { text: 'City view' }, { text: '26 m²' }],
        imageKeys: ['premium1', 'premium2', 'premium3', 'premium4'],
      },
      {
        roomNumber: '02',
        title: 'Deluxe',
        description:
          'This modern double room, measuring 30 m², features an extra king-size bed, ensuring spaciousness and comfort for guests. The luxurious bathroom with a walk-in shower adds a touch of elegance and practicality, creating the perfect ambiance for relaxation. The entire space exudes modern design and comfort, ideal for anyone who wants to enjoy comfortable accommodation with a view of the city of Osijek.',
        displayPrice: 150,
        displayPriceSuffix: 'night',
        badges: [{ text: 'Extra king' }, { text: '30 m²' }, { text: 'Luxury bathroom' }],
        imageKeys: ['deluxe1', 'deluxe2', 'deluxe3', 'deluxe4'],
      },
      {
        roomNumber: '03',
        title: 'Suite',
        description:
          'This luxurious double room in Osijek offers incredible views of the city, allowing guests to enjoy beautiful panoramic views. The room is air-conditioned and covers 37 m², and offers a comfortable seating area and quality rest. The centerpiece of the room is an extra king-size bed, which ensures maximum comfort. The bathroom is modern, with a walk-in shower, which provides additional functionality. The room is ideal for relaxing and enjoying a sophisticated ambiance.',
        displayPrice: 210,
        displayPriceSuffix: 'night',
        badges: [{ text: 'Extra king' }, { text: 'Lounge area' }, { text: '37 m²' }],
        imageKeys: ['suite1', 'suite2', 'suite3', 'suite4'],
      },
      {
        roomNumber: '04',
        title: 'JACUZZI SUPERIOR',
        description:
          'Beautiful view of the city of Osijek from a high position, from a comfortable and relaxing double room measuring 37 m². The room is luxuriously decorated with a comfortable extra king-size bed, a seating area and a private jacuzzi that provides complete relaxation. The windows provide an incredible view of the city\'s hustle and bustle, while the stylish bathroom with a bathtub further emphasizes the feeling of luxury. The lighting of the room is gentle, and the space is perfectly designed to provide a peaceful atmosphere and quality rest.',
        displayPrice: 290,
        displayPriceSuffix: 'night',
        badges: [{ text: 'Private jacuzzi' }, { text: 'Bathtub' }, { text: '37 m²' }],
        imageKeys: ['jacuzzi1', 'jacuzzi2', 'jacuzzi3', 'jacuzzi4'],
      },
    ],
  },
  rooftop: {
    ...HR.rooftop,
    chapterLabel: 'Chapter · Rooftop',
    heading: 'Rooftop with a view — *private Rooftop* for our guests',
    manifestHeading:
      'Relaxing on the roof by the pool and jacuzzi, sunset over Osijek and private rental for celebrations, after-work gatherings or mini events.',
    features: [
      {
        romanNumeral: 'I.',
        tag: 'Seasonal · summer months',
        title: 'Jacuzzi & chill',
        description:
          'Enjoy the open-air jacuzzi, surrounded by comfortable lounge chairs and soft bean bags. The space is designed for a slow afternoon, a glass of wine and unhurried conversation. When it gets dark, ambient lighting transforms the rooftop into an intimate living room in the sky.',
        imageKey: 'rooftop1',
      },
      {
        romanNumeral: 'II.',
        tag: 'Best · sunset',
        title: 'City panorama',
        description:
          'The open view of Osijek provides the perfect backdrop for photos and video memories. The sunset and the lights above the terrace create a special atmosphere that is difficult to replicate indoors.',
        imageKey: 'rooftop2',
        reverseLayout: true,
      },
      {
        romanNumeral: 'III.',
        tag: 'For guests',
        title: 'Comfort',
        description:
          'The rooftop space offers ample seating, stable Wi-Fi, and easy access from the accommodation, making it ideal for a relaxed stay. Guests are provided with private parking for a hassle-free arrival, while our staff is available for support. The space is available seasonally, with the option of pre-booking for the full experience in the desired environment.',
        imageKey: 'rooftop3',
      },
    ],
  },
  contact: {
    chapterNum: 'iv.',
    chapterLabel: 'Chapter · Contact',
    heading: 'We are here for your *inquiries and reservations*.',
    leadText:
      'Do you need an accommodation offer, a private rooftop rental, or do you have special requests? Send us a message via the form—we will respond as soon as possible, usually the same day. We will be happy to help with dates, prices, and recommendations for your stay in Osijek.',
    channels: [
      { type: 'email', label: 'Email', value: 'support@district.hr', href: 'mailto:support@district.hr' },
      { type: 'phone', label: 'Phone', value: '+385 99 554 4337', href: 'tel:+385995544337' },
      {
        type: 'instagram',
        label: 'Instagram',
        value: '@momentobydistrict',
        href: 'https://instagram.com/momentobydistrict',
      },
    ],
    intelRows: [
      { label: 'Reception', value: '24/7' },
      { label: 'Rooftop', value: 'May — September' },
      { label: 'Address', value: 'Lj. Posavskog 7, Osijek' },
      { label: 'Parking', value: 'included' },
    ],
    formNote: 'We respond within a few hours. No auto-replies.',
    successHeading: 'Thank you.',
    successMessage: 'Your message was received — we will be in touch soon.',
    sectionId: 'kontakt',
  },
  footer: {
    timeLabel: 'Time in Osijek',
    signoffEyebrow: 'See you soon',
    signoffHeading: 'See you on the *rooftop*.',
    addressHeading: 'Address & arrival',
    addressHtml: 'Ljudevita Posavskog 7<br />31000 Osijek, Croatia',
    infoRows: [
      { label: 'Private parking', value: 'included' },
      { label: 'Wi-Fi', value: 'free, fast' },
      { label: 'Check-in', value: 'from 3:00 p.m.' },
      { label: 'Check-out', value: 'until 11:00 a.m.' },
      { label: 'Pets', value: 'on request' },
    ],
    contactHeading: 'Get in touch',
    contactLinks: [
      { key: 'support@district.hr', label: 'Email', href: 'mailto:support@district.hr' },
      { key: '+385 99 554 4337', label: 'Phone', href: 'tel:+385995544337' },
      {
        key: '@momentobydistrict',
        label: 'Instagram',
        href: 'https://instagram.com/momentobydistrict',
      },
      { key: '/district.boutique.osijek', label: 'Facebook', href: '#' },
    ],
    newsletterHeading: 'Newsletter · once a month',
    newsletterNote: 'No spam — only Boutique news.',
    mapHeading: 'Map',
    mapCta: 'Open in Maps',
    distanceRows: [
      { label: 'Opus Arena', value: '3 min' },
      { label: 'Tvrđa', value: '8 min' },
      { label: 'Promenada', value: '2 min' },
      { label: 'Osijek Airport', value: '20 min' },
    ],
    marqueeItems: ['Boutique', 'Osijek', 'Rooftop & Jacuzzi', 'Drava', 'Opus Arena', 'MMXXVI'],
    copyright: '© District d.o.o. · OIB 56282051463 · all rights reserved',
    legalLinks: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Cancellation policy', href: '#' },
      { label: 'Imprint', href: '#' },
    ],
    madeBy: 'Created by Front Tribe · redesign concept',
  },
  formSeed: {
    nameFieldLabel: 'Full name',
    namePlaceholder: 'Your name',
    emailFieldLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    phoneFieldLabel: 'Phone',
    phonePlaceholder: '+385 …',
    typeFieldLabel: 'Inquiry type',
    typePlaceholder: 'Select',
    typeOptions: [
      { label: 'Room reservation', value: 'rezervacija' },
      { label: 'Rooftop hire', value: 'rooftop' },
      { label: 'Business stay', value: 'poslovni' },
      { label: 'Special occasion', value: 'posebna' },
      { label: 'Other', value: 'drugo' },
    ],
    messageFieldLabel: 'Message',
    messagePlaceholder: 'Tell us what you need…',
    submitButtonLabel: 'Send inquiry',
    successMessage: 'Thank you — we will reply soon.',
  },
}

const DE: BoutiqueSeedLocalePack = {
  pageTitle: 'District Boutique — Osijek',
  meta: {
    title: 'District Boutique · Osijek',
    description:
      'Boutique-Unterkunft in Osijek — saisonaler Pool und Jacuzzis, kostenloses Parken und WLAN, wenige Minuten zur Opus Arena.',
  },
  nav: [
    { label: 'Über uns', scrollTarget: 'o-nama' },
    { label: 'Zimmer', scrollTarget: 'sobe' },
    { label: 'Dachterrasse', scrollTarget: 'krov' },
    { label: 'Kontakt', scrollTarget: 'kontakt' },
  ],
  hero: {
    heading: 'District Boutique',
    subheading:
      'Moderne Boutique-Unterkunft in Osijek mit saisonalem Außenpool und Jacuzzis, kostenlosem Parken und WLAN, nur wenige Minuten von der Opus Arena entfernt. Geräumige, elegant eingerichtete Zimmer und Apartments bieten die perfekte Mischung aus Komfort, Privatsphäre und zeitgenössischem Design — ideal für Paare, Geschäftsreisende und Familien, die Ruhe und eine erstklassige Lage im Herzen Slawoniens suchen.',
    sectionId: 'hero',
  },
  intro: {
    chapterNum: 'i.',
    chapterLabel: 'Kapitel · Über uns',
    heading: 'District Boutique – *mehr als eine Übernachtung*.',
    body:
      'District Boutique in Osijek verbindet ruhige Eleganz mit den praktischen Details, die Reisen mühelos machen. Geräumige, sorgfältig eingerichtete Zimmer und ein Apartment bieten Komfort für Paare, Geschäftsreisende und Familien, während kostenloses Privatparken und schnelles WLAN ab der Ankunft für einen angenehmen Aufenthalt sorgen. Nur wenige Minuten von der Opus Arena und den wichtigsten Sehenswürdigkeiten der Stadt — ein idealer Ausgangspunkt, um Slawonien zu entdecken.\n\nUnser Team empfiehlt Ihnen gerne die besten lokalen Restaurants, Spaziergänge entlang der Drau und aktuelle Veranstaltungen. Wenn Sie eine Unterkunft in Osijek suchen, die Ruhe, Stil und warmen Service bietet — ohne große Hotels und Menschenmassen — willkommen im District Boutique, Ihrer Osijeker Adresse für Design, Komfort und entspannten Aufenthalt.',
    pullQuote:
      'Ein ruhiger Boutique-Rückzugsort nahe der Opus Arena — Dachterrasse, Jacuzzi und Liebe zum Detail, die in Erinnerung bleibt.',
    pullQuoteCite: '— Gast, August 2025',
    stats: [
      { value: 4, label: 'Zimmerkategorien' },
      { value: 37, suffix: 'm²', label: 'größte Suite' },
      { value: 2, label: 'Jacuzzis & Pool' },
      { value: 3, suffix: "'", label: 'zur Opus Arena' },
      { value: 100, suffix: '%', label: 'Privatparkplatz' },
    ],
    collageTags: ['01 · Außenbereich an der Drau', '02 · Zimmer', '03 · Details'],
    sectionId: 'o-nama',
  },
  rooms: {
    chapterNum: 'ii.',
    chapterLabel: 'Unsere Zimmer und Apartment',
    heading:
      'Wählen Sie einen Raum voller Komfort und feinen Designs — Premium, Deluxe, Deluxe Suite, Deluxe Suite mit Hydromassage-Badewanne oder Apartment',
    subheading:
      'Alle Einheiten sind für einen ruhigen, angenehmen Aufenthalt konzipiert: Premium-Betten, Klimaanlage und private Badezimmer, dazu kostenloses WLAN und Privatparkplatz. Für längere Aufenthalte gibt es Optionen mit zusätzlichem Platz und Küche, im Sommer genießen Sie den saisonalen Außenpool und zwei Jacuzzis. Ideal für Paare, Geschäftsreisende und Familien im Herzen von Osijek.',
    sectionId: 'sobe',
    items: [
      {
        roomNumber: '01',
        title: 'Premium Room',
        description:
          'Dieses elegante, klimatisierte Doppelzimmer mit 26 m² und Extra-Kingsize-Bett bietet einen unwiderstehlichen Blick auf die Stadt an der Drau. Große Fenster ermöglichen den Blick auf den osijeker Alltag. Das Zimmer ist mit modernen und luxuriösen Elementen gestaltet, einschließlich eines bequemen Extra-Kingsize-Betts mit hochwertiger Bettwäsche. Das Zimmer ist hell und luftig. Das geräumige Badezimmer mit bodengleicher Dusche bietet zusätzlichen Komfort und Funktionalität.',
        displayPrice: 120,
        displayPriceSuffix: 'Nacht',
        badges: [{ text: 'Extra King' }, { text: 'Stadtblick' }, { text: '26 m²' }],
        imageKeys: ['premium1', 'premium2', 'premium3', 'premium4'],
      },
      {
        roomNumber: '02',
        title: 'Deluxe',
        description:
          'Dieses moderne Doppelzimmer mit 30 m² verfügt über ein Extra-Kingsize-Bett und garantiert Geräumigkeit und Komfort. Das luxuriöse Badezimmer mit bodengleicher Dusche verleiht Eleganz und Praktikabilität und schafft die perfekte Atmosphäre zum Entspannen. Der gesamte Raum strahlt modernes Design und Behaglichkeit aus — ideal für alle, die komfortable Unterkunft mit Blick auf Osijek genießen möchten.',
        displayPrice: 150,
        displayPriceSuffix: 'Nacht',
        badges: [{ text: 'Extra King' }, { text: '30 m²' }, { text: 'Luxusbad' }],
        imageKeys: ['deluxe1', 'deluxe2', 'deluxe3', 'deluxe4'],
      },
      {
        roomNumber: '03',
        title: 'Suite',
        description:
          'Dieses luxuriöse Doppelzimmer in Osijek bietet einen unglaublichen Blick auf die Stadt und wunderschöne Panoramablicke. Das klimatisierte Zimmer umfasst 37 m² und bietet einen gemütlichen Sitzbereich für erholsame Ruhe. Im Mittelpunkt steht ein Extra-Kingsize-Bett für maximalen Komfort. Das moderne Badezimmer mit bodengleicher Dusche bietet zusätzliche Funktionalität. Ideal zum Entspannen in einer sophistizierten Atmosphäre.',
        displayPrice: 210,
        displayPriceSuffix: 'Nacht',
        badges: [{ text: 'Extra King' }, { text: 'Lounge' }, { text: '37 m²' }],
        imageKeys: ['suite1', 'suite2', 'suite3', 'suite4'],
      },
      {
        roomNumber: '04',
        title: 'JACUZZI SUPERIOR',
        description:
          'Wunderschöner Blick auf Osijek aus erhöhter Lage, aus einem komfortablen und entspannenden Doppelzimmer mit 37 m². Das Zimmer ist luxuriös eingerichtet mit Extra-Kingsize-Bett, Ruhebereich und privatem Jacuzzi für vollständige Entspannung. Die Fenster bieten einen beeindruckenden Blick auf das Stadtleben, während das stilvolle Badezimmer mit Badewanne das Gefühl von Luxus unterstreicht. Sanfte Beleuchtung und durchdachtes Design sorgen für eine ruhige Atmosphäre und erholsamen Schlaf.',
        displayPrice: 290,
        displayPriceSuffix: 'Nacht',
        badges: [{ text: 'Privater Jacuzzi' }, { text: 'Badewanne' }, { text: '37 m²' }],
        imageKeys: ['jacuzzi1', 'jacuzzi2', 'jacuzzi3', 'jacuzzi4'],
      },
    ],
  },
  rooftop: {
    chapterNum: 'iii.',
    chapterLabel: 'Kapitel · Dachterrasse',
    heading: 'Dachterrasse mit Blick — *private Rooftop* für unsere Gäste',
    metaRows: ['45.5550° N · 18.6955° E', 'Geöffnet Mai — September', 'Am besten · Sonnenuntergang'],
    manifestEyebrow: 'Manifest',
    manifestHeading:
      'Entspannung auf dem Dach mit Pool und Jacuzzi, Sonnenuntergang über Osijek und private Miete für Feiern, After-Work-Treffen oder Mini-Events.',
    manifestItems: [
      { key: 'Pool', value: 'saisonal, außen' },
      { key: 'Jacuzzis', value: 'zwei, unter freiem Himmel' },
      { key: 'Sitzplätze', value: 'Lounge + Sitzsäcke' },
      { key: 'Beleuchtung', value: 'ambient, dimmbar' },
      { key: 'Musik', value: 'eigene Playlist' },
      { key: 'Kapazität', value: 'bis 24 Personen für Privatmiete' },
      { key: 'WLAN', value: 'deckt die gesamte Terrasse ab' },
      { key: 'Geöffnet', value: 'Mai — September' },
    ],
    cta: { label: 'Anfrage für Dachterrasse →', href: '#kontakt' },
    sectionId: 'krov',
    features: [
      {
        romanNumeral: 'I.',
        tag: 'Saisonal · Sommermonate',
        title: 'Jacuzzi & chill',
        description:
          'Genießen Sie den Jacuzzi unter freiem Himmel, umgeben von bequemen Lounge-Sitzplätzen und weichen Sitzsäcken. Der Raum ist für einen langsamen Nachmittag, ein Glas Wein und ungehetzte Gespräche gedacht. Wenn es dunkel wird, verwandelt die Ambientebeleuchtung die Dachterrasse in ein intim Wohnzimmer unter dem Himmel.',
        imageKey: 'rooftop1',
      },
      {
        romanNumeral: 'II.',
        tag: 'Am besten · Sonnenuntergang',
        title: 'Stadtpanorama',
        description:
          'Der offene Blick auf Osijek bietet die perfekte Kulisse für Fotos und Video-Erinnerungen. Sonnenuntergang und Lichter über der Terrasse schaffen eine besondere Atmosphäre, die sich in Innenräumen schwer nachbilden lässt.',
        imageKey: 'rooftop2',
        reverseLayout: true,
      },
      {
        romanNumeral: 'III.',
        tag: 'Für Gäste',
        title: 'Komfort',
        description:
          'Die Dachterrasse bietet ausreichend Sitzplätze, stabiles WLAN und einfachen Zugang von der Unterkunft — ideal für einen entspannten Aufenthalt. Gäste erhalten Privatparkplätze für eine sorgenfreie Anreise, unser Team steht für Unterstützung zur Verfügung. Der Raum ist saisonal verfügbar, mit der Möglichkeit einer Vorausbuchung für das volle Erlebnis.',
        imageKey: 'rooftop3',
      },
    ],
  },
  contact: {
    chapterNum: 'iv.',
    chapterLabel: 'Kapitel · Kontakt',
    heading: 'Wir sind für Ihre *Anfragen und Reservierungen* da.',
    leadText:
      'Benötigen Sie ein Angebot für einen Aufenthalt, eine private Dachterrassen-Miete oder haben Sie besondere Wünsche? Senden Sie uns eine Nachricht über das Formular — wir antworten so schnell wie möglich, in der Regel noch am selben Tag. Gerne helfen wir bei Terminen, Preisen und Empfehlungen für Ihren Aufenthalt in Osijek.',
    channels: [
      { type: 'email', label: 'E-Mail', value: 'support@district.hr', href: 'mailto:support@district.hr' },
      { type: 'phone', label: 'Telefon', value: '+385 99 554 4337', href: 'tel:+385995544337' },
      {
        type: 'instagram',
        label: 'Instagram',
        value: '@momentobydistrict',
        href: 'https://instagram.com/momentobydistrict',
      },
    ],
    intelRows: [
      { label: 'Rezeption', value: '24/7' },
      { label: 'Dachterrasse', value: 'Mai — September' },
      { label: 'Adresse', value: 'Lj. Posavskog 7, Osijek' },
      { label: 'Parken', value: 'inklusive' },
    ],
    formNote: 'Wir antworten innerhalb weniger Stunden. Keine Auto-Antworten.',
    successHeading: 'Vielen Dank.',
    successMessage:
      'Ihre Nachricht ist eingegangen — wir melden uns in Kürze.',
    sectionId: 'kontakt',
  },
  footer: {
    timeLabel: 'Uhrzeit in Osijek',
    signoffEyebrow: 'Bis bald',
    signoffHeading: 'Wir sehen uns auf dem *Dach*.',
    addressHeading: 'Adresse & Anreise',
    addressHtml: 'Ljudevita Posavskog 7<br />31000 Osijek, Kroatien',
    infoRows: [
      { label: 'Privatparkplatz', value: 'inklusive' },
      { label: 'WLAN', value: 'kostenlos, schnell' },
      { label: 'Check-in', value: 'ab 15:00 Uhr' },
      { label: 'Check-out', value: 'bis 11:00 Uhr' },
      { label: 'Haustiere', value: 'auf Anfrage' },
    ],
    contactHeading: 'Kontakt',
    contactLinks: [
      { key: 'support@district.hr', label: 'E-Mail', href: 'mailto:support@district.hr' },
      { key: '+385 99 554 4337', label: 'Telefon', href: 'tel:+385995544337' },
      {
        key: '@momentobydistrict',
        label: 'Instagram',
        href: 'https://instagram.com/momentobydistrict',
      },
      { key: '/district.boutique.osijek', label: 'Facebook', href: '#' },
    ],
    newsletterHeading: 'Newsletter · einmal monatlich',
    newsletterNote: 'Kein Spam — nur Boutique-Neuigkeiten.',
    mapHeading: 'Karte',
    mapCta: 'In Karten öffnen',
    distanceRows: [
      { label: 'Opus Arena', value: '3 Min.' },
      { label: 'Tvrđa', value: '8 Min.' },
      { label: 'Promenada', value: '2 Min.' },
      { label: 'Flughafen Osijek', value: '20 Min.' },
    ],
    marqueeItems: ['Boutique', 'Osijek', 'Dach & Jacuzzi', 'Drau', 'Opus Arena', 'MMXXVI'],
    copyright: '© District d.o.o. · OIB 56282051463 · alle Rechte vorbehalten',
    legalLinks: [
      { label: 'Datenschutz', href: '#' },
      { label: 'AGB', href: '#' },
      { label: 'Stornobedingungen', href: '#' },
      { label: 'Impressum', href: '#' },
    ],
    madeBy: 'Erstellt von Front Tribe · Redesign-Konzept',
  },
  formSeed: {
    nameFieldLabel: 'Vor- und Nachname',
    namePlaceholder: 'Ihr Name',
    emailFieldLabel: 'E-Mail',
    emailPlaceholder: 'sie@beispiel.de',
    phoneFieldLabel: 'Telefon',
    phonePlaceholder: '+385 …',
    typeFieldLabel: 'Art der Anfrage',
    typePlaceholder: 'Bitte wählen',
    typeOptions: [
      { label: 'Zimmerreservierung', value: 'rezervacija' },
      { label: 'Dachterrassen-Miete', value: 'rooftop' },
      { label: 'Geschäftsreise', value: 'poslovni' },
      { label: 'Besonderer Anlass', value: 'posebna' },
      { label: 'Sonstiges', value: 'drugo' },
    ],
    messageFieldLabel: 'Nachricht',
    messagePlaceholder: 'Beschreiben Sie kurz, was Sie benötigen…',
    submitButtonLabel: 'Anfrage senden',
    successMessage: 'Vielen Dank — wir melden uns bald.',
  },
}

export function getBoutiqueLocalePack(locale: BoutiqueLocale): BoutiqueSeedLocalePack {
  if (locale === 'en') return EN
  if (locale === 'de') return DE
  return HR
}

export const BOUTIQUE_INQUIRY_FORM_TITLE = 'Boutique — kontakt (seed)'
