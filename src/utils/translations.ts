type Locale = 'hr' | 'en' | 'de'

type Translations = {
  [key: string]: {
    [key in Locale]: string
  }
}

const translations: Translations = {
  comingSoon: {
    hr: 'Uskoro',
    en: 'Coming Soon',
    de: 'Demnächst',
  },
  reservationSuccess: {
    hr: 'Rezervacija uspješna!',
    en: 'Reservation Successful!',
    de: 'Reservierung erfolgreich!',
  },
  reservationSuccessMessage: {
    hr: 'Vaša rezervacija je uspješno obrađena. Detalji su poslani na vašu email adresu.',
    en: 'Your reservation has been successfully processed. Details have been sent to your email address.',
    de: 'Ihre Reservierung wurde erfolgreich bearbeitet. Details wurden an Ihre E-Mail-Adresse gesendet.',
  },
  confirmationDetails: {
    hr: 'Detalji potvrde',
    en: 'Confirmation Details',
    de: 'Bestätigungsdetails',
  },
  guestName: {
    hr: 'Ime gosta',
    en: 'Guest Name',
    de: 'Gastname',
  },
  room: {
    hr: 'Soba',
    en: 'Room',
    de: 'Zimmer',
  },
  nights: {
    hr: 'Noći',
    en: 'Nights',
    de: 'Nächte',
  },
  totalPrice: {
    hr: 'Ukupna cijena',
    en: 'Total Price',
    de: 'Gesamtpreis',
  },
  emailConfirmationSent: {
    hr: 'Potvrda rezervacije je poslana na vašu email adresu',
    en: 'Confirmation email has been sent to your email address',
    de: 'Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet',
  },
  scrollToExplore: {
    hr: 'Skrolaj za istraživanje',
    en: 'Scroll to explore',
    de: 'Scrollen um zu erkunden',
  },
  address: {
    hr: 'Adresa',
    en: 'Address',
    de: 'Adresse',
  },
  workingHours: {
    hr: 'Radno vrijeme',
    en: 'Working Hours',
    de: 'Öffnungszeiten',
  },
  closed: {
    hr: 'Zatvoreno',
    en: 'Closed',
    de: 'Geschlossen',
  },
  monday: {
    hr: 'Ponedjeljak',
    en: 'Monday',
    de: 'Montag',
  },
  tuesday: {
    hr: 'Utorak',
    en: 'Tuesday',
    de: 'Dienstag',
  },
  wednesday: {
    hr: 'Srijeda',
    en: 'Wednesday',
    de: 'Mittwoch',
  },
  thursday: {
    hr: 'Četvrtak',
    en: 'Thursday',
    de: 'Donnerstag',
  },
  friday: {
    hr: 'Petak',
    en: 'Friday',
    de: 'Freitag',
  },
  saturday: {
    hr: 'Subota',
    en: 'Saturday',
    de: 'Samstag',
  },
  sunday: {
    hr: 'Nedjelja',
    en: 'Sunday',
    de: 'Sonntag',
  },
  email: {
    hr: 'Email',
    en: 'Email',
    de: 'E-Mail',
  },
  checkIn: {
    hr: 'Prijava',
    en: 'Check-in',
    de: 'Check-in',
  },
  checkOut: {
    hr: 'Odjava',
    en: 'Check-out',
    de: 'Check-out',
  },
  close: {
    hr: 'Zatvori',
    en: 'Close',
    de: 'Schließen',
  },
}

export function getTranslation(key: string, locale: string): string {
  const validLocale = locale === 'hr' || locale === 'en' || locale === 'de' ? locale : 'hr'
  return translations[key]?.[validLocale] || translations[key]?.hr || key
}
