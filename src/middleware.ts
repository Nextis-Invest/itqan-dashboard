import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // First, handle i18n
  const response = intlMiddleware(request);
  
  // Add pathname and full URL to headers for server components to access
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  response.headers.set('x-pathname', pathname);
  response.headers.set('x-url', pathname + search);
  
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files (icons, images, etc.)
    '/((?!api|_next|icons|.*\\..*).*)',
  ],
};
