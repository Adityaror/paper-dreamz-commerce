"use client";

import Image from "next/image";
import { ArrowRight, Flower2, Gift, ImagePlus, Package, Palette, Type, Users } from "lucide-react";
import Reveal from "./Reveal";
import EnquiryForm from "./EnquiryForm";
import { resolveAssetUrl } from "@/lib/api";
import { PAGES_CONTENT as P } from "@/lib/content/pages";
import { usePageContent } from "@/lib/usePageContent";

/** Icons for the customisation options, in order; the text comes from Admin → Pages → Custom Orders Page. */
const OPTION_ICONS = [Type, Palette, Flower2, Gift, Users, Package];

export default function CustomOrders() {
  const options = usePageContent("custom-orders.options", P["custom-orders.options"]);
  const how = usePageContent("custom-orders.steps", P["custom-orders.steps"]);

  return (
    <>
      <section id="options" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">{options.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-ink">{options.heading}</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {options.items.map((o, i) => {
              const Icon = OPTION_ICONS[i % OPTION_ICONS.length];
              return (
              <Reveal key={o.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-sm border border-gold/25 bg-white/60 p-7 shadow-[0_10px_30px_rgba(44,36,32,0.06)]">
                  <Icon size={22} className="text-gold-deep" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-xl text-ink">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-taupe">{o.body}</p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-cream-2/60 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal className="flex flex-col gap-4 border-b border-gold/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">{how.eyebrow}</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-ink">{how.heading}</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-taupe sm:text-right">
              {how.subtext}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
              <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-sm border border-gold/40" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/20 shadow-xl">
                <Image src={resolveAssetUrl(how.image) ?? P["custom-orders.steps"].image} alt={how.image_alt} fill sizes="(max-width:1024px) 90vw, 35vw" className="object-cover" />
              </div>
            </Reveal>
            <div className="lg:col-span-7">
              <ol className="space-y-6">
                {how.steps.map((s, i) => (
                  <Reveal key={s.step} delay={i * 0.08}>
                    <li className="flex gap-6 border-b border-gold/20 pb-6">
                      <span className="font-script text-4xl italic text-gold-deep">{s.step}</span>
                      <div>
                        <h3 className="font-display text-xl text-ink">{s.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-taupe">{s.body}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
              <Reveal delay={0.3} className="mt-8 flex flex-col gap-5 rounded-sm border border-gold/30 bg-ivory p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <ImagePlus size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" />
                  <p className="text-sm leading-relaxed text-taupe">
                    <span className="block font-display text-base text-ink">{how.callout_title}</span>
                    {how.callout_text}
                  </p>
                </div>
                <a
                  href="#enquire"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
                >
                  {how.callout_button} <ArrowRight size={13} />
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function CustomOrderForm() {
  const form = usePageContent("custom-orders.form", P["custom-orders.form"]);

  return (
    <section id="enquire" className="scroll-mt-32 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">{form.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-ink">{form.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-taupe">
            {form.intro}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 rounded-sm border border-gold/25 bg-white/60 p-6 sm:p-10 shadow-[0_10px_30px_rgba(44,36,32,0.06)]">
          <EnquiryForm variant="custom" />
        </Reveal>
      </div>
    </section>
  );
}
