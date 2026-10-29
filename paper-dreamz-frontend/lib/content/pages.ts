/**
 * Copy and photos for the inner pages (Shop, Gallery, Custom Orders, Contact,
 * FAQs), keyed by the backend `page_sections` key each block is edited under
 * (Admin → Pages). Shown as-is until the API responds, and whenever it is
 * unreachable.
 *
 * Every `*.hero` block has the PageHero shape. Plain data with no imports, so
 * `scripts/export-content.ts` can turn it into the backend seed data.
 */

export type PageHeroContent = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  image_alt: string;
};

export const PAGES_CONTENT = {
  "shop.hero": {
    eyebrow: "The Collection",
    title: "Shop by category",
    accent: "handmade for every occasion.",
    intro:
      "Envelopes, cash boxes, coin boxes and tags — each one cut, layered and finished by hand, and each one made to be personalised for your celebration.",
    image: "/images/products/wedding-envelopes/we0003.webp",
    image_alt: "The Royal Lace handmade wedding envelope",
  },

  "shop.personalise": {
    items: [
      { title: "Names & Monograms", text: "Hand-lettered names, initials and dates." },
      { title: "Your Colour Story", text: "Matched to your outfit, theme or décor." },
      { title: "Motifs & Embellishments", text: "Pearls, florals, foiling and more." },
      { title: "Any Quantity", text: "From a single piece to a full wedding." },
    ],
  },

  "shop.bespoke": {
    steps: [
      { title: "Share the occasion", text: "Tell us the celebration, quantity and the feel you have in mind." },
      { title: "We design it", text: "Our atelier sketches options with your names, colours and motifs." },
      { title: "Handmade for you", text: "Approved designs are cut, layered and finished entirely by hand." },
    ],
    quote: "Every piece is designed around you — no two are ever alike.",
    button_label: "Start your design",
  },

  "gallery.hero": {
    eyebrow: "The Gallery",
    title: "Every design,",
    accent: "in one place.",
    intro:
      "A look at the pieces leaving our atelier. Tap any design to see its details, sizes and pack prices in the shop.",
    image: "/images/products/wedding-envelopes/we0005.webp",
    image_alt: "The Royal Elegance handmade wedding envelope",
  },

  "custom-orders.hero": {
    eyebrow: "Custom Orders · Bulk & Bespoke",
    title: "Your idea,",
    accent: "handcrafted by us.",
    intro:
      "Every Paper Dreamz piece can be made to your brief — your colours, your names, your motifs, in the quantity you need. Tell us about your celebration and we'll design around it.",
    image: "/images/craft_occasion_custom.webp",
    image_alt: "A bespoke gift box finished with a satin bow and pearl brooch",
  },

  "custom-orders.options": {
    eyebrow: "What we customise",
    heading: "Made around your celebration",
    items: [
      { title: "Names & monograms", body: "Initials, family names, dates and messages, lettered on every piece." },
      { title: "Colours & themes", body: "Matched to your wedding palette, festival or baby theme." },
      { title: "Motifs & embellishments", body: "Pearls, florals, foiling, laser-cut patterns and religious motifs." },
      { title: "Envelopes, boxes & tags", body: "Shagun envelopes, cash boxes, coin boxes, luxury and greeting tags." },
      { title: "Bulk orders", body: "Weddings, celebrations and corporate gifting, priced around your quantity." },
      { title: "Careful packing", body: "Packed by hand and delivered to every corner of India." },
    ],
  },

  "custom-orders.steps": {
    eyebrow: "How it works",
    heading: "From your idea to your doorstep",
    subtext: "Four simple steps — we keep you in the loop from the first sketch to dispatch.",
    image: "/images/craft_design_sketch.webp",
    image_alt: "Sketching a custom Paper Dreamz design",
    steps: [
      {
        step: "01",
        title: "Share your idea",
        body: "Send us the occasion, quantity, date and any reference images on WhatsApp or through the form below.",
      },
      {
        step: "02",
        title: "Design & confirm",
        body: "We suggest designs, colours and finishes, and refine them with your feedback until every detail is right.",
      },
      {
        step: "03",
        title: "Confirm your order",
        body: "Orders are confirmed with 100% advance payment, and production begins as soon as it is received.",
      },
      {
        step: "04",
        title: "Handcrafted & dispatched",
        body: "Standard orders are processed within 7 working days; bulk orders take around 3 weeks.",
      },
    ],
    callout_title: "Have a design in mind?",
    callout_text: "Add a reference photo to your enquiry and we’ll design around it.",
    callout_button: "Start your order",
  },

  "custom-orders.form": {
    eyebrow: "Start your order",
    heading: "Tell us what you have in mind",
    intro: "Share a few details and we’ll get back to you with design ideas and a quote.",
    occasions: [
      "Wedding / Roka / Engagement",
      "Baby Arrival / Cradle Ceremony",
      "Birthday / Anniversary",
      "Festival (Diwali, Raksha Bandhan, Eid, Christmas…)",
      "Corporate Gifting",
      "Other",
    ],
  },

  "contact.hero": {
    eyebrow: "Contact Us",
    title: "Let's create something",
    accent: "beautiful together.",
    intro: "Orders, custom designs or a quick question — reach us on WhatsApp, phone or email.",
    image: "/images/collection_envelopes.webp",
    image_alt: "Paper Dreamz handmade envelopes",
  },

  "contact.form": {
    eyebrow: "Write to us",
    heading: "We’d love to hear from you",
    intro:
      "Questions about an order, a design you’ve seen, or bulk pricing — send us a message and we’ll reply on WhatsApp.",
  },

  "faq.hero": {
    eyebrow: "Customer Care · FAQs",
    title: "Questions,",
    accent: "answered.",
    intro:
      "Customisation, bulk orders, timelines, payment and delivery — everything you'd want to know before you order.",
    image: "/images/craft_design_sketch.webp",
    image_alt: "A monogram being sketched by hand on cotton paper",
  },

  "faq.cta": {
    text: "Still have a question?",
    button_label: "Contact Us",
  },
};

/** Maps a `*.hero` block onto PageHero's props. */
export const heroProps = (hero: PageHeroContent) => ({
  eyebrow: hero.eyebrow,
  title: hero.title,
  accent: hero.accent,
  intro: hero.intro,
  image: hero.image,
  imageAlt: hero.image_alt,
});
