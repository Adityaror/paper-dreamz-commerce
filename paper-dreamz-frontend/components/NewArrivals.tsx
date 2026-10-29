"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { useTheme } from "@/context/ThemeContext";
import { ShoppingBag } from "lucide-react";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { cart } from "@/lib/cart";
import { HOME_CONTENT } from "@/lib/content/home";
import { usePageContent } from "@/lib/usePageContent";

type Product = {
  id: number;
  name: string;
  slug: string;
  badge: string | null;
  tag: string | null;
  price: number;
  unit: string | null;
  image: string | null;
  compare_price: number | null;
  is_new_arrival: boolean;
  is_hot_deal: boolean;
  is_best_seller: boolean;
  sort_order: number;
};

export type CategoryId = "new-arrivals" | "hot-deals" | "best-sellers";

/** Dispatch with a CategoryId as `detail` to switch the active tab from elsewhere (e.g. the promo popup). */
export const SHOW_CATEGORY_EVENT = "pd:show-category";

const CATEGORY_IDS: CategoryId[] = ["new-arrivals", "hot-deals", "best-sellers"];


type DisplayProduct = {
  badge: string;
  tag: string;
  name: string;
  price: string;
  priceValue: number;
  comparePrice?: string;
  unit: string;
  img: string;
  categories: CategoryId[];
};

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

const FALLBACK_PRODUCTS: DisplayProduct[] = [
  {
    badge: "Bestseller",
    tag: "Top Picks",
    name: "Royal Ivory Filigree Suite",
    price: "₹1,499",
    priceValue: 1499,
    unit: "Set of 10",
    img: "/images/collection_envelopes.webp",
    categories: ["best-sellers"],
  },
  {
    badge: "New",
    tag: "Heritage Edit",
    name: "Emerald Velvet Shagun",
    price: "₹1,899",
    priceValue: 1899,
    unit: "Set of 10",
    img: "/images/hero_emerald_envelope.webp",
    categories: ["new-arrivals"],
  },
  {
    badge: "Trending",
    tag: "Destination Wedding",
    name: "Maroon Peacock Sagan",
    price: "₹2,199",
    priceValue: 2199,
    comparePrice: "₹2,499",
    unit: "Set of 10",
    img: "/images/new_maroon_peacock.webp",
    categories: ["new-arrivals", "hot-deals"],
  },
  {
    badge: "Signature",
    tag: "Featured",
    name: "Anniversary Keepsake Box",
    price: "₹2,499",
    priceValue: 2499,
    unit: "Piece",
    img: "/images/k.webp",
    categories: ["best-sellers"],
  },
];

export default function NewArrivals() {
  const { getSectionThemeStyle } = useTheme();
  const theme = getSectionThemeStyle("arrivals");
  const [products, setProducts] = useState<DisplayProduct[]>(FALLBACK_PRODUCTS);
  const [active, setActive] = useState<CategoryId>("new-arrivals");
  const content = usePageContent("home.new-arrivals", HOME_CONTENT["home.new-arrivals"]);
  const CATEGORIES: { id: CategoryId; label: string; description: string }[] = [
    { id: "new-arrivals", label: content.new_arrivals_label, description: content.new_arrivals_description },
    { id: "hot-deals", label: content.hot_deals_label, description: content.hot_deals_description },
    { id: "best-sellers", label: content.best_sellers_label, description: content.best_sellers_description },
  ];

  useEffect(() => {
    let cancelled = false;

    apiGet<Product[]>("/products").then((items) => {
      if (cancelled || !items || items.length === 0) return;

      setProducts(
        items.map((p) => ({
          badge: p.badge ?? "",
          tag: p.tag ?? "",
          name: p.name,
          price: formatPrice(p.price),
          priceValue: p.price,
          comparePrice: p.compare_price ? formatPrice(p.compare_price) : undefined,
          unit: p.unit ?? "",
          img: resolveAssetUrl(p.image) ?? "/images/collection_envelopes.webp",
          categories: [
            p.is_new_arrival && "new-arrivals",
            p.is_hot_deal && "hot-deals",
            p.is_best_seller && "best-sellers",
          ].filter(Boolean) as CategoryId[],
        })),
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onShowCategory = (e: Event) => {
      const id = (e as CustomEvent<CategoryId>).detail;
      if (CATEGORY_IDS.includes(id)) setActive(id);
    };
    window.addEventListener(SHOW_CATEGORY_EVENT, onShowCategory);
    return () => window.removeEventListener(SHOW_CATEGORY_EVENT, onShowCategory);
  }, []);

  const activeCategory = CATEGORIES.find((c) => c.id === active)!;
  const visible = products.filter((p) => p.categories.includes(active));

  return (
    <section
      id="new-arrivals"
      style={{ backgroundColor: theme.customHex || undefined }}
      className={`relative py-16 sm:py-20 transition-colors duration-500 ${theme.bgClass}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-current/10 pb-8">
          <h2 className={`font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight ${theme.textClass}`}>
            {activeCategory.label}
          </h2>
          <p className={`max-w-sm text-sm sm:text-right ${theme.subtextClass}`}>{activeCategory.description}</p>
        </Reveal>

        <div role="tablist" aria-label="Product categories" className="mt-8 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                active === c.id
                  ? "border-gold bg-bottle-green text-gold-light shadow-sm"
                  : "border-gold/30 text-gold-deep hover:border-gold hover:bg-gold/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {visible.length === 0 && (
            <p className={`col-span-full py-10 text-center text-sm ${theme.subtextClass}`}>
              {content.empty_message}
            </p>
          )}
          {visible.map((p, i) => (
            <Reveal key={`${active}-${p.name}`} delay={i * 0.08} className="group flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-gold/20 shadow-md">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 24vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {(p.badge || p.comparePrice) && (
                  <span className="absolute top-3 left-3 rounded-full bg-noir/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold border border-gold/20">
                    {active === "hot-deals" && p.comparePrice ? "Hot Deal" : p.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 flex-1 flex flex-col">
                <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-gold-deep">{p.tag}</p>
                <h3 className={`mt-1.5 font-display text-lg leading-snug font-semibold ${theme.textClass}`}>{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-xl text-gold-deep font-bold">{p.price}</span>
                  {p.comparePrice && (
                    <span className={`text-sm line-through opacity-60 ${theme.subtextClass}`}>{p.comparePrice}</span>
                  )}
                  <span className={`text-xs ${theme.subtextClass}`}>/ {p.unit}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    cart.add({ id: `arrival-${p.name}`, name: p.name, variant: p.unit, unitPrice: p.priceValue, img: p.img })
                  }
                  className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/40 bg-bottle-green py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-light transition-colors hover:bg-emerald-2 hover:border-gold shadow-sm"
                >
                  <ShoppingBag size={13} /> Add to Cart
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
