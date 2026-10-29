"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Menu, X, Search, User, ShoppingBag, Truck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn, pageHref } from "@/lib/utils";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { loadSiteSettings } from "@/lib/siteSettings";
import { useCatalog } from "@/lib/catalog";
import { cart, useCart } from "@/lib/cart";
import CartDrawer from "./CartDrawer";

type NavLink = {
  id: number;
  label: string;
  href: string;
  sort_order: number;
};


const FALLBACK_LINKS: NavLink[] = [
  { id: 1, label: "Home", href: "#home", sort_order: 0 },
  { id: 2, label: "Shop", href: "/shop", sort_order: 1 },
  { id: 3, label: "Gallery", href: "/gallery", sort_order: 2 },
  { id: 4, label: "About", href: "/about", sort_order: 3 },
  { id: 5, label: "Custom Orders", href: "/custom-orders", sort_order: 4 },
  { id: 6, label: "Contact", href: "/contact", sort_order: 5 },
];

// Links that open the Shop menu of categories ("#collections" is the pre-/shop value still in older databases).
const isShopLink = (href: string) => href === "/shop" || href === "#collections";

const FALLBACK_SETTINGS = {
  announcement_text: "Complimentary Shipping On Orders Above ₹2999",
  logo: "/images/logo-mark-sm.webp",
  brand_name: "PAPER DREAMZ",
  brand_tagline: "Ruchi Mishra",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState(FALLBACK_LINKS);
  const { count: cartCount } = useCart();
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const pathname = usePathname();
  const shopCategories = useCatalog().map((c) => ({ label: c.name, href: `/shop#${c.slug}` }));
  const isActive = (href: string) => (pathname === "/" ? href === "#home" : href === pathname);

  const reduceMotion = useReducedMotion();
  // Cursor position across the whole navbar, normalised to -0.5..0.5
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-40, 40]), { stiffness: 120, damping: 14 });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [22, -22]), { stiffness: 120, damping: 14 });

  const onHeaderMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onHeaderLeave = () => {
    mx.set(0);
    my.set(0);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiGet<NavLink[]>("/nav-links").then((data) => {
      if (cancelled || !data || data.length === 0) return;
      setLinks(data);
    });

    loadSiteSettings().then((data) => {
      if (cancelled || !data) return;
      setSettings({
        announcement_text: data.announcement_text ?? FALLBACK_SETTINGS.announcement_text,
        logo: resolveAssetUrl(data.logo) ?? FALLBACK_SETTINGS.logo,
        brand_name: data.brand_name ?? FALLBACK_SETTINGS.brand_name,
        brand_tagline: data.brand_tagline ?? FALLBACK_SETTINGS.brand_tagline,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Top announcement bar (Cream / Light header color) */}
      <div className="fixed top-0 inset-x-0 z-50 flex h-[32px] sm:h-[34px] items-center justify-center bg-cream border-b border-gold/25 px-2.5 sm:px-4 py-1 sm:py-2 text-[9px] xs:text-[9.5px] sm:text-[10.5px] text-ink font-medium tracking-[0.1em] sm:tracking-[0.16em] uppercase">
        <div className="flex items-center gap-1.5 sm:gap-2 text-center truncate">
          <Truck size={12} className="text-gold-deep shrink-0 hidden xs:inline" />
          <span className="truncate">{settings.announcement_text}</span>
        </div>
      </div>

      {/* Main Header (Dark Bottle Green color) */}
      <header
        id="site-header"
        onMouseMove={onHeaderMove}
        onMouseLeave={onHeaderLeave}
        className={cn(
          "fixed top-[32px] sm:top-[34px] inset-x-0 z-40 bg-bottle-green/98 backdrop-blur-md border-b border-gold/20 transition-all duration-300",
          scrolled && "shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        )}
      >
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-12 py-1 sm:py-1 lg:py-1 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* 1. Left Section: Logo & Brand Name (Scaled for mobile) */}
          <div className="flex items-center justify-start flex-1 min-w-0 pr-1">
            <Link href={pageHref("#home", pathname)} className="flex flex-col items-center gap-0.5 group flex-shrink-0">
              <span className="relative block h-7 w-10 sm:h-8 sm:w-12 md:h-9 md:w-[52px] shrink-0 [perspective:600px]">
                <motion.span
                  className="absolute inset-0 block [transform-style:preserve-3d]"
                  style={reduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }}
                >
                  {/* periodic 3D coin-flip + floating bob */}
                  <motion.span
                    className="absolute inset-0 block [transform-style:preserve-3d] drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
                    animate={reduceMotion ? undefined : { rotateY: [0, 0, 360, 360], y: [0, -2, 0, 2, 0] }}
                    transition={{
                      rotateY: { duration: 7, times: [0, 0.6, 0.8, 1], ease: "easeInOut", repeat: Infinity },
                      y: { duration: 3.2, ease: "easeInOut", repeat: Infinity },
                    }}
                    whileHover={reduceMotion ? undefined : { scale: 1.2, rotateZ: -6 }}
                  >
                    <Image src={settings.logo ?? FALLBACK_SETTINGS.logo} alt={settings.brand_name ?? "Paper Dreamz"} fill sizes="(max-width: 640px) 48px, 72px" className="object-contain [backface-visibility:visible]" priority />
                  </motion.span>
                </motion.span>
              </span>
              <span className="flex flex-col leading-none justify-center items-center">
                <span className="font-logo text-[12px] xs:text-[13px] sm:text-[15px] md:text-[16px] tracking-[0.16em] xs:tracking-[0.2em] sm:tracking-[0.26em] md:tracking-[0.3em] text-white group-hover:text-white/80 transition-colors font-normal whitespace-nowrap">
                  {settings.brand_name}
                </span>
                <span className="flex items-center gap-1.5 sm:gap-2 mt-0.5 whitespace-nowrap">
                  <span className="h-px w-3 sm:w-4 bg-white/50" />
                  <span className="font-logo text-[8px] sm:text-[9px] text-white/85 lowercase">by</span>
                  <span className="h-px w-3 sm:w-4 bg-white/50" />
                </span>
                <span className="font-logo text-[7px] xs:text-[7.5px] sm:text-[8.5px] tracking-[0.22em] sm:tracking-[0.28em] text-white/80 uppercase whitespace-nowrap">
                  {settings.brand_tagline}
                </span>
              </span>
            </Link>
          </div>

          {/* 2. Center Section: Navigation Links (Dead Center) */}
          <nav className="hidden lg:flex items-center justify-center flex-shrink-0 [perspective:700px]">
            <ul className="flex items-center gap-7 xl:gap-9 text-[11px] xl:text-[12px] tracking-[0.2em] uppercase font-medium">
              {links.map((l) => (
                <li key={l.id} className="relative group/shop">
                  <a
                    href={pageHref(l.href, pathname)}
                    className={cn(
                      "relative inline-block py-1.5 transition-all duration-300 text-ivory/80 hover:text-gold-light hover:[transform:rotateX(-18deg)_translateZ(8px)] hover:[text-shadow:0_6px_10px_rgba(0,0,0,0.5)] group",
                      isActive(l.href) && "text-gold-light font-bold"
                    )}
                  >
                    {l.label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-[1.5px] bg-gold-light transition-all duration-300",
                        isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </a>
                  {isShopLink(l.href) && (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover/shop:visible group-hover/shop:opacity-100 group-focus-within/shop:visible group-focus-within/shop:opacity-100">
                      <ul className="min-w-[230px] rounded-sm border border-gold/25 bg-bottle-green py-2 shadow-2xl normal-case tracking-normal">
                        {shopCategories.map((c) => (
                          <li key={c.label}>
                            <a href={pageHref(c.href, pathname)} className="block px-5 py-2 text-[12px] text-ivory/85 hover:bg-white/5 hover:text-gold-light">
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Right Section: Search, User, Cart Actions */}
          <div className="flex items-center justify-end flex-shrink-0 gap-2 xs:gap-3 sm:gap-5 lg:gap-6">
            <button aria-label="Search" className="text-ivory/85 hover:text-gold-light transition-colors p-1 cursor-pointer">
              <Search size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
            </button>
            <button aria-label="Account" className="hidden sm:block text-ivory/85 hover:text-gold-light transition-colors p-1 cursor-pointer">
              <User size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => cart.setOpen(true)}
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              className="relative text-ivory/85 hover:text-gold-light transition-colors p-1 cursor-pointer"
            >
              <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-3.5 sm:h-4 sm:min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[8.5px] sm:text-[9.5px] font-bold text-noir shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </button>
            <button
              className="lg:hidden text-ivory hover:text-gold-light p-1 cursor-pointer"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[104px] inset-x-0 z-30 mx-4 rounded-2xl border border-gold/25 bg-bottle-green/95 backdrop-blur-xl shadow-2xl p-6 lg:hidden"
          >
            <ul className="flex flex-col gap-4 text-center text-base font-display text-ivory">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={pageHref(l.href, pathname)}
                    onClick={() => setOpen(false)}
                    className="hover:text-gold-light transition-colors block py-1 uppercase tracking-[0.18em] text-xs font-semibold"
                  >
                    {l.label}
                  </a>
                  {isShopLink(l.href) && (
                    <ul className="mt-1 flex flex-col gap-1 text-center">
                      {shopCategories.map((c) => (
                        <li key={c.label}>
                          <a href={pageHref(c.href, pathname)} onClick={() => setOpen(false)} className="block py-0.5 text-[11px] text-ivory/60 hover:text-gold-light">
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer />
    </>
  );
}
