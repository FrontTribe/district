import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const host = request.headers.get('host')
  const prodDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'new.district.hr'
  const devDomain = process.env.NEXT_PUBLIC_DEV_DOMAIN || 'dev.district.hr'
  const defaultTenant = 'district'

  if (!host) {
    return NextResponse.next()
  }

  const cleanHost = host.replace('www.', '').split(':')[0]
  console.log(`[Middleware] Clean host: ${cleanHost}`)

  let subdomain = ''

  // --- Local development ---
  if (cleanHost === 'localhost') {
    subdomain = defaultTenant
  } else if (cleanHost.includes('.test') || cleanHost.includes('localhost')) {
    const parts = cleanHost.split('.')
    if (parts.length >= 2) {
      subdomain = parts[0]
    }
  }

  // --- Production ---
  else if (cleanHost === prodDomain) {
    subdomain = defaultTenant
  } else if (
    cleanHost.endsWith('.district.hr') &&
    !cleanHost.startsWith('dev.') &&
    cleanHost !== 'district.hr'
  ) {
    // e.g. hotels.district.hr → hotels
    const parts = cleanHost.split('.')
    if (parts.length >= 3) {
      subdomain = parts[0]
    }
  }

  // --- Development ---
  else if (cleanHost === devDomain) {
    subdomain = defaultTenant
  } else if (cleanHost.endsWith(`.${devDomain}`)) {
    // e.g. hotels.dev.district.hr → hotels
    const subdomainEndIndex = cleanHost.length - devDomain.length - 1
    subdomain = cleanHost.slice(0, subdomainEndIndex)
  }

  if (subdomain) {
    console.log(`[Middleware] Derived Subdomain: ${subdomain}`)
    headers.set('x-tenant-subdomain', subdomain)
  } else {
    console.log(`[Middleware] No subdomain detected for host: ${cleanHost}`)
  }

  return NextResponse.next({
    request: { headers },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|media|api).*)'],
}
