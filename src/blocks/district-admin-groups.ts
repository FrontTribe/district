/**
 * Payload admin — grupiranje blokova u layoutu stranice po vertikali (proizvodnoj liniji).
 * Real estate: novi landing + zastarjeli RE blokovi. Boutique / Momento: vlastiti setovi blokova.
 */
export const districtAdminGroups = {
  realEstate: {
    en: 'District · Real estate',
    hr: 'District · Nekretnine',
  },
  boutique: {
    en: 'District · Boutique',
    hr: 'District · Boutique',
  },
  momento: {
    en: 'District · Momento',
    hr: 'District · Momento',
  },
  hub: {
    en: 'District · Hub & pages',
    hr: 'District · Hub i stranice',
  },
} as const
