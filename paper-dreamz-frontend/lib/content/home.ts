/**
 * Home page copy, keyed by the backend `page_sections` key it is edited under
 * (Admin → Pages → Home Page). Each component shows this as-is until the API
 * responds, and keeps it whenever the API is unreachable.
 *
 * This file is plain data with no imports: `scripts/export-content.ts` reads it
 * to generate the backend seed data, so the admin starts with exactly this copy.
 */

export const HOME_CONTENT = {
  "home.collections": {
    heading: "Shop by Category",
    subtext: "Beautifully handmade creations for every occasion",
    button_label: "View All Categories",
  },

  "home.mission-vision": {
    eyebrow: "Original in Thought, Exceptional in Detail",
    heading: "Mission &",
    accent: "Vision",
    pillars: [
      {
        eyebrow: "Our Mission",
        heading: "Imagination,",
        accent_word: "crafted.",
        body: "To transform imagination into exceptional paper artistry and personalised creations through originality, refined craftsmanship and thoughtful customisation. At PaperDreamz, we strive to turn every client's vision into a distinctive creation that reflects their individuality, exceeds ordinary expectations and makes every occasion more meaningful.",
        quote: "We don't just create products; we give imagination a beautiful identity.",
      },
      {
        eyebrow: "Our Vision",
        heading: "Originality,",
        accent_word: "timeless.",
        body: "To establish PaperDreamz by Ruchi Mishra as a distinctive name in luxury paper artistry and customised creative design, inspiring crafters and designers across India and overseas through original concepts, trend-conscious innovation and uncompromising attention to detail. Beyond craft, our vision is to build a women-centric creative community that inspires independence, celebrates talent, and transforms creativity into a source of pride, purpose, and livelihood.",
        quote: "To inspire creativity, empower women, set new standards and make originality timeless.",
      },
    ],
    signature: "PaperDreamz by Ruchi Mishra",
    tagline: "Where ideas become art, and details become distinction.",
  },

  "home.why-choose-us": {
    eyebrow: "Inspired by Imagination",
    heading: "Why Choose",
    accent: "PaperDreamz",
    intro:
      "In a world where designs can be copied, true creativity cannot be replicated so easily. We do not simply follow trends — we create ideas that inspire them.",
    quote: "Not just crafted. Thoughtfully created. Unmistakably personal.",
    cta_label: "Let’s Create Together",
    cta_link: "#contact",
    reasons: [
      {
        title: "Originality Is Our Signature",
        body: "Every design begins with an idea, not a template. Let others notice the trend — let our clients own the original experience.",
      },
      {
        title: "Exclusivity Beyond the Ordinary",
        body: "We make every project feel imagined specifically for the recipient, down to the smallest detail.",
      },
      {
        title: "Trendsetters by Instinct",
        body: "Creativity is imagining what people will appreciate tomorrow — fresh concepts, unconventional designs.",
      },
      {
        title: "Your Vision, Our Interpretation",
        body: "A photograph, a theme, or simply an emotion — we translate your thoughts into a considered creation.",
      },
      {
        title: "The Difference Is in the Details",
        body: "Precision cuts, compositional balance and flawless finishing define the lasting impression.",
      },
      {
        title: "Customisation Without Compromise",
        body: "From names and themes to dimensions and materials, every creation stays personal to you.",
      },
      {
        title: "Nearly 17 Years of Evolution",
        body: "From a single punching machine to intricate quilling, frames, scrapbooks and glass-house boxes.",
      },
      {
        title: "Partner for Designers & Crafters",
        body: "We celebrate independent designers and gifting professionals, and welcome fresh collaborations.",
      },
    ],
    closing_quote:
      "At PaperDreamz, we do not promise that every creation will be the most extravagant or expensive. We aim for something more meaningful: a creation that feels right for you.",
    differentiators: ["Distinct Identity", "Thoughtful Luxury", "Personalised Purpose", "Quality & Trust"],
    closing_cta_label: "Have an Idea? Let’s Create It Together",
    closing_cta_link: "#contact",
  },

  "home.new-arrivals": {
    new_arrivals_label: "New Arrivals",
    new_arrivals_description: "Fresh from our atelier — the latest shagun suites and keepsakes",
    hot_deals_label: "Hot Deals",
    hot_deals_description: "Limited-time offers on our most-loved designs",
    best_sellers_label: "Best Sellers",
    best_sellers_description: "The artisanal favorites couples keep coming back to",
    empty_message: "New pieces are on the way — check back soon.",
  },

  "home.faq": {
    heading: "Before You Begin",
    quote: "Everything you’d want to know, answered with complete transparency.",
    image: "/images/diary_vanshika.webp",
    image_alt: "Bespoke keepsake diary",
    image_eyebrow: "100% Artisanal Heritage",
    image_caption: "Crafting Timeless Shagun Memories",
  },
};
