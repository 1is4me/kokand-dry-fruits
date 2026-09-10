import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, type Locale } from './i18n/config';

/** Accept-Language sarlavhasidan qo'llab-quvvatlanadigan eng mos tilni tanlaydi. */
function pickLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    const match = locales.find((locale) => locale === base || locale === tag);
    if (match) return match;
    // "zh-cn", "zh-hans" kabi teglar zh ga tushadi
    if (base === 'zh') return 'zh';
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /*
   * Statik fayllar, API yo'llari va Next ichki yo'llari chetlab o'tiladi.
   * `.*\\..*` — nomida nuqta bor har qanday yo'l (robots.txt, sitemap.xml,
   * favicon.ico, rasm va shriftlar). Busiz /robots.txt til prefiksiga
   * yo'naltirilardi va Google uni o'qiy olmasdi. Til yo'llarida nuqta yo'q,
   * shuning uchun ular baribir shu matcher'ga tushadi.
   */
  matcher: ['/((?!api|_next|assets|.*\\..*).*)'],
};
