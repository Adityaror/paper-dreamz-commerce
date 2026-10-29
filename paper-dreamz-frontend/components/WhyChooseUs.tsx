"use client";

import Reveal from "./Reveal";
import { HOME_CONTENT } from "@/lib/content/home";
import { usePageContent } from "@/lib/usePageContent";

export default function WhyChooseUs() {
  const content = usePageContent("home.why-choose-us", HOME_CONTENT["home.why-choose-us"]);

  return (
    <section id="why-choose-us" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
              {content.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink">
              {content.heading}
              <br />
              <span className="font-script text-gold text-5xl sm:text-6xl">{content.accent}</span>
            </h2>
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-taupe">
              {content.intro}
            </p>
            <p className="mt-8 max-w-sm font-script text-2xl italic leading-snug text-emerald-2 sm:text-3xl">
              &ldquo;{content.quote}&rdquo;
            </p>
            <a
              href={content.cta_link}
              className="mt-9 inline-flex items-center rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors shadow-sm"
            >
              {content.cta_label}
            </a>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="border-t border-gold/20">
              {content.reasons.map((r, i) => (
                <Reveal key={r.title} delay={Math.min(i, 5) * 0.05}>
                  <div className="group flex items-baseline gap-5 border-b border-gold/20 py-6 transition-colors hover:bg-gold/[0.03] sm:gap-7 sm:py-7">
                    <span className="shrink-0 font-display text-xl text-gold-deep/60 transition-colors group-hover:text-gold-deep sm:text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-ink sm:text-xl">{r.title}</h3>
                      <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-taupe">{r.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.1} className="relative mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#f6ecd9] px-6 py-14 text-center sm:px-16 sm:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-4 rounded-[1.4rem] border border-gold/50 sm:inset-6" />
            <div aria-hidden className="pointer-events-none absolute inset-6 rounded-[1.2rem] border border-gold/20 sm:inset-9" />

            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-script text-[7rem] leading-none text-gold/15 sm:top-8 sm:text-[9rem]"
            >
              &ldquo;
            </span>

            <div className="relative">
              <p className="mx-auto max-w-2xl font-script text-2xl italic leading-snug text-ink sm:text-3xl">
                {content.closing_quote}
              </p>

              <div className="mx-auto mt-8 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gold/50" />
                <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                <span className="h-px w-10 bg-gold/50" />
              </div>

              <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-3">
                {content.differentiators.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-gold/35 bg-white/70 px-4 py-1.5 font-display text-[10.5px] uppercase tracking-[0.2em] text-gold-deep"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <a
                href={content.closing_cta_link}
                className="mt-10 inline-flex items-center rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors shadow-sm"
              >
                {content.closing_cta_label}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
