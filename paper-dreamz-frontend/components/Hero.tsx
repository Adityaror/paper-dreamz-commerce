"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { apiGet, resolveAssetUrl } from "@/lib/api";

type HeroSlide = {
  id: number;
  eyebrow: string | null;
  heading: string;
  accent_text: string | null;
  subtext: string | null;
  cta_label: string | null;
  cta_link: string | null;
  video: string | null;
  poster_image: string | null;
  sort_order: number;
};

const FALLBACK = {
  eyebrow: "Handmade. Luxury. Timeless.",
  heading: "Luxurious creations,",
  accent_text: "beautifully yours.",
  subtext: "Luxury handmade envelopes, keepsakes and gifts for life's most beautiful moments.",
  cta_label: "Explore Collection",
  cta_link: "#collections",
  video: "/videos/hero-v2.mp4",
  poster_image: "/images/hero-poster.webp",
};

export default function Hero() {
  const [slide, setSlide] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    apiGet<HeroSlide[]>("/hero-slides").then((slides) => {
      if (cancelled || !slides || slides.length === 0) return;

      const first = slides[0];
      setSlide({
        eyebrow: first.eyebrow ?? FALLBACK.eyebrow,
        heading: first.heading ?? FALLBACK.heading,
        accent_text: first.accent_text ?? FALLBACK.accent_text,
        subtext: first.subtext ?? FALLBACK.subtext,
        cta_label: first.cta_label ?? FALLBACK.cta_label,
        cta_link: first.cta_link ?? FALLBACK.cta_link,
        video: resolveAssetUrl(first.video) ?? FALLBACK.video,
        poster_image: resolveAssetUrl(first.poster_image) ?? FALLBACK.poster_image,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="home" className="relative w-full overflow-hidden bg-black">
      {/* Full-bleed video background, covering the whole section including the area behind the fixed navbar */}
      <div className="absolute inset-0">
        <video
          key={slide.video}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={slide.poster_image}
        >
          <source src={slide.video} type="video/mp4" />
        </video>
      </div>

      {/* Dark scrim so the rose-gold logo and white copy stay readable over the light video */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,17,12,0.55)_0%,rgba(6,17,12,0.15)_70%)]"
      />

      <div className="relative min-h-[720px] pt-[104px]">
        {/* Copy, centered over the video */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[720px] px-6 py-20 text-center">
          {/* Full brand lockup — the logo leads the hero, LV/Nyakka-style */}
          <motion.img
            src="/images/logo-full.webp"
            alt="Paper Dreamz by Ruchi Mishra"
            width={1200}
            height={873}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 w-[210px] sm:w-[280px] lg:w-[340px] h-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
          />

          {slide.eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-xs sm:text-sm font-extrabold tracking-[0.3em] uppercase text-gold-light [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_2px_10px_rgba(0,0,0,0.6)]"
            >
              {slide.eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display font-semibold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.85),0_4px_20px_rgba(0,0,0,0.6)]"
          >
            {slide.heading}
            {slide.accent_text && (
              <>
                <br />
                <span className="font-script text-gold-light text-5xl sm:text-6xl lg:text-7xl [text-shadow:0_2px_4px_rgba(0,0,0,0.85),0_4px_20px_rgba(0,0,0,0.6)]">
                  {slide.accent_text}
                </span>
              </>
            )}
          </motion.h1>

          <div className="mt-6 flex items-center gap-3 text-gold/70">
            <span className="h-px w-10 bg-gold/40" />
            <span className="text-base">&#10047;</span>
            <span className="h-px w-10 bg-gold/40" />
          </div>

          {slide.subtext && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 max-w-md text-[15px] sm:text-base font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_2px_10px_rgba(0,0,0,0.6)]"
            >
              {slide.subtext}
            </motion.p>
          )}

          {slide.cta_label && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-9"
            >
              <a
                href={slide.cta_link ?? "#collections"}
                className="btn-elite group inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
              >
                {slide.cta_label}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
