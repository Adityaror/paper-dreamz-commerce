"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Reveal from "./Reveal";
import EnquiryForm from "./EnquiryForm";
import { formatPhone, ProtectedEmail } from "./Footer";
import { PAGES_CONTENT } from "@/lib/content/pages";
import { loadSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import { usePageContent } from "@/lib/usePageContent";

type ContactSettings = Pick<
  SiteSettings,
  | "contact_phone"
  | "contact_whatsapp"
  | "contact_email"
  | "contact_address"
  | "business_hours"
  | "whatsapp_url"
  | "instagram_url"
  | "facebook_url"
  | "youtube_url"
  | "pinterest_url"
>;

const CONTACT: ContactSettings = {
  contact_phone: "+91 99999 80586",
  contact_whatsapp: "+91 76690 06999",
  // Kept split so the address never appears verbatim in the page source.
  contact_email: ["Paperdreamz.orders", "gmail.com"].join("@"),
  contact_address: "New Delhi, India",
  business_hours: "11am to 6pm",
  whatsapp_url: "https://wa.me/917669006999",
  instagram_url: "https://www.instagram.com/paperdreamz_ruchi",
  facebook_url: "https://www.facebook.com/share/1EEz4maxTH/",
  youtube_url: "https://www.youtube.com/@paperdreamz2017",
  pinterest_url: "https://pin.it/575TwFYzX",
};

const cardClass = "flex h-full flex-col rounded-sm border border-gold/25 bg-white/60 p-7 shadow-[0_10px_30px_rgba(44,36,32,0.06)]";
const eyebrowClass = "mt-5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep";
const valueClass = "mt-2 font-display text-lg text-ink break-words hover:text-gold-deep transition-colors";

export default function ContactDetails() {
  // Admin → Settings → Site Settings; CONTACT is shown until it loads and whenever it can't be reached.
  const [s, setSettings] = useState(CONTACT);
  const content = usePageContent("contact.form", PAGES_CONTENT["contact.form"]);

  useEffect(() => {
    let cancelled = false;
    loadSiteSettings().then((data) => {
      if (cancelled || !data) return;
      setSettings((current) => {
        const next = { ...current };
        for (const key of Object.keys(current) as (keyof ContactSettings)[]) {
          if (data[key]) next[key] = data[key];
        }
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const socials = [
    { label: "Instagram", href: s.instagram_url },
    { label: "Facebook", href: s.facebook_url },
    { label: "YouTube", href: s.youtube_url },
    { label: "Pinterest", href: s.pinterest_url },
  ].filter((x): x is { label: string; href: string } => Boolean(x.href));

  return (
    <>
      <section id="contact-details" className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {s.contact_whatsapp && (
            <Reveal>
              <div className={cardClass}>
                <MessageCircle size={22} className="text-gold-deep" strokeWidth={1.5} />
                <p className={eyebrowClass}>WhatsApp · Orders</p>
                <a href={s.whatsapp_url ?? `https://wa.me/${formatPhone(s.contact_whatsapp).replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={valueClass}>
                  {formatPhone(s.contact_whatsapp)}
                </a>
              </div>
            </Reveal>
          )}
          {s.contact_phone && (
            <Reveal delay={0.06}>
              <div className={cardClass}>
                <Phone size={22} className="text-gold-deep" strokeWidth={1.5} />
                <p className={eyebrowClass}>Call us</p>
                <a href={`tel:${formatPhone(s.contact_phone).replace(/\s+/g, "")}`} className={valueClass}>
                  {formatPhone(s.contact_phone)}
                </a>
              </div>
            </Reveal>
          )}
          {s.contact_email && (
            <Reveal delay={0.12}>
              <div className={cardClass}>
                <Mail size={22} className="text-gold-deep" strokeWidth={1.5} />
                <p className={eyebrowClass}>Email</p>
                <ProtectedEmail email={s.contact_email} className={`${valueClass} text-base`} />
              </div>
            </Reveal>
          )}
          <Reveal delay={0.18}>
            <div className={cardClass}>
              <Clock size={22} className="text-gold-deep" strokeWidth={1.5} />
              <p className={eyebrowClass}>Studio</p>
              {s.contact_address && (
                <p className="mt-2 flex items-start gap-1.5 font-display text-lg text-ink">
                  <MapPin size={15} className="mt-1.5 shrink-0 text-gold-deep" /> {s.contact_address}
                </p>
              )}
              {s.business_hours && <p className="mt-1 text-sm text-taupe">Hours: {s.business_hours}</p>}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact-form" className="bg-cream-2/60 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">{content.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-ink">{content.heading}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-taupe">
              {content.intro}
            </p>
            {socials.length > 0 && (
              <div className="mt-8">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">Follow our work</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {socials.map((x) => (
                    <li key={x.label}>
                      <a
                        href={x.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-full border border-gold/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-deep hover:border-gold hover:bg-gold/10 transition-colors"
                      >
                        {x.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8 rounded-sm border border-gold/25 bg-white/70 p-6 sm:p-10 shadow-[0_10px_30px_rgba(44,36,32,0.06)]">
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
