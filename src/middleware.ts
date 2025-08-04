import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const host = request.headers.get('host')
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN

  if (!host || !rootDomain) {
    return NextResponse.next()
  }

  const cleanHost = host.replace('www.', '').split(':')[0]

  let subdomain = ''

  if (cleanHost === rootDomain) {
    subdomain = 'district'
  } else {
    subdomain = cleanHost.replace(`.${rootDomain}`, '')
  }

  console.log(`[Middleware] Production Derived Subdomain: ${subdomain}`)

  headers.set('x-tenant-subdomain', subdomain)

  return NextResponse.next({
    request: {
      headers: headers,
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|media).*)'],
}
