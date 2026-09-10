/**
 * Lug'at sxemasi en.json dan olingan — 12 ta til fayli bir xil tuzilishga ega
 * (i18n/dictionaries dagi barcha fayllar kalitlari tekshirilgan).
 */

export type NamedItem = { name: string; description: string };
export type TitledItem = { title: string; description: string };

export type ProductKey =
  // Kompaniya profilidagi 6 ta asosiy yo'nalish
  | 'driedApricots'
  | 'raisins'
  | 'prunes'
  | 'walnuts'
  | 'peanuts'
  | 'mungBeans'
  // Eng ko'p sotiladigan qolgan mahsulotlar
  | 'beans'
  | 'apricotKernels'
  | 'driedPeppers'
  | 'driedMelon'
  | 'compoteMix'
  | 'sourCherries'
  | 'driedApples';

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { home: string; about: string; products: string; contact: string };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  strengths: {
    sectionTitle: string;
    sectionSubtitle: string;
    quality: TitledItem;
    fresh: TitledItem;
    delivery: TitledItem;
    privateLabel: TitledItem;
  };
  products: {
    sectionTitle: string;
    /** Bosh sahifadagi tanlangan mahsulotlar sarlavhasi */
    sectionSubtitle: string;
    /** /products — to'liq katalog sarlavhasi */
    allSubtitle: string;
    priceNote: string;
    viewAll: string;
    learnMore: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchClear: string;
    noResults: string;
  } & Record<ProductKey, NamedItem>;
  stats: {
    products: string;
    capacity: string;
    countries: string;
    experience: string;
    productsValue: string;
    capacityValue: string;
    countriesValue: string;
    experienceValue: string;
  };
  certification: {
    sectionTitle: string;
    sectionSubtitle: string;
    gaccTitle: string;
    gaccBody: string;
    chinaRegLabel: string;
    foreignRegLabel: string;
    coveredLabel: string;
    coveredNote: string;
  };
  /** Rahbariyat bo'limi — ismlar lib/contacts.ts da, bu yerda faqat lavozimlar */
  team: {
    eyebrow: string;
    title: string;
    subtitle: string;
    roles: { founder: string; shuhratjon: string; hojiakbar: string };
  };
  cta: { title: string; subtitle: string; button: string };
  about: {
    heroTitle: string;
    story: { title: string; p1: string; p2: string };
    principles: { title: string; items: TitledItem[] };
  };
  contact: {
    heroTitle: string;
    heroSubtitle: string;
    form: {
      title: string;
      name: string;
      phone: string;
      phoneHint: string;
      country: string;
      countrySearch: string;
      countryNoResults: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      optional: string;
      emailRequired: string;
      product: string;
      productAny: string;
      sent: string;
    };
    info: {
      title: string;
      address: string;
      addressLabel: string;
      email: string;
      emailLabel: string;
      hours: string;
      hoursLabel: string;
      viewOnMap: string;
    };
  };
  footer: {
    description: string;
    quickLinks: string;
    ourProducts: string;
    contactUs: string;
    followUs: string;
    rights: string;
    /** "Saytni ishlab chiqdi" — 1is4me havolasidan oldingi matn */
    madeBy: string;
  };
  common: { loading: string };
  landing: { scroll: string };
  productPage: ProductPage;
};

/** Alohida mahsulot sahifasining matnlari. */
export type ProductPage = {
  labels: {
    catalog: string;
    allProducts: string;
    otherProducts: string;
    varieties: string;
    varietiesSub: string;
    specifications: string;
    specificationsSub: string;
    benefits: string;
    requestQuote: string;
    calibre: string;
    moisture: string;
    packaging: string;
    shelfLife: string;
    storage: string;
    hsCode: string;
    origin: string;
    originValue: string;
    specNote: string;
  };
  items: Record<ProductKey, ProductPageItem>;
};

export type ProductPageItem = {
  /** Hero ostidagi qisqa shior */
  tagline: string;
  /** Ikki-uch jumlalik kirish */
  intro: string;
  benefits: { title: string; text: string }[];
  /** Nav kaliti -> nomi (lib/products.ts dagi kalitlarga mos). Navsiz mahsulotlarda bo'sh. */
  varieties: Record<string, string>;
};
