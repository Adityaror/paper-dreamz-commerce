/**
 * Site-wide settings (Admin → Settings → Site Settings): contact details,
 * social links, announcement bar and brand. One request is shared by every
 * component on the page.
 */

import { apiGet } from "@/lib/api";

export type SiteSettings = {
  announcement_text: string | null;
  logo: string | null;
  brand_name: string | null;
  brand_tagline: string | null;
  footer_blurb: string | null;
  footer_est_year: number | null;
  footer_copyright_name: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
  contact_address: string | null;
  business_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  pinterest_url: string | null;
  threads_url: string | null;
  whatsapp_url: string | null;
};

/** wa.me number (country code, digits only) used by every "order / enquire on WhatsApp" link. */
let whatsappNumber = "917669006999";

export const getWhatsappNumber = () => whatsappNumber;

let pending: Promise<SiteSettings | null> | null = null;

/** Fetches `/site-settings` once per page load; a failed request is retried by the next caller. */
export function loadSiteSettings(): Promise<SiteSettings | null> {
  pending ??= apiGet<SiteSettings>("/site-settings").then((settings) => {
    if (!settings) {
      pending = null;
      return null;
    }
    const fromUrl = settings.whatsapp_url?.match(/wa\.me\/(\d+)/)?.[1];
    const fromPhone = settings.contact_whatsapp?.replace(/\D/g, "");
    const number = fromUrl ?? (fromPhone?.length === 10 ? `91${fromPhone}` : fromPhone);
    if (number) whatsappNumber = number;
    return settings;
  });
  return pending;
}
