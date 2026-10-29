/**
 * Shop category tree and priced designs, as built from the client's notes and
 * content sheet (content.md). Edited in Admin → Collections (categories and
 * their shop-page stories) and Admin → Products (designs, sizes and pack
 * prices); this copy is shown until the API responds, and whenever it is
 * unreachable.
 *
 * Plain data with no imports, so `scripts/export-content.ts` can turn it into
 * the backend seed data.
 */

/** One size of a design; the client prices every design in fixed packs. */
export type ProductSize = { label: string; dimensions: string; capacity: string; packs: { qty: number; price: number }[] };
export type CatalogProduct = { code: string; name: string; description: string; img: string; sizes: ProductSize[]; video?: string; video2?: string };

export type CatalogItem = {
  id?: number;
  name: string;
  slug: string;
  tag: string;
  img: string;
  products?: CatalogProduct[];
  /** Top-level categories only: the shop page's script line, introduction and "Perfect for" chips. */
  accent?: string;
  description?: string;
  occasions?: string[];
};
export type CatalogGroup = CatalogItem & { children: CatalogItem[] };

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const item = (name: string, img: string, tag = ""): CatalogItem => ({ name, slug: slugify(name), tag, img });

/** Client rule: packs of this many pieces or more can be personalised with a custom name. */
export const CUSTOM_NAME_MIN_PACK = 25;

const packs = (...pairs: [number, number][]) => pairs.map(([qty, price]) => ({ qty, price }));

const STANDARD = { label: "Standard", dimensions: "3.5 × 6.5 in (8.89 × 16.51 cm) approx.", capacity: "Up to ₹11,000" };

// Wedding envelope range from the client's content sheet (content.md).
const WEDDING_ENVELOPES: CatalogProduct[] = [
  {
    code: "WE0001",
    name: "The Luxe Cash Envelope",
    description:
      "An exquisite ivory cash envelope adorned with intricate gold artistry and delicate pearl embellishments. A timeless expression of elegance, perfect for weddings, shagun, and distinguished celebrations.",
    img: "/images/products/wedding-envelopes/we0001.webp?v=6",
    sizes: [{ ...STANDARD, packs: packs([12, 1800], [25, 3500], [50, 6750]) }],
  },
  {
    code: "WE0002",
    name: "The Floral Luxe Cash Envelope",
    description:
      "An exquisite ivory cash envelope featuring delicate floral artistry, elegant gold accents, and a pearl centerpiece. A sophisticated choice for weddings, shagun, and distinguished celebrations.",
    img: "/images/products/wedding-envelopes/we0002.webp?v=6",
    sizes: [{ ...STANDARD, packs: packs([10, 2000], [25, 4750], [50, 9000]) }],
  },
  {
    code: "WE0003",
    name: "The Royal Lace Envelope",
    description:
      "An exquisite ivory envelope adorned with intricate lace detailing, a delicate gold-accented band, and an elegant pearl embellishment, creating a timeless expression of luxury for weddings, anniversaries, and special celebrations.",
    img: "/images/products/wedding-envelopes/we0003.webp?v=6",
    sizes: [{ ...STANDARD, packs: packs([12, 1800], [25, 3500], [50, 6750]) }],
  },
  {
    code: "WE0004",
    name: "The Timeless Lace Envelope",
    description:
      "An elegant ivory envelope featuring intricate geometric lace detailing arranged in a graceful diagonal pattern, beautifully finished with a delicate pearl embellishment for a sophisticated, luxurious touch. Perfect for weddings, anniversaries, and special celebrations.",
    img: "/images/products/wedding-envelopes/we0004.webp?v=6",
    sizes: [{ ...STANDARD, packs: packs([12, 1800], [25, 3500], [50, 6750]) }],
  },
  {
    code: "WE0005",
    name: "The Royal Elegance Envelope",
    description:
      "A sophisticated ivory envelope featuring ornate gold-accented scrollwork, an elegant central frame, and a delicate “Best Wishes” sentiment. Finished with a refined gold border, this timeless design adds a touch of regal charm to weddings, anniversaries, and special celebrations.",
    img: "/images/products/wedding-envelopes/we0005.webp?v=6",
    sizes: [{ ...STANDARD, packs: packs([12, 1800], [25, 3500], [50, 6750]) }],
  },
  {
    code: "WE0006",
    name: "The Imperial Elegance Envelope",
    description:
      "An exquisite ivory envelope adorned with intricate ornamental filigree in metallic silver, a beautifully framed central medallion, and a refined contrasting border. Features the timeless “Best Wishes” sentiment, this elegant design brings a regal touch to weddings, anniversaries, and special celebrations.",
    img: "/images/products/wedding-envelopes/we0006.webp?v=6",
    sizes: [{ ...STANDARD, packs: packs([10, 1750], [25, 4250], [50, 7850]) }],
  },
];

// Baby Theme Coin Envelope range from public/videos/Chuha
const BABY_THEME_COIN_ENVELOPES: CatalogProduct[] = [
  {
    code: "BTCE0001",
    name: "The 'Tiny Miracle' Baby Coin Envelope",
    description:
      "A precious luxury handcrafted baby coin envelope featuring a charming dimensional bunny motif, embossed polka dot background, delicate ribbon bow, and a 'Tiny Miracle' seal. Crafted with love on textured archival cardstock, perfect for baby showers, birth announcements, and shagun blessings.",
    img: "/images/products/baby-envelopes/btce0001.webp?v=3",
    video: "/videos/Chuha/Product_showcase_video_generation_2b043df3_1080p_gwr_video_mvp.mp4",
    video2: "/videos/Chuha/paperdreamz_enhanced_632E13F1_v2.mp4",
    sizes: [
      {
        label: "Standard",
        dimensions: "3.5 × 4.5 in (8.89 × 11.43 cm) approx.",
        capacity: "Gold/Silver Coin & Currency Notes",
        packs: packs([5, 950], [10, 1800], [25, 4250], [50, 8000]),
      },
    ],
  },
];

// Luxury Gifting Card range from public/images/products/Luxury Cards.
const LUXURY_GIFTING_CARDS: CatalogProduct[] = [
  {
    code: "LGC001",
    name: "The Christmas Poinsettia Keepsake Card",
    description:
      "An artisan 3D luxury handcrafted card featuring die-cut layered poinsettia blooms, gilded winter mittens, delicate snow accents, and festive dimensional typography on textured craft stock.",
    img: "/images/products/Luxury Cards/image (4).png",
    sizes: [
      {
        label: "Standard",
        dimensions: "4.5 × 7.5 in (11.4 × 19.0 cm) approx.",
        capacity: "Currency note slot & handwritten letter page",
        packs: packs([1, 350], [5, 1450], [10, 2750], [25, 6250]),
      },
    ],
  },
  {
    code: "LGC002",
    name: "The Whimsical 'Wish Big' 3D Shaker Card",
    description:
      "An enchanting dimensional celebration card featuring an interactive clear 3D shaker dome filled with candy dragees, a sculpted polar bear pâtissier, tiered cupcake, and picket fence detailing.",
    img: "/images/products/Luxury Cards/image (5).png",
    sizes: [
      {
        label: "Standard",
        dimensions: "4.5 × 7.5 in (11.4 × 19.0 cm) approx.",
        capacity: "Interactive 3D shaker & keepsake note",
        packs: packs([1, 380], [5, 1600], [10, 3000], [25, 6800]),
      },
    ],
  },
];

export const CATALOG: CatalogGroup[] = [
  {
    ...item("Envelopes", "/images/collection_envelopes.webp", "Luxury Handmade"),
    accent: "for every shagun",
    description:
      "Handmade shagun envelopes for weddings, baby arrivals, festivals and every celebration in between — cut, layered and finished by hand.",
    occasions: ["Weddings", "Baby Arrivals", "Diwali", "Rakhi", "Birthdays"],
    children: [
      {
        ...item("Wedding Envelopes", "/images/products/wedding-envelopes/we0001.webp?v=6", "Turn every gift into a fairytale of luxury."),
        products: WEDDING_ENVELOPES,
      },
      {
        ...item("Baby Envelopes", "/images/products/baby-envelopes/btce0001.webp?v=3", "Precious keepsakes for little blessings."),
        products: BABY_THEME_COIN_ENVELOPES,
      },
      {
        ...item("Baby Theme Coin Envelopes", "/images/products/baby-envelopes/btce0001.webp?v=3", "Gifts of prosperity for little miracles."),
        products: BABY_THEME_COIN_ENVELOPES,
      },

      item("Festive Envelopes", "/images/craft_design_lotus.webp"),
      item("Floating Pearl Envelopes", "/images/craft_design_pearls.webp"),
      item("Floral Envelopes", "/images/craft_design_petals.webp"),
      item("Gold / Silver Coin Envelopes", "/images/k.webp"),
      item("Luxury Envelopes", "/images/collection_luxury_envelopes.webp"),
      item("Religious Envelopes", "/images/craft_design_finished.webp"),
      item("Traditional Envelopes", "/images/hero_emerald_envelope.webp"),
    ],
  },
  {
    ...item("Gold / Silver Coin Boxes", "/images/collection_keepsakes.webp", "Gifts Of Prosperity"),
    accent: "gifts of prosperity",
    description:
      "Elegant presentation boxes for gold and silver coins, made to be kept long after the gift is given.",
    occasions: ["Dhanteras", "Baby Showers", "Anniversaries", "Corporate Gifting"],
    children: [item("Baby Theme Gold / Silver Coin Boxes", "/images/collection_babybooks.webp")],
  },
  {
    ...item("Cash Boxes", "/images/collection_frames.webp", "Shagun Presentation"),
    accent: "a moment, not a gift",
    description:
      "Keepsake boxes that turn a cash gift into a moment, designed for weddings, rokas and baby celebrations.",
    occasions: ["Weddings", "Rokas", "Baby Celebrations", "Housewarmings"],
    children: [item("Baby Theme Cash Boxes", "/images/collection_babybooks.webp")],
  },
  {
    ...item("Luxury Tags", "/images/collection_gifting.webp", "Finishing Touches"),
    accent: "the finishing touch",
    description:
      "Finishing touches for gift hampers, favours and trousseau packing, personalised with names, dates and motifs.",
    occasions: ["Gift Hampers", "Wedding Favours", "Trousseau Packing", "Return Gifts"],
    children: [],
  },
  {
    ...item("Greeting Cards", "/images/products/Luxury Cards/image (4).png", "Words That Linger"),
    accent: "words that linger",
    description:
      "Handmade 3D dimensional greeting and gift cards crafted with layered papercraft, interactive shaker domes, and exquisite gold foil accents.",
    occasions: ["Christmas & New Year", "Birthdays", "Weddings", "Baby Showers", "Celebrations"],
    children: [
      {
        ...item("Luxury Gifting Card", "/images/products/Luxury Cards/image (4).png", "Interactive 3D Handcrafted Keepsakes"),
        products: LUXURY_GIFTING_CARDS,
      },
    ],
  },
];
