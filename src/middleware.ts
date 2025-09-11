import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const host = request.headers.get('host')

  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN

  if (!host) return NextResponse.next()

  const cleanHost = host.replace('www.', '').split(':')[0]
  console.log(`[Middleware] Clean host: ${cleanHost}`)

  let subdomain = ''

  // 1. Local development
  if (cleanHost.includes('.test') || cleanHost.includes('localhost')) {
    const parts = cleanHost.split('.')
    if (parts.length >= 2) subdomain = parts[0]
  }
  // 2. Dev environment (dev subdomain)
  else if (
    cleanHost.startsWith('dev.') &&
    mainDomain &&
    cleanHost.endsWith(mainDomain.replace(/^www\./, ''))
  ) {
    const subdomainEndIndex = cleanHost.length - mainDomain.length - 1
    subdomain = cleanHost.slice(0, subdomainEndIndex) // 'dev'
  }
  // 3. Production subdomains
  else if (mainDomain) {
    if (cleanHost === mainDomain) {
      subdomain = 'district'
    } else if (cleanHost.endsWith(`.${mainDomain}`)) {
      const subdomainEndIndex = cleanHost.length - mainDomain.length - 1
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
    request: { headers },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|media).*)'],
}
