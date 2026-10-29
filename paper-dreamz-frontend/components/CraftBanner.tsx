"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { apiGet, resolveAssetUrl } from "@/lib/api";

type CraftBannerData = {
  eyebrow: string | null;
  quote: string | null;
  background_image: string | null;
};

const FALLBACK_BANNER = {
  eyebrow: "Craftsmanship In Motion",
  quote: "Every fold, petal, and gold emboss is crafted with precision.",
  backgroundImage: "/images/cinematic_hero_bg.webp",
};

export default function CraftBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const [banner, setBanner] = useState(FALLBACK_BANNER);

  useEffect(() => {
    let cancelled = false;

    apiGet<CraftBannerData>("/craft-banner").then((data) => {
      if (cancelled || !data) return;

      setBanner({
        eyebrow: data.eyebrow ?? FALLBACK_BANNER.eyebrow,
        quote: data.quote ?? FALLBACK_BANNER.quote,
        backgroundImage: resolveAssetUrl(data.background_image) ?? FALLBACK_BANNER.backgroundImage,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      ref={ref}
      id="craft-banner"
      className="relative h-[75vh] min-h-[480px] max-h-[640px] overflow-hidden bg-[#f7f0e2] px-5 py-8 sm:px-10 sm:py-12"
    >
      {/* Soft champagne light, drifting slowly with scroll */}
      <motion.div
        style={{ y }}
        aria-hidden
        className="absolute inset-0 scale-110 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,#fffdf7_0%,rgba(255,253,247,0)_70%),radial-gradient(ellipse_50%_70%_at_0%_100%,rgba(217,169,154,0.35)_0%,transparent_70%),radial-gradient(ellipse_50%_70%_at_100%_0%,rgba(217,169,154,0.30)_0%,transparent_70%)]"
      />

      {/* Logo bow as a large, faint watermark behind the quote */}
      <motion.div
        style={{ y }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[min(90%,620px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.13]"
      >
        <Image src="/images/logo-mark-sm.webp" alt="Paper Dreamz ribbon bow watermark" fill sizes="620px" className="object-contain" />
      </motion.div>

      {/* Fine double-line gold frame */}
      <div aria-hidden className="pointer-events-none absolute inset-5 border border-gold/50 sm:inset-8" />
      <div aria-hidden className="pointer-events-none absolute inset-7 border border-gold/20 sm:inset-10" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.5em] text-gold-deep">{banner.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div aria-hidden className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <Image src="/images/logo-mark-sm.webp" alt="Paper Dreamz ribbon bow emblem" width={600} height={471} className="h-auto w-9 sm:w-11" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-3xl font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.25] tracking-tight text-ink">
            &ldquo;{banner.quote}&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}
