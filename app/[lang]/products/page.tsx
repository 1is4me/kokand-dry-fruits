import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cta from '@/components/Cta';
import ProductCatalog from '@/components/ProductCatalog';
import { getDictionary } from '@/i18n/get-dictionary';
import { defaultLocale, htmlLang, isLocale, locales } from '@/i18n/config';
import { PRODUCTS } from '@/lib/products';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: `${dict.products.sectionTitle} — Kokand Dry Fruits`,
    description: dict.products.sectionSubtitle,
    alternates: {
      canonical: `/${lang}/products`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [htmlLang[l], `/${l}/products`]),
        ),
        'x-default': `/${defaultLocale}/products`,
      },
    },
  };
}

export default async function ProductsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  // Qidiruv klientda ishlaydi, shuning uchun ro'yxat tayyor holda uzatiladi.
  const items = PRODUCTS.map(({ key, slug, image }) => ({
    slug,
    image,
    name: dict.products[key].name,
    description: dict.products[key].description,
  }));

  return (
    <>
      <Header
        lang={lang}
        t={{
          products: dict.nav.products,
          about: dict.nav.about,
          delivery: dict.strengths.delivery.title,
          contact: dict.nav.contact,
          menu: dict.nav.home,
        }}
        homeHref={`/${lang}`}
        pathAfterLocale="/products"
        solid
      />

      <section className="pindex">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow reveal-up">{dict.products.sectionTitle}</span>
            <h1 className="h2 reveal-up">{dict.products.allSubtitle}</h1>
          </div>

          <ProductCatalog
            items={items}
            lang={lang}
            t={{
              searchLabel: dict.products.searchLabel,
              searchPlaceholder: dict.products.searchPlaceholder,
              noResults: dict.products.noResults,
              learnMore: dict.products.learnMore,
              clear: dict.products.searchClear,
            }}
          />
        </div>
      </section>

      <Cta dict={dict} lang={lang} />
      <Footer dict={dict} homeHref={`/${lang}`} />
    </>
  );
}
