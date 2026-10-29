"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cart, useCart, type CartLine } from "@/lib/cart";
import { whatsappUrl } from "@/lib/catalog";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Until online payment is wired in, checkout sends the itemised order to WhatsApp. */
function orderMessage(lines: CartLine[], total: number) {
  const items = lines.map(
    (l, i) =>
      `${i + 1}. ${l.name} (${l.variant}) × ${l.qty} = ${inr(l.unitPrice * l.qty)}` +
      (l.customName ? `\n   Custom name: ${l.customName}` : ""),
  );
  return ["Hi Paper Dreamz, I'd like to place an order:", "", ...items, "", `Total: ${inr(total)}`].join("\n");
}

/** Slide-out cart, mounted once by the Navbar and opened from the bag icon or any "Add to cart". */
export default function CartDrawer() {
  const { lines, open, count, total } = useCart();
  const close = () => cart.setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-noir/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream text-ink shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-gold/25 px-6 py-5">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-gold-deep">Your cart</p>
                <h2 className="mt-1 font-playfair text-2xl font-semibold">
                  {count} {count === 1 ? "item" : "items"}
                </h2>
              </div>
              <button onClick={close} aria-label="Close cart" className="cursor-pointer rounded-full p-2 text-taupe hover:bg-cream-2 hover:text-ink">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={40} strokeWidth={1} className="text-gold" />
                <p className="mt-5 font-playfair text-xl font-semibold">Your cart is empty</p>
                <p className="mt-2 text-sm text-taupe">Browse our handmade designs and add your favourites.</p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="mt-7 inline-flex items-center rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-gold-light transition-colors hover:bg-emerald-2 hover:border-gold"
                >
                  Shop the collection
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-gold/15 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={l.id} className="flex gap-4 py-5">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-sm border border-gold/25 bg-cream-2">
                        <Image src={l.img} alt={l.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          {l.href ? (
                            <Link href={l.href} onClick={close} className="font-playfair text-[15px] font-semibold leading-snug hover:text-gold-deep">
                              {l.name}
                            </Link>
                          ) : (
                            <p className="font-playfair text-[15px] font-semibold leading-snug">{l.name}</p>
                          )}
                          <button
                            onClick={() => cart.remove(l.id)}
                            aria-label={`Remove ${l.name}`}
                            className="cursor-pointer p-0.5 text-taupe/70 hover:text-ink"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-[12px] text-taupe">{l.variant}</p>
                        {l.customName && (
                          <p className="mt-1 text-[12px] text-ink">
                            <span className="text-taupe">Custom name:</span>{" "}
                            <span className="font-script text-[15px] italic text-gold-deep">{l.customName}</span>
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-gold/30">
                            <button
                              onClick={() => cart.setQty(l.id, l.qty - 1)}
                              aria-label="Decrease quantity"
                              className="cursor-pointer p-1.5 text-taupe hover:text-ink"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                            <button
                              onClick={() => cart.setQty(l.id, l.qty + 1)}
                              aria-label="Increase quantity"
                              className="cursor-pointer p-1.5 text-taupe hover:text-ink"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-playfair text-base font-semibold text-gold-deep">{inr(l.unitPrice * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gold/25 bg-ivory px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-taupe">Subtotal</span>
                    <span className="font-playfair text-2xl font-semibold">{inr(total)}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-taupe">Shipping and personalisation are confirmed with you on WhatsApp.</p>
                  <a
                    href={whatsappUrl(orderMessage(lines, total))}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex w-full items-center justify-center rounded-sm border border-gold/40 bg-bottle-green py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-gold-light shadow-md transition-colors hover:bg-emerald-2 hover:border-gold"
                  >
                    Checkout on WhatsApp
                  </a>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em]">
                    <button onClick={close} className="cursor-pointer text-gold-deep hover:text-ink">
                      Continue shopping
                    </button>
                    <button onClick={() => cart.clear()} className="cursor-pointer text-taupe hover:text-ink">
                      Clear cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
