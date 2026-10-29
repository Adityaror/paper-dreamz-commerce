"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Brush, Gem, IndianRupee, LayoutGrid, LayoutTemplate, Layers, MessageCircle, Package, PenLine, Ruler, ShoppingBag, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { resolveAssetUrl } from "@/lib/api";
import { cart } from "@/lib/cart";
import { PAGES_CONTENT } from "@/lib/content/pages";
import { usePageContent } from "@/lib/usePageContent";
import { CUSTOM_NAME_MIN_PACK, enquiryUrl, productHref, useCatalog, type CatalogGroup, type CatalogItem, type CatalogProduct } from "@/lib/catalog";
import { ProductRangeAlt } from "./ProductRangeAlt";

type Product = {
  id: number;
  name: string;
  slug: string;
  badge: string | null;
  tag: string | null;
  price: number;
  compare_price: number | null;
  unit: string | null;
  image: string | null;
  collection?: { id: number; name: string; slug: string } | null;
};

/** Icons for the personalisation points, in order; the text comes from Admin → Pages → Shop Page. */
const PERSONALISE_ICONS = [PenLine, Brush, Gem, Package];

function usePersonalise() {
  const { items } = usePageContent("shop.personalise", PAGES_CONTENT["shop.personalise"]);
  return items.map((item, i) => ({ ...item, icon: PERSONALISE_ICONS[i % PERSONALISE_ICONS.length] }));
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

function ProductCard({ product }: { product: Product }) {
  const img = resolveAssetUrl(product.image) ?? "/images/collection_envelopes.webp";
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gold/20 bg-cream shadow-md">
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-cream/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-deep border border-gold/30">
            {product.badge}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        {product.tag && <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-gold-deep">{product.tag}</p>}
        <h4 className="mt-1.5 font-display text-lg leading-snug font-semibold text-ink">{product.name}</h4>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-xl text-gold-deep font-bold">{inr(product.price)}</span>
          {product.compare_price && <span className="text-sm line-through text-taupe/70">{inr(product.compare_price)}</span>}
          {product.unit && <span className="text-xs text-taupe">/ {product.unit}</span>}
        </div>
        <button
          onClick={() =>
            cart.add({
              id: `product-${product.id}`,
              name: product.name,
              variant: product.unit ?? "",
              unitPrice: product.price,
              img,
            })
          }
          className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/40 bg-bottle-green py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-light transition-colors hover:bg-emerald-2 hover:border-gold shadow-sm"
        >
          <ShoppingBag size={13} /> Add to cart
        </button>
      </div>
    </div>
  );
}

function EnquireButton({ name, label = "Enquire on WhatsApp" }: { name: string; label?: string }) {
  return (
    <a
      href={enquiryUrl(name)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
    >
      <MessageCircle size={14} /> {label}
    </a>
  );
}

/** Sub-category tile for categories with several designs. Tiles with a product range open it (via the hash); the rest enquire on WhatsApp. */
function DesignCard({ item, index, highlight, onSelect }: { item: CatalogItem; index: number; highlight: boolean; onSelect?: () => void }) {
  const hasRange = (item.products?.length ?? 0) > 0;
  const isLuxury = item.slug.includes("luxury") || item.slug.includes("card");
  return (
    <a
      id={item.slug}
      href={hasRange ? `#${item.slug}` : enquiryUrl(item.name)}
      target={hasRange ? undefined : "_blank"}
      onClick={hasRange && onSelect ? () => onSelect() : undefined}
      rel={hasRange ? undefined : "noreferrer"}
      className="group block scroll-mt-48"
    >
      <div
        className={`relative aspect-square overflow-hidden rounded-2xl border bg-cream-2 shadow-md transition-all duration-500 group-hover:shadow-xl ${highlight ? "border-gold ring-2 ring-gold/50 ring-offset-4 ring-offset-cream" : "border-gold/25"
          }`}
      >
        <Image
          src={item.img}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {isLuxury && (
          <>
            <div className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-gold-light/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            <span className="absolute top-3 right-3 z-10 rounded-full border border-gold/40 bg-bottle-green/85 px-2.5 py-0.5 text-[8.5px] font-mono font-semibold uppercase tracking-[0.15em] text-gold-light shadow-md backdrop-blur-sm">
              3D Edition
            </span>
          </>
        )}
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 whitespace-nowrap rounded-full border border-gold/40 bg-cream/95 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep opacity-0 shadow-md backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {hasRange ? "View designs" : "Enquire"}
        </span>
      </div>
      <p className="mt-4 font-script text-lg italic text-gold-deep">
        No. {pad(index + 1)}
        {hasRange && <span className="ml-2 font-sans text-[10px] not-italic uppercase tracking-[0.2em]">· {item.products!.length} {item.products!.length === 1 ? "design" : "designs"}</span>}
      </p>
      <h3 className="font-playfair text-base sm:text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-gold-deep">
        {item.name}
      </h3>
    </a>
  );
}

/** Large editorial spread used when a category has only one or two designs, so the page never looks sparse. */
function FeatureSpread({ item, index, group, highlight }: { item: CatalogItem; index: number; group: CatalogGroup; highlight: boolean }) {
  const flip = index % 2 === 1;
  const personalise = usePersonalise();
  return (
    <div id={item.slug} className="grid scroll-mt-48 grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-16">
      <div className={`relative md:col-span-6 ${flip ? "md:order-2" : ""}`}>
        <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-2xl border border-gold/40" />
        <div
          className={`relative aspect-square overflow-hidden rounded-2xl border bg-cream-2 shadow-xl ${highlight ? "border-gold ring-2 ring-gold/50 ring-offset-4 ring-offset-cream" : "border-gold/25"
            }`}
        >
          <Image src={item.img} alt={item.name} fill sizes="(max-width: 768px) 90vw, 45vw" className="object-cover" />
        </div>
      </div>
      <div className={`md:col-span-6 ${flip ? "md:order-1" : ""}`}>
        <p className="font-script text-2xl italic text-gold-deep">No. {pad(index + 1)}</p>
        <h3 className="mt-2 font-playfair text-3xl sm:text-4xl font-semibold leading-tight text-ink">{item.name}</h3>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-taupe">
          Designed around your celebration and finished entirely by hand — choose the palette, the motif and the
          personalisation, and we&rsquo;ll craft {group.name.toLowerCase()} that feel made for the moment.
        </p>
        <ul className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-gold/25 pt-6 text-[13px] text-ink">
          {personalise.map((p) => (
            <li key={p.title} className="flex items-center gap-2.5">
              <p.icon size={15} strokeWidth={1.5} className="shrink-0 text-gold-deep" />
              {p.title}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <EnquireButton name={item.name} />
          <Link
            href="/custom-orders"
            className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep hover:text-ink transition-colors"
          >
            Customise <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * A priced design: pick a size (when there is more than one) and a pack, then add to cart or enquire.
 * Packs of CUSTOM_NAME_MIN_PACK pieces or more can carry a custom name, which travels with the cart line.
 */

/**
 * Futuristic 3D Magnetic Perspective Tilt & Holographic Foil Beam
 * Exclusive to Luxury Gifting Cards (isCard) in Grid UI.
 */
function ProductGridMedia({ product, isSquare }: { product: CatalogProduct; isSquare: boolean }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const particleCounterRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 14, y: x * 14 });
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    // Spawn golden particle trail for envelopes
    if (!isSquare && isHovered) {
      const id = ++particleCounterRef.current;
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      setParticles((prev) => [...prev.slice(-12), { id, x: px, y: py }]);
      setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 1000);
    }
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
    setParticles([]);
  };

  if (!isSquare) {
    /* ─── WEDDING ENVELOPES: Levitation, Energy Pulse Border, Glass Reflection, Parallax, Particle Trail, Liquid Gold ─── */
    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[16/9] overflow-hidden bg-cream-2 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
      >
        {/* 3D Floating Product Levitation */}
        <motion.div
          animate={{
            y: isHovered ? [0, -6, 0] : 0,
            rotateX: isHovered ? rotate.x * 0.5 : 0,
            rotateY: isHovered ? rotate.y * 0.5 : 0,
            scale: isHovered ? 1.04 : 1,
          }}
          transition={isHovered
            ? { y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }, rotateX: { type: "spring", stiffness: 80, damping: 22 }, rotateY: { type: "spring", stiffness: 80, damping: 22 }, scale: { duration: 0.5 } }
            : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
        {/* Ambient blurred backdrop so the container is gracefully filled without cutting the product */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={product.img}
            alt=""
            aria-hidden="true"
            fill
            sizes="80px"
            className="object-cover object-center blur-xl opacity-35 scale-110"
          />
          <div className="absolute inset-0 bg-cream-2/70" />
        </div>

        <Image
          src={product.img}
          alt={`${product.name} — handcrafted envelope`}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
          className="object-contain object-center transition-transform duration-700 ease-out"
        />

          {/* Dynamic Glass Reflection sweep */}
          <motion.div
            animate={isHovered ? { x: ["-150%", "250%"], opacity: [0, 0.6, 0.6, 0] } : { x: "-150%", opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], repeat: isHovered ? Infinity : 0, repeatDelay: 2.2 }}
            className="pointer-events-none absolute inset-0 z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[2px]"
          />

          {/* Liquid Gold Surface Distortion overlay */}
          <motion.div
            animate={isHovered
              ? { background: [
                  "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)",
                  "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(212,175,55,0.14) 0%, transparent 70%)",
                  "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)",
                ] }
              : { background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)" }
            }
            transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-10"
          />

          {/* 3D Product Depth Parallax — mouse-tracked light */}
          {isHovered && (
            <div
              style={{
                background: `radial-gradient(circle 180px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,235,175,0.22), transparent 75%)`,
              }}
              className="pointer-events-none absolute inset-0 z-10 transition-all duration-100"
            />
          )}
        </motion.div>

        {/* Golden Energy Pulse Border */}
        <motion.div
          animate={isHovered
            ? { opacity: [0.4, 1, 0.4], boxShadow: ["inset 0 0 0px rgba(212,175,55,0)", "inset 0 0 18px rgba(212,175,55,0.45)", "inset 0 0 0px rgba(212,175,55,0)"] }
            : { opacity: 0 }
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-20 border border-gold/60"
        />

        {/* Golden Particle Trail */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2, y: -20 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="pointer-events-none absolute z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light shadow-[0_0_8px_rgba(212,175,55,0.9)]"
          />
        ))}

        {/* Code tag */}
        <span className="absolute left-4 top-4 z-20 rounded-full border border-gold/40 bg-bottle-green px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light shadow-md">
          {product.code}
        </span>
      </div>
    );
  }

  /* ─── LUXURY GIFTING CARDS: 3D Magnetic Tilt, Holographic Foil Shimmer, Laser Reticles ─── */
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-square overflow-hidden bg-cream-2 [perspective:1000px] cursor-pointer select-none"
    >
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: "spring", stiffness: 95, damping: 26 }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* Ambient blurred backdrop so the container is gracefully filled without cutting the product */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={product.img}
            alt=""
            aria-hidden="true"
            fill
            sizes="80px"
            className="object-cover object-center blur-xl opacity-35 scale-110"
          />
          <div className="absolute inset-0 bg-cream-2/70" />
        </div>

        <Image
          src={product.img}
          alt={`${product.name} — handcrafted luxury design`}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
          className="object-contain object-center transition-transform duration-700 ease-out"
        />

        {/* Ambient holographic foil shimmer ribbon */}
        <motion.div
          animate={isHovered ? { x: ["-120%", "220%"] } : { x: "-120%" }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 1.6 }}
          className="pointer-events-none absolute inset-0 z-10 w-2/3 -skew-x-25 bg-gradient-to-r from-transparent via-gold-light/45 to-transparent blur-[3px]"
        />

        {/* Dynamic lighting depth overlay */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 bg-gradient-to-tr from-gold/15 via-transparent to-white/20 mix-blend-overlay ${isHovered ? "opacity-100" : "opacity-0"}`}
        />

        {/* Futuristic Laser reticle corner brackets */}
        <div
          className={`pointer-events-none absolute inset-3 z-10 transition-all duration-500 ${isHovered ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-gold-light shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-gold-light shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-gold-light shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-gold-light shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>
      </motion.div>

      {/* Code tag in Luxury Bottle Green */}
      <span className="absolute left-4 top-4 z-20 rounded-full border border-gold/40 bg-bottle-green px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light shadow-md">
        {product.code}
      </span>
    </div>
  );
}

function EnvelopeCard({ product, highlight }: { product: CatalogProduct; highlight: boolean }) {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [packIdx, setPackIdx] = useState(0);
  const size = product.sizes[sizeIdx];
  const pack = size.packs[Math.min(packIdx, size.packs.length - 1)];
  const sizeNote = product.sizes.length > 1 ? `, ${size.label.toLowerCase()} size` : "";
  const [customName, setCustomName] = useState("");
  const canPersonalise = pack.qty >= CUSTOM_NAME_MIN_PACK;
  const name = canPersonalise ? customName.trim() : "";
  const isCard = product.code.startsWith("LGC") || product.img.toLowerCase().includes("luxury");

  return (
    <article id={product.code.toLowerCase()} className={`group flex h-full scroll-mt-48 flex-col overflow-hidden rounded-sm border bg-ivory shadow-md transition-shadow duration-500 hover:shadow-xl ${highlight ? "border-gold ring-2 ring-gold/50 ring-offset-4 ring-offset-cream" : "border-gold/25"
      }`}>
      <ProductGridMedia product={product} isSquare={isCard} />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-2.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-2 animate-pulse" />
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.25em] text-bottle-green">
              {isCard ? "Handcrafted 3D Keepsake" : "Bespoke Handcrafted Envelope"}
            </span>
          </div>
          <h4 className="font-playfair text-2xl font-semibold leading-snug text-ink">{product.name}</h4>
          <p className="mt-3 text-[13.5px] leading-relaxed text-taupe">{product.description}</p>
        </motion.div>

        {product.sizes.length > 1 && (
          <div className="mt-5 flex gap-2" role="radiogroup" aria-label="Size">
            {product.sizes.map((s, i) => (
              <button
                key={s.label}
                role="radio"
                aria-checked={i === sizeIdx}
                onClick={() => {
                  setSizeIdx(i);
                  setPackIdx(0);
                }}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${i === sizeIdx ? "border-gold-deep bg-cream-2 text-ink" : "border-gold/30 text-taupe hover:text-ink"
                  }`}
              >
                {s.label}
              </button>
            ))}

          </div>
        )}

        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 grid grid-cols-1 gap-2.5 border-y border-gold/20 py-4 text-[13px] sm:grid-cols-2"
        >
          <div className="flex items-start gap-2">
            <Ruler size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" />
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-taupe">Size</dt>
              <dd className="text-ink">{size.dimensions}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <IndianRupee size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" />
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-taupe">{size.capacity.toLowerCase().includes("note") || size.capacity.toLowerCase().includes("slot") ? "Capacity" : "Cash capacity"}</dt>
              <dd className="text-ink">{size.capacity}</dd>
            </div>
          </div>
        </motion.dl>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-taupe">Choose a pack</p>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Pack size">
            {size.packs.map((p, i) => {
              const on = p === pack;
              return (
                <button
                  key={p.qty}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPackIdx(i)}
                  className={`cursor-pointer rounded-sm border px-2 py-2.5 text-center transition-all duration-300 ${on
                    ? "border-gold bg-bottle-green text-gold-light shadow-md scale-102"
                    : "border-gold/25 bg-ivory hover:border-bottle-green/40 hover:text-bottle-green"
                    }`}
                >
                  <span className={`block text-[10px] uppercase tracking-[0.15em] ${on ? "text-gold-light/80" : "text-taupe"}`}>
                    Pack of {p.qty}
                  </span>
                  <span className={`mt-0.5 block font-playfair text-base font-semibold ${on ? "text-gold-light" : "text-ink"}`}>
                    {inr(p.price)}
                  </span>
                  {p.qty >= CUSTOM_NAME_MIN_PACK && (
                    <span className={`mt-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${on ? "text-gold-light" : "text-gold-deep"}`}>
                      <Sparkles size={9} /> Name
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {canPersonalise ? (
          <div className="mt-4 rounded-sm border border-gold/35 bg-cream-2/60 p-4">
            <label htmlFor={`${product.code}-name`} className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
              <PenLine size={13} /> Add a custom name <span className="font-normal normal-case tracking-normal text-taupe">(optional)</span>
            </label>
            <input
              id={`${product.code}-name`}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              maxLength={40}
              placeholder="e.g. Riya & Arjun"
              className="mt-2.5 w-full rounded-sm border border-gold/30 bg-ivory px-3.5 py-2.5 font-script text-lg italic text-ink placeholder:font-sans placeholder:text-sm placeholder:not-italic placeholder:text-taupe/60 focus:border-gold-deep focus:outline-none"
            />
            <p className="mt-2 text-[11.5px] leading-relaxed text-taupe">
              Printed on every piece in this pack. We&rsquo;ll share a preview on WhatsApp before making it.
            </p>
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-taupe">
            <Sparkles size={12} className="shrink-0 text-gold-deep" />
            Choose a pack of {CUSTOM_NAME_MIN_PACK} or more to add a custom name.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-auto pt-6"
        >
          <p className="font-playfair text-3xl font-semibold text-gold-deep">{inr(pack.price)}</p>
          <p className="text-[11.5px] text-taupe">
            Pack of {pack.qty} · approx. {inr(Math.round(pack.price / pack.qty))} each
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                cart.add({
                  id: `${product.code}|${size.label}|${pack.qty}|${name}`,
                  name: product.name,
                  variant: `${product.code} · Pack of ${pack.qty}${product.sizes.length > 1 ? ` · ${size.label}` : ""}`,
                  unitPrice: pack.price,
                  img: product.img,
                  href: productHref(product.code),
                  customName: name || undefined,
                })
              }
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
            >
              <ShoppingBag size={14} /> Add to cart
            </button>
            <a
              href={enquiryUrl(`${product.code} ${product.name} (pack of ${pack.qty}${sizeNote}${name ? `, custom name: ${name}` : ""})`)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
              title="Enquire on WhatsApp"
              className="inline-flex items-center justify-center rounded-sm border border-gold/40 bg-bottle-green px-4 text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </article>
  );
}

/** The priced designs of one sub-category, shown in place of the category's design tiles once that tile is opened. */
function ProductRange({
  item,
  group,
  highlight,
  onBack,
  onToggleUI,
}: {
  item: CatalogItem;
  group: CatalogGroup;
  highlight: string | null;
  onBack: () => void;
  onToggleUI: (mode: number) => void;
}) {
  const products = item.products ?? [];

  return (
    <div className="[perspective:1200px]">
      <button
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} /> All {group.name.toLowerCase()}
      </button>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 mt-6 flex flex-col gap-3 border-b border-gold/25 pb-6 sm:flex-row sm:items-end sm:justify-between relative overflow-hidden"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
            {group.name} · {item.name} · {pad(products.length)} designs
          </p>
          <h3 className="mt-3 font-playfair text-3xl sm:text-4xl font-semibold text-ink">The {item.name.toLowerCase()} range</h3>
        </div>
        <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
          {/* UI toggle — 3 modes */}
          <div className="flex items-center gap-1 rounded-full border border-gold/30 bg-ivory p-1 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => onToggleUI(0)}
              title="Classic grid view"
              className="flex-1 sm:flex-initial flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all bg-bottle-green text-gold-light border border-gold/40 shadow-sm"
            >
              <LayoutGrid size={12} /> Grid
            </button>
            <button
              onClick={() => onToggleUI(1)}
              title="Editorial view"
              className="flex-1 sm:flex-initial flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all text-taupe hover:text-ink"
            >
              <LayoutTemplate size={12} /> Editorial
            </button>
            <button
              onClick={() => onToggleUI(2)}
              title="Spotlight view"
              className="flex-1 sm:flex-initial flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all text-taupe hover:text-ink"
            >
              <Layers size={12} /> Spotlight
            </button>
          </div>
          {item.tag && <p className="font-script text-xl sm:text-2xl italic text-gold-deep text-left sm:text-right">{item.tag}</p>}
        </div>

        {/* Futuristic Laser sweep across header */}
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "100%" }}
          viewport={{ once: false }}
          transition={{ duration: 2.0, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-light to-transparent shadow-[0_0_12px_#d4af37]"
        />
      </motion.div>

      {/* Grid with 3D Staggered Cascade for Cards, Royal Silk Elevation for Envelopes */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p, i) => {
          const isCardProduct = p.code.startsWith("LGC") || p.img.toLowerCase().includes("luxury");
          return (
            <motion.div
              key={p.code}
              initial={
                isCardProduct
                  ? {
                      opacity: 0,
                      y: 75,
                      rotateX: 18,
                      rotateZ: i % 2 === 0 ? -2.5 : 2.5,
                      scale: 0.88,
                    }
                  : {
                      opacity: 0,
                      y: 45,
                      scale: 0.94,
                      filter: "blur(4px)",
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                rotateZ: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: isCardProduct ? 1.45 : 1.25,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.14 * (i % 3),
              }}
              className="h-full [perspective:1200px]"
            >
              <EnvelopeCard product={p} highlight={highlight === p.code.toLowerCase()} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** Shown for categories that are made to order only, with no sub-categories yet. */
function BespokeShowcase({ group }: { group: CatalogGroup }) {
  const { steps, quote, button_label } = usePageContent("shop.bespoke", PAGES_CONTENT["shop.bespoke"]);
  return (
    <div id="bespoke" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="relative min-h-[340px] overflow-hidden rounded-sm border border-gold/25 shadow-xl lg:col-span-7 lg:min-h-[480px]">
        <Image src={group.img} alt={group.name} fill sizes="(max-width: 1024px) 90vw, 55vw" className="object-cover" />
        <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-cream/95 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-deep shadow-md">
          Bespoke · Made to order
        </span>
      </div>
      <div className="flex flex-col justify-between rounded-sm border border-gold/30 bg-gradient-to-br from-ivory to-cream-2 p-8 sm:p-10 lg:col-span-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">How it works</p>
          <ol className="mt-7 space-y-7">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-playfair text-3xl font-semibold leading-none text-gold/80">{pad(i + 1)}</span>
                <div>
                  <h4 className="font-playfair text-lg font-semibold text-ink">{s.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-taupe">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-10 border-t border-gold/25 pt-8">
          <p className="font-script text-2xl italic leading-snug text-ink">
            {quote}
          </p>
          <div className="mt-6">
            <EnquireButton name={group.name} label={button_label} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryPanel({
  group,
  index,
  total,
  products,
  highlight,
  openSub,
  onCloseSub,
  onOpenSub,
}: {
  group: CatalogGroup;
  index: number;
  total: number;
  products: Product[];
  highlight: string | null;
  openSub: string | null;
  onCloseSub: () => void;
  onOpenSub: (subSlug: string) => void;
}) {
  const sub = group.children.find((c) => c.slug === openSub && (c.products?.length ?? 0) > 0);
  const personalise = usePersonalise();
  const story = {
    description: group.description || group.tag,
    accent: group.accent || group.tag.toLowerCase(),
    occasions: group.occasions ?? [],
  };
  const count = group.children.length;
  const secondImg = group.children[0]?.products?.[1]?.img ?? group.children[0]?.img ?? "/images/craft_design_sketch.webp";
  const hasAnyProducts = group.children.some((c) => (c.products?.length ?? 0) > 0);
  const showGrid = count > 2 || hasAnyProducts;

  return (
    <motion.div
      key={group.slug}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Category introduction */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
              <span className="h-px w-8 bg-current opacity-60" />
              Collection {pad(index + 1)} / {pad(total)}
            </p>
            <h2 className="mt-6 font-playfair text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-tight text-ink">
              {group.name}
            </h2>
            <p className="mt-3 font-script text-3xl sm:text-4xl italic text-gold-deep">{story.accent}</p>
            <p className="mt-7 max-w-lg text-[15px] sm:text-base leading-relaxed text-taupe">{story.description}</p>

            <dl className="mt-9 grid max-w-lg grid-cols-3 divide-x divide-gold/25 border-y border-gold/25 py-4 sm:py-5 text-center">
              <div className="px-1 sm:px-2">
                <dt className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-taupe">Designs</dt>
                <dd className="mt-1 font-playfair text-lg sm:text-2xl font-semibold text-ink leading-tight">{count > 0 ? pad(count) : "Bespoke"}</dd>
              </div>
              <div className="px-1 sm:px-2">
                <dt className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-taupe">Crafted</dt>
                <dd className="mt-1 font-playfair text-lg sm:text-2xl font-semibold text-ink leading-tight">By hand</dd>
              </div>
              <div className="px-1 sm:px-2">
                <dt className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-taupe">Made</dt>
                <dd className="mt-1 font-playfair text-lg sm:text-2xl font-semibold text-ink leading-tight whitespace-nowrap">To order</dd>
              </div>
            </dl>

            {story.occasions.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[10.5px] uppercase tracking-[0.2em] text-taupe">Perfect for</span>
                {story.occasions.map((o) => (
                  <span key={o} className="rounded-full border border-gold/35 bg-ivory px-3.5 py-1.5 text-[11.5px] text-ink">
                    {o}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <EnquireButton name={group.name} />
              <Link
                href="/custom-orders"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep hover:text-ink transition-colors"
              >
                Custom order <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Arched image composition */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none lg:pl-16">
            <div className="relative ml-auto w-[82%]">
              <div className="absolute -inset-4 rounded-t-[999px] border border-gold/40" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-sm border border-gold/25 shadow-2xl">
                <Image src={group.img} alt={group.name} fill priority sizes="(max-width: 1024px) 80vw, 40vw" className="object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-8 left-0 w-[42%] rotate-[-4deg] overflow-hidden rounded-sm border-[6px] border-ivory bg-ivory shadow-2xl">
              <div className="relative aspect-square">
                <Image src={secondImg} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            </div>
            <span className="absolute right-0 top-10 rounded-full border border-gold/40 bg-cream/95 px-4 py-2 font-script text-lg italic text-gold-deep shadow-lg lg:-right-4">
              Handcrafted with love
            </span>
          </div>
        </div>
      </section>

      {/* The designs */}
      <section
        id={`${group.slug}-designs`}
        className="scroll-mt-52 md:scroll-mt-60 border-t border-gold/20 bg-gradient-to-b from-cream-2/70 to-cream pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-x-clip"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-10">
          {sub ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`ui-editorial-${sub.slug}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <ProductRangeAlt item={sub} group={group} highlight={highlight} onBack={onCloseSub} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
                    {count > 0 ? "The Designs" : "Made to Order"}
                  </p>
                  <h3 className="mt-3 font-playfair text-3xl sm:text-4xl font-semibold text-ink">
                    {count > 1
                      ? `${count} styles to choose from`
                      : count === 1
                        ? "1 style to choose from"
                        : `${group.name}, designed for you`}
                  </h3>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-taupe sm:text-right">
                  Tap any design to enquire on WhatsApp — every piece can be personalised.
                </p>
              </Reveal>

              {showGrid ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 md:grid-cols-3 lg:grid-cols-4">
                  {group.children.map((child, i) => (
                    <Reveal key={child.slug} delay={(i % 4) * 0.06} once={false}>
                      <DesignCard item={child} index={i} highlight={highlight === child.slug} onSelect={() => onOpenSub(child.slug)} />
                    </Reveal>
                  ))}
                </div>
              ) : count > 0 ? (
                <div className="space-y-20">
                  {group.children.map((child, i) => (
                    <Reveal key={child.slug}>
                      <FeatureSpread item={child} index={i} group={group} highlight={highlight === child.slug} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Reveal>
                  <BespokeShowcase group={group} />
                </Reveal>
              )}
            </>
          )}

          {products.length > 0 && (
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Personalisation strip */}
      <section id="personalise" className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-gold/25 bg-gold/25 lg:grid-cols-4">
            {personalise.map((p) => (
              <div key={p.title} className="bg-cream p-6 sm:p-8">
                <p.icon size={22} strokeWidth={1.3} className="text-gold-deep" />
                <h4 className="mt-4 font-playfair text-lg font-semibold text-ink">{p.title}</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-taupe">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default function ShopCatalog() {
  const groups = useCatalog();
  const [active, setActive] = useState(groups[0]?.slug ?? "");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [barTop, setBarTop] = useState(96);
  const panelRef = useRef<HTMLDivElement>(null);

  // Priced designs come nested in the catalog (each sub-category's range); this extra flat grid is unused for now.
  const products: Product[] = [];

  // A product belongs to a main category when it is filed under it or under one of its sub-categories.
  const productsFor = (group: CatalogGroup) => {
    const slugs = new Set([group.slug, ...group.children.map((c) => c.slug)]);
    return products.filter((p) => p.collection && slugs.has(p.collection.slug));
  };

  const scrollToPanel = () => {
    const el = panelRef.current;
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - barTop - 68, behavior: "smooth" });
  };

  const handleOpenSub = (groupSlug: string, subSlug: string) => {
    setActive(groupSlug);
    setOpenSub(subSlug);
    setHighlight(null);
    history.pushState(null, "", `#${subSlug}`);
    setTimeout(() => {
      const target = document.getElementById(`${groupSlug}-designs`);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - barTop - 70;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }, 100);
  };

  // `/shop#<category>` opens that category; `/shop#<sub-category>` opens its parent and highlights the design,
  // or opens its product range when it has one; `/shop#<product code>` (e.g. #we0001) opens the range at that product.
  useEffect(() => {
    const open = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
      if (!hash) return;

      for (const g of groups) {
        const sub = g.children.find(
          (c) => c.slug === hash || c.slug === hash.replace(/-s$/, "") || `${c.slug}s` === hash || c.products?.some((p) => p.code.toLowerCase() === hash),
        );
        if (!sub?.products?.length) continue;
        const productCode = sub.slug === hash || `${sub.slug}s` === hash || sub.slug === hash.replace(/-s$/, "") ? null : hash;
        setActive(g.slug);
        setOpenSub(sub.slug);
        setHighlight(productCode);
        setTimeout(() => {
          if (productCode) {
            const target = document.getElementById(productCode);
            target?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            const target = document.getElementById(`${g.slug}-designs`);
            if (target) {
              const top = target.getBoundingClientRect().top + window.scrollY - barTop - 70;
              window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
            }
          }
        }, 350);
        return;
      }

      const parent = groups.find((g) => g.slug === hash || g.children.some((c) => c.slug === hash));
      if (!parent) return;
      setActive(parent.slug);
      setOpenSub(null);
      const child = parent.slug === hash ? null : hash;
      setHighlight(child);
      setTimeout(() => {
        const target = child ? document.getElementById(child) : panelRef.current;
        if (child && target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        else scrollToPanel();
      }, 350);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  // Keep the sticky category bar flush under the fixed header, whatever its height at this breakpoint.
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (header) setBarTop(Math.round(header.getBoundingClientRect().bottom));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const select = (slug: string) => {
    setActive(slug);
    setOpenSub(null);
    setHighlight(null);
    history.replaceState(null, "", `#${slug}`);
    scrollToPanel();
  };

  const index = Math.max(0, groups.findIndex((g) => g.slug === active));
  const group = groups[index];
  const others = groups.filter((g) => g.slug !== active);

  return (
    <>
      {/* Category switcher */}
      <nav
        aria-label="Shop categories"
        style={{ top: barTop }}
        className="sticky z-20 border-y border-gold/20 bg-cream/95 backdrop-blur-md"
      >
        <ul role="tablist" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-10 [scrollbar-width:none] lg:justify-between">
          {groups.map((g) => {
            const on = g.slug === active;
            return (
              <li key={g.slug} className="shrink-0">
                <button
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(g.slug)}
                  className="group relative flex cursor-pointer items-center gap-3 px-3 py-3.5 text-left"
                >
                  <span
                    className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 transition-all duration-300 ${on ? "border-gold shadow-md" : "border-gold/20 grayscale-[40%] group-hover:grayscale-0"
                      }`}
                  >
                    <Image src={g.img} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span>
                    <span className={`block whitespace-nowrap font-playfair text-[15px] font-semibold transition-colors ${on ? "text-ink" : "text-taupe group-hover:text-ink"}`}>
                      {g.name}
                    </span>
                    <span className="block text-[9.5px] uppercase tracking-[0.2em] text-gold-deep">
                      {g.children.length > 0 ? `${g.children.length} ${g.children.length === 1 ? "design" : "designs"}` : "Bespoke"}
                    </span>
                  </span>
                  {on && (
                    <motion.span layoutId="shop-tab" className="absolute inset-x-3 bottom-0 h-[2px] bg-gold-deep" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div ref={panelRef} id={group?.slug}>
        <AnimatePresence mode="wait">
          {group && (
            <CategoryPanel
              key={group.slug}
              group={group}
              index={index}
              total={groups.length}
              products={productsFor(group)}
              highlight={highlight}
              openSub={openSub}
              onCloseSub={() => {
                setOpenSub(null);
                setHighlight(null);
                history.replaceState(null, "", `#${group.slug}`);
                document.getElementById(`${group.slug}-designs`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              onOpenSub={(subSlug) => handleOpenSub(group.slug, subSlug)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Explore other collections */}
      <section className="border-t border-gold/20 bg-cream-2/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between gap-6 border-b border-gold/20 pb-6">
            <h3 className="font-playfair text-3xl sm:text-4xl font-semibold text-ink">Explore other collections</h3>
            <p className="hidden font-script text-xl italic text-gold-deep sm:block">handmade, every one</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
            {others.map((g) => (
              <button key={g.slug} onClick={() => select(g.slug)} className="group cursor-pointer text-left">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/20 shadow-md">
                  <Image
                    src={g.img}
                    alt={g.name}
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <h4 className="mt-4 font-playfair text-lg font-semibold text-ink">{g.name}</h4>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.2em] text-gold-deep">
                  Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">Something else in mind?</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-ink">We make it to your brief.</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-taupe">
            Colours, themes, names, motifs and quantities — every piece can be customised for your celebration.
          </p>
          <Link
            href="/custom-orders"
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
          >
            Start a Custom Order <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
