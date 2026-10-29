"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import { useTheme } from "@/context/ThemeContext";
import { useCatalog } from "@/lib/catalog";
import { HOME_CONTENT } from "@/lib/content/home";
import { usePageContent } from "@/lib/usePageContent";

export default function Collections() {
  const { getSectionThemeStyle } = useTheme();
  const theme = getSectionThemeStyle("collections");
  const groups = useCatalog();
  const content = usePageContent("home.collections", HOME_CONTENT["home.collections"]);

  return (
    <section
      id="collections"
      style={theme.customHex ? { backgroundColor: theme.customHex } : undefined}
      className={`collections-serif relative py-16 sm:py-20 transition-colors duration-500 ${theme.bgClass}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-current/10 pb-8">
          <h2
            className={`font-playfair text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight font-semibold ${theme.textClass}`}
          >
            {content.heading}
          </h2>
          <p
            className={`font-playfair max-w-xs text-sm sm:text-right ${theme.subtextClass}`}
          >
            {content.subtext}
          </p>
        </Reveal>

        <div className="relative mt-10">
          <button
            aria-label="Previous"
            className="hidden md:flex absolute left-[-1.5rem] top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-noir text-ivory border border-gold/30 hover:bg-emerald-2 hover:border-gold transition-colors cursor-pointer shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next"
            className="hidden md:flex absolute right-[-1.5rem] top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-noir text-ivory border border-gold/30 hover:bg-emerald-2 hover:border-gold transition-colors cursor-pointer shadow-lg"
          >
            <ChevronRight size={18} />
          </button>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {groups.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.07} className="group">
                <a
                  href={`/shop#${item.slug}`}
                  className="block"
                >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-gold/20 shadow-md">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 18vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <h3
                  className={`font-playfair mt-5 text-lg font-semibold ${theme.textClass}`}
                >
                  {item.name}
                </h3>
                <p
                  className={`mt-1 text-[11px] uppercase tracking-[0.15em] font-code ${theme.subtextClass}`}
                >
                  {item.children.length > 0
                    ? `${item.children.length} ${item.children.length === 1 ? "Design" : "Designs"}`
                    : item.tag}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 border-b border-gold/50 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold-deep transition-colors group-hover:border-gold-deep">
                  Explore More
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-14 flex justify-center">
          <motion.a
            whileHover={{ y: -2 }}
            href="/shop"
            className="font-playfair btn-elite inline-flex items-center rounded-sm bg-bottle-green px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-light border border-gold/40 hover:bg-emerald-2 transition-colors shadow-md"
          >
            {content.button_label}
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}

