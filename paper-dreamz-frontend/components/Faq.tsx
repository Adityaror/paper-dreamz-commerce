"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { useTheme } from "@/context/ThemeContext";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { HOME_CONTENT } from "@/lib/content/home";
import { PAGES_CONTENT } from "@/lib/content/pages";
import { usePageContent } from "@/lib/usePageContent";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
};

const FALLBACK_FAQS = [
  {
    q: "Are there any options for customisation?",
    a: "Yes — every piece is handcrafted to order. Choose your own colors, themes and designs, and we'll tailor each detail to your celebration.",
  },
  {
    q: "Do you accept bulk orders?",
    a: "Yes. We welcome bulk orders for weddings, celebrations, corporate gifting and special occasions, with pricing crafted around your quantity and design.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we deliver to every corner of India, from metros to the smallest towns.",
  },
  {
    q: "What is the processing time for an order?",
    a: "Standard orders are processed within 7 working days. Bulk orders typically take around 3 weeks for processing and dispatch. Timelines may vary slightly with design complexity and quantity.",
  },
  {
    q: "How do you prefer to get paid?",
    a: "We require 100% advance payment to confirm an order, with production beginning as soon as payment is received.",
  },
  {
    q: "What occasions do you craft for?",
    a: "Weddings, rokas, engagements, anniversaries, baby showers, baby arrivals, birthdays and festivals such as Diwali, Eid, Christmas and Raksha Bandhan — alongside bespoke corporate gifting.",
  },
  {
    q: "Can I customize my order to suit my exact needs?",
    a: "Absolutely. Share your ideas and inspiration with us on WhatsApp at +91 99999 80586 or email paperdreamz.orders@gmail.com, and we'll bring your vision to life.",
  },
  {
    q: "Do you accept returns or exchanges?",
    a: "As every piece is handmade and customised specifically for you, we're unable to accept returns or exchanges. We recommend reviewing your customisation details carefully before confirming your order.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  const { getSectionThemeStyle } = useTheme();
  const theme = getSectionThemeStyle("faq");
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const content = usePageContent("home.faq", HOME_CONTENT["home.faq"]);

  useEffect(() => {
    let cancelled = false;

    apiGet<FaqItem[]>("/faqs").then((items) => {
      if (cancelled || !items || items.length === 0) return;

      setFaqs(items.map((f) => ({ q: f.question, a: f.answer })));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="faq"
      style={{ backgroundColor: theme.customHex || undefined }}
      className={`relative py-16 sm:py-20 transition-colors duration-500 ${theme.bgClass}`}
    >
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14">
        <Reveal>
          <h2 className={`font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight ${theme.textClass}`}>
            {content.heading}
          </h2>
          <p className={`mt-5 font-display text-lg ${theme.subtextClass}`}>
            &ldquo;{content.quote}&rdquo;
          </p>
          <div className="relative mt-10 aspect-[4/5] max-w-sm overflow-hidden rounded-2xl gold-border shadow-[0_10px_30px_rgba(44,36,32,0.1)]">
            <Image src={resolveAssetUrl(content.image) ?? HOME_CONTENT["home.faq"].image} alt={content.image_alt} fill sizes="(max-width:1024px) 90vw, 32vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-mono font-bold">{content.image_eyebrow}</p>
              <p className="mt-1 font-display text-lg text-ivory">{content.image_caption}</p>
            </div>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${theme.cardBgClass}`}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className={`font-display text-base sm:text-lg font-medium ${theme.textClass}`}>{f.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-gold"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                {/* Answers stay in the DOM (collapsed via grid rows) so search engines can read every one. */}
                <div
                  id={`faq-answer-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className={`px-6 pb-6 text-sm leading-relaxed ${theme.subtextClass}`}>{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Still have a question?" prompt under the FAQs on /faq. */
export function FaqContactCta() {
  const content = usePageContent("faq.cta", PAGES_CONTENT["faq.cta"]);

  return (
    <section id="faq-contact" className="pb-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[15px] text-taupe">{content.text}</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
        >
          {content.button_label}
        </Link>
      </div>
    </section>
  );
}
