export type TenantVisualTheme = 'default' | 'boutique' | 'momento'

/**
 * Maps tenant subdomain to frontend visual theme.
 * Extend when new tenant-specific design systems are added.
 */
export function getTenantVisualTheme(
  subdomain: string | null | undefined,
): TenantVisualTheme {
  if (subdomain === 'boutique') return 'boutique'
  if (subdomain === 'momento') return 'momento'
  return 'default'
}

export function isMomentoTheme(theme: TenantVisualTheme): boolean {
  return theme === 'momento'
}
