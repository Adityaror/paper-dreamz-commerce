"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { apiGet } from "@/lib/api";

type ValueProp = {
  id: number;
  title: string;
  description: string;
  sort_order: number;
};

const FALLBACK_VALUES = [
  { title: "Handmade", desc: "Crafted with love & care" },
  { title: "Custom Orders", desc: "Personalized for your occasion" },
  { title: "Premium Quality", desc: "Finest materials, timeless keepsakes" },
  { title: "Safe Delivery", desc: "Carefully packed, worldwide" },
];

export default function ValueStrip() {
  const [values, setValues] = useState(FALLBACK_VALUES);

  useEffect(() => {
    let cancelled = false;

    apiGet<ValueProp[]>("/value-props").then((valueProps) => {
      if (cancelled || !valueProps || valueProps.length === 0) return;

      setValues(valueProps.map((v) => ({ title: v.title, desc: v.description })));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="value-strip" aria-labelledby="value-strip-heading" className="relative bg-bottle-green py-7 sm:py-8 overflow-hidden">
      <h2 id="value-strip-heading" className="sr-only">Why choose Paper Dreamz</h2>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 overflow-x-auto scrollbar-hide">
        <Reveal className="flex flex-nowrap items-center justify-center gap-x-5 md:gap-x-8 lg:gap-x-12 w-max mx-auto">
          {values.map((v, i) => (
            <div key={v.title} className="flex items-center gap-x-5 md:gap-x-8 lg:gap-x-12 shrink-0">
              <div className="text-center whitespace-nowrap">
                <h3 className="font-display text-[13px] md:text-[15px] lg:text-base text-gold-light tracking-wide">
                  {v.title}
                </h3>
                <p className="mt-1 text-[9px] md:text-[10.5px] uppercase tracking-[0.14em] md:tracking-[0.18em] text-ivory-dim">
                  {v.desc}
                </p>
              </div>
              {i < values.length - 1 && (
                <span className="block h-8 w-px shrink-0 bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
