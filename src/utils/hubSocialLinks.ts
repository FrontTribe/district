import type { Footer } from '@/payload-types'

export type HubSocialLink = { label: string; href: string }

/**
 * Build Instagram + Facebook links for hub landing (bottom bar + mobile menu),
 * from footer CMS. Missing entries use `#` like the static landing mock.
 */
export function buildHubSocialLinks(footer: Footer | null): HubSocialLink[] {
  const out: HubSocialLink[] = []
  const ig = footer?.rightContent?.contact?.instagram?.trim()
  if (ig) {
    const handle = ig.replace(/^@/, '')
    out.push({ label: 'Instagram', href: `https://www.instagram.com/${handle}/` })
  } else {
    out.push({ label: 'Instagram', href: '#' })
  }

  const bottomLinks = footer?.bottomContent?.links ?? []
  const fbRow = bottomLinks.find((row) => {
    const url = (row.url || '').toLowerCase()
    const text = (row.text || '').toLowerCase()
    return url.includes('facebook.com') || text.includes('facebook')
  })
  if (fbRow?.url) {
    out.push({ label: fbRow.text?.trim() || 'Facebook', href: fbRow.url })
  } else {
    out.push({ label: 'Facebook', href: '#' })
  }

  return out
}
