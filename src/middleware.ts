import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const host = request.headers.get('host')
  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'district.hr'
  const devDomain =
    process.env.NEXT_PUBLIC_DEV_ROOT_DOMAIN ||
    (mainDomain ? `dev.${mainDomain}` : '')
  const defaultTenant = 'district'

  if (!host) {
    return NextResponse.next()
  }

  const cleanHost = host.replace('www.', '').split(':')[0]
  let subdomain = ''

  // Local development: localhost or *.test
  if (cleanHost === 'localhost') {
    subdomain = defaultTenant
  } else if (cleanHost.endsWith('.test') || cleanHost.includes('localhost')) {
    const parts = cleanHost.split('.')
    if (parts.length >= 2) {
      subdomain = parts[0]
    }
  }
  // Development shared domain: *.dev.{mainDomain}
  else if (devDomain && (cleanHost === devDomain || cleanHost.endsWith(`.${devDomain}`))) {
    if (cleanHost === devDomain) {
      subdomain = defaultTenant
    } else {
      const subdomainEndIndex = cleanHost.length - devDomain.length - 1
      subdomain = cleanHost.slice(0, subdomainEndIndex)
    }
  }
  // Production: *.{mainDomain}
  else if (mainDomain && (cleanHost === mainDomain || cleanHost.endsWith(`.${mainDomain}`))) {
    if (cleanHost === mainDomain) {
      subdomain = defaultTenant
    } else {
      // e.g. xyz.district.hr => xyz
      const subdomainEndIndex = cleanHost.length - mainDomain.length - 1
      subdomain = cleanHost.slice(0, subdomainEndIndex)
    }
  }

  if (subdomain) {
    headers.set('x-tenant-subdomain', subdomain)
  }

  return NextResponse.next({
    request: { headers },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|media|api).*)'],
}
