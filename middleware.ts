import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files and API routes - allow through immediately
  const isStaticFile =
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot|avif|webp)$/i.test(pathname);
  const isApiRoute = pathname.startsWith('/api/');
  const isNextAsset = pathname.startsWith('/_next/');

  if (isStaticFile || isApiRoute || isNextAsset || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // BYPASS: Skip middleware for products showcase page
  if (pathname.includes('/products/products-showcase')) {
    console.log('🚫 [MIDDLEWARE] BYPASSED for products showcase page');
    return NextResponse.next();
  }

  // Update Supabase session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};