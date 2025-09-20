import { useMemo } from 'react'
import { generateTenantUrl } from '@/utils/generateTenantUrl'

/**
 * Hook to generate tenant URLs
 * @param subdomain - The tenant subdomain
 * @returns The generated URL for the tenant
 */
export function useTenantUrl(subdomain: string): string {
  return useMemo(() => generateTenantUrl(subdomain), [subdomain])
}

/**
 * Hook to get current environment
 * @returns Current environment type
 */
export function useEnvironment(): 'local' | 'dev' | 'prod' {
  return useMemo(() => {
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
  }, [])
}
