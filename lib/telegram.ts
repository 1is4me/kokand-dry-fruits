import 'server-only';

/**
 * Telegram bilan ishlash — bitta joyda.
 *
 * TELEGRAM_CHAT_ID bir nechta egani qabul qiladi: vergul (yoki bo'sh joy,
 * yangi qator, nuqta-vergul) bilan ajratiladi. Masalan:
 *   TELEGRAM_CHAT_ID=123456789,-1001234567890, 987654321
 * Har bir ariza ro'yxatdagi hamma chatga boradi; ulardan istalgani javob
 * bera oladi.
 */

const API = 'https://api.telegram.org';

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Egalarning chat id lari. Noto'g'ri yozilganlari tashlab yuboriladi. */
export function ownerIds(): string[] {
  const raw = process.env.TELEGRAM_CHAT_ID ?? '';
  const ids = raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => /^-?\d+$/.test(s));
  // Takrorlanganini olib tashlaymiz — bir odamga ikki marta bormasin.
  return [...new Set(ids)];
}

export const isOwner = (chatId: number | string): boolean =>
  ownerIds().includes(String(chatId));

export async function call(
  method: string,
  payload: Record<string, unknown>,
): Promise<Response | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`${API}/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[telegram] ${method} -> ${res.status}`, await res.clone().text());
    }
    return res;
  } catch (err) {
    console.error(`[telegram] ${method} failed`, err);
    return null;
  }
}

export const send = (chatId: number | string, text: string) =>
  call('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

export type InlineButton = { text: string; callback_data: string };

/** Tugmali xabar — til tanlash uchun ishlatiladi. */
export const sendWithKeyboard = (
  chatId: number | string,
  text: string,
  keyboard: InlineButton[][],
) =>
  call('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: keyboard },
  });

/**
 * Tugma bosilganini Telegramga tasdiqlaydi. Chaqirilmasa mijozning
 * ekranida tugma cheksiz "yuklanmoqda" holatida qolib ketadi.
 */
export const answerCallback = (callbackQueryId: string, text?: string) =>
  call('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
  });

/** Tanlangandan keyin tugmalarni olib tashlaydi — ikkinchi marta bosilmasin. */
export const clearKeyboard = (chatId: number | string, messageId: number) =>
  call('editMessageReplyMarkup', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });

/** Matnsiz xabarni (rasm, fayl, ovoz) o'z holicha ko'chiradi. */
export const copyMessage = (
  toChat: number | string,
  fromChat: number | string,
  messageId: number,
) => call('copyMessage', { chat_id: toChat, from_chat_id: fromChat, message_id: messageId });

/**
 * Hamma egaga yuboradi. Bittasi ishlamasa ham qolganlari oladi —
 * shuning uchun Promise.allSettled.
 */
export async function sendToOwners(text: string): Promise<{ sent: number; total: number }> {
  const owners = ownerIds();
  if (owners.length === 0) return { sent: 0, total: 0 };

  const results = await Promise.allSettled(owners.map((id) => send(id, text)));
  const sent = results.filter(
    (r) => r.status === 'fulfilled' && r.value !== null && r.value.ok,
  ).length;
  return { sent, total: owners.length };
}
