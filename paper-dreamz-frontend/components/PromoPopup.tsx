"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { INTRO_DONE_EVENT, isIntroDone } from "./Intro";
import { SHOW_CATEGORY_EVENT, type CategoryId } from "./NewArrivals";

type PromoPopupData = {
  is_enabled: boolean;
  category: CategoryId;
  eyebrow: string | null;
  title: string | null;
  message: string | null;
  button_label: string | null;
  image: string | null;
  delay_seconds: number;
  version: string;
  product_count: number;
  featured_product: { name: string; image: string | null; price: number } | null;
};

const DEFAULTS: Record<CategoryId, { eyebrow: string; title: string; message: string; label: string }> = {
  "new-arrivals": {
    eyebrow: "Just In",
    title: "New Arrivals are here",
    message: "Fresh shagun suites and keepsakes, straight from our atelier.",
    label: "New Arrivals",
  },
  "hot-deals": {
    eyebrow: "Limited Time",
    title: "Hot Deals you'll love",
    message: "Special prices on our most-loved designs — while they last.",
    label: "Hot Deals",
  },
  "best-sellers": {
    eyebrow: "Most Loved",
    title: "Shop our Best Sellers",
    message: "The artisanal favourites couples keep coming back to.",
    label: "Best Sellers",
  },
};

/** Shown when the backend can't be reached, so the popup still appears; the admin's settings take over once it's live. */
const FALLBACK_POPUP: PromoPopupData = {
  is_enabled: true,
  category: "new-arrivals",
  eyebrow: null,
  title: null,
  message: null,
  button_label: null,
  image: null,
  delay_seconds: 2,
  version: "fallback",
  product_count: 0,
  featured_product: { name: "Maroon Peacock Sagan", image: "/images/new_maroon_peacock.webp", price: 2199 },
};

const SECTION_ID = "new-arrivals";

type Mode = "hidden" | "card" | "pill";

export default function PromoPopup() {
  const [popup, setPopup] = useState<PromoPopupData | null>(null);
  const [mode, setMode] = useState<Mode>("hidden");
  const [sectionInView, setSectionInView] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGet<PromoPopupData>("/promo-popup").then((data) => {
      if (cancelled) return;
      // null means the API was unreachable; an explicit is_enabled: false from the admin keeps it hidden.
      const resolved = data ?? FALLBACK_POPUP;
      if (resolved.is_enabled) setPopup(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Wait for the cinematic intro to finish, then the admin-configured delay.
  useEffect(() => {
    if (!popup) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      // Always open as the full card on page load; closing it only collapses it for this visit.
      timer = setTimeout(() => setMode("card"), Math.max(0, popup.delay_seconds) * 1000);
    };

    if (isIntroDone()) start();
    else window.addEventListener(INTRO_DONE_EVENT, start, { once: true });

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, start);
      clearTimeout(timer);
    };
  }, [popup]);

  // Step aside while the products section itself is on screen.
  useEffect(() => {
    const section = document.getElementById(SECTION_ID);
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setSectionInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (!popup) return null;

  const defaults = DEFAULTS[popup.category] ?? DEFAULTS["new-arrivals"];
  const eyebrow = popup.eyebrow || defaults.eyebrow;
  const title = popup.title || defaults.title;
  const message = popup.message || defaults.message;
  const buttonLabel = popup.button_label || "Explore Now";
  const image = resolveAssetUrl(popup.image) ?? resolveAssetUrl(popup.featured_product?.image);

  const goToSection = () => {
    setMode("pill");
    window.dispatchEvent(new CustomEvent<CategoryId>(SHOW_CATEGORY_EVENT, { detail: popup.category }));
    document.getElementById(SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visible = !sectionInView ? mode : "hidden";

  return (
    <div id="promo-popup" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex justify-end">
      <AnimatePresence mode="wait">
        {visible === "card" && (
          <motion.aside
            key="card"
            aria-label={defaults.label}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-[calc(100vw-2rem)] max-w-[22rem] overflow-hidden rounded-2xl border border-gold/40 bg-bottle-green text-cream shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setMode("pill")}
              aria-label="Close"
              className="absolute top-2 right-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-noir/60 text-gold-light transition-colors hover:bg-noir cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <button type="button" onClick={goToSection} className="flex w-full text-left cursor-pointer group">
              {image && (
                <div className="relative w-28 shrink-0 self-stretch overflow-hidden border-r border-gold/25">
                  <Image
                    src={image}
                    alt={popup.featured_product?.name ?? title}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 p-4 pr-9">
                <p className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gold">
                  <Sparkles className="h-3 w-3" />
                  {eyebrow}
                </p>
                <p className="mt-1.5 font-display text-lg leading-snug font-semibold text-cream">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-cream/70 line-clamp-2">{message}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-light transition-colors group-hover:bg-gold group-hover:text-bottle-green">
                  {buttonLabel}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          </motion.aside>
        )}

        {visible === "pill" && (
          <motion.button
            key="pill"
            type="button"
            onClick={() => setMode("card")}
            aria-label={`Show ${defaults.label} offer`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="relative inline-flex items-center gap-2 rounded-full border border-gold/50 bg-bottle-green px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-light shadow-xl transition-colors hover:bg-emerald-2 cursor-pointer"
          >
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            <Sparkles className="h-3.5 w-3.5" />
            {defaults.label}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
