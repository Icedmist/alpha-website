import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Detect subdomain vs root domain
  const isAcademySubdomain = host.startsWith('academy.');

  console.log('Middleware Request:', {
    host,
    pathname: url.pathname,
    isAcademySubdomain,
  });

  if (!isAcademySubdomain) {
    // Main domain context: redirect academy requests to subdomain
    if (url.pathname === '/academy') {
      return new NextResponse(null, {
        status: 307,
        headers: {
          'Location': 'http://academy.localhost:3000/',
        },
      });
    }
    if (url.pathname.startsWith('/academy/dashboard')) {
      return new NextResponse(null, {
        status: 307,
        headers: {
          'Location': 'http://academy.localhost:3000/dashboard',
        },
      });
    }
  } else {
    // Academy subdomain context
    if (url.pathname === '/academy') {
      return new NextResponse(null, {
        status: 307,
        headers: {
          'Location': 'http://academy.localhost:3000/',
        },
      });
    }
    if (url.pathname.startsWith('/academy/dashboard')) {
      return new NextResponse(null, {
        status: 307,
        headers: {
          'Location': 'http://academy.localhost:3000/dashboard',
        },
      });
    }

    // Redirect standard main site routes back to main domain
    const mainSiteRoutes = ['/about', '/talent-cloud', '/roadmap', '/contact', '/apply'];
    if (mainSiteRoutes.some((route) => url.pathname.startsWith(route))) {
      return new NextResponse(null, {
        status: 307,
        headers: {
          'Location': `http://localhost:3000${url.pathname}${url.search}`,
        },
      });
    }
  }

  return NextResponse.next();
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
