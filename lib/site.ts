/**
 * Saytning kanonik manzili — bitta joyda.
 *
 * Prod: https://www.kdryfruits.com (www bilan; apex shunga yo'naltiriladi).
 * Vercel'da NEXT_PUBLIC_SITE_URL o'rnatiladi, lokalda .env dan olinadi.
 * Oxiridagi "/" olib tashlanadi — absolute() ni ikki marta slash qilmasin.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kdryfruits.com'
).replace(/\/+$/, '');

/** Nisbiy yo'ldan to'liq URL yasaydi — sitemap va JSON-LD uchun majburiy. */
export const absolute = (path: string): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
