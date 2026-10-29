"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Gift, Sparkles, Phone, MapPin, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import { apiGet, apiPost, resolveAssetUrl } from "@/lib/api";
import { loadSiteSettings } from "@/lib/siteSettings";
import { usePathname } from "next/navigation";
import { pageHref } from "@/lib/utils";

type FooterLink = {
  id: number;
  group: "quick" | "care";
  label: string;
  href: string;
  sort_order: number;
};

type PaymentBadge = {
  id: number;
  label: string;
  sort_order: number;
};


const FALLBACK_QUICK_LINKS: FooterLink[] = [
  { id: 1, group: "quick", label: "About Us", href: "/about", sort_order: 0 },
  { id: 2, group: "quick", label: "Shop All", href: "/shop", sort_order: 1 },
  { id: 3, group: "quick", label: "Custom Orders", href: "/custom-orders", sort_order: 2 },
  { id: 4, group: "quick", label: "Gallery", href: "/gallery", sort_order: 3 },
  { id: 5, group: "quick", label: "Contact Us", href: "/contact", sort_order: 4 },
];

const FALLBACK_CARE_LINKS: FooterLink[] = [
  { id: 6, group: "care", label: "FAQs", href: "/faq", sort_order: 0 },
  { id: 7, group: "care", label: "Shipping & Delivery", href: "/shipping-delivery", sort_order: 1 },
  { id: 8, group: "care", label: "Returns & Refunds", href: "/returns-refunds", sort_order: 2 },
  { id: 9, group: "care", label: "Terms & Conditions", href: "/terms-conditions", sort_order: 3 },
  { id: 10, group: "care", label: "Privacy Policy", href: "/privacy-policy", sort_order: 4 },
];

const FALLBACK_PAYMENT_BADGES: PaymentBadge[] = [
  { id: 1, label: "VISA", sort_order: 0 },
  { id: 2, label: "Mastercard", sort_order: 1 },
  { id: 3, label: "UPI", sort_order: 2 },
  { id: 4, label: "RuPay", sort_order: 3 },
];

const FALLBACK_SETTINGS = {
  logo: "/images/logo-mark-sm.webp",
  brand_name: "PAPER DREAMZ",
  brand_tagline: "Ruchi Mishra",
  footer_blurb:
    "Handcrafted with love, curated for special moments. Luxury bespoke envelopes, keepsakes, and heirloom stationery.",
  footer_est_year: 2010,
  footer_copyright_name: "Paper Dreamz by Ruchi Mishra",
  contact_phone: "+91 99999 80586",
  contact_whatsapp: "+91 76690 06999",
  // Kept split so the address never appears verbatim in the page source.
  contact_email: ["Paperdreamz.orders", "gmail.com"].join("@"),
  contact_address: "New Delhi, India",
  business_hours: "11am to 6pm",
  instagram_url: "https://www.instagram.com/paperdreamz_ruchi?stkn=MWo4aXI3amdoaTN5eg%3D%3D&utm_source=qr",
  facebook_url: "https://www.facebook.com/share/1EEz4maxTH/?mibextid=wwXIfr",
  youtube_url: "https://youtube.com/@paperdreamz2017?si=hM0lk9JFlgQ_2_Kw",
  pinterest_url: "https://pin.it/575TwFYzX",
  whatsapp_url: "https://wa.me/917669006999",
  threads_url: "https://www.threads.com/@paperdreamz_ruchi",
};

/** Normalises a bare 10-digit Indian number to "+91 XXXXX XXXXX" so it is read as an Indian phone number. */
export const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return local.length === 10 ? `+91 ${local.slice(0, 5)} ${local.slice(5)}` : raw;
};

/** Shows "name [at] domain" in the markup and only assembles the real mailto: link on click, to keep scrapers off it. */
export function ProtectedEmail({ email, className }: { email: string; className?: string }) {
  const [user, domain] = email.split("@");
  if (!domain) return <span className={className}>{email}</span>;
  return (
    <a
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${user}@${domain}`;
      }}
      className={className}
    >
      {user} [at] {domain}
    </a>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "subscribed" | "error">("idle");
  const [error, setError] = useState("");
  const [quickLinks, setQuickLinks] = useState(FALLBACK_QUICK_LINKS);
  const [careLinks, setCareLinks] = useState(FALLBACK_CARE_LINKS);
  const [paymentBadges, setPaymentBadges] = useState(FALLBACK_PAYMENT_BADGES);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    apiGet<FooterLink[]>("/footer-links?group=quick").then((data) => {
      if (cancelled || !data || data.length === 0) return;
      setQuickLinks(data);
    });

    apiGet<FooterLink[]>("/footer-links?group=care").then((data) => {
      if (cancelled || !data || data.length === 0) return;
      setCareLinks(data);
    });

    apiGet<PaymentBadge[]>("/payment-badges").then((data) => {
      if (cancelled || !data || data.length === 0) return;
      setPaymentBadges(data);
    });

    loadSiteSettings().then((data) => {
      if (cancelled || !data) return;
      setSettings({
        logo: resolveAssetUrl(data.logo) ?? FALLBACK_SETTINGS.logo,
        brand_name: data.brand_name ?? FALLBACK_SETTINGS.brand_name,
        brand_tagline: data.brand_tagline ?? FALLBACK_SETTINGS.brand_tagline,
        footer_blurb: data.footer_blurb ?? FALLBACK_SETTINGS.footer_blurb,
        footer_est_year: data.footer_est_year ?? FALLBACK_SETTINGS.footer_est_year,
        footer_copyright_name: data.footer_copyright_name ?? FALLBACK_SETTINGS.footer_copyright_name,
        contact_phone: data.contact_phone ?? FALLBACK_SETTINGS.contact_phone,
        contact_whatsapp: data.contact_whatsapp ?? FALLBACK_SETTINGS.contact_whatsapp,
        contact_email: data.contact_email ?? FALLBACK_SETTINGS.contact_email,
        contact_address: data.contact_address ?? FALLBACK_SETTINGS.contact_address,
        business_hours: data.business_hours ?? FALLBACK_SETTINGS.business_hours,
        instagram_url: data.instagram_url ?? FALLBACK_SETTINGS.instagram_url,
        facebook_url: data.facebook_url ?? FALLBACK_SETTINGS.facebook_url,
        youtube_url: data.youtube_url ?? FALLBACK_SETTINGS.youtube_url,
        pinterest_url: data.pinterest_url ?? FALLBACK_SETTINGS.pinterest_url,
        whatsapp_url: data.whatsapp_url ?? FALLBACK_SETTINGS.whatsapp_url,
        threads_url: data.threads_url ?? FALLBACK_SETTINGS.threads_url,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setError("");

    const result = await apiPost<{ id: number; email: string }>("/newsletter/subscribe", { email });

    if (result.ok) {
      setStatus("subscribed");
      setEmail("");
    } else {
      setStatus("error");
      setError(result.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <footer id="site-footer" className="relative bg-bottle-green text-ivory border-t border-gold/25 overflow-hidden">

      <div className="relative z-10 mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12">

        {/* ===================================================================
            1. TOP NEWSLETTER & PROMO BAR
            =================================================================== */}
        <div className="py-7 sm:py-9 border-b border-gold/20 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

          {/* Left: Newsletter Prompt */}
          <div id="newsletter" className="flex items-center gap-3.5 text-left w-full lg:w-auto justify-center lg:justify-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold-light shadow-sm">
              <Mail size={20} strokeWidth={1.4} />
            </div>
            <div>
              <p className="font-display text-sm sm:text-base font-semibold tracking-[0.14em] uppercase text-ivory">
                Join Our World
              </p>
              <p className="text-[11.5px] sm:text-xs text-ivory-dim">
                Subscribe for exclusive offers, new launches &amp; more.
              </p>
            </div>
          </div>

          {/* Center: Subscription Form */}
          <div className="w-full max-w-md lg:max-w-lg">
            <form onSubmit={handleSubscribe} className="flex w-full items-stretch shadow-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === "loading"}
                className="w-full bg-black/30 border border-gold/30 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-elite shrink-0 border border-gold/50 bg-emerald-2 hover:bg-emerald hover:border-gold text-gold-light font-bold text-[11px] sm:text-xs tracking-[0.16em] uppercase px-5 sm:px-7 py-2.5 sm:py-3 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Subscribing…" : status === "subscribed" ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            {status === "error" && (
              <p className="mt-2 text-[11px] text-red-300">{error}</p>
            )}
          </div>

          {/* Right: Value Badges */}
          <div className="flex items-center gap-6 sm:gap-8 text-ivory-dim text-xs justify-center lg:justify-end w-full lg:w-auto">
            <div className="flex items-center gap-2.5">
              <Gift size={18} className="text-gold shrink-0" strokeWidth={1.5} />
              <div className="leading-tight text-left">
                <span className="font-semibold text-ivory text-[11px] tracking-wider uppercase block">Exclusive Offers</span>
                <span className="text-[10px] text-ivory-dim/70">For our subscribers</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-gold shrink-0" strokeWidth={1.5} />
              <div className="leading-tight text-left">
                <span className="font-semibold text-ivory text-[11px] tracking-wider uppercase block">New Launches</span>
                <span className="text-[10px] text-ivory-dim/70">Be the first to know</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===================================================================
            2. MAIN 5-COLUMN FOOTER CONTENT
            =================================================================== */}
        <div className="py-12 sm:py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* Column 1: Brand Info & Socials (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href={pageHref("#home", pathname)} className="inline-flex flex-col items-center gap-1.5 group">
              <span className="relative h-14 w-20 shrink-0 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                <Image src={settings.logo ?? FALLBACK_SETTINGS.logo} alt={settings.brand_name ?? "Paper Dreamz"} fill sizes="80px" className="object-contain" />
              </span>
              <span className="flex flex-col items-center leading-none">
                <span className="font-logo text-[17px] sm:text-lg tracking-[0.3em] text-white font-normal whitespace-nowrap">
                  {settings.brand_name}
                </span>
                <span className="flex items-center gap-2 mt-1.5">
                  <span className="h-px w-4 bg-white/50" />
                  <span className="font-logo text-[10px] text-white/85 lowercase">by</span>
                  <span className="h-px w-4 bg-white/50" />
                </span>
                <span className="font-logo text-[9px] tracking-[0.28em] text-white/80 uppercase mt-1 whitespace-nowrap">
                  {settings.brand_tagline}
                </span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-ivory leading-relaxed max-w-sm pt-1">
              {settings.footer_blurb}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-ivory hover:border-gold hover:text-gold hover:scale-110 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-ivory hover:border-gold hover:text-gold hover:scale-110 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.694 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                  </svg>
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-ivory hover:border-gold hover:text-gold hover:scale-110 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {settings.pinterest_url && (
                <a
                  href={settings.pinterest_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-ivory hover:border-gold hover:text-gold hover:scale-110 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                  </svg>
                </a>
              )}
              {settings.whatsapp_url && (
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-ivory hover:border-gold hover:text-gold hover:scale-110 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              )}
              {settings.threads_url && (
                <a
                  href={settings.threads_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Threads"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-ivory hover:border-gold hover:text-gold hover:scale-110 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold mb-4 sm:mb-5">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-xs text-ivory-dim">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a href={pageHref(link.href, pathname)} className="hover:text-gold-light hover:translate-x-1 inline-block transition-transform">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold mb-4 sm:mb-5">
              Customer Care
            </h2>
            <ul className="space-y-2.5 text-xs text-ivory-dim">
              {careLinks.map((link) => (
                <li key={link.id}>
                  <a href={pageHref(link.href, pathname)} className="hover:text-gold-light hover:translate-x-1 inline-block transition-transform">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us (2 cols on lg) */}
          <div id="contact" className="lg:col-span-2 scroll-mt-32">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold mb-4 sm:mb-5">
              Contact Us
            </h2>
            <ul className="space-y-3 text-xs text-ivory-dim">
              {settings.contact_phone && (
                <li className="flex items-start gap-2.5">
                  <Phone size={14} className="text-gold mt-0.5 shrink-0" />
                  <a href={`tel:${formatPhone(settings.contact_phone).replace(/\s+/g, "")}`} className="hover:text-gold-light transition-colors">
                    {formatPhone(settings.contact_phone)}
                  </a>
                </li>
              )}
              {settings.contact_whatsapp && (
                <li className="flex items-start gap-2.5">
                  <MessageCircle size={14} className="text-gold mt-0.5 shrink-0" />
                  <a
                    href={settings.whatsapp_url ?? `https://wa.me/${formatPhone(settings.contact_whatsapp).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-light transition-colors"
                  >
                    {formatPhone(settings.contact_whatsapp)} <span className="text-ivory-dim/60">(WhatsApp)</span>
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-start gap-2.5">
                  <Mail size={14} className="text-gold mt-0.5 shrink-0" />
                  <ProtectedEmail email={settings.contact_email} className="hover:text-gold-light transition-colors break-all" />
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                  <address className="not-italic">{settings.contact_address}</address>
                </li>
              )}
              {settings.business_hours && (
                <li className="flex items-start gap-2.5">
                  <Clock size={14} className="text-gold mt-0.5 shrink-0" />
                  <span>Business Hours: {settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 5: Luxury Seal / "Made With Love" Badge (2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-40 h-40 group">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-label={`Handcrafted with love, est. ${settings.footer_est_year}`} role="img">
                <defs>
                  <path id="seal-arc-top" d="M 24,100 A 76,76 0 0 1 176,100" />
                  <path id="seal-arc-bottom" d="M 12,100 A 88,88 0 0 0 188,100" />
                </defs>
                <circle cx="100" cy="100" r="97" fill="rgba(255,255,255,0.02)" stroke="#C5A059" strokeOpacity="0.55" strokeWidth="1.5" className="transition-opacity group-hover:[stroke-opacity:1]" />
                <circle cx="100" cy="100" r="91" fill="none" stroke="#C5A059" strokeOpacity="0.25" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="62" fill="none" stroke="#C5A059" strokeOpacity="0.3" strokeWidth="0.75" strokeDasharray="2 4" />
                <text fill="#E6CF9C" fontSize="13" letterSpacing="4.5" textAnchor="middle" className="font-mono uppercase">
                  <textPath href="#seal-arc-top" startOffset="50%">Handcrafted with Love</textPath>
                </text>
                <text fill="#C5A059" fontSize="11" letterSpacing="5" textAnchor="middle" className="font-mono uppercase">
                  <textPath href="#seal-arc-bottom" startOffset="50%">Est. {String(settings.footer_est_year ?? "")}</textPath>
                </text>
                <circle cx="24" cy="100" r="2" fill="#C5A059" fillOpacity="0.7" />
                <circle cx="176" cy="100" r="2" fill="#C5A059" fillOpacity="0.7" />
              </svg>

              {/* Bow ribbon mark */}
              <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 opacity-95">
                <Image src="/images/logo-mark-sm.webp" alt="Ribbon" fill className="object-contain" />
              </div>
            </div>
          </div>

        </div>

        {/* ===================================================================
            3. BOTTOM COPYRIGHT & SECURE PAYMENTS BAR
            =================================================================== */}
        <div className="py-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ivory-dim">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {settings.footer_copyright_name}. All rights reserved.
          </p>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] text-gold-light mr-1 font-medium">
              <ShieldCheck size={13} className="text-gold" /> Secure Payments
            </span>
            {paymentBadges.map((badge) => (
              <span
                key={badge.id}
                className="rounded bg-black/40 border border-gold/25 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-ivory uppercase"
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
