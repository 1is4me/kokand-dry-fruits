import { locales, localeFlag, localeNames, type Locale } from '@/i18n/config';

/**
 * Bot matnlari — saytning 12 tili bilan bir xil ro'yxat.
 *
 * Sayt lug'atlaridan (i18n/dictionaries) ayrim turadi: u yerdagi matnlar
 * sahifa uchun, bu yerdagilar suhbat uchun. Kalitlar oz — mijoz bot bilan
 * uzoq gaplashmaydi, u savolini yozadi va jamoa javob beradi.
 */

/** 'gb' -> 🇬🇧. Bayroq emojisi ikkita "regional indicator" harfidan yasaladi. */
export const flagEmoji = (countryCode: string): string =>
  countryCode
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

/** Tugma va sarlavhalarda ko'rinadigan yorliq: "🇷🇺 Русский". */
export const localeLabel = (locale: Locale): string =>
  `${flagEmoji(localeFlag[locale])} ${localeNames[locale]}`;

type BotStrings = {
  /** Til tanlangandan keyingi salom. */
  welcome: string;
  /** Mijozning xabari egalarga yetgach beriladigan tasdiq. */
  ack: string;
  /** Til o'zgartirilgani haqida qisqa tasdiq (callback popup uchun). */
  languageSet: string;
};

export const BOT_TEXT: Record<Locale, BotStrings> = {
  en: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nDried fruits, nuts and pulses from the Fergana Valley, Uzbekistan.\n\nTell us what you need — which product, what volume, and the destination country. Our team will reply right here.',
    ack: '✅ Thank you — your message reached our team. We will reply in this chat.',
    languageSet: 'Language set to English',
  },
  ru: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nСухофрукты, орехи и бобовые из Ферганской долины, Узбекистан.\n\nНапишите, что вам нужно — какой продукт, какой объём и страна назначения. Наша команда ответит здесь.',
    ack: '✅ Спасибо — ваше сообщение получено. Мы ответим в этом чате.',
    languageSet: 'Язык изменён на русский',
  },
  uz: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nFarg‘ona vodiysidan quruq meva, yong‘oq va dukkakli mahsulotlar.\n\nSavolingizni yozing — qaysi mahsulot, qancha hajm va qaysi davlatga kerak. Jamoamiz shu chatda javob beradi.',
    ack: '✅ Rahmat — xabaringiz jamoamizga yetib bordi. Shu chatda javob beramiz.',
    languageSet: 'Til o‘zbekchaga o‘zgartirildi',
  },
  ar: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nفواكه مجففة ومكسرات وبقوليات من وادي فرغانة، أوزبكستان.\n\nأخبرنا بما تحتاجه — أي منتج، وما الكمية، وبلد الوجهة. سيرد فريقنا هنا.',
    ack: '✅ شكرًا لك — وصلت رسالتك إلى فريقنا. سنرد في هذه المحادثة.',
    languageSet: 'تم تعيين اللغة إلى العربية',
  },
  tr: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nÖzbekistan Fergana Vadisi’nden kuru meyve, kuruyemiş ve bakliyat.\n\nNeye ihtiyacınız olduğunu yazın — hangi ürün, ne kadar hacim ve hangi ülkeye. Ekibimiz buradan yanıtlayacak.',
    ack: '✅ Teşekkürler — mesajınız ekibimize ulaştı. Bu sohbetten yanıtlayacağız.',
    languageSet: 'Dil Türkçe olarak ayarlandı',
  },
  zh: {
    welcome:
      '<b>Kokand Dry Fruits</b>\n来自乌兹别克斯坦费尔干纳谷地的干果、坚果和豆类。\n\n请告诉我们您的需求——需要哪种产品、数量以及目的国。我们的团队将在此回复您。',
    ack: '✅ 谢谢 — 您的留言已送达我们团队。我们会在此对话中回复。',
    languageSet: '语言已设置为中文',
  },
  hi: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nउज़्बेकिस्तान की फ़रगना घाटी से सूखे मेवे, नट्स और दालें।\n\nहमें बताएं कि आपको क्या चाहिए — कौन सा उत्पाद, कितनी मात्रा और किस देश के लिए। हमारी टीम यहीं उत्तर देगी।',
    ack: '✅ धन्यवाद — आपका संदेश हमारी टीम तक पहुँच गया है। हम इसी चैट में उत्तर देंगे।',
    languageSet: 'भाषा हिन्दी पर सेट की गई',
  },
  ko: {
    welcome:
      '<b>Kokand Dry Fruits</b>\n우즈베키스탄 페르가나 계곡의 건과일, 견과류, 콩류입니다.\n\n필요하신 내용을 알려주세요 — 어떤 제품인지, 수량, 도착 국가. 저희 팀이 여기서 답변드립니다.',
    ack: '✅ 감사합니다 — 메시지가 저희 팀에 전달되었습니다. 이 대화에서 답변드리겠습니다.',
    languageSet: '언어가 한국어로 설정되었습니다',
  },
  ja: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nウズベキスタン・フェルガナ盆地産のドライフルーツ、ナッツ、豆類。\n\nご要望をお知らせください — ご希望の商品、数量、配送先の国。担当チームがこちらで返信いたします。',
    ack: '✅ ありがとうございます — メッセージはチームに届きました。このチャットで返信いたします。',
    languageSet: '言語を日本語に設定しました',
  },
  fr: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nFruits secs, noix et légumineuses de la vallée de Ferghana, Ouzbékistan.\n\nDites-nous ce qu’il vous faut — quel produit, quel volume et le pays de destination. Notre équipe vous répondra ici.',
    ack: '✅ Merci — votre message est bien parvenu à notre équipe. Nous répondrons dans cette conversation.',
    languageSet: 'Langue définie sur le français',
  },
  de: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nTrockenfrüchte, Nüsse und Hülsenfrüchte aus dem Ferghanatal, Usbekistan.\n\nSagen Sie uns, was Sie brauchen — welches Produkt, welche Menge und das Zielland. Unser Team antwortet Ihnen hier.',
    ack: '✅ Vielen Dank — Ihre Nachricht hat unser Team erreicht. Wir antworten in diesem Chat.',
    languageSet: 'Sprache auf Deutsch gesetzt',
  },
  es: {
    welcome:
      '<b>Kokand Dry Fruits</b>\nFrutos secos, nueces y legumbres del valle de Fergana, Uzbekistán.\n\nCuéntenos qué necesita — qué producto, qué volumen y el país de destino. Nuestro equipo le responderá aquí.',
    ack: '✅ Gracias — su mensaje llegó a nuestro equipo. Le responderemos en este chat.',
    languageSet: 'Idioma configurado en español',
  },
};

/** Til tanlash taklifi — tanlanmagan paytda ko'rsatiladi, shuning uchun ko'p tilda. */
export const CHOOSE_LANGUAGE =
  '🌐 <b>Choose your language</b>\nTilni tanlang · Выберите язык · اختر لغتك · 请选择语言';

/**
 * Inline tugmalar — ikki ustun. callback_data "lang:<kod>" ko'rinishida,
 * 64 baytlik Telegram cheklovidan ancha kichik.
 */
export function languageKeyboard(): { text: string; callback_data: string }[][] {
  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < locales.length; i += 2) {
    rows.push(
      locales.slice(i, i + 2).map((l) => ({
        text: localeLabel(l),
        callback_data: `lang:${l}`,
      })),
    );
  }
  return rows;
}
