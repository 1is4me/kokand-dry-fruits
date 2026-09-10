import { notFound } from 'next/navigation';
import Rails from '@/components/Rails';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Marquee from '@/components/Marquee';
import Production from '@/components/Production';
import Process from '@/components/Process';
import Products from '@/components/Products';
import Geo from '@/components/Geo';
import Certification from '@/components/Certification';
import Team from '@/components/Team';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import { OrganizationSchema } from '@/components/StructuredData';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale } from '@/i18n/config';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <OrganizationSchema lang={lang} />
      <Rails scrollLabel={dict.landing.scroll} />
      <Header
        lang={lang}
        t={{
          products: dict.nav.products,
          about: dict.nav.about,
          delivery: dict.strengths.delivery.title,
          contact: dict.nav.contact,
          menu: dict.nav.home,
        }}
      />
      <Hero dict={dict} />
      <Intro dict={dict} />
      <Marquee dict={dict} />
      <Production dict={dict} />
      <Process dict={dict} />
      <Products dict={dict} lang={lang} />
      <Geo dict={dict} lang={lang} />
      <Certification dict={dict} />
      <Team dict={dict} />
      <Cta dict={dict} lang={lang} />
      <Footer dict={dict} />
    </>
  );
}
