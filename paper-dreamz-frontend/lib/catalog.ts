"use client";

/**
 * Shop categories, shared by the home page Collections section, the navbar
 * Shop menu, the enquiry forms, /shop and /gallery. Live from the backend's
 * `/catalog` (Admin → Collections and Products); the built-in tree in
 * `lib/content/catalog.ts` is shown until it responds and whenever it can't be reached.
 */

import { useEffect, useState } from "react";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { getWhatsappNumber } from "@/lib/siteSettings";
import { CATALOG, type CatalogGroup, type CatalogItem, type CatalogProduct, type ProductSize } from "@/lib/content/catalog";

export { CATALOG, CUSTOM_NAME_MIN_PACK } from "@/lib/content/catalog";
export type { CatalogGroup, CatalogItem, CatalogProduct, ProductSize } from "@/lib/content/catalog";

type ApiProduct = {
  id: number;
  code: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sizes: { label?: string; dimensions?: string; capacity?: string; packs?: { qty: number | string; price: number | string }[] }[];
};

type ApiCollection = {
  id: number;
  name: string;
  slug: string;
  tag: string | null;
  accent: string | null;
  description: string | null;
  occasions: string[];
  image: string | null;
  products?: ApiProduct[];
  children?: ApiCollection[];
};

const FALLBACK_IMAGE = "/images/collection_envelopes.webp";

/** Only designs with at least one size and pack can be shown with the shop's pack picker. */
function toProduct(p: ApiProduct): CatalogProduct | null {
  const sizes: ProductSize[] = (p.sizes ?? [])
    .filter((s) => (s.label ?? "").toLowerCase() !== "large")
    .map((s) => ({
      label: s.label ?? "Standard",
      dimensions: s.dimensions ?? "",
      capacity: s.capacity ?? "",
      packs: (s.packs ?? []).map((pk) => ({ qty: Number(pk.qty), price: Number(pk.price) })).filter((pk) => pk.qty > 0),
    }))
    .filter((s) => s.packs.length > 0);
  if (sizes.length === 0) return null;
  return {
    code: p.code || p.slug.toUpperCase(),
    name: p.name,
    description: p.description ?? "",
    img: resolveAssetUrl(p.image) ?? FALLBACK_IMAGE,
    sizes,
  };
}

function toItem(c: ApiCollection): CatalogItem {
  const products = (c.products ?? []).map(toProduct).filter((p): p is CatalogProduct => p !== null);
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    tag: c.tag ?? "",
    img: resolveAssetUrl(c.image) ?? FALLBACK_IMAGE,
    ...(products.length > 0 && { products }),
    accent: c.accent ?? undefined,
    description: c.description ?? undefined,
    occasions: c.occasions ?? [],
  };
}

const toGroup = (c: ApiCollection): CatalogGroup => {
  const base = toItem(c);
  let children = (c.children ?? []).map(toItem);
  const localMatch = CATALOG.find(
    (g) => g.slug === c.slug || g.name.toLowerCase() === c.name.toLowerCase(),
  );
  if (localMatch) {
    if (children.length === 0 && localMatch.children.length > 0) {
      children = localMatch.children;
    } else {
      children = children.map((ch) => {
        const localChild = localMatch.children.find(
          (lc) => lc.slug === ch.slug || lc.name.toLowerCase() === ch.name.toLowerCase(),
        );
        if (
          localChild &&
          (!ch.products || ch.products.length === 0) &&
          localChild.products &&
          localChild.products.length > 0
        ) {
          return { ...ch, products: localChild.products };
        }
        return ch;
      });
    }
  }
  return { ...base, children };
};

export const whatsappUrl = (text: string) => `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(text)}`;

export const enquiryUrl = (name: string) => whatsappUrl(`Hi Paper Dreamz, I'd like to enquire about ${name}.`);

/** Category tree for the shop: the built-in tree first, replaced by the admin's once `/catalog` responds. */
export function useCatalog(): CatalogGroup[] {
  const [groups, setGroups] = useState<CatalogGroup[]>(CATALOG);

  useEffect(() => {
    let cancelled = false;
    apiGet<ApiCollection[]>("/catalog").then((data) => {
      if (cancelled || !data || data.length === 0) return;
      setGroups(data.map(toGroup));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return groups;
}

/** Every priced product with the category it is filed under — feeds the /gallery page. */
export function allProducts(groups: CatalogGroup[]) {
  return groups.flatMap((group) =>
    group.children.flatMap((sub) => (sub.products ?? []).map((product) => ({ product, group, sub }))),
  );
}

/** Where a product lives on the shop page; ShopCatalog opens its range and highlights it from this hash. */
export const productHref = (code: string) => `/shop#${code.toLowerCase()}`;
