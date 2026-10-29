"use client";

/**
 * Shopping cart, kept in the browser (localStorage) until the backend checkout
 * is wired in. A tiny external store so the navbar badge, the cart drawer and
 * every "Add to cart" button share one state without a provider.
 */

import { useSyncExternalStore } from "react";

export type CartLine = {
  /** Unique per product + variant, e.g. "WE0006|Large|12". */
  id: string;
  name: string;
  /** Variant summary shown under the name, e.g. "Pack of 12 · Large". */
  variant: string;
  unitPrice: number;
  qty: number;
  img: string;
  /** Where the product lives on the site, for the drawer's links. */
  href?: string;
  /** Custom name to be printed on the pieces (packs of 25+). */
  customName?: string;
};

type CartState = { lines: CartLine[]; open: boolean };

const STORAGE_KEY = "pd-cart";
const SERVER_STATE: CartState = { lines: [], open: false };

let state: CartState | null = null;
const listeners = new Set<() => void>();

function read(): CartState {
  if (state) return state;
  let lines: CartLine[] = [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(saved)) lines = saved;
  } catch {
    // Storage blocked or corrupt: start with an empty cart.
  }
  state = { lines, open: false };
  return state;
}

function write(next: CartState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.lines));
  } catch {
    // The cart still works for this visit without storage.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    state = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(line: Omit<CartLine, "qty">, qty = 1) {
    const { lines } = read();
    const existing = lines.find((l) => l.id === line.id);
    write({
      open: true,
      lines: existing
        ? lines.map((l) => (l.id === line.id ? { ...l, qty: l.qty + qty } : l))
        : [...lines, { ...line, qty }],
    });
  },
  setQty(id: string, qty: number) {
    const s = read();
    write({ ...s, lines: qty < 1 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)) });
  },
  remove(id: string) {
    const s = read();
    write({ ...s, lines: s.lines.filter((l) => l.id !== id) });
  },
  clear() {
    write({ ...read(), lines: [] });
  },
  setOpen(open: boolean) {
    write({ ...read(), open });
  },
};

export function useCart() {
  const s = useSyncExternalStore(subscribe, read, () => SERVER_STATE);
  return {
    lines: s.lines,
    open: s.open,
    count: s.lines.reduce((n, l) => n + l.qty, 0),
    total: s.lines.reduce((n, l) => n + l.qty * l.unitPrice, 0),
  };
}
