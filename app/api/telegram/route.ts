import { NextResponse } from 'next/server';
import {
  answerCallback,
  clearKeyboard,
  copyMessage,
  escapeHtml,
  isOwner as isOwnerChat,
  ownerIds,
  send,
  sendToOwners,
  sendWithKeyboard,
} from '@/lib/telegram';
import {
  BOT_TEXT,
  CHOOSE_LANGUAGE,
  languageKeyboard,
  localeLabel,
} from '@/lib/bot-i18n';
import { detectLanguage, type Detection } from '@/lib/detect-language';
import { isLocale, type Locale } from '@/i18n/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Telegram webhook — @Kokand_Dry_Fruits_Bot.
 *
 * Buyruqlar:
 *   /start — til tanlash tugmalari, keyin tanlangan tilda salom.
 *   /lang  — tilni keyin ham o'zgartirish uchun.
 *   /id    — yozgan odamga chat_id sini qaytaradi.
 *
 * Relay:
 *   Mijozning xabari egalarga (TELEGRAM_CHAT_ID) uzatiladi. Sarlavhada
 *   mijozning ismi, @username, "#u<id>" belgisi va ENG MUHIMI — xabar qaysi
 *   tilda ekani va bu qanday aniqlangani ko'rsatiladi. Egasi shu satrga qarab
 *   qaysi tilda javob yozishni biladi.
 *   Egasi o'sha xabarga REPLY qilsa, javob mijozga qaytadi.
 *
 * Xotira haqida: bu route holatsiz (ma'lumotlar bazasi yo'q). Mijoz tanlagan
 * til jarayon xotirasida saqlanadi — server "sovib" qolsa unutiladi, lekin
 * unutilganda ham til matnning yozuvidan qayta aniqlanadi, shuning uchun
 * egaga ko'rsatiladigan ma'lumot hech qachon yo'qolmaydi.
 */

type TgChat = { id: number; type?: string; title?: string; username?: string };
type TgUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
};
type TgMessage = {
  message_id?: number;
  chat?: TgChat;
  from?: TgUser;
  text?: string;
  caption?: string;
  reply_to_message?: TgMessage;
};
type TgCallbackQuery = {
  id: string;
  from?: TgUser;
  data?: string;
  message?: TgMessage;
};
type TgUpdate = {
  message?: TgMessage;
  edited_message?: TgMessage;
  callback_query?: TgCallbackQuery;
};

/**
 * Mijoz tanlagan til. Bu Vercel'da "iliq" instansiya davomida yashaydi —
 * kafolatlangan saqlash emas, shunchaki qulaylik. Yo'qolsa detectLanguage()
 * matndan aniqlaydi.
 */
const chosenLanguage = new Map<number, Locale>();

function displayName(u?: TgUser): string {
  if (!u) return 'Unknown';
  const name = [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
  return name || u.username || String(u.id);
}

/** Egaga ko'rsatiladigan izoh — tilga qanchalik ishonish mumkinligini aytadi. */
const SOURCE_NOTE: Record<Detection['source'], string> = {
  chosen: 'mijoz o‘zi tanlagan',
  script: 'matn yozuvidan aniqlandi',
  telegram: 'Telegram ilovasi tili',
  default: 'aniqlanmadi — standart',
};

export async function POST(request: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = request.headers.get('x-telegram-bot-api-secret-token');
  if (!expected || got !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let update: TgUpdate;
  try {
    update = (await request.json()) as TgUpdate;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Har qanday holatda Telegramga 200 qaytariladi — aks holda u qayta yuboraveradi.
  try {
    await handle(update);
  } catch (err) {
    console.error('[telegram] handler error', err);
  }
  return NextResponse.json({ ok: true });
}

async function handle(update: TgUpdate) {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return;
  }
  await handleMessage(update.message ?? update.edited_message);
}

/** Til tugmasi bosilganda. */
async function handleCallback(query: TgCallbackQuery) {
  const chatId = query.message?.chat?.id;
  const data = query.data ?? '';

  if (!data.startsWith('lang:') || typeof chatId !== 'number') {
    await answerCallback(query.id);
    return;
  }

  const code = data.slice('lang:'.length);
  if (!isLocale(code)) {
    await answerCallback(query.id);
    return;
  }

  chosenLanguage.set(chatId, code);
  await answerCallback(query.id, BOT_TEXT[code].languageSet);

  // Tugmalarni olib tashlaymiz, keyin tanlangan tilda salom yuboramiz.
  if (query.message?.message_id) {
    await clearKeyboard(chatId, query.message.message_id);
  }
  await send(chatId, `${localeLabel(code)}\n\n${BOT_TEXT[code].welcome}`);
}

async function handleMessage(msg: TgMessage | undefined) {
  const chatId = msg?.chat?.id;
  if (typeof chatId !== 'number') return;

  const owners = ownerIds();
  const isOwner = isOwnerChat(chatId);
  const isPrivate = msg?.chat?.type === 'private';
  const body = (msg?.text ?? msg?.caption ?? '').trim();
  // Guruhda buyruq "/id@BotNomi" ko'rinishida keladi.
  const command = body.split(/\s+/)[0].split('@')[0].toLowerCase();

  if (command === '/id') {
    const userId = msg?.from?.id;
    const isGroup = msg?.chat?.type && msg.chat.type !== 'private';
    const lines = [
      '<b>Chat ID</b>',
      `<code>${chatId}</code>`,
      '',
      'Nusxa olish uchun yuqoridagi raqamni bosing.',
      '',
      'Uni <code>TELEGRAM_CHAT_ID</code> ga qo’ying — arizalar shu chatga tushadi.',
    ];
    if (isGroup && typeof userId === 'number' && userId !== chatId) {
      lines.splice(
        2,
        0,
        '',
        '<b>Shaxsiy ID’ingiz</b>',
        `<code>${userId}</code>`,
        `(bu chat — ${escapeHtml(msg?.chat?.type ?? 'guruh')})`,
      );
    }
    await send(chatId, lines.join('\n'));
    return;
  }

  // /start va /lang — ikkalasi ham til tanlashni ochadi.
  if (command === '/start' || command === '/lang') {
    if (isOwner && command === '/start') {
      await send(
        chatId,
        [
          '<b>Egasi chati</b>',
          '',
          'Saytdan kelgan arizalar va botga yozganlarning xabarlari shu yerga tushadi.',
          '',
          'Har bir xabar sarlavhasida <b>🌐 Til</b> satri bo‘ladi — mijoz qaysi tilda yozgani va bu qanday aniqlangani.',
          '',
          'Javob berish uchun o’sha xabarga <b>reply</b> qiling — matningiz to’g’ridan-to’g’ri mijozga boradi. Javobni mijozning tilida yozing.',
        ].join('\n'),
      );
      return;
    }
    await sendWithKeyboard(chatId, CHOOSE_LANGUAGE, languageKeyboard());
    return;
  }

  // --- Egasining javobi mijozga qaytadi ---
  if (isOwner && msg?.reply_to_message) {
    const source = msg.reply_to_message.text ?? msg.reply_to_message.caption ?? '';
    // Belgi sarlavha oxirida turadi, shuning uchun oxirgi moslik olinadi.
    const marks = [...source.matchAll(/#u(\d+)/g)];
    const target = marks.length ? marks[marks.length - 1][1] : null;

    if (!target) {
      await send(
        chatId,
        'Bu javob kimga ekanini aniqlab bo’lmadi. <code>#u…</code> belgisi bor xabarga reply qiling.',
      );
      return;
    }

    // Sarlavhadagi #l belgisidan mijozning tilini o'qiymiz — baza kerak emas.
    const langMark = [...source.matchAll(/#l([a-z-]{2,5})/g)].pop()?.[1];
    const replyLocale = langMark && isLocale(langMark) ? langMark : null;

    const res = msg.text
      ? await send(target, escapeHtml(msg.text))
      : msg.message_id
        ? await copyMessage(target, chatId, msg.message_id)
        : null;

    await send(
      chatId,
      res?.ok
        ? `✅ Yuborildi${replyLocale ? ` — ${localeLabel(replyLocale)}` : ''}.`
        : '⚠️ Yetkazib bo’lmadi — mijoz botni bloklagan bo’lishi mumkin.',
    );
    return;
  }

  // --- Mijozning xabari egasiga uzatiladi ---
  if (!isOwner && isPrivate) {
    const detection = detectLanguage(
      body,
      msg?.from?.language_code,
      chosenLanguage.get(chatId),
    );

    if (owners.length === 0) {
      console.warn('[telegram] TELEGRAM_CHAT_ID not set — message not relayed', {
        from: msg?.from?.id,
        lang: detection.locale,
        text: body.slice(0, 200),
      });
      await send(chatId, BOT_TEXT[detection.locale].ack);
      return;
    }

    const from = msg?.from;
    const header = [
      '📩 <b>Bot orqali yangi xabar</b>',
      `<b>Kimdan:</b> ${escapeHtml(displayName(from))}` +
        (from?.username ? ` (@${escapeHtml(from.username)})` : ''),
      `<b>ID:</b> <code>${chatId}</code>`,
      // Egasi javobni qaysi tilda yozishini shu satrdan biladi.
      `🌐 <b>Til:</b> ${localeLabel(detection.locale)} · <code>${detection.locale}</code>` +
        ` — <i>${SOURCE_NOTE[detection.source]}</i>`,
      '',
      body ? escapeHtml(body) : '<i>(quyida biriktirma)</i>',
      '',
      `<i>Javob berish uchun shu xabarga reply qiling — ${escapeHtml(
        localeLabel(detection.locale),
      )} tilida.</i> #u${chatId} #l${detection.locale}`,
    ].join('\n');

    await sendToOwners(header);
    // Matnsiz xabar bo'lsa — asl faylni ham har bir egaga yuboramiz.
    if (!msg?.text && msg?.message_id) {
      await Promise.allSettled(
        owners.map((id) => copyMessage(id, chatId, msg.message_id!)),
      );
    }

    await send(chatId, BOT_TEXT[detection.locale].ack);
  }
}
