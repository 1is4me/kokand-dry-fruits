import type { MetadataRoute } from 'next';
import { SITE_URL, absolute } from '@/lib/site';

/**
 * /robots.txt — Next.js buni build vaqtida statik fayl qilib chiqaradi.
 *
 * DIQQAT: middleware matcher'i nuqtali yo'llarni chetlab o'tishi shart,
 * aks holda /robots.txt til prefiksiga (307 -> /en/robots.txt) yo'naltiriladi
 * va Google uni umuman o'qiy olmaydi.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // API yo'llari indeksga tushmasin — foydali kontent emas.
        disallow: ['/api/'],
      },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: SITE_URL,
  };
}
