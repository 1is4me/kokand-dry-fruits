import type { MetadataRoute } from 'next';
import { defaultLocale, htmlLang, locales, type Locale } from '@/i18n/config';
import { PRODUCTS } from '@/lib/products';
import { absolute } from '@/lib/site';

/**
 * /sitemap.xml — 12 til × 15 sahifa = 180 ta URL.
 *
 * Har bir yozuv o'zining boshqa tillardagi variantlarini xreflang orqali
 * ko'rsatadi: Google shunda 12 ta nusxani dublikat deb emas, bitta sahifaning
 * tarjimalari deb qabul qiladi va foydalanuvchiga o'z tilidagisini beradi.
 * x-default — tili mos kelmaganlarga ko'rsatiladigan sahifa (en).
 */
type Route = {
  path: (lang: Locale) => string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

const ROUTES: Route[] = [
  { path: (l) => `/${l}`, priority: 1, changeFrequency: 'weekly' },
  { path: (l) => `/${l}/products`, priority: 0.9, changeFrequency: 'weekly' },
  ...PRODUCTS.map(
    (product): Route => ({
      path: (l) => `/${l}/products/${product.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    }),
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    locales.map((lang) => ({
      url: absolute(route.path(lang)),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          // Kalit — to'liq BCP-47 teg (zh emas, zh-Hans).
          ...Object.fromEntries(
            locales.map((l) => [htmlLang[l], absolute(route.path(l))]),
          ),
          'x-default': absolute(route.path(defaultLocale)),
        },
      },
    })),
  );
}
