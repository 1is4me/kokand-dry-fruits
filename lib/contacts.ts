/** Aloqa ma'lumotlari — matnli qismlari lug'atdan, texnik qismlari shu yerdan. */
export const CONTACTS = {
  email: 'info@kokanddryfruits.uz',
  /** Google Maps'dagi tasdiqlangan joy kartochkasi (qidiruv havolasi emas). */
  mapsUrl:
    'https://www.google.com/maps/place/Kokand+Dry+Fruits/@40.3956076,70.7681325,17z/data=!3m1!4b1!4m6!3m5!1s0x38ba8d0041083a4b:0x5f2de8a58ace187d!8m2!3d40.3956076!4d70.7707128!16s%2Fg%2F11xkdbnglb',
};

/** WhatsApp raqami. */
export const WHATSAPP = '998910590011';
/** O'sha raqamning ko'rinadigan ko'rinishi. */
export const WHATSAPP_DISPLAY = '+998 91 059 00 11';

/**
 * Ijtimoiy tarmoqlar. href bo'sh bo'lsa — havola umuman chizilmaydi,
 * shuning uchun YouTube kanal manzili ma'lum bo'lgach shu yerga qo'yish kifoya.
 */
export const SOCIALS = [
  { label: 'Telegram', href: 'https://t.me/Kokand_Dry_Fruits_Bot' },
  { label: 'Instagram', href: 'https://www.instagram.com/kokand_dry_fruits/' },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP}` },
  // TODO: kanal manzili kelgach to'ldirilsin
  { label: 'YouTube', href: '' },
] as const;

/** Faqat manzili bor tarmoqlar — komponentlar shuni ishlatadi. */
export const ACTIVE_SOCIALS = SOCIALS.filter((s) => s.href !== '');

export type SocialLabel = (typeof SOCIALS)[number]['label'];

/**
 * Kompaniya rekvizitlari — kompaniya profilidan (2026-08-23) olingan.
 * Tilga bog'liq bo'lmagan qiymatlar, shuning uchun lug'atlarda takrorlanmaydi.
 */
export const COMPANY = {
  legalName: '“KOKAND DRY FRUITS” LLC',
  founder: 'Sodiqov Qahramonjon',
  team: ['Sodiqov Hojiakbar', 'Sodiqov Shuhratjon'],
  /** Yillik ishlab chiqarish quvvati, tonna */
  capacityTonnes: 250,
  /** Asosiy hajm shu uch mahsulotga to'g'ri keladi */
  mainVolume: ['prunes', 'mungBeans', 'driedApricots'] as const,
} as const;

/**
 * Oilaviy biznes rahbariyati. Ismlar — atoqli otlar, hamma tilda bir xil,
 * shuning uchun lug'atda emas shu yerda; lavozim nomi esa tarjima qilinadi
 * (dict.team.roles[key]).
 */
export const TEAM = [
  { key: 'founder', name: 'Qahramonjon Sodiqov', photo: '/assets/img/team/qahramonjon.jpg' },
  { key: 'shuhratjon', name: 'Shuhratjon Sodiqov', photo: '/assets/img/team/shuhratjon.jpg' },
  { key: 'hojiakbar', name: 'Hojiakbar Sodiqov', photo: '/assets/img/team/hojiakbar.jpg' },
] as const;

export type TeamKey = (typeof TEAM)[number]['key'];

/**
 * GACC (Xitoy Bojxona Bosh Boshqarmasi) ro'yxati.
 * Qamrov faqat quyidagi HS kodlar bilan cheklangan — boshqa mahsulotlar
 * uchun alohida ro'yxatga olish talab qilinadi.
 */
export const GACC = {
  chinaRegNo: 'CUZB13012509280167',
  foreignRegNo: '2837474',
  coveredHsCodes: ['0813 10', '0813 20'],
  /** Ro'yxat qamrab olgan mahsulot kalitlari */
  coveredProducts: ['driedApricots', 'prunes', 'sourCherries'] as const,
} as const;

/**
 * Eksport bozorlari — davlat kodlari.
 * Nomlari Intl.DisplayNames orqali har bir tilda avtomatik chiqadi,
 * shuning uchun lug'atlarda takrorlanmaydi.
 */
export const EXPORT_REGIONS = ['CN', 'TR', 'RU'] as const;
