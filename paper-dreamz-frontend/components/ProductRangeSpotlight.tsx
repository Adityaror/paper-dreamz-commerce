"use client";

/**
 * ProductRangeSpotlight — UI3 for the product-range section.
 *
 * A "stage" viewer: one product at a time, centered on the viewport.
 *   • Large full-width image with floating left/right chevron arrows on the sides.
 *   • Product code + counter centered at top of the image.
 *   • Below the image: name, description, and a horizontal spec/pack row.
 *   • Dot nav centered below.
 *   • Horizontal thumbnail strip for quick jump.
 */

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  LayoutGrid,
  LayoutTemplate,
  Layers,
  MessageCircle,
  PenLine,
  Ruler,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { cart } from "@/lib/cart";
import {
  CUSTOM_NAME_MIN_PACK,
  enquiryUrl,
  productHref,
  type CatalogGroup,
  type CatalogItem,
  type CatalogProduct,
} from "@/lib/catalog";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

/* ─── Detail strip below the image ──────────────────────────────── */
function SpotlightDetail({
  product,
  highlight,
}: {
  product: CatalogProduct;
  highlight: boolean;
}) {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [packIdx, setPackIdx] = useState(0);
  const [customName, setCustomName] = useState("");

  const size = product.sizes[sizeIdx];
  const pack = size.packs[Math.min(packIdx, size.packs.length - 1)];
  const canPersonalise = pack.qty >= CUSTOM_NAME_MIN_PACK;
  const name = canPersonalise ? customName.trim() : "";
  const sizeNote = product.sizes.length > 1 ? `, ${size.label.toLowerCase()} size` : "";
  const isCard = product.code.startsWith("LGC") || product.img.toLowerCase().includes("luxury");

  return (
    <div className={highlight ? "ring-2 ring-gold/40 ring-offset-4 ring-offset-cream rounded-sm" : ""}>
      {/* Name + description */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl px-4 pt-10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <span className="rounded-full border border-gold/40 bg-bottle-green px-3.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.25em] text-gold-light shadow-md">
            {product.code}
          </span>
          <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.25em] text-bottle-green">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-2 animate-pulse" />
            {isCard ? "Handcrafted 3D Keepsake" : "Bespoke Handcrafted Envelope"}
          </span>
        </div>
        <h3 className="mt-2 font-playfair text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {product.name}
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-taupe">
          {product.description}
        </p>
      </motion.div>

      {/* Horizontal spec + pack row */}
      <div className="mx-auto mt-8 max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-start justify-center gap-6 border-y border-gold/20 py-5"
        >
          {/* Size */}
          <div className="flex items-center gap-2 text-[13px]">
            <Ruler size={14} strokeWidth={1.5} className="shrink-0 text-gold-deep" />
            <div>
              <span className="block text-[9px] uppercase tracking-[0.22em] text-taupe">Size</span>
              <span className="text-ink">{size.dimensions}</span>
            </div>
          </div>
          {/* Capacity */}
          <div className="flex items-center gap-2 text-[13px]">
            <IndianRupee size={14} strokeWidth={1.5} className="shrink-0 text-gold-deep" />
            <div>
              <span className="block text-[9px] uppercase tracking-[0.22em] text-taupe">{size.capacity.toLowerCase().includes("note") || size.capacity.toLowerCase().includes("slot") ? "Capacity" : "Cash capacity"}</span>
              <span className="text-ink">{size.capacity}</span>
            </div>
          </div>

          {/* Size toggle */}
          {product.sizes.length > 1 && (
            <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Size">
              {product.sizes.map((s, i) => (
                <button
                  key={s.label}
                  role="radio"
                  aria-checked={i === sizeIdx}
                  onClick={() => { setSizeIdx(i); setPackIdx(0); }}
                  className={`cursor-pointer rounded-full border px-3.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.15em] transition-colors ${i === sizeIdx
                      ? "border-gold-deep bg-cream-2 text-ink"
                      : "border-gold/30 text-taupe hover:text-ink"
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pack pills — horizontal centered row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6"
        >
          <p className="mb-3 text-center text-[9.5px] font-semibold uppercase tracking-[0.28em] text-taupe">
            Choose a pack
          </p>
          <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3">
            {size.packs.map((p, i) => {
              const on = i === packIdx;
              return (
                <button
                  key={p.qty}
                  onClick={() => setPackIdx(i)}
                  className={`flex cursor-pointer flex-col items-center rounded-sm border px-3 sm:px-6 py-2.5 sm:py-3 transition-all duration-200 ${
                    on
                      ? "border-gold bg-bottle-green text-gold-light shadow-md scale-102"
                      : "border-gold/25 bg-ivory text-taupe hover:border-bottle-green/40 hover:text-bottle-green"
                  }`}
                >
                  <span className={`text-[9px] uppercase tracking-[0.18em] ${on ? "text-gold-light/80" : "text-taupe"}`}>Pack of {p.qty}</span>
                  <span className={`mt-0.5 font-playfair text-[15px] font-semibold ${on ? "text-gold-light" : "text-ink"}`}>{inr(p.price)}</span>
                  {p.qty >= CUSTOM_NAME_MIN_PACK && (
                    <span className={`mt-1 flex items-center gap-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] ${on ? "text-gold-light" : "text-gold-deep"}`}>
                      <Sparkles size={8} /> Name
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Custom name */}
        {canPersonalise ? (
          <div className="mx-auto mt-5 max-w-md rounded-sm border border-gold/35 bg-cream-2/60 p-4">
            <label
              htmlFor={`spot-${product.code}-name`}
              className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-deep"
            >
              <PenLine size={12} /> Add a custom name{" "}
              <span className="font-normal normal-case tracking-normal text-taupe">(optional)</span>
            </label>
            <input
              id={`spot-${product.code}-name`}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              maxLength={40}
              placeholder="e.g. Riya & Arjun"
              className="mt-2.5 w-full rounded-sm border border-gold/30 bg-ivory px-3.5 py-2.5 text-center font-script text-lg italic text-ink placeholder:font-sans placeholder:text-sm placeholder:not-italic placeholder:text-taupe/60 focus:border-gold-deep focus:outline-none"
            />
            <p className="mt-1.5 text-center text-[11px] text-taupe">
              Printed on every piece. We&apos;ll share a preview on WhatsApp first.
            </p>
          </div>
        ) : (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11.5px] text-taupe">
            <Sparkles size={12} className="shrink-0 text-gold-deep" />
            Choose a pack of {CUSTOM_NAME_MIN_PACK} or more to add a custom name.
          </p>
        )}

        {/* Price + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-col items-center gap-4 border-t border-gold/20 pt-6 pb-10"
        >
          <p className="font-playfair text-4xl font-semibold text-gold-deep">{inr(pack.price)}</p>
          <p className="text-[12px] text-taupe">
            pack of {pack.qty} · approx. {inr(Math.round(pack.price / pack.qty))} each
          </p>
          <div className="flex w-full max-w-xs sm:w-auto gap-2.5">
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
              className="inline-flex flex-1 sm:flex-initial cursor-pointer items-center justify-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-5 sm:px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
            >
              <ShoppingBag size={14} /> Add to cart
            </button>
            <a
              href={enquiryUrl(`${product.code} ${product.name} (pack of ${pack.qty}${sizeNote}${name ? `, custom name: ${name}` : ""})`)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
              className="inline-flex items-center justify-center rounded-sm border border-gold/40 bg-bottle-green px-4 text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold shrink-0"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */

/**
 * Futuristic Spotlight Stage Media for ProductRangeSpotlight:
 * For Luxury Cards (isCard):
 *  - 3D Kinetic Depth Portal transition
 *  - Interactive 3D Stage Gyroscope / Perspective Tilt
 *  - Orbiting Conic Spotlight Aura
 *  - Twinkling Shaker Starlight Glints
 *  - Holographic Stage HUD
 * For Envelopes (!isCard):
 *  - Clean standard 16:9 stage transition
 */
function SpotlightImageStage({
  product,
  isCard,
  total,
  idx,
}: {
  product: CatalogProduct;
  isCard: boolean;
  total: number;
  idx: number;
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCard) return; // Gyro tilt is exclusive to luxury cards
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-sm border border-gold/25 shadow-xl bg-cream-2 ${
        isCard ? "aspect-[4/3] max-w-4xl mx-auto [perspective:1200px]" : "aspect-[16/9] max-w-5xl mx-auto"
      }`}
    >
      {isCard ? (
        /* ─── LUXURY GIFTING CARDS: 3D Stage Gyroscope Tilt & Starlight Glints ─── */
        <motion.div
          animate={{
            rotateX: rotate.x,
            rotateY: rotate.y,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 95, damping: 26 }}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          {/* Orbiting Ambient Golden Halo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -inset-[40%] z-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.14)_0%,_transparent_65%)]"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={product.code}
              initial={{ opacity: 0, scale: 0.9, rotateY: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, rotateY: -10, filter: "blur(4px)" }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* Ambient blurred backdrop so the container is gracefully filled without cutting the product */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={product.img}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="120px"
                  className="object-cover object-center blur-2xl opacity-40 scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-cream-2/70" />
              </div>

              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain object-center drop-shadow-md"
                priority
              />

              {/* Twinkling Shaker Starlight Glints */}
              {[
                { top: "28%", left: "30%", delay: 0 },
                { top: "45%", left: "68%", delay: 1.3 },
                { top: "68%", left: "42%", delay: 2.2 },
              ].map((glint, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [0, 1.4, 0],
                    opacity: [0, 0.95, 0],
                    rotate: [0, 90, 180],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: glint.delay,
                    ease: "easeInOut",
                  }}
                  style={{ top: glint.top, left: glint.left }}
                  className="pointer-events-none absolute z-20 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-gold-light"
                >
                  <Sparkles size={15} className="text-gold-light drop-shadow-[0_0_8px_#ffd700]" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Top badges bar */}
          <div className="pointer-events-none absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 z-20 flex items-center justify-between">
            <span className="rounded-full border border-gold/40 bg-bottle-green px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gold-light shadow-md">
              {product.code}
            </span>
            <span className="rounded-full border border-white/30 bg-black/40 px-2.5 sm:px-3.5 py-1 font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white backdrop-blur-sm shadow-sm">
              {pad(idx + 1)} / {pad(total)}
            </span>
          </div>
        </motion.div>
      ) : (
        /* ─── WEDDING ENVELOPES: God Rays, Geometric Fragments, Magnetic Attraction, Energy Shield, Floor Reflection, Camera Dolly ─── */
        <motion.div
          animate={{
            scale: isHovered ? 1.025 : 1,
            y: isHovered ? -4 : 0,
          }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full"
        >
          {/* Volumetric God Rays — radial light shafts from top */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {[15, 35, 55, 75, 90].map((pct, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.04, 0.12, 0.04], scaleY: [0.8, 1.1, 0.8] }}
                transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                style={{ left: `${pct}%`, transformOrigin: "top center" }}
                className="absolute top-0 h-full w-[2px] bg-gradient-to-b from-gold-light/60 via-gold/20 to-transparent blur-[3px]"
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={product.code}
              initial={{ opacity: 0, scale: 0.94, filter: "brightness(1.15)" }}
              animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "brightness(0.92)" }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* Ambient blurred backdrop so the container is gracefully filled without cutting the product */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={product.img}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="120px"
                  className="object-cover object-center blur-2xl opacity-40 scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-cream-2/70" />
              </div>

              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain object-center drop-shadow-md"
                priority
              />

              {/* Stage Floor Reflection — bottom mirror gradient */}
              <div className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-1/3 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

              {/* Cinematic Camera Dolly — slow horizontal drift */}
              <motion.div
                animate={{ x: isHovered ? [0, 8, 0] : 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/08 via-transparent to-black/08"
              />
            </motion.div>
          </AnimatePresence>

          {/* Golden Energy Shield — pulsing border ring */}
          <motion.div
            animate={isHovered
              ? { opacity: [0, 1, 0], scale: [0.96, 1.01, 0.96] }
              : { opacity: 0 }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-2 z-20 rounded-sm border border-gold/55 shadow-[0_0_20px_rgba(212,175,55,0.35),inset_0_0_20px_rgba(212,175,55,0.12)]"
          />

          {/* Floating 3D Geometric Fragments */}
          {[
            { x: "8%", y: "15%", size: 10, delay: 0, dur: 5.5, rot: 45 },
            { x: "88%", y: "22%", size: 8, delay: 1.4, dur: 6.2, rot: -30 },
            { x: "15%", y: "72%", size: 6, delay: 2.8, dur: 4.8, rot: 60 },
            { x: "82%", y: "68%", size: 9, delay: 0.7, dur: 5.8, rot: -15 },
          ].map((frag, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -12, 0],
                rotate: [frag.rot, frag.rot + 180, frag.rot + 360],
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{ duration: frag.dur, repeat: Infinity, ease: "easeInOut", delay: frag.delay }}
              style={{ left: frag.x, top: frag.y, width: frag.size, height: frag.size }}
              className="pointer-events-none absolute z-20 border border-gold-light/60 rotate-45 shadow-[0_0_6px_rgba(212,175,55,0.5)]"
            />
          ))}

          {/* Magnetic Product Attraction — center glow on hover */}
          <motion.div
            animate={isHovered
              ? { opacity: [0, 0.5, 0], scale: [0.5, 1.5, 2.0] }
              : { opacity: 0 }
            }
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="h-32 w-32 rounded-full bg-gradient-radial from-gold-light/30 to-transparent blur-xl" />
          </motion.div>

          {/* Top badges bar */}
          <div className="pointer-events-none absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 z-20 flex items-center justify-between">
            <span className="rounded-full border border-gold/40 bg-bottle-green px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gold-light shadow-md">
              {product.code}
            </span>
            <span className="rounded-full border border-white/30 bg-black/40 px-2.5 sm:px-3.5 py-1 font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white backdrop-blur-sm shadow-sm">
              {pad(idx + 1)} / {pad(total)}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function ProductRangeSpotlight({
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
  const [idx, setIdx] = useState(() =>
    highlight
      ? Math.max(0, products.findIndex((p) => p.code.toLowerCase() === highlight))
      : 0,
  );

  const product = products[idx];
  const total = products.length;
  const isCard = item.slug.includes("card") || products.some((p) => p.code.startsWith("LGC") || p.img.toLowerCase().includes("luxury"));
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  if (!product) return null;

  return (
    <div>
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} /> All {group.name.toLowerCase()}
      </button>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10 mt-6 flex flex-col gap-4 border-b border-gold/25 pb-6 sm:flex-row sm:items-end sm:justify-between relative overflow-hidden"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
            {group.name} · {item.name} · {pad(total)} designs
          </p>
          <h2 className="mt-3 font-playfair text-3xl font-semibold text-ink sm:text-4xl">
            The {item.name.toLowerCase()} range
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
          {/* UI toggle — 3 modes */}
          <div className="flex items-center gap-1 rounded-full border border-gold/30 bg-ivory p-1 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => onToggleUI(0)}
              title="Classic grid view"
              className="flex-1 sm:flex-initial flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all text-taupe hover:text-ink"
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
              className="flex-1 sm:flex-initial flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all bg-bottle-green text-gold-light border border-gold/40 shadow-sm"
            >
              <Layers size={12} /> Spotlight
            </button>
          </div>
          {item.tag && (
            <p className="font-script text-xl sm:text-2xl italic text-gold-deep text-left sm:text-right">{item.tag}</p>
          )}
        </div>

        {/* Futuristic Laser sweep across header */}
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "100%" }}
          viewport={{ once: false }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-light to-transparent shadow-[0_0_12px_#d4af37]"
        />
      </motion.div>

      {/* Stage: 3D Pedestal for Cards, Royal Velvet Unveil for Envelopes */}
      <motion.div
        initial={
          isCard
            ? { opacity: 0, scale: 0.82, y: 70, rotateX: -16, filter: "blur(12px) brightness(0.5)" }
            : { opacity: 0, scale: 0.93, y: 40, filter: "blur(6px)" }
        }
        whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: "blur(0px) brightness(1)" }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 1.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative [perspective:1400px]"
      >
        {/* Expanding shockwave ripple ring for Cards, Floral Aura Blossom for Envelopes */}
        {isCard ? (
          <motion.div
            initial={{ scale: 0.3, opacity: 0.9 }}
            whileInView={{ scale: 2.3, opacity: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full border border-gold-light/60 shadow-[0_0_30px_rgba(212,175,55,0.4)] z-30"
          />
        ) : (
          <motion.div
            initial={{ scale: 0.4, opacity: 0.8 }}
            whileInView={{ scale: 1.8, opacity: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.35)_0%,_transparent_70%)] z-20"
          />
        )}

        {/* Floating Left arrow — responsive positioning */}
        <button
          onClick={prev}
          aria-label="Previous design"
          className="absolute left-2 sm:-left-6 lg:-left-7 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full bg-white text-ink border border-gold/35 shadow-xl transition-all hover:bg-cream hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={20} className="text-ink" />
        </button>

        {/* Floating Right arrow — responsive positioning */}
        <button
          onClick={next}
          aria-label="Next design"
          className="absolute right-2 sm:-right-6 lg:-right-7 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full bg-white text-ink border border-gold/35 shadow-xl transition-all hover:bg-cream hover:scale-110 active:scale-95"
        >
          <ChevronRight size={20} className="text-ink" />
        </button>

        {/* Stage: Futuristic Holographic Portal for Cards, Standard 16:9 for Envelopes */}
        <SpotlightImageStage
          product={product}
          isCard={isCard}
          total={total}
          idx={idx}
        />
      </motion.div>

      {/* Bottom controls & details with ripple entrance for Cards */}
      <motion.div
        initial={isCard ? { opacity: 0, y: 35 } : false}
        whileInView={isCard ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Dot nav — placed outside below the image so it NEVER covers the card */}
        <div className="mt-4 flex justify-center gap-2">
          {products.map((p, i) => (
            <button
              key={p.code}
              onClick={() => setIdx(i)}
              aria-label={`Go to ${p.name}`}
              className={`cursor-pointer rounded-full transition-all duration-300 ${i === idx ? "h-2 w-7 bg-gold-deep" : "h-2 w-2 bg-gold/30 hover:bg-gold/60"
                }`}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {products.map((p, i) => (
            <button
              key={p.code}
              onClick={() => setIdx(i)}
              title={p.name}
              className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${i === idx ? "border-gold-deep shadow-md scale-105" : "border-gold/20 opacity-60 hover:opacity-100"
                }`}
            >
              <Image src={p.img} alt={p.name} fill sizes="64px" className="object-cover" />
              {i === idx && <div className="absolute inset-0 bg-gold/10" />}
            </button>
          ))}
        </div>

        {/* Product detail strip */}
        <div className="mt-2 border-t border-gold/15">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightDetail
                product={product}
                highlight={highlight === product.code.toLowerCase()}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
