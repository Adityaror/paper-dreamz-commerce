"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import { useTheme } from "@/context/ThemeContext";
import { apiGet } from "@/lib/api";
import { TESTIMONIALS, TESTIMONIALS_SECTION, type Testimonial } from "@/lib/content/testimonials";

type TestimonialsResponse = {
  section: { heading: string | null; subtext: string | null } | null;
  items: { name: string; city: string | null; highlight: string; body: string[] }[];
};

const AUTOPLAY_MS = 9000;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Stars() {
  return (
    <div className="flex gap-1 text-emerald-2" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, size = "sm", dark = false }: { name: string; size?: "sm" | "lg"; dark?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-script italic transition-colors duration-500 ${
        size === "lg" ? "h-16 w-16 text-2xl" : "h-12 w-12 text-lg"
      } ${
        dark
          ? "bg-white/5 text-gold-light ring-1 ring-gold/70 ring-offset-2 ring-offset-emerald"
          : "bg-emerald/[0.06] text-emerald-2 ring-1 ring-gold/50 ring-offset-2 ring-offset-[#fbf6ea]"
      }`}
    >
      {initials(name)}
    </span>
  );
}

export default function Experience() {
  const { getSectionThemeStyle } = useTheme();
  const theme = getSectionThemeStyle("experience");

  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [section, setSection] = useState(TESTIMONIALS_SECTION);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);

  useEffect(() => {
    let cancelled = false;
    apiGet<TestimonialsResponse>("/testimonials").then((data) => {
      if (cancelled || !data) return;
      if (data.section) {
        setSection({
          heading: data.section.heading || TESTIMONIALS_SECTION.heading,
          subtext: data.section.subtext || TESTIMONIALS_SECTION.subtext,
        });
      }
      if (data.items?.length > 0) {
        setTestimonials(
          data.items.map((t) => ({
            name: t.name,
            city: t.city ?? "",
            highlight: t.highlight,
            body: t.body.length > 0 ? t.body : [t.highlight],
          })),
        );
        setActive(0);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = testimonials.length;
  const current = testimonials[active] ?? testimonials[0];
  const hasMore = current.body.join(" ").length > current.highlight.length + 40;

  const go = useCallback(
    (i: number) => {
      setActive(((i % total) + total) % total);
      setExpanded(false);
    },
    [total],
  );

  useEffect(() => {
    if (paused || expanded) return;
    const id = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, expanded, go]);

  return (
    <section
      id="experience"
      style={{ backgroundColor: theme.customHex || undefined }}
      className={`relative overflow-hidden py-20 sm:py-28 transition-colors duration-500 ${theme.bgClass}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className={`font-display text-5xl leading-[1] tracking-tight sm:text-6xl lg:text-7xl ${theme.textClass}`}>
            {section.heading}
          </h2>
          <div className="mx-auto mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-14 bg-gold/50" />
            <span className="h-2 w-2 rotate-45 bg-gold" />
            <span className="h-px w-14 bg-gold/50" />
          </div>
          <p className={`mt-6 text-sm leading-relaxed sm:text-base ${theme.subtextClass}`}>{section.subtext}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8"
          >
            {/* Active testimonial */}
            <div className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border border-gold/20 bg-[#fbf6ea] p-8 shadow-[0_30px_70px_-35px_rgba(15,43,30,0.45)] sm:p-12">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-6 select-none font-script text-[11rem] leading-none text-emerald/10"
              >
                “
              </span>

              <div className="relative flex-1">
                <Stars />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <blockquote className="mt-7 font-script text-2xl italic leading-[1.55] text-ink sm:text-[1.75rem] lg:text-3xl">
                      “{current.highlight}”
                    </blockquote>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 max-h-56 space-y-4 overflow-y-auto pr-3 text-sm leading-relaxed text-taupe">
                            {current.body.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        aria-expanded={expanded}
                        className="mt-6 cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-gold-deep underline decoration-gold/40 underline-offset-8 transition-colors hover:text-gold"
                      >
                        {expanded ? "Show less" : "Read the full note"}
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative mt-8 border-t border-ink/10 pt-8">
                <div className="flex items-center gap-5">
                  <Avatar name={current.name} size="lg" />
                  <div>
                    <p className="font-script text-xl text-ink sm:text-2xl">{current.name}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-2">{current.city}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-2" role="tablist" aria-label="Testimonial progress">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.name}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`Show testimonial from ${t.name}`}
                      onClick={() => go(i)}
                      className="group h-4 flex-1 cursor-pointer"
                    >
                      <span className="block h-[3px] w-full overflow-hidden rounded-full bg-ink/10 transition-colors group-hover:bg-ink/20">
                        <motion.span
                          key={`${i}-${i === active && !paused && !expanded}`}
                          initial={{ width: i < active ? "100%" : "0%" }}
                          animate={{ width: i < active ? "100%" : i === active && !paused && !expanded ? "100%" : "0%" }}
                          transition={{
                            duration: i === active && !paused && !expanded ? AUTOPLAY_MS / 1000 : 0,
                            ease: "linear",
                          }}
                          className="block h-full rounded-full bg-emerald-2"
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selector grid */}
            <div className="grid content-start gap-3 sm:grid-cols-2 sm:gap-4">
              {testimonials.map((t, i) => {
                const on = i === active;
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => go(i)}
                    aria-pressed={on}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-500 ${
                      on
                        ? "bg-emerald text-ivory shadow-xl shadow-emerald/30"
                        : "bg-[#fbf6ea] text-ink shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                  >
                    <Avatar name={t.name} dark={on} />
                    <span className="min-w-0">
                      <span className="block truncate font-script text-[15px]">{t.name}</span>
                      <span
                        className={`mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.2em] ${
                          on ? "text-ivory-dim" : "text-emerald-2"
                        }`}
                      >
                        {t.city}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
