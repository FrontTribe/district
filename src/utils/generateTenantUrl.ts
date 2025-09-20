/**
 * Generates tenant URL based on environment and tenant subdomain
 * @param subdomain - The tenant subdomain (e.g., 'boutique', 'concept-bar')
 * @returns The complete URL for the tenant
 */
export function generateTenantUrl(subdomain: string): string {
  // Check for local development first (both client and server)
  const isLocalDev =
    (typeof window !== 'undefined' &&
      (window.location.hostname.includes('.test') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')) ||
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'

  if (isLocalDev) {
    return `http://${subdomain}.test:3000`
  }

  // Check for development environment
  const isDev =
    (typeof window !== 'undefined' && window.location.hostname.includes('.dev.')) ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'

  if (isDev) {
    return `https://${subdomain}.dev.district.hr`
  }

  // Default to production
  return `https://${subdomain}.district.hr`
}

/**
 * Gets the current environment type
 * @returns 'local' | 'dev' | 'prod'
 */
export function getEnvironment(): 'local' | 'dev' | 'prod' {
  // Check for local development first
  const isLocalDev =
    (typeof window !== 'undefined' &&
      (window.location.hostname.includes('.test') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')) ||
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'

  if (isLocalDev) {
    return 'local'
  }

  // Check for development environment
  const isDev =
    (typeof window !== 'undefined' && window.location.hostname.includes('.dev.')) ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'

  if (isDev) {
    return 'dev'
  }

  return 'prod'
}
