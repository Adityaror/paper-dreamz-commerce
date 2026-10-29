/**
 * About page copy and photos, keyed by the backend `page_sections` key it is
 * edited under (Admin → Pages → About Page). Shown as-is until the API
 * responds, and whenever it is unreachable.
 *
 * `**text**` inside a paragraph renders bold. Plain data with no imports, so
 * `scripts/export-content.ts` can turn it into the backend seed data.
 */

export const ABOUT_CONTENT = {
  "about.hero": {
    eyebrow: "Our Story · Paper Dreamz by Ruchi Mishra",
    heading: "Every beautiful thing begins with a dream.",
    accent: "Ours began with paper.",
    intro:
      "From a small beginning in Delhi to a world of handcrafted elegance — a story shaped by imagination, patience, and thousands of little details that mean everything.",
    primary_cta_label: "Read the Journey",
    secondary_cta_label: "Explore Collections",
    image: "/images/brand_story_craft.webp",
    image_alt: "Ruchi Mishra's handcrafted paper creations",
    inset_image: "/images/hero_emerald_envelope.webp",
    inset_image_alt: "Emerald velvet envelope",
  },

  "about.crafts": {
    items: [
      "Luxury Envelopes",
      "Shagun Lifafas",
      "Wedding & Roka Envelopes",
      "Floating Pearl Envelopes",
      "Gold & Silver Coin Boxes",
      "Cash Boxes",
      "Gift Tags",
      "Custom Orders",
    ],
  },

  "about.story": {
    eyebrow: "About Us",
    heading: "Not just paper.",
    accent: "A piece of someone’s story.",
    quote:
      "Some businesses begin with capital. Some begin with opportunity. And some begin with a dream that refuses to remain small.",
    paragraphs: [
      "PaperDreamZ began nearly 17 years ago in Delhi, when **Ruchi Mishra** decided to turn her love for creativity into something meaningful. With a small fund to invest in a punching machine, she took her first step into a world that would gradually expand through tools, techniques, textures, colours, and countless ideas waiting to take shape.",
      "There was no grand beginning. No extraordinary setup. Just a creative mind, the courage to begin with what was available, and the determination to make something beautiful out of something as simple as paper.",
    ],
    closing_text: "That small beginning became a journey, and that journey became",
    closing_highlight: "PaperDreamZ",
  },

  "about.stats": {
    items: [
      { value: "2010", label: "Founded in Delhi" },
      { value: "1", label: "Punching machine to begin" },
      { value: "1000s", label: "Envelopes crafted for clients" },
      { value: "5+", label: "International regions served" },
    ],
  },

  "about.journey": {
    eyebrow: "The Journey",
    heading: "From one machine to a",
    accent: "thousand possibilities.",
    intro:
      "Our story was never about standing still. It was about discovering what more could be created, what more could be learned, and how far imagination could travel.",
    steps: [
      {
        title: "The First Impression",
        body: "It started with a small investment in a punching machine — the first expressions of a creative vision.",
        image: "/images/craft_design_sketch.webp",
      },
      {
        title: "Precision & Quilling",
        body: "Cutting techniques and quilling opened new possibilities, transforming simple sheets into intricate handmade art.",
        image: "/images/craft_design_petals.webp",
      },
      {
        title: "The Beauty of Framing",
        body: "Preserving creations with lasting presence, so that presentation makes people feel truly special.",
        image: "/images/collection_frames.webp",
      },
      {
        title: "Tangible Memories",
        body: "Scrapbooks gave photographs, milestones and celebrations a permanent home beyond the moment.",
        image: "/images/collection_keepsakes.webp",
      },
      {
        title: "Cards, Invitations & Envelopes",
        body: "Greeting cards, invitations, envelopes and Shagun Lifafas became the signature of our journey. Every customised request challenged us to think differently — growing through continuous evolution without abandoning our roots.",
        image: "/images/collection_envelopes.webp",
      },
    ],
  },

  "about.envelopes": {
    watermark: "Envelopes",
    image: "/images/collection_luxury_envelopes.webp",
    image_alt: "Luxury handcrafted envelopes",
    badge_value: "Thousands",
    badge_label: "of envelopes for client orders",
    eyebrow: "Our Signature",
    heading: "Thousands of envelopes.",
    accent: "Countless emotions.",
    paragraphs: [
      "An envelope carries a wedding invitation, a blessing, a heartfelt message, or a gift presented with love. Held for moments before being opened, its impression remains long after.",
      "Over the years, PaperDreamZ has created thousands of envelopes for client orders, each reflecting thoughtful design, presentation, and personalisation — from elegant Shagun Lifafas to invitation envelopes.",
    ],
    quote: "We see an envelope not as the end of a design process, but as the beginning of an experience.",
  },

  "about.promise": {
    eyebrow: "The PaperDreamZ Promise",
    heading: "Creativity is an ongoing",
    accent: "conversation.",
    intro:
      "Between what a client imagines and what we thoughtfully bring to life. Our approach evolves through client feedback and experimentation.",
    steps: [
      { step: "Listen", body: "Every piece begins with what you imagine." },
      { step: "Explore", body: "Textures, colours and techniques, tried and tested." },
      { step: "Refine", body: "Your feedback shapes every detail and finish." },
      { step: "Create", body: "A beautiful new answer for what you need today." },
    ],
    values_label: "We value",
    values: ["Texture", "Colour precision", "Refined finishes", "Personal touches"],
  },

  "about.world": {
    eyebrow: "From Delhi to the World",
    heading: "A handcrafted detail",
    accent: "speaks across cultures.",
    intro:
      "What began in Delhi gradually reached clients across India and international markets — Africa, the USA, Europe, Australia and Pacific nations. Different places bring diverse traditions and celebrations, yet the appreciation for thoughtfully designed craftsmanship remains universal.",
    highlights: [
      { value: "Delhi", label: "Where it all began" },
      { value: "5", label: "Continents reached" },
      { value: "1 envelope", label: "Speaks across every culture" },
    ],
    closing_quote: "A personalised envelope complements any meaningful celebration — wherever in the world it is opened.",
  },

  "about.happiness": {
    eyebrow: "The Greatest Reward",
    heading: "Client",
    accent: "happiness.",
    paragraphs: [
      "There is something deeply special about receiving messages from clients who love what we have created. Testimonials and photographs from celebrations are reminders that creativity has a human purpose.",
      "We cherish repeat orders and build lasting relationships, knowing that our clients do more than inspire our work — they help shape the future of PaperDreamZ.",
    ],
    link_label: "Read client stories",
  },

  "about.next-chapter": {
    image: "/images/craft_design_lotus.webp",
    image_alt: "Handcrafted lotus envelope detail",
    eyebrow: "The Next Chapter",
    heading: "A destination for",
    accent: "luxurious envelopes.",
    body: "Our next chapter elevates the art of envelopes — building PaperDreamZ into a distinctive luxury destination for refined styles, personalisation, and creations suited to life’s most meaningful occasions.",
    quote:
      "We began with a small machine and a big dream. We continue with experience in our hands, gratitude in our hearts, and countless new ideas waiting to become reality.",
    quote_name: "Ruchi Mishra",
    quote_role: "Founder & Designer",
  },

  "about.personal-note": {
    eyebrow: "A Personal Note",
    text: "PaperDreamZ carries years of effort, learning, and the happiness of making something meaningful.",
    accent: "Thank you for being part of this story.",
    signature: "PaperDreamZ by Ruchi Mishra",
    tagline: "Where Paper Finds Its Purpose, Details Find Their Beauty, and Every Occasion Finds Its Expression.",
    primary_cta_label: "Shop the Collection",
    secondary_cta_label: "Start a Custom Order",
  },
};
