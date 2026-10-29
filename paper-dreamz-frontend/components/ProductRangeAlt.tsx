"use client";

/**
 * ProductRangeAlt — an alternative UI for the product-range section.
 *
 * Replaces the standard card grid with a full-bleed editorial layout:
 *   • Left: large image panel with product code badge, dot-nav, and prev/next arrows.
 *   • Right: sticky details panel — name, description, specs, pack selector, CTA.
 *
 * Drop-in swap: accepts the same props as ProductRange in ShopCatalog.tsx.
 */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  MessageCircle,
  PenLine,
  Play,
  Ruler,
  ShoppingBag,
  Sparkles,
  X,
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

/* ─── helpers ───────────────────────────────────────────────────── */
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

/* ─── Pack selector pill ─────────────────────────────────────────── */
function PackPill({
  qty,
  price,
  selected,
  onClick,
}: {
  qty: number;
  price: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex cursor-pointer flex-col items-center rounded-sm border px-4 py-3 transition-all duration-200 ${selected
        ? "border-gold bg-bottle-green text-gold-light shadow-md scale-102"
        : "border-gold/25 bg-ivory text-taupe hover:border-bottle-green/40 hover:text-bottle-green"
        }`}
    >
      <span className={`text-[9.5px] uppercase tracking-[0.18em] ${selected ? "text-gold-light/80" : "text-taupe"}`}>
        Pack of {qty}
      </span>
      <span className={`mt-0.5 font-playfair text-[15px] font-semibold ${selected ? "text-gold-light" : "text-ink"}`}>
        {inr(price)}
      </span>
      {qty >= CUSTOM_NAME_MIN_PACK && (
        <span className={`mt-1 flex items-center gap-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] ${selected ? "text-gold-light" : "text-gold-deep"}`}>
          <Sparkles size={8} /> Name
        </span>
      )}
    </button>
  );
}

/* ─── Right-side detail panel (single product) ───────────────────── */
function DetailPanel({
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
  const isBabyCoin = product.code.startsWith("BTCE");

  return (
    <div
      className={`flex h-full flex-col ${highlight ? "ring-2 ring-gold/50 ring-offset-4 ring-offset-cream rounded-sm" : ""}`}
    >
      {/* Product header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="border-b border-gold/20 pb-7"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full border border-gold/40 bg-bottle-green px-3 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.25em] text-gold-light shadow-md">
            {product.code}
          </span>
          <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.25em] text-bottle-green">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-2 animate-pulse" />
            {isCard ? "Handcrafted 3D Keepsake" : isBabyCoin ? "Bespoke Baby Coin Envelope" : "Bespoke Handcrafted Envelope"}
          </span>
        </div>
        <h3 className="mt-2 font-playfair text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {product.name}
        </h3>
        <p className="mt-4 text-[14px] leading-relaxed text-taupe">
          {product.description}
        </p>
      </motion.div>

      {/* Specs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 grid grid-cols-2 gap-4"
      >
        <div className="flex items-start gap-2.5">
          <Ruler size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" />
          <div>
            <p className="text-[9.5px] uppercase tracking-[0.22em] text-taupe">Size</p>
            <p className="mt-0.5 text-[13px] text-ink">{size.dimensions}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <IndianRupee size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" />
          <div>
            <p className="text-[9.5px] uppercase tracking-[0.22em] text-taupe">{size.capacity.toLowerCase().includes("note") || size.capacity.toLowerCase().includes("slot") ? "Capacity" : "Cash capacity"}</p>
            <p className="mt-0.5 text-[13px] text-ink">{size.capacity}</p>
          </div>
        </div>
      </motion.div>

      {/* Size tabs (only when >1) */}
      {product.sizes.length > 1 && (
        <div className="mt-6 flex gap-2" role="radiogroup" aria-label="Size">
          {product.sizes.map((s, i) => (
            <button
              key={s.label}
              role="radio"
              aria-checked={i === sizeIdx}
              onClick={() => { setSizeIdx(i); setPackIdx(0); }}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${i === sizeIdx
                ? "border-gold-deep bg-cream-2 text-ink"
                : "border-gold/30 text-taupe hover:text-ink"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Pack selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6"
      >
        <p className="mb-3 text-[9.5px] font-semibold uppercase tracking-[0.28em] text-taupe">
          Choose a pack
        </p>
        <div
          className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 gap-2"
          role="radiogroup"
          aria-label="Pack size"
        >
          {size.packs.map((p, i) => (
            <PackPill
              key={p.qty}
              qty={p.qty}
              price={p.price}
              selected={i === packIdx}
              onClick={() => setPackIdx(i)}
            />
          ))}
        </div>
      </motion.div>

      {/* Custom name */}
      {canPersonalise ? (
        <div className="mt-5 rounded-sm border border-gold/35 bg-cream-2/60 p-4">
          <label
            htmlFor={`alt-${product.code}-name`}
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-deep"
          >
            <PenLine size={12} /> Add a custom name{" "}
            <span className="font-normal normal-case tracking-normal text-taupe">(optional)</span>
          </label>
          <input
            id={`alt-${product.code}-name`}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            maxLength={40}
            placeholder="e.g. Riya & Arjun"
            className="mt-2.5 w-full rounded-sm border border-gold/30 bg-ivory px-3.5 py-2.5 font-script text-lg italic text-ink placeholder:font-sans placeholder:text-sm placeholder:not-italic placeholder:text-taupe/60 focus:border-gold-deep focus:outline-none"
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-taupe">
            Printed on every piece. We&apos;ll share a preview on WhatsApp first.
          </p>
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-1.5 text-[11.5px] text-taupe">
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
        className="mt-auto pt-7"
      >
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-4xl font-semibold text-gold-deep">{inr(pack.price)}</span>
          <span className="text-[12px] text-taupe">
            · pack of {pack.qty} · approx. {inr(Math.round(pack.price / pack.qty))} each
          </span>
        </div>
        <div className="mt-4 flex gap-2.5">
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
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
          >
            <ShoppingBag size={14} /> Add to cart
          </button>
          <a
            href={enquiryUrl(`${product.code} ${product.name} (pack of ${pack.qty}${sizeNote}${name ? `, custom name: ${name}` : ""})`)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="inline-flex items-center justify-center rounded-sm border border-gold/40 bg-bottle-green px-4 text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */

/**
 * Cinematic Editorial Image Stage:
 * Modeled after high-end luxury camera macro video:
 *  1. Smooth continuous Ken Burns macro-glide / camera zoom into the center medallion & foil details.
 *  2. Interactive 3D gyroscopic tilt reacting dynamically to mouse movement.
 *  3. Specular diagonal sheen sweeping across the golden embossing.
 *  4. Twinkling golden starlight glints (sparkles) pulsing on the decorative center & accents.
 *  5. Dynamic warm spotlight torch illuminating cursor focus.
 */
/* ──────────────────────────────────────────────────────────────────
 * BESPOKE VISUAL & MOTION EFFECTS (100% Unique to Every Single Product)
 * ────────────────────────────────────────────────────────────────── */

/** WE0001: The Luxe Cash Envelope — Ken Burns Macro Zoom & Golden Starlight (Reference Video) */
function LuxeCashMedallionEffect({ product }: { product: CatalogProduct }) {
  return (
    <>
      {/* Specular Diagonal Sheen Sweep */}
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 3, ease: [0.4, 0, 0.2, 1] }}
        className="pointer-events-none absolute inset-y-0 w-3/4 -skew-x-12 bg-gradient-to-r from-transparent via-gold-light/25 to-transparent z-15 mix-blend-overlay"
      />
      {/* Centerpiece Starlight Sparkles */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {[
          { top: "50%", left: "50%", delay: 0, dur: 2.4, size: 18 },
          { top: "45%", left: "46%", delay: 1.6, dur: 2.6, size: 15 },
          { top: "54%", left: "55%", delay: 2.8, dur: 2.2, size: 16 },
          { top: "42%", left: "53%", delay: 4.1, dur: 2.5, size: 14 },
          { top: "58%", left: "47%", delay: 2.2, dur: 2.7, size: 14 },
        ].map((spark, i) => (
          <motion.div
            key={`sparkle-${product.code}-${i}`}
            style={{ top: spark.top, left: spark.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
            transition={{ duration: spark.dur, repeat: Infinity, repeatDelay: 2, delay: spark.delay, ease: "easeInOut" }}
          >
            <Sparkles size={spark.size} className="text-gold-light drop-shadow-[0_0_10px_#ffd700]" />
          </motion.div>
        ))}
      </div>
    </>
  );
}

/** WE0002: The Floral Luxe Envelope — Enchanted Falling Blossom Petals */
function FloralPetalsEffect() {
  const petals = [
    { x: "18%", dur: 7.0, delay: 0, rot: 55, scale: 0.9 },
    { x: "36%", dur: 8.5, delay: 1.8, rot: 130, scale: 1.1 },
    { x: "58%", dur: 7.5, delay: 3.2, rot: -70, scale: 0.85 },
    { x: "76%", dur: 8.0, delay: 0.9, rot: 95, scale: 1.0 },
    { x: "90%", dur: 9.0, delay: 2.4, rot: -40, scale: 0.95 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {petals.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: ["-10%", "110%"],
            x: [p.x, `calc(${p.x} + 28px)`, `calc(${p.x} - 22px)`, `calc(${p.x} + 15px)`],
            rotate: [0, p.rot, p.rot * 2, p.rot * 3],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          className="absolute top-0"
        >
          <svg width="22" height="28" viewBox="0 0 24 30" fill="none" style={{ transform: `scale(${p.scale})` }}>
            <path
              d="M12 0C18 7 24 16 20 25C16 31 8 30 4 25C-1 18 6 7 12 0Z"
              fill="url(#petal-grad)"
              className="drop-shadow-[0_2px_6px_rgba(244,114,182,0.35)]"
            />
            <defs>
              <linearGradient id="petal-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fdf2f8" />
                <stop offset="50%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/** WE0003: The Royal Lace Envelope — Clean Silk Sheen (Zero colored tints / Zero rainbow) */
function RoyalLaceSheenEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
      {/* Clean elegant white/gold silk light sweep across the lace */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/2 -skew-x-20 bg-gradient-to-r from-transparent via-white/18 to-transparent mix-blend-overlay"
      />
    </div>
  );
}

/** WE0004: The Timeless Lace Envelope — Clean Subtle Shadow Depth */
function SubtleShadowDepthEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
      {/* Crisp clean diagonal shimmer beam (No artificial color tints) */}
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/2 -rotate-45 bg-gradient-to-r from-transparent via-white/15 to-transparent mix-blend-overlay"
      />
    </div>
  );
}

/** WE0005: The Royal Elegance Envelope — 3D Gold Wax Seal & Calligraphic Flourish */
function RoyalWaxSealEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* 3D Embossed Gold Wax Seal Badge Stamp */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-5 right-5 flex items-center justify-center"
      >
        <div className="relative h-15 w-15 rounded-full bg-gradient-to-br from-[#d4af37] via-[#996515] to-[#5a3805] p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#996515] via-[#c5a059] to-[#ffd700] border border-amber-200/50 shadow-inner">
            <span className="font-serif text-[17px] font-bold text-amber-950/80 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
              👑
            </span>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-gold-light/40 border-dashed"
          />
        </div>
      </motion.div>

      {/* Elegant SVG Calligraphic Flourish line */}
      <svg className="absolute bottom-[26%] inset-x-8 h-10 w-[calc(100%-4rem)]" viewBox="0 0 400 40" fill="none">
        <motion.path
          d="M10 25 C 100 5, 150 40, 200 20 C 250 0, 300 35, 390 15"
          stroke="url(#royal-gold-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="royal-gold-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/** WE0006: The Imperial Elegance Envelope — Clean Platinum Diamond Sheen (No colored tints) */
function PlatinumDiamondPrismEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Sharp Pure Silver Diamond Flare Beam (Clean white light, no artificial blue/indigo) */}
      <motion.div
        animate={{ x: ["-130%", "230%"] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2.5, ease: [0.2, 0.8, 0.4, 1] }}
        className="absolute inset-y-0 w-1/2 -skew-x-25 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay"
      />
      {/* Diamond Glint Crosses at Filigree Junctions */}
      {[
        { top: "45%", left: "48%", delay: 0 },
        { top: "52%", left: "54%", delay: 1.8 },
        { top: "40%", left: "62%", delay: 3.2 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          style={{ top: pos.top, left: pos.left }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [0, 1.3, 0], opacity: [0, 0.9, 0], rotate: [0, 45, 90] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.2, delay: pos.delay, ease: "easeInOut" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="h-5 w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <div className="absolute h-0.5 w-5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** LGC001: Christmas Poinsettia Card — Gentle Winter Snowfall & Hearth */
function WinterSnowfallEffect() {
  const flakes = [
    { x: "12%", dur: 5.5, delay: 0, size: 4 },
    { x: "28%", dur: 7.0, delay: 1.2, size: 6 },
    { x: "44%", dur: 6.2, delay: 2.5, size: 5 },
    { x: "62%", dur: 5.8, delay: 0.7, size: 7 },
    { x: "78%", dur: 7.5, delay: 1.8, size: 4 },
    { x: "92%", dur: 6.5, delay: 3.0, size: 6 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Warm fireplace hearth amber glow */}
      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.22),transparent_60%)] mix-blend-screen"
      />
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          animate={{
            y: ["-10%", "110%"],
            x: [f.x, `calc(${f.x} + 12px)`, `calc(${f.x} - 12px)`, f.x],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: f.dur, repeat: Infinity, delay: f.delay, ease: "linear" }}
          style={{ width: f.size, height: f.size }}
          className="absolute top-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
        />
      ))}
    </div>
  );
}

/** LGC002: Whimsical Wish Big 3D Shaker Card — Clean Acrylic Dome Glass Sheen (No artificial dots) */
function CleanGlassDomeSheenEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft natural clean curved light reflection across the shaker dome */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 6, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay"
      />
    </div>
  );
}

/** BTCE0001: Baby Theme Coin Envelope — Gentle Nursery Sparkle Glints */
function BabyCoinEnvelopeEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft nursery twinkle glints on ribbon bow, bunny collar, and Tiny Miracle seal */}
      {[
        { top: "30%", left: "50%", delay: 0, dur: 2.5, size: 16 },
        { top: "53%", left: "51%", delay: 1.8, dur: 2.3, size: 14 },
        { top: "72%", left: "38%", delay: 3.2, dur: 2.6, size: 16 },
        { top: "42%", left: "37%", delay: 4.0, dur: 2.2, size: 13 },
      ].map((spark, i) => (
        <motion.div
          key={i}
          style={{ top: spark.top, left: spark.left }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [0, 1.3, 0], opacity: [0, 0.95, 0], rotate: [0, 90, 180] }}
          transition={{ duration: spark.dur, repeat: Infinity, repeatDelay: 2, delay: spark.delay, ease: "easeInOut" }}
        >
          <Sparkles size={spark.size} className="text-amber-200 drop-shadow-[0_0_8px_#fde68a]" />
        </motion.div>
      ))}
    </div>
  );
}

type ProductMotionConfig = {
  animate: Record<string, number | number[]>;
  duration: number;
};

/**
 * 9 RADICALLY DIFFERENT CAMERA MOTION TRAJECTORIES:
 *  - WE0001: Forward Ken Burns Macro Zoom In & Out
 *  - WE0002: Horizontal Cinematic Side-to-Side Pan (No Zoom!)
 *  - WE0003: Diagonal Corner-to-Corner Glide (No Zoom!)
 *  - WE0004: Gentle Tilting Pendulum Rotation Sway (No Zoom!)
 *  - WE0005: Vertical Elevator Up-and-Down Pan Scan (No Zoom!)
 *  - WE0006: Circular Orbital Float (No Zoom!)
 *  - LGC001: 3D Pop-Up Floating Rocking
 *  - LGC002: Playful Tactile Shaker Bounce & Wobble
 *  - BTCE0001: Nursery Floating Rock & Soft Zoom
 */
const PRODUCT_CAMERA_MOTIONS: Record<string, ProductMotionConfig> = {
  // 1. WE0001: Forward Ken Burns Macro Zoom In & Out
  WE0001: {
    animate: { scale: [1, 1.15, 1], y: [0, -12, 0] },
    duration: 8.5,
  },
  // 2. WE0002: Horizontal Dolly Pan Side-to-Side (No Zoom!)
  WE0002: {
    animate: { scale: 1.1, x: [-24, 24, -24], y: 0 },
    duration: 9.5,
  },
  // 3. WE0003: Diagonal Corner-to-Corner Glide (No Zoom!)
  WE0003: {
    animate: { scale: 1.1, x: [-18, 18, -18], y: [-14, 14, -14] },
    duration: 10,
  },
  // 4. WE0004: Gentle Tilting Pendulum Sway (No Zoom!)
  WE0004: {
    animate: { scale: 1.08, rotate: [-3.5, 3.5, -3.5], x: [-8, 8, -8], y: [-6, 6, -6] },
    duration: 9,
  },
  // 5. WE0005: Vertical Up-and-Down Pan Scan (No Zoom!)
  WE0005: {
    animate: { scale: 1.1, y: [-24, 24, -24], x: 0 },
    duration: 9,
  },
  // 6. WE0006: Circular Orbit Glide (No Zoom!)
  WE0006: {
    animate: { scale: 1.1, x: [0, 18, 0, -18, 0], y: [-14, 0, 14, 0, -14] },
    duration: 10.5,
  },
  // 7. LGC001: 3D Floating Rocking
  LGC001: {
    animate: { scale: [1.02, 1.08, 1.02], rotate: [-2, 2, -2], y: [-10, 10, -10] },
    duration: 7.5,
  },
  // 8. LGC002: Playful Shaker Bounce
  LGC002: {
    animate: { scale: [1.04, 1.1, 1.05, 1.1, 1.04], y: [0, -14, 2, -10, 0], rotate: [-1.5, 1.5, -1, 1.2, -1.5] },
    duration: 6.5,
  },
  // 9. BTCE0001: Nursery Floating Rock & Soft Zoom
  BTCE0001: {
    animate: { scale: [1, 1.08, 1], rotate: [-1, 1, -1], y: [0, -8, 0] },
    duration: 8.5,
  },
};

/**
 * Editorial Image Stage:
 *  - 100% unique camera motion + unique visual overlay per design.
 *  - Clicking on the image stage opens the luxury showcase video modal popup.
 */
export type ProductMediaMode = "effect" | "photo" | "video" | "video2";

/**
 * Editorial Image Stage:
 *  - Supports 3 view modes: "effect" (3D animated motion & bespoke glints),
 *    "photo" (clean original still image with zero motion/effects), and
 *    "video" (plays showcase video directly on the left stage).
 */
function EditorialImageStage({
  product,
  isCard,
  mediaMode,
  setMediaMode,
}: {
  product: CatalogProduct;
  isCard: boolean;
  mediaMode: ProductMediaMode;
  setMediaMode: (mode: ProductMediaMode) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [torch, setTorch] = useState({ x: -300, y: -300, active: false });
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVideoOpen(false);
    };
    if (isVideoOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isVideoOpen]);

  // 3D gyroscopic tilt tracking cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 24 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
    setTorch({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setTorch((prev) => ({ ...prev, active: false }));
  };

  const code = product.code.toUpperCase();
  const motionConfig = PRODUCT_CAMERA_MOTIONS[code] || PRODUCT_CAMERA_MOTIONS.WE0001;
  const videoUrl1 = encodeURI(
    product.video ||
    (code.startsWith("BTCE")
      ? "/videos/Chuha/Product_showcase_video_generation_2b043df3_1080p_gwr_video_mvp.mp4"
      : "/videos/Envelop/Creating_product_showcase_video_365c92e7_1080p_gwr_video_mvp.mp4")
  );
  const videoUrl2 = encodeURI(
    product.video2 ||
    (code.startsWith("BTCE")
      ? "/videos/Chuha/paperdreamz_enhanced_632E13F1_v2.mp4"
      : "")
  );

  const activeVideoUrl = mediaMode === "video2" ? (videoUrl2 || videoUrl1) : videoUrl1;

  // ─── 1. VIDEO VIEW MODE (Plays directly on the left side, edge-to-edge full height) ───
  if (mediaMode === "video" || mediaMode === "video2") {
    return (
      <div className="relative aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[640px] overflow-hidden select-none bg-cream-2">
        <video
          key={activeVideoUrl}
          src={activeVideoUrl}
          autoPlay
          loop
          playsInline
          controls
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  // ─── 2. SIMPLE IMAGE (PHOTO) VIEW MODE (Interactive cursor hover tilt, no loop effects) ───
  if (mediaMode === "photo") {
    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group/stage relative aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[640px] overflow-hidden select-none bg-cream-2 flex items-center justify-center [perspective:1200px]"
      >
        <motion.div
          key={product.code}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          transition={{ ease: "easeOut" }}
          className="relative h-full w-full"
        >
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center pointer-events-none"
            priority
          />
        </motion.div>
      </div>
    );
  }

  // ─── 3. 3D EFFECT VIEW MODE (Full animated camera motion + bespoke overlay effects) ───
  return (
    <>
      <div
        ref={containerRef}
        onClick={() => setMediaMode("video")}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        title="Click to play showcase video"
        className="group/stage relative aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[640px] overflow-hidden select-none cursor-pointer [perspective:1200px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={product.code}
            initial={{ opacity: 0, filter: "blur(10px) brightness(1.15)", scale: 1.05 }}
            animate={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(6px) brightness(0.9)", scale: 0.98 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative h-full w-full"
          >
            {/* Dynamic Camera Motion (Unique motion trajectory per design!) */}
            <motion.div
              animate={motionConfig.animate}
              transition={{
                duration: motionConfig.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 h-full w-full origin-center"
            >
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center pointer-events-none"
                priority
              />
            </motion.div>

            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,transparent_45%,rgba(10,18,12,0.3)_100%)]" />

            {/* Dynamic Interactive Spotlight Torch */}
            {torch.active && (
              <div
                style={{
                  background: `radial-gradient(circle 280px at ${torch.x}px ${torch.y}px, rgba(255, 240, 200, 0.22), transparent 75%)`,
                }}
                className="pointer-events-none absolute inset-0 z-15 transition-opacity duration-200"
              />
            )}

            {/* ─── RADICALLY DISTINCT BESPOKE OVERLAY FOR EACH PRODUCT ─── */}
            {code === "WE0001" && <LuxeCashMedallionEffect product={product} />}
            {code === "WE0002" && <FloralPetalsEffect />}
            {code === "WE0003" && <RoyalLaceSheenEffect />}
            {code === "WE0004" && <SubtleShadowDepthEffect />}
            {code === "WE0005" && <RoyalWaxSealEffect />}
            {code === "WE0006" && <PlatinumDiamondPrismEffect />}
            {code === "LGC001" && <WinterSnowfallEffect />}
            {code === "LGC002" && <CleanGlassDomeSheenEffect />}
            {code.startsWith("BTCE") && <BabyCoinEnvelopeEffect />}

            {/* Laser Scanner Beam on Design Change */}
            <motion.div
              key={`scan-${product.code}`}
              initial={{ top: "0%", opacity: 1 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-gold-light to-transparent shadow-[0_0_14px_rgba(255,225,120,0.95)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── LUXURY CINEMATIC SHOWCASE VIDEO POPUP MODAL (OPTIONAL FULLSCREEN) ─── */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-auto flex max-h-[90vh] w-auto max-w-4xl flex-col overflow-hidden rounded-xl border border-gold/40 bg-bottle-green shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gold/20 bg-bottle-green px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-gold-light animate-pulse" />
                  <h3 className="font-playfair text-base sm:text-lg font-medium text-cream">
                    {product.name}
                  </h3>
                  <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-gold-light/75">
                    · Showcase Video
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoOpen(false)}
                  aria-label="Close video popup"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold-light transition-all hover:bg-gold hover:text-bottle-green hover:scale-105 active:scale-95"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative flex max-h-[75vh] w-full items-center justify-center bg-black/95">
                <video
                  src={activeVideoUrl}
                  autoPlay
                  controls
                  playsInline
                  loop
                  className="max-h-[75vh] w-auto max-w-full object-contain shadow-2xl"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-gold/15 bg-emerald/60 px-5 py-2.5 text-[11px] text-taupe">
                <span className="font-mono text-[10px] tracking-wider text-gold-light/80">
                  {product.code}
                </span>
                <span>Click outside or press <kbd className="rounded border border-gold/30 bg-black/40 px-1 py-0.5 text-[9px] text-cream">ESC</kbd> to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProductRangeAlt({
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
  onToggleUI?: (mode: number) => void;
}) {
  const products = item.products ?? [];
  const [idx, setIdx] = useState(() =>
    highlight
      ? Math.max(0, products.findIndex((p) => p.code.toLowerCase() === highlight))
      : 0,
  );
  const [mediaMode, setMediaMode] = useState<ProductMediaMode>("effect");

  const product = products[idx];
  const total = products.length;
  const isCard = product ? (product.code.startsWith("LGC") || product.img.toLowerCase().includes("luxury")) : false;
  const prev = () => {
    setIdx((i) => (i - 1 + total) % total);
  };
  const next = () => {
    setIdx((i) => (i + 1) % total);
  };

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
        {item.tag && (
          <div className="flex sm:items-end w-full sm:w-auto">
            <p className="font-script text-xl sm:text-2xl italic text-gold-deep text-left sm:text-right">{item.tag}</p>
          </div>
        )}

        {/* Futuristic Laser sweep across header */}
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "100%" }}
          viewport={{ once: false }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-light to-transparent shadow-[0_0_12px_#d4af37]"
        />
      </motion.div>

      {/* Relative wrapper for floating side swipe buttons */}
      <div className="relative">
        {/* Left/Right swipe buttons only when multiple designs exist */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous design"
              className="absolute left-2 sm:-left-5 lg:-left-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-xl border border-gold/35 transition-all hover:bg-cream hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} className="text-ink" />
            </button>

            <button
              onClick={next}
              aria-label="Next design"
              className="absolute right-2 sm:-right-5 lg:-right-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-xl border border-gold/35 transition-all hover:bg-cream hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} className="text-ink" />
            </button>
          </>
        )}

        {/* Editorial split layout with Cinematic Horizon Split for Cards, Standard for Envelopes */}
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-sm border border-gold/25 shadow-xl lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px]">

          {/* LEFT: image panel with Horizon Unfold */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-cream-2 overflow-hidden"
          >
            <EditorialImageStage
              product={product}
              isCard={isCard}
              mediaMode={mediaMode}
              setMediaMode={setMediaMode}
            />

            {/* Top badges bar — separate code and counter so they never collide */}
            <div className="absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 z-20 flex items-center justify-between pointer-events-none">
              <span className="rounded-full border border-gold/40 bg-bottle-green px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gold-light shadow-md">
                {product.code}
              </span>
              <span className="rounded-full border border-white/30 bg-black/40 px-2.5 sm:px-3.5 py-1 font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white backdrop-blur-sm shadow-sm">
                {pad(idx + 1)} / {pad(total)}
              </span>
            </div>

            {/* Bottom: dot nav only when multiple designs */}
            {total > 1 && (
              <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-6">
                <div className="flex items-center gap-2">
                  {products.map((p, i) => (
                    <button
                      key={p.code}
                      onClick={() => setIdx(i)}
                      aria-label={`Go to ${p.name}`}
                      className={`cursor-pointer rounded-full transition-all duration-300 ${i === idx
                        ? "h-2.5 w-7 bg-gold"
                        : "h-2 w-2 bg-white/60 hover:bg-white"
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT: detail panel with Lateral Glide */}
          <motion.div
            initial={{ opacity: 0, x: 70, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="relative border-t border-gold/20 bg-ivory lg:border-t-0 lg:border-l"
          >
            {/* Seam laser divider flash */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
              viewport={{ once: false }}
              transition={{ duration: 2.0, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-transparent via-gold-light to-transparent shadow-[0_0_12px_#ffd700] z-30"
            />

            {/* Thumbnail strip */}
            <div className="flex gap-0 overflow-x-auto border-b border-gold/20 [scrollbar-width:none] bg-cream/30">
              {products.length === 1 ? (
                /* When single product (e.g. Baby Theme Coin Envelopes): show 3 media thumbnails directly */
                <>
                  {/* 1. 3D Effect View */}
                  <button
                    onClick={() => setMediaMode("effect")}
                    className={`group relative h-20 w-28 sm:w-32 shrink-0 cursor-pointer overflow-hidden border-r border-gold/20 transition-all duration-200 ${
                      mediaMode === "effect"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/15"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    aria-label="3D Effect View"
                    title="View with 3D animation & sparkle effects"
                  >
                    <Image
                      src={product.img}
                      alt={`${product.name} (Effect)`}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/90 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-gold-light backdrop-blur-xs">
                      <Sparkles size={9} className="text-amber-300" />
                      <span>3D Effect</span>
                    </div>
                    {mediaMode === "effect" && (
                      <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_#ffd700]" />
                    )}
                  </button>

                  {/* 2. Simple Image (No Effect) */}
                  <button
                    onClick={() => setMediaMode("photo")}
                    className={`group relative h-20 w-28 sm:w-32 shrink-0 cursor-pointer overflow-hidden border-r border-gold/20 transition-all duration-200 ${
                      mediaMode === "photo"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/15"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    aria-label="Simple Image (No Effect)"
                    title="View clean static photo without effects"
                  >
                    <Image
                      src={product.img}
                      alt={`${product.name} (Simple Photo)`}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/90 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-gold-light backdrop-blur-xs">
                      <Camera size={9} />
                      <span>Simple Image</span>
                    </div>
                    {mediaMode === "photo" && (
                      <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_#ffd700]" />
                    )}
                  </button>

                  {/* 3. Showcase Video 1 */}
                  <button
                    onClick={() => setMediaMode("video")}
                    className={`group relative h-20 w-28 sm:w-32 shrink-0 cursor-pointer overflow-hidden border-r border-gold/20 transition-all duration-200 ${
                      mediaMode === "video"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/15"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    aria-label="Showcase Video 1"
                    title="Play showcase video 1 on the left"
                  >
                    <Image
                      src={product.img}
                      alt={`${product.name} (Video 1)`}
                      fill
                      sizes="128px"
                      className="object-cover brightness-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bottle-green/90 border border-gold/50 text-gold-light shadow transition-transform group-hover:scale-110">
                        <Play size={10} className="fill-current ml-0.5" />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/90 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-gold-light backdrop-blur-xs">
                      <Play size={9} className="fill-current" />
                      <span>Video 1</span>
                    </div>
                    {mediaMode === "video" && (
                      <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                    )}
                  </button>

                  {/* 4. Showcase Video 2 (Enhanced) */}
                  <button
                    onClick={() => setMediaMode("video2")}
                    className={`group relative h-20 w-28 sm:w-32 shrink-0 cursor-pointer overflow-hidden border-r border-gold/20 transition-all duration-200 ${
                      mediaMode === "video2"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/15"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    aria-label="Showcase Video 2"
                    title="Play enhanced showcase video 2 on the left"
                  >
                    <Image
                      src={product.img}
                      alt={`${product.name} (Video 2)`}
                      fill
                      sizes="128px"
                      className="object-cover brightness-65 saturate-125"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bottle-green/90 border border-gold/50 text-gold-light shadow transition-transform group-hover:scale-110">
                        <Play size={10} className="fill-current ml-0.5" />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/90 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-gold-light backdrop-blur-xs">
                      <Play size={9} className="fill-current" />
                      <span>Video 2</span>
                    </div>
                    {mediaMode === "video2" && (
                      <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                    )}
                  </button>
                </>
              ) : (
                /* When multiple products (e.g. Wedding Envelopes): show product thumbnails, plus media view toggles */
                <>
                  {products.map((p, i) => (
                    <button
                      key={p.code}
                      onClick={() => setIdx(i)}
                      className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden transition-all duration-200 border-r border-gold/15 ${
                        i === idx
                          ? "ring-2 ring-inset ring-gold-deep bg-gold/10"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={p.name}
                      title={p.name}
                    >
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center font-mono text-[8px] font-semibold uppercase tracking-wider text-white">
                        {p.code}
                      </div>
                      {i === idx && (
                        <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_#ffd700]" />
                      )}
                    </button>
                  ))}

                  {/* Golden vertical divider */}
                  <div className="my-auto mx-1.5 h-10 w-[1px] bg-gold/30 shrink-0" />

                  {/* Media views for currently active product */}
                  <button
                    onClick={() => setMediaMode("effect")}
                    className={`group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden border-r border-gold/15 transition-all duration-200 ${
                      mediaMode === "effect"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/10"
                        : "opacity-65 hover:opacity-100"
                    }`}
                    title="3D Effect View"
                  >
                    <Image src={product.img} alt="Effect view" fill sizes="80px" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/85 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-gold-light">
                      <Sparkles size={8} /> Effect
                    </div>
                  </button>

                  <button
                    onClick={() => setMediaMode("photo")}
                    className={`group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden border-r border-gold/15 transition-all duration-200 ${
                      mediaMode === "photo"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/10"
                        : "opacity-65 hover:opacity-100"
                    }`}
                    title="Simple Image View"
                  >
                    <Image src={product.img} alt="Simple image" fill sizes="80px" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/85 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-gold-light">
                      <Camera size={8} /> Photo
                    </div>
                  </button>

                  <button
                    onClick={() => setMediaMode("video")}
                    className={`group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden transition-all duration-200 ${
                      mediaMode === "video"
                        ? "ring-2 ring-inset ring-gold-deep bg-gold/10"
                        : "opacity-65 hover:opacity-100"
                    }`}
                    title="Watch Video"
                  >
                    <Image src={product.img} alt="Video view" fill sizes="80px" className="object-cover brightness-70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bottle-green/90 border border-gold/50 text-gold-light shadow">
                        <Play size={8} className="fill-current ml-0.5" />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-bottle-green/85 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-gold-light">
                      <Play size={8} className="fill-current" /> Video
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Animated detail content */}
            <div className="overflow-y-auto lg:max-h-[calc(100%-80px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="p-4 sm:p-7 lg:p-9"
                >
                  <DetailPanel
                    product={product}
                    highlight={highlight === product.code.toLowerCase()}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick-jump strip (mobile only) */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 lg:hidden [scrollbar-width:none]">
        {products.length === 1 ? (
          <>
            <button
              onClick={() => setMediaMode("effect")}
              className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${
                mediaMode === "effect"
                  ? "border-gold-deep shadow-md ring-2 ring-gold-deep"
                  : "border-gold/20 opacity-70 hover:opacity-100"
              }`}
              style={{ width: 88, height: 88 }}
            >
              <Image src={product.img} alt={product.name} fill sizes="88px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[8px] font-bold uppercase tracking-[0.15em] bg-gold-deep/90 text-cream">
                ✨ Effect
              </span>
            </button>
            <button
              onClick={() => setMediaMode("photo")}
              className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${
                mediaMode === "photo"
                  ? "border-gold-deep shadow-md ring-2 ring-gold-deep"
                  : "border-gold/20 opacity-70 hover:opacity-100"
              }`}
              style={{ width: 88, height: 88 }}
            >
              <Image src={product.img} alt={product.name} fill sizes="88px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[8px] font-bold uppercase tracking-[0.15em] bg-bottle-green/90 text-gold-light">
                📷 Photo
              </span>
            </button>
            <button
              onClick={() => setMediaMode("video")}
              className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${
                mediaMode === "video"
                  ? "border-gold-deep shadow-md ring-2 ring-gold-deep"
                  : "border-gold/20 opacity-70 hover:opacity-100"
              }`}
              style={{ width: 88, height: 88 }}
            >
              <Image src={product.img} alt={product.name} fill sizes="88px" className="object-cover brightness-70" />
              <span className="absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[8px] font-bold uppercase tracking-[0.15em] bg-red-800/90 text-white">
                ▶ Video 1
              </span>
            </button>
            <button
              onClick={() => setMediaMode("video2")}
              className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${
                mediaMode === "video2"
                  ? "border-gold-deep shadow-md ring-2 ring-gold-deep"
                  : "border-gold/20 opacity-70 hover:opacity-100"
              }`}
              style={{ width: 88, height: 88 }}
            >
              <Image src={product.img} alt={product.name} fill sizes="88px" className="object-cover brightness-65 saturate-125" />
              <span className="absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[8px] font-bold uppercase tracking-[0.15em] bg-red-800/90 text-white">
                ▶ Video 2
              </span>
            </button>
          </>
        ) : (
          products.map((p, i) => (
            <button
              key={p.code}
              onClick={() => setIdx(i)}
              className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${i === idx
                ? "border-gold-deep shadow-md"
                : "border-gold/20 opacity-70 hover:opacity-100"
                }`}
              style={{ width: 88, height: 88 }}
            >
              <Image src={p.img} alt={p.name} fill sizes="88px" className="object-cover" />
              <span
                className={`absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[8px] font-bold uppercase tracking-[0.15em] ${i === idx ? "bg-gold-deep/90 text-cream" : "bg-black/40 text-white"
                  }`}
              >
                {p.code}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}