import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductHero from '@/components/ProductHero';
import ProductBenefits from '@/components/ProductBenefits';
import ProductVarieties from '@/components/ProductVarieties';
import ProductSpecs from '@/components/ProductSpecs';
import OtherProducts from '@/components/OtherProducts';
import Cta from '@/components/Cta';
import { getDictionary } from '@/i18n/get-dictionary';
import { defaultLocale, htmlLang, isLocale, locales } from '@/i18n/config';
import { PRODUCTS, getProduct } from '@/lib/products';
import { ProductSchema } from '@/components/StructuredData';

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    PRODUCTS.map((product) => ({ lang, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(lang) || !product) return {};

  const dict = await getDictionary(lang);
  const name = dict.products[product.key].name;
  const item = dict.productPage.items[product.key];

  return {
    title: `${name} — Kokand Dry Fruits`,
    description: item.intro,
    alternates: {
      canonical: `/${lang}/products/${slug}`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [htmlLang[l], `/${l}/products/${slug}`]),
        ),
        'x-default': `/${defaultLocale}/products/${slug}`,
      },
    },
    openGraph: {
      title: `${name} — Kokand Dry Fruits`,
      description: item.intro,
      images: [product.poster ?? product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(lang) || !product) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <ProductSchema
        lang={lang}
        slug={slug}
        name={dict.products[product.key].name}
        description={dict.productPage.items[product.key].intro}
        image={product.poster ?? product.image}
        productsLabel={dict.nav.products}
      />
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
        pathAfterLocale={`/products/${slug}`}
      />
      <ProductHero product={product} dict={dict} lang={lang} />
      <ProductBenefits product={product} dict={dict} />
      <ProductVarieties product={product} dict={dict} />
      <ProductSpecs product={product} dict={dict} />
      <OtherProducts currentSlug={slug} dict={dict} lang={lang} />
      <Cta dict={dict} lang={lang} defaultProduct={slug} />
      <Footer dict={dict} homeHref={`/${lang}`} />
    </>
  );
}
