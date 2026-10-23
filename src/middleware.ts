import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/**
 * - Every localized request refreshes the NEXT_LOCALE cookie (next-intl), which is how the
 *   visitor's language is remembered across navigation and later visits.
 * - A bare "/" goes to the remembered locale if there is one, otherwise to the default (es).
 */
export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const saved = request.cookies.get('NEXT_LOCALE')?.value;
    if (saved && (routing.locales as readonly string[]).includes(saved)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${saved}`;
      return NextResponse.redirect(url);
    }
  }
  return handleI18nRouting(request);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, fonts, icons...).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
