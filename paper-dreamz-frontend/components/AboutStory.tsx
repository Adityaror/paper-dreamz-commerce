"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Quote, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import FloralOrnament from "./FloralOrnament";
import WorldReach from "./WorldReach";
import { resolveAssetUrl } from "@/lib/api";
import { ABOUT_CONTENT as A } from "@/lib/content/about";
import { withBold } from "@/lib/richText";
import { usePageContent } from "@/lib/usePageContent";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

function EstSeal() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <path id="about-seal-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="#faf7f2" stroke="#c5a059" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#c5a059" strokeOpacity="0.5" strokeWidth="1" />
      <text fill="#9c7a3f" fontSize="15" letterSpacing="5" className="uppercase" style={{ fontFamily: "var(--font-urbanist)" }}>
        <textPath href="#about-seal-circle">Paper Dreamz · Since 2010 · Delhi ·</textPath>
      </text>
      <text x="100" y="96" textAnchor="middle" fill="#9c7a3f" fontSize="13" letterSpacing="3" style={{ fontFamily: "var(--font-urbanist)" }}>
        EST.
      </text>
      <text x="100" y="122" textAnchor="middle" fill="#2c2420" fontSize="28" style={{ fontFamily: "var(--font-cormorant)" }}>
        2010
      </text>
    </svg>
  );
}

export default function AboutStory() {
  const reduceMotion = useReducedMotion();
  const hero = usePageContent("about.hero", A["about.hero"]);
  const crafts = usePageContent("about.crafts", A["about.crafts"]);
  const story = usePageContent("about.story", A["about.story"]);
  const stats = usePageContent("about.stats", A["about.stats"]);
  const journey = usePageContent("about.journey", A["about.journey"]);
  const envelopes = usePageContent("about.envelopes", A["about.envelopes"]);
  const promise = usePageContent("about.promise", A["about.promise"]);
  const happiness = usePageContent("about.happiness", A["about.happiness"]);
  const nextChapter = usePageContent("about.next-chapter", A["about.next-chapter"]);
  const note = usePageContent("about.personal-note", A["about.personal-note"]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 120]);

  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ["start 70%", "end 60%"] });
  const lineScale = useTransform(journeyProgress, [0, 1], [0, 1]);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section ref={heroRef} id="about-hero" className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-2 text-ink pt-[150px] sm:pt-[170px] pb-20 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_20%,rgba(197,160,89,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <FloralOrnament className="pointer-events-none absolute -right-6 top-24 w-44 text-gold/45 sm:w-60 lg:-right-10 lg:top-28 lg:w-72" />
        <FloralOrnament className="pointer-events-none absolute -bottom-8 -left-8 w-36 -scale-x-100 rotate-180 text-gold/35 sm:w-48" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-medium">
                {hero.heading}
                <span className="mt-3 block font-script italic text-gold-deep text-5xl sm:text-7xl lg:text-8xl">
                  {hero.accent}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl border-l-2 border-gold/60 pl-5 text-[15px] sm:text-base leading-relaxed text-taupe">
                {hero.intro}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="#journey"
                  className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
                >
                  {hero.primary_cta_label} <ArrowRight size={14} />
                </Link>
                <Link
                  href="/#collections"
                  className="inline-flex items-center rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
                >
                  {hero.secondary_cta_label}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <motion.div style={reduceMotion ? undefined : { y: heroImageY }} className="relative mx-auto max-w-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl border border-gold/30 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src={resolveAssetUrl(hero.image) ?? A["about.hero"].image}
                  alt={hero.image_alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-6 sm:-left-12 w-36 sm:w-44 rotate-[-6deg] overflow-hidden rounded-xl border-4 border-ivory shadow-2xl">
                <div className="relative aspect-square">
                  <Image src={resolveAssetUrl(hero.inset_image) ?? A["about.hero"].inset_image} alt={hero.inset_image_alt} fill sizes="180px" className="object-cover" />
                </div>
              </div>
              <motion.div
                className="absolute -top-6 -right-2 sm:-right-8 h-28 w-28 sm:h-32 sm:w-32"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 28, ease: "linear", repeat: Infinity }}
              >
                <EstSeal />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────── Craft marquee ───────────── */}
      <div className="group relative overflow-hidden border-y border-gold/40 bg-bottle-green py-5 sm:py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bottle-green to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bottle-green to-transparent sm:w-28" />
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {crafts.items.map((c) => (
                <li key={c} className="flex items-center gap-8 px-4 font-script text-2xl sm:text-3xl italic font-medium text-ivory whitespace-nowrap">
                  {c}
                  <Sparkles size={14} className="text-gold-light" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ───────────── About Us ───────────── */}
      <section id="about-us" className="relative py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
              {story.heading}
              <span className="block font-script italic text-gold-deep text-5xl sm:text-6xl mt-2">{story.accent}</span>
            </h2>
            <blockquote className="mt-10 rounded-2xl border border-gold/25 bg-white/60 p-7 backdrop-blur-sm">
              <Quote size={22} className="text-gold" />
              <p className="mt-3 font-script text-2xl italic leading-snug text-ink">
                {story.quote}
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7 lg:pt-14">
            <div className="space-y-6 text-[16px] leading-[1.85] text-taupe">
              {story.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:font-script first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold-deep"
                      : undefined
                  }
                >
                  {withBold(paragraph, "font-semibold text-ink")}
                </p>
              ))}
              <p className="font-display text-xl sm:text-2xl leading-snug text-ink">
                {story.closing_text} <span className="text-gold-deep">{story.closing_highlight}</span>.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/25 bg-white/50 backdrop-blur-sm lg:grid-cols-4">
            {stats.items.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.08}
                className={`p-7 sm:p-9 text-center ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0 border-gold/20`}
              >
                <p className="font-script text-5xl sm:text-6xl text-gold-deep">{s.value}</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-taupe">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Journey timeline ───────────── */}
      <section id="journey" className="relative bg-cream-2/70 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-36">
              <Reveal>
                <Eyebrow>{journey.eyebrow}</Eyebrow>
                <h2 className="mt-6 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
                  {journey.heading} <span className="font-script italic text-gold-deep">{journey.accent}</span>
                </h2>
                <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-taupe">
                  {journey.intro}
                </p>
              </Reveal>
            </div>
          </div>

          <div ref={journeyRef} className="relative lg:col-span-8">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gold/20 sm:left-[23px]" />
            <motion.div
              style={{ scaleY: reduceMotion ? 1 : lineScale }}
              className="absolute left-[19px] top-2 bottom-2 w-px origin-top bg-gold sm:left-[23px]"
            />

            <ol className="space-y-14">
              {journey.steps.map((j, i) => (
                <li key={j.title} className="relative pl-14 sm:pl-20">
                  <span className="absolute left-0 top-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gold bg-cream font-script text-lg sm:text-xl text-gold-deep shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Reveal className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-gold/20 bg-white/70 shadow-[0_10px_40px_rgba(44,36,32,0.06)] transition-shadow hover:shadow-[0_18px_50px_rgba(44,36,32,0.12)] sm:grid-cols-5">
                    <div className="relative aspect-[16/10] sm:col-span-2 sm:aspect-auto sm:min-h-[200px] overflow-hidden">
                      <Image
                        src={resolveAssetUrl(j.image) ?? "/images/craft_design_sketch.webp"}
                        alt={j.title}
                        fill
                        sizes="(max-width: 640px) 90vw, 300px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 sm:col-span-3 sm:p-8">
                      <h3 className="font-display text-2xl text-ink">{j.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-taupe">{j.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── Envelopes ───────────── */}
      <section id="envelopes" className="relative overflow-hidden bg-cream-2/60 text-ink py-24 lg:py-32">
        <p
          aria-hidden
          className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-script text-[22vw] leading-none text-gold/[0.08] select-none"
        >
          {envelopes.watermark}
        </p>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 sm:px-10 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-gold/30">
              <Image src={resolveAssetUrl(envelopes.image) ?? A["about.envelopes"].image} alt={envelopes.image_alt} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 right-6 rounded-xl border border-gold/40 bg-white/95 px-6 py-4 shadow-2xl backdrop-blur">
              <p className="font-script text-3xl text-gold-deep">{envelopes.badge_value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-taupe">{envelopes.badge_label}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <Eyebrow>{envelopes.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl leading-[1.1]">
              {envelopes.heading}
              <span className="block font-script italic text-gold-deep mt-1">{envelopes.accent}</span>
            </h2>
            {envelopes.paragraphs.map((paragraph, i) => (
              <p key={i} className={`${i === 0 ? "mt-7" : "mt-5"} text-[15px] leading-relaxed text-taupe`}>
                {paragraph}
              </p>
            ))}
            <p className="mt-8 border-l-2 border-gold pl-5 font-display text-xl leading-snug text-ink">
              {envelopes.quote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Promise ───────────── */}
      <section id="promise" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <Eyebrow>{promise.eyebrow}</Eyebrow>
            </div>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
              {promise.heading} <span className="font-script italic text-gold-deep">{promise.accent}</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-taupe">
              {promise.intro}
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {promise.steps.map((p, i) => (
              <Reveal
                key={p.step}
                delay={i * 0.1}
                className="group relative overflow-hidden rounded-2xl border border-gold/25 bg-white/60 p-8 transition-colors duration-500 hover:bg-cream-2"
              >
                <span className="font-script text-6xl text-gold/40 transition-colors group-hover:text-gold/60">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-2xl text-ink">{p.step}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-taupe">{p.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-taupe mr-2">{promise.values_label}</span>
            {promise.values.map((v) => (
              <span key={v} className="rounded-full border border-gold/40 bg-cream px-5 py-2 text-[13px] text-ink">
                {v}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <WorldReach />

      {/* ───────────── Client happiness ───────────── */}
      <section id="happiness" className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Reveal className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-white/80 to-cream-2 p-10 sm:p-16 text-center shadow-[0_20px_60px_rgba(44,36,32,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush/25">
              <Heart size={22} className="fill-blush text-blush" />
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">{happiness.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-ink">
              {happiness.heading} <span className="font-script italic text-gold-deep">{happiness.accent}</span>
            </h2>
            {happiness.paragraphs.map((paragraph, i) => (
              <p key={i} className={`mx-auto ${i === 0 ? "mt-6" : "mt-4"} max-w-2xl text-[15px] leading-relaxed text-taupe`}>
                {paragraph}
              </p>
            ))}
            <Link
              href="/#experience"
              className="mt-9 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-deep hover:text-ink transition-colors"
            >
              {happiness.link_label} <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Next chapter + founder quote ───────────── */}
      <section id="next-chapter" className="relative overflow-hidden bg-cream-2/60 text-ink">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[640px]">
            <Image src={resolveAssetUrl(nextChapter.image) ?? A["about.next-chapter"].image} alt={nextChapter.image_alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-cream-2 via-cream-2/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-cream-2" />
          </div>
          <div className="flex max-w-2xl flex-col justify-center px-6 py-20 sm:px-14 lg:px-20">
            <Reveal>
              <Eyebrow>{nextChapter.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl leading-[1.1]">
                {nextChapter.heading} <span className="font-script italic text-gold-deep">{nextChapter.accent}</span>
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-taupe">
                {nextChapter.body}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <figure className="mt-12 border-t border-gold/25 pt-10">
                <Quote size={28} className="text-gold" />
                <blockquote className="mt-4 font-script text-3xl sm:text-4xl italic leading-tight text-ink">
                  {nextChapter.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4">
                  <span className="h-px w-10 bg-gold" />
                  <span>
                    <span className="block font-script text-2xl text-gold-deep">{nextChapter.quote_name}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-taupe">{nextChapter.quote_role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Personal note ───────────── */}
      <section id="personal-note" className="py-24 lg:py-32">
        <Reveal className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <div className="flex justify-center">
            <Eyebrow>{note.eyebrow}</Eyebrow>
          </div>
          <p className="mt-8 font-display text-2xl sm:text-3xl leading-snug text-ink">
            {note.text}
            <span className="block mt-3 font-script italic text-gold-deep text-3xl sm:text-4xl">{note.accent}</span>
          </p>
          <div className="mx-auto my-12 h-px w-24 bg-gold/50" />
          <p className="font-logo text-xl tracking-[0.3em] uppercase text-ink">{note.signature}</p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-taupe">
            {note.tagline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/#collections"
              className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
            >
              {note.primary_cta_label} <ArrowRight size={14} />
            </Link>
            <Link
              href="/#experience"
              className="inline-flex items-center rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
            >
              {note.secondary_cta_label}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
