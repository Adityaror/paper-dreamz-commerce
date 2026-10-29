"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import FloralOrnament from "./FloralOrnament";
import { resolveAssetUrl } from "@/lib/api";
import { usePageContent } from "@/lib/usePageContent";

/**
 * Light cream page header shared by the inner pages (Shop, Custom Orders, Contact, FAQs, policies).
 * With `contentKey` (e.g. "shop.hero"), the text and photo are replaced by that block from Admin → Pages once it loads.
 */
export default function PageHero({
  contentKey,
  children,
  ...props
}: {
  contentKey?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  const fallback = {
    eyebrow: props.eyebrow,
    title: props.title,
    accent: props.accent ?? "",
    intro: props.intro ?? "",
    image: props.image ?? "",
    image_alt: props.imageAlt ?? "",
  };
  const content = usePageContent(contentKey ?? "", fallback, Boolean(contentKey));
  const { eyebrow, title, accent, intro } = content;
  const image = resolveAssetUrl(content.image);
  const imageAlt = content.image_alt;

  return (
    <section id="page-hero" className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-2 text-ink pt-[150px] sm:pt-[170px] pb-14 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_20%,rgba(197,160,89,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

      {/* Floral corners */}
      <FloralOrnament className="pointer-events-none absolute -right-6 top-24 w-44 text-gold/45 sm:w-60 lg:-right-10 lg:top-28 lg:w-72" />
      <FloralOrnament className="pointer-events-none absolute -bottom-8 -left-8 w-36 -scale-x-100 rotate-180 text-gold/35 sm:w-48" />

      <div className={`relative mx-auto max-w-7xl px-6 sm:px-10 ${image ? "grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10" : ""}`}>
        <div className={image ? "lg:col-span-7" : ""}>
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
              <span className="h-px w-8 bg-current opacity-60" />
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-4xl font-display text-[2.4rem] leading-[1.05] sm:text-6xl lg:text-7xl font-medium">
              {title}
              {accent && (
                <span className="mt-2 block font-script italic text-gold-deep text-4xl sm:text-6xl lg:text-7xl">{accent}</span>
              )}
            </h1>
          </Reveal>
          {intro && (
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-2xl border-l-2 border-gold/60 pl-5 text-[15px] sm:text-base leading-relaxed text-taupe">
                {intro}
              </p>
            </Reveal>
          )}
          {children && <Reveal delay={0.3}>{children}</Reveal>}
        </div>

        {image && (
          <Reveal delay={0.2} className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-sm">
              <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-sm border border-gold/40" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-sm border border-gold/30 bg-cream-2 shadow-2xl">
                <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1024px) 80vw, 35vw" className="object-cover" />
              </div>
              <FloralOrnament className="pointer-events-none absolute -bottom-10 -left-12 w-32 rotate-[200deg] text-gold-deep/70 sm:w-40" />
              <span className="absolute -right-3 top-8 rounded-full border border-gold/40 bg-cream/95 px-4 py-1.5 font-script text-lg italic text-gold-deep shadow-lg">
                Handcrafted with love
              </span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
