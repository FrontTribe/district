export type TenantVisualTheme = 'default' | 'boutique'

/**
 * Maps tenant subdomain to frontend visual theme.
 * Extend when new tenant-specific design systems are added.
 */
export function getTenantVisualTheme(
  subdomain: string | null | undefined,
): TenantVisualTheme {
  if (subdomain === 'boutique') return 'boutique'
  return 'default'
}
