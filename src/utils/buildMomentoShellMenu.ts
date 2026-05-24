import type { Menu } from '@/payload-types'
import type { MomentoShellMenuProps } from '@/components/momento-landing/MomentoLandingShell'

export function buildMomentoShellMenu(
  menu: Menu | null | undefined,
  locale: string,
): MomentoShellMenuProps | undefined {
  if (!menu) return undefined

  return {
    logoText: menu.logoText ?? 'Momento.',
    locale,
    menuItems:
      menu.menuItems?.map((item) => ({
        label: item.label,
        link: item.link,
        scrollTarget: item.scrollTarget || undefined,
        external: item.external || false,
      })) ?? [],
  }
}
