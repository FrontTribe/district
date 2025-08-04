import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const host = request.headers.get('host')

  const appDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  const tenantRootDomain = process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN

  if (!host) {
    return NextResponse.next()
  }

  const cleanHost = host.replace('www.', '').split(':')[0]
  console.log(`[Middleware] Clean host: ${cleanHost}`)

  let subdomain = ''

  // Handle local development with .test domains
  if (cleanHost.includes('.test')) {
    const parts = cleanHost.split('.')
    if (parts.length >= 2) {
      subdomain = parts[0]
    }
  }
  // Handle production domains
  else if (appDomain && tenantRootDomain) {
    if (cleanHost === appDomain) {
      subdomain = 'shifutit'
    } else if (cleanHost.endsWith(`.${tenantRootDomain}`)) {
      const subdomainEndIndex = cleanHost.length - tenantRootDomain.length - 1
      subdomain = cleanHost.slice(0, subdomainEndIndex)
    }
  }

  if (subdomain) {
    console.log(`[Middleware] Derived Subdomain: ${subdomain}`)
    headers.set('x-tenant-subdomain', subdomain)
  } else {
    console.log(`[Middleware] No subdomain detected for host: ${cleanHost}`)
  }

  return NextResponse.next({
    request: {
      headers: headers,
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|media).*)'],
}
