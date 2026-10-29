"use client";

import Reveal from "./Reveal";
import { HOME_CONTENT } from "@/lib/content/home";
import { usePageContent } from "@/lib/usePageContent";

export default function MissionVision() {
  const content = usePageContent("home.mission-vision", HOME_CONTENT["home.mission-vision"]);

  return (
    <section id="mission-vision" className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[2.5rem] border border-gold/15 bg-white/70 px-6 py-12 shadow-[0_40px_100px_-60px_rgba(15,43,30,0.35)] backdrop-blur-sm sm:px-12 sm:py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
              {content.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-ink">
              {content.heading} <span className="font-script text-gold text-5xl sm:text-6xl">{content.accent}</span>
            </h2>
            <div className="mx-auto mt-7 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-gold/50" />
              <span className="h-2 w-2 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gold/50" />
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {content.pillars.map((p, i) => (
              <Reveal key={p.eyebrow} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-[1.5rem] border border-gold/20 bg-white p-8 shadow-[0_24px_60px_-42px_rgba(15,43,30,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 sm:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
                    {p.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1] text-ink">
                    {p.heading}
                    <br />
                    <span className="font-script text-gold text-4xl sm:text-5xl">{p.accent_word}</span>
                  </h3>
                  <p className="mt-6 text-[15px] leading-relaxed text-taupe">{p.body}</p>
                  <p className="mt-auto pt-8 font-script text-xl italic leading-snug text-emerald-2 sm:text-2xl">
                    &ldquo;{p.quote}&rdquo;
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mx-auto mt-10 max-w-2xl text-center">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-emerald-2">
              {content.signature}
            </p>
            <p className="mt-3 text-[15px] italic text-taupe">
              {content.tagline}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
