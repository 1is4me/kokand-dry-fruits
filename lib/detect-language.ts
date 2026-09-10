import { isLocale, type Locale } from '@/i18n/config';

/**
 * Xabar qaysi tilda yozilganini aniqlaydi.
 *
 * Kutubxona ishlatilmaydi — yozuv (script) tekshiruvi 12 tilimiz uchun yetarli
 * va u tarjima kutubxonalaridan farqli o'laroq hech qachon xato "ishonchli"
 * javob bermaydi. Lotin yozuvi ko'p tilga umumiy, shuning uchun u yerda
 * Telegram bergan `language_code` ga suyanamiz.
 *
 * Manba (`source`) egaga ham ko'rsatiladi: "tanlagan" — mijozning o'zi
 * tanlagani, "yozuv" — matndan aniqlangani, "telegram" — ilova tili.
 * Shu tufayli egasi javob yozishdan oldin qanchalik ishonish mumkinligini
 * ko'rib turadi.
 */

export type DetectionSource = 'chosen' | 'script' | 'telegram' | 'default';

export type Detection = {
  locale: Locale;
  source: DetectionSource;
};

/**
 * Tartib muhim: kana (ja) Han (zh) dan oldin tekshiriladi, chunki yapon
 * matnida kanji ham bo'ladi — teskari tartibda yapon xitoy deb o'qilardi.
 */
const SCRIPTS: [RegExp, Locale][] = [
  [/[぀-ゟ゠-ヿ]/, 'ja'], // hiragana / katakana
  [/[가-힯ᄀ-ᇿ]/, 'ko'], // hangul
  [/[一-鿿]/, 'zh'], // han (kana yo'q -> xitoycha)
  [/[؀-ۿݐ-ݿࢠ-ࣿ]/, 'ar'], // arab
  [/[ऀ-ॿ]/, 'hi'], // devanagari
  [/[Ѐ-ӿ]/, 'ru'], // kirill
];

/** Lotin yozuvidagi o'zbekcha belgilar — "o‘", "g‘" va tez-tez uchraydigan so'zlar. */
const UZBEK_HINTS =
  /(?:[o'g'][‘’']|\b(?:kerak|narx|qancha|mahsulot|salom|rahmat|bo['‘’]ladi|qanday|menga|yuboring)\b)/i;

/** Turkcha maxsus harflar — lotin yozuvida turkchani ajratishga yordam beradi. */
const TURKISH_HINTS = /[ğışĞİŞ]|\b(?:merhaba|fiyat|ürün|teşekkür|nasıl|lütfen)\b/i;

export function detectLanguage(
  text: string | undefined,
  telegramLangCode?: string,
  chosen?: Locale,
): Detection {
  // Mijozning o'zi tanlagani hamma narsadan ustun.
  if (chosen) return { locale: chosen, source: 'chosen' };

  const body = (text ?? '').trim();

  if (body) {
    for (const [pattern, locale] of SCRIPTS) {
      if (pattern.test(body)) return { locale, source: 'script' };
    }
    // Lotin yozuvi: bir nechta tilga tegishli, shuning uchun faqat kuchli
    // belgilar bo'lgandagina qaror qilamiz.
    if (UZBEK_HINTS.test(body)) return { locale: 'uz', source: 'script' };
    if (TURKISH_HINTS.test(body)) return { locale: 'tr', source: 'script' };
  }

  // Telegram ilovasining tili: "ru", "en-GB", "zh-hans" kabi keladi.
  if (telegramLangCode) {
    const base = telegramLangCode.toLowerCase().split('-')[0];
    if (isLocale(base)) return { locale: base, source: 'telegram' };
    if (base === 'zh') return { locale: 'zh', source: 'telegram' };
  }

  return { locale: 'en', source: 'default' };
}
