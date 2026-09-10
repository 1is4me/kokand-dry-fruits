import ContactForm from './ContactForm';
import { WhatsAppIcon, MapPinIcon, SOCIAL_ICONS } from './Icons';
import {
  ACTIVE_SOCIALS,
  CONTACTS,
  WHATSAPP,
  WHATSAPP_DISPLAY,
} from '@/lib/contacts';
import { PRODUCTS } from '@/lib/products';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/types';

/** WhatsApp bu bo'limda raqam bilan chiqqani uchun ikonkalar qatorida takrorlanmaydi. */
const HIDDEN_IN_CTA = new Set(['WhatsApp']);

export default function Cta({
  dict,
  lang,
  defaultProduct,
}: {
  dict: Dictionary;
  lang: Locale;
  /** Mahsulot sahifasida shu mahsulot formada oldindan tanlanadi. */
  defaultProduct?: string;
}) {
  const info = dict.contact.info;
  const products = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: dict.products[p.key].name,
  }));

  return (
    <section className="cta" id="contacts">
      <div className="container cta__inner">
        <div className="cta__text">
          <span className="eyebrow reveal-up">{dict.contact.heroTitle}</span>
          <h2 className="h2 reveal-up">{dict.cta.title}</h2>
          <p className="reveal-up">{dict.contact.heroSubtitle}</p>

          <p className="cta__price reveal-up">{dict.products.priceNote}</p>

          <div className="cta__contacts reveal-up">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
            >
              <WhatsAppIcon className="cta__lineicon" />
              <span>{WHATSAPP_DISPLAY}</span>
            </a>
          </div>

          <ul className="cta__socials reveal-up">
            {ACTIVE_SOCIALS.map((social) => {
              if (HIDDEN_IN_CTA.has(social.label)) return null;
              const Icon = SOCIAL_ICONS[social.label];
              if (!Icon) return null;
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={CONTACTS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={info.viewOnMap}
                title={info.viewOnMap}
              >
                <MapPinIcon />
              </a>
            </li>
          </ul>
        </div>
        <ContactForm
          lang={lang}
          products={products}
          defaultProduct={defaultProduct}
          t={{
            title: dict.contact.form.title,
            name: dict.contact.form.name,
            phone: dict.contact.form.phone,
            email: dict.contact.form.email,
            message: dict.contact.form.message,
            send: dict.contact.form.send,
            optional: dict.contact.form.optional,
            error: dict.contact.form.emailRequired,
            loading: dict.common.loading,
            product: dict.contact.form.product,
            productAny: dict.contact.form.productAny,
            sent: dict.contact.form.sent,
          }}
        />
      </div>
    </section>
  );
}
