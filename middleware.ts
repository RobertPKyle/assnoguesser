import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow these paths without gating
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/content-warning') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/denied') ||
    pathname.match(/\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json)$/)
  ) {
    return NextResponse.next();
  }

  // Check consent cookie
  const hasConsent = req.cookies.get('content-ok')?.value === 'true';
  if (!hasConsent) {
    const url = req.nextUrl.clone();
    url.pathname = '/content-warning';
    url.search = `?returnTo=${encodeURIComponent(pathname + (search || ''))}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
