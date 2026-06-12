import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Define your domain contexts
  const isProdAcademy = hostname === 'academy.alphaspark.icedmist.tech'
  const isLocalAcademy = hostname.startsWith('academy.localhost')
  const isAcademyContext = isProdAcademy || isLocalAcademy

  const isProdMain = hostname === 'alphaspark.icedmist.tech'
  const isLocalMain = hostname === 'localhost:3000' || hostname.startsWith('127.0.0.1')
  const isMainContext = isProdMain || isLocalMain

  // 1. If on Main Site context, but trying to hit academy paths -> Redirect to Academy Subdomain
  if (isMainContext && (url.pathname.startsWith('/academy') || url.pathname.startsWith('/dashboard'))) {
    const targetHost = isLocalMain ? 'academy.localhost:3000' : 'academy.alphaspark.icedmist.tech'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    return NextResponse.redirect(`${protocol}://${targetHost}${url.pathname}${url.search}`)
  }

  // 2. If on Academy context, but trying to hit public main site paths -> Redirect to Main Site
  const publicMainPaths = ['/about', '/roadmap', '/apply', '/talent-cloud', '/contact']
  if (isAcademyContext && publicMainPaths.some(path => url.pathname.startsWith(path))) {
    const targetHost = isLocalAcademy ? 'localhost:3000' : 'alphaspark.icedmist.tech'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    return NextResponse.redirect(`${protocol}://${targetHost}${url.pathname}${url.search}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api (API routes)
     * 2. _next/static (static files)
     * 3. _next/image (image optimization files)
     * 4. assets (public logo assets/images)
     * 5. favicon.ico & logo files
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
};
