"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { allProducts, productHref, useCatalog } from "@/lib/catalog";

/** Photo wall of every product; each photo opens that product on the shop page. */
export default function GalleryGrid() {
  const items = allProducts(useCatalog());
  const filters = [...new Map(items.map(({ sub }) => [sub.slug, sub.name])).entries()];
  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? items.filter(({ sub }) => sub.slug === filter) : items;

  return (
    <section id="gallery" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col gap-6 border-b border-gold/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div role="tablist" aria-label="Filter by collection" className="flex flex-wrap gap-2">
            {[[null, "All"] as const, ...filters].map(([slug, name]) => {
              const on = filter === slug;
              return (
                <button
                  key={slug ?? "all"}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(slug)}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    on ? "border-gold-deep bg-cream-2 text-ink" : "border-gold/30 text-taupe hover:text-ink"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <p className="font-script text-xl italic text-gold-deep">
            {shown.length} {shown.length === 1 ? "design" : "designs"}, handmade every one
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ product, sub }, i) => (
            <Reveal key={product.code} delay={(i % 3) * 0.06}>
              <Link
                href={productHref(product.code)}
                className="group relative block overflow-hidden rounded-sm border border-gold/25 bg-cream-2 shadow-md transition-shadow duration-500 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={product.img}
                    alt={`${product.name} — ${sub.name}`}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-cream/95 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold-deep shadow-md">
                    {product.code}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 bg-ivory px-5 py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold-deep">{sub.name}</p>
                    <h3 className="mt-0.5 font-playfair text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-gold-deep">
                      {product.name}
                    </h3>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-colors group-hover:bg-bottle-green group-hover:text-gold-light">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
