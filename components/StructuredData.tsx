import {
  ACTIVE_SOCIALS,
  CONTACTS,
  COMPANY,
  EXPORT_REGIONS,
  GACC,
  WHATSAPP,
} from '@/lib/contacts';
import { defaultLocale, htmlLang, locales, type Locale } from '@/i18n/config';
import { absolute } from '@/lib/site';

/**
 * Schema.org JSON-LD.
 *
 * Nima uchun kerak: "kokand dry fruits" — brend so'rovi. Google bunda sahifa
 * matnini emas, tanigan *tashkilotni* qidiradi. Organization yozuvi sayt bilan
 * kompaniyani bog'laydi (nomi, manzili, logotipi, ijtimoiy tarmoqlari), shuning
 * uchun brend so'roviga aynan shu domen chiqadi va o'ng tomonda knowledge panel
 * paydo bo'lish imkoniyati tug'iladi.
 *
 * @id lar barqaror: boshqa yozuvlar shu langar orqali bir-biriga ulanadi.
 */

const ORG_ID = absolute('/#organization');
const SITE_ID = absolute('/#website');

/** Brendning qidiruvda uchraydigan boshqa yozilishlari. */
const ALTERNATE_NAMES = [
  'KOKAND DRY FRUITS LLC',
  'Kokand Dryfruits',
  'Qoqon Quruq Mevalar',
  "Qo'qon quruq mevalari",
  'Коканд Сухофрукты',
];

const jsonLd = (data: unknown) => (
  <script
    type="application/ld+json"
    // Ma'lumot to'liq bizniki (foydalanuvchi kiritmasi emas), shuning uchun xavfsiz.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Kokand Dry Fruits',
  alternateName: ALTERNATE_NAMES,
  legalName: COMPANY.legalName.replace(/[“”]/g, ''),
  url: absolute(`/${defaultLocale}`),
  logo: {
    '@type': 'ImageObject',
    url: absolute('/assets/brand/logo-emblem.png'),
  },
  image: absolute('/assets/brand/logo-horizontal.png'),
  foundingDate: '2020',
  founder: { '@type': 'Person', name: 'Qahramonjon Sodiqov' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mustaqillik St. 36, Kichik Oqmasjid MFY',
    addressLocality: 'Kokand',
    addressRegion: 'Fergana Region',
    addressCountry: 'UZ',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      // Statsionar raqam saytdan olib tashlandi — ommaviy raqam shu bittasi.
      telephone: `+${WHATSAPP}`,
      email: CONTACTS.email,
      contactType: 'sales',
      areaServed: [...EXPORT_REGIONS],
      availableLanguage: locales.map((l) => htmlLang[l]),
    },
  ],
  // sameAs — Google shu havolalar orqali brendni tarmoqlardagi profillari bilan
  // bir shaxs deb tanidi. Xarita kartochkasi ham shu ro'yxatda.
  sameAs: [...ACTIVE_SOCIALS.map((s) => s.href), CONTACTS.mapsUrl],
  areaServed: [...EXPORT_REGIONS],
  knowsAbout: [
    'dried apricots',
    'raisins',
    'prunes',
    'walnuts',
    'peanuts',
    'mung beans',
    'dried fruit export',
  ],
  identifier: {
    '@type': 'PropertyValue',
    name: 'GACC China registration',
    value: GACC.chinaRegNo,
  },
};

const website = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: absolute('/'),
  name: 'Kokand Dry Fruits',
  publisher: { '@id': ORG_ID },
  inLanguage: locales.map((l) => htmlLang[l]),
};

/** Bosh sahifada bir marta chiqadi — tashkilot va sayt yozuvlari. */
export function OrganizationSchema({ lang }: { lang: Locale }) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      { ...website, url: absolute(`/${lang}`) },
      {
        '@type': 'WebPage',
        '@id': absolute(`/${lang}#webpage`),
        url: absolute(`/${lang}`),
        isPartOf: { '@id': SITE_ID },
        about: { '@id': ORG_ID },
        inLanguage: htmlLang[lang],
      },
    ],
  });
}

/** Mahsulot sahifasida — Product yozuvi va qidiruvda ko'rinadigan breadcrumb. */
export function ProductSchema({
  lang,
  slug,
  name,
  description,
  image,
  productsLabel,
}: {
  lang: Locale;
  slug: string;
  name: string;
  description: string;
  image: string;
  productsLabel: string;
}) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': absolute(`/${lang}/products/${slug}#product`),
        name,
        description,
        image: absolute(image),
        brand: { '@id': ORG_ID },
        manufacturer: { '@id': ORG_ID },
        countryOfOrigin: { '@type': 'Country', name: 'Uzbekistan' },
        url: absolute(`/${lang}/products/${slug}`),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Kokand Dry Fruits',
            item: absolute(`/${lang}`),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: productsLabel,
            item: absolute(`/${lang}/products`),
          },
          { '@type': 'ListItem', position: 3, name },
        ],
      },
    ],
  });
}
