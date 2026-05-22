export function resolveMediaUrl(media: unknown): string {
  if (typeof media === 'string') return media
  if (media && typeof media === 'object' && 'url' in media) {
    const url = (media as { url?: string | null }).url
    return url ?? ''
  }
  return ''
}

/** e.g. "Tražiš posao?" → { lead: "Tražiš", accent: "posao?" } */
export function splitCareerHeading(title: string): { lead: string; accent: string } {
  const trimmed = title.trim()
  const qIndex = trimmed.indexOf('?')
  if (qIndex < 0) return { lead: trimmed, accent: '' }

  const beforeQuestion = trimmed.slice(0, qIndex).trim()
  const lastSpace = beforeQuestion.lastIndexOf(' ')
  if (lastSpace < 0) {
    return { lead: '', accent: trimmed }
  }

  return {
    lead: beforeQuestion.slice(0, lastSpace).trim(),
    accent: `${beforeQuestion.slice(lastSpace + 1).trim()}?`,
  }
}

export function splitHeroHeading(heading: string): { line1: string; line2: string } {
  const byIdx = heading.toLowerCase().indexOf(' by ')
  if (byIdx > 0) {
    return {
      line1: heading.slice(0, byIdx).trim(),
      line2: heading.slice(byIdx + 1).trim(),
    }
  }
  const parts = heading.trim().split(/\s+/)
  if (parts.length <= 1) return { line1: heading, line2: '' }
  return { line1: parts[0]!, line2: parts.slice(1).join(' ') }
}

const OFFERS_RE = /posebna|special|sonderangebot/i

export function isOffersCategory(name: string): boolean {
  return OFFERS_RE.test(name)
}

const DAY_LABELS: Record<string, Record<string, string>> = {
  hr: {
    monday: 'Ponedjeljak',
    tuesday: 'Utorak',
    wednesday: 'Srijeda',
    thursday: 'Četvrtak',
    friday: 'Petak',
    saturday: 'Subota',
    sunday: 'Nedjelja',
  },
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
  de: {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
  },
}

export function dayLabel(day: string, locale = 'hr'): string {
  return DAY_LABELS[locale]?.[day] ?? DAY_LABELS.hr?.[day] ?? day
}
