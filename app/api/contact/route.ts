import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { escapeHtml, ownerIds, sendToOwners } from '@/lib/telegram';
import { SITE_URL } from '@/lib/site';

export const runtime = 'nodejs';

type Lead = {
  name: string;
  phone: string;
  email?: string;
  /** Mahsulot slug'i — formadagi ro'yxatdan */
  product?: string;
  msg?: string;
  lang?: string;
};

function parse(body: unknown): Lead | null {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(b.name);
  const phone = str(b.phone);
  if (!name || !phone) return null;

  // Faqat katalogdagi slug qabul qilinadi — ixtiyoriy matn emas.
  const slug = str(b.product);
  const product = getProduct(slug) ? slug : undefined;

  // Uzun kiritmalarni kesamiz — forma maydonlari uchun yetarli.
  return {
    name: name.slice(0, 120),
    phone: phone.slice(0, 60),
    email: str(b.email).slice(0, 160) || undefined,
    product,
    msg: str(b.msg).slice(0, 2000) || undefined,
    lang: str(b.lang).slice(0, 8) || undefined,
  };
}

function formatMessage(lead: Lead): string {
  const rows: [string, string | undefined][] = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Product', lead.product],
    ['Language', lead.lang],
    ['Message', lead.msg],
  ];
  const body = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v as string)}`)
    .join('\n');
  const host = SITE_URL.replace(/^https?:\/\//, '');
  return `🌰 <b>New enquiry — ${host}</b>\n\n${body}`;
}

/**
 * Telegramga yuboradi — TELEGRAM_CHAT_ID dagi hamma egaga.
 * Kalitlar .env dan olinadi va hech qachon klientga tushmaydi.
 * Sozlanmagan bo'lsa — false qaytaradi.
 */
async function sendToTelegram(lead: Lead): Promise<boolean> {
  if (!process.env.TELEGRAM_BOT_TOKEN || ownerIds().length === 0) return false;

  const { sent, total } = await sendToOwners(formatMessage(lead));
  if (sent === 0) throw new Error(`Telegram delivery failed for all ${total} recipients`);
  if (sent < total) {
    console.warn(`[contact] delivered to ${sent}/${total} owners`);
  }
  return true;
}

/** Formadan kelgan arizani qabul qiladi va Telegramga uzatadi. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const lead = parse(body);
  if (!lead) {
    return NextResponse.json(
      { error: 'Fields "name" and "phone" are required' },
      { status: 422 },
    );
  }

  try {
    const delivered = await sendToTelegram(lead);
    if (!delivered) {
      // Bot sozlanmagan — ariza yo'qolmasligi uchun logga yozamiz.
      console.warn(
        '[contact] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not set — lead logged only',
        { ...lead, receivedAt: new Date().toISOString() },
      );
    }
  } catch (err) {
    // Yetkazishda xatolik — mijozga xato ko'rsatamiz, ariza logda qoladi.
    console.error('[contact] delivery failed', err, {
      ...lead,
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Delivery failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
