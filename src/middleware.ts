// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OPERATOR_FAVICON_MAP: Record<string, string> = {
  'hms.adilla.com.sa': 'adilla',
  'hms.daleelalzowar.sa': 'daleel',
  'localhost:3000': 'default'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/favicon.ico' || pathname.startsWith('/favicon-') || pathname === '/apple-touch-icon.png') {
    const host = request.headers.get('host') || 'localhost:3000'
    const operator = OPERATOR_FAVICON_MAP[host] || 'default'

    // Rewrite to operator-specific favicon
    const url = request.nextUrl.clone()
    url.pathname = `/favicons/${operator}${pathname}`

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/favicon.ico', '/favicon-16x16.png', '/favicon-32x32.png', '/apple-touch-icon.png']
}
