/**
 * Customer Care policy copy. DRAFT for client review: drafted from the facts
 * already approved in the FAQs (processing times, 100% advance payment,
 * no returns on customised pieces, delivery across India, free shipping
 * above the threshold shown in the announcement bar). Anything beyond those facts needs the client's sign-off.
 */

export type PolicySlug = "shipping-delivery" | "returns-refunds" | "terms-conditions" | "privacy-policy";

export type Policy = {
  title: string;
  intro: string;
  /** Page header photo. */
  image: string;
  sections: { heading: string; body: string[] }[];
};

export const POLICIES: Record<PolicySlug, Policy> = {
  "shipping-delivery": {
    title: "Shipping & Delivery",
    intro: "Every order is handmade, packed by hand and shipped to every corner of India.",
    image: "/images/craft_occasion_bulk.webp",
    sections: [
      {
        heading: "Processing time",
        body: [
          "Standard orders are processed within 7 working days of payment.",
          "Bulk orders typically take around 3 weeks for processing and dispatch.",
          "Timelines may vary slightly with design complexity and quantity — we will confirm the expected dispatch date when your order is confirmed.",
        ],
      },
      {
        heading: "Delivery",
        body: [
          "We deliver across India, from metros to the smallest towns. Once your order is dispatched we share the courier tracking details with you on WhatsApp.",
          "Delivery time after dispatch depends on your location and the courier partner.",
        ],
      },
      {
        heading: "Shipping charges",
        body: [
          "Shipping is complimentary on orders above the amount shown in the announcement bar at the top of our website. For smaller orders, shipping charges are shared with you before you confirm.",
        ],
      },
      {
        heading: "Urgent orders",
        body: [
          "Need it sooner? Message us on WhatsApp before ordering and we will tell you honestly whether your date is possible.",
        ],
      },
    ],
  },
  "returns-refunds": {
    title: "Returns & Refunds",
    intro: "Because every piece is handmade and customised for you, please read this before confirming your order.",
    image: "/images/craft_design_pearls.webp",
    sections: [
      {
        heading: "Returns and exchanges",
        body: [
          "As every piece is handmade and customised specifically for you, we are unable to accept returns or exchanges.",
          "We recommend reviewing your customisation details — names, dates, spellings, colours and quantities — carefully before confirming your order.",
        ],
      },
      {
        heading: "Damaged in transit",
        body: [
          "We pack every order with care. If your parcel arrives damaged, please contact us on WhatsApp as soon as you receive it, with photos of the parcel and the product, so we can help.",
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "Production begins as soon as your payment is received, so orders cannot be cancelled once work has started.",
        ],
      },
    ],
  },
  "terms-conditions": {
    title: "Terms & Conditions",
    intro: "The terms that apply when you order from Paper Dreamz by Ruchi Mishra.",
    image: "/images/craft_design_finished.webp",
    sections: [
      {
        heading: "Orders and payment",
        body: [
          "We require 100% advance payment to confirm an order; production begins as soon as payment is received.",
          "Prices for bulk and customised orders are quoted individually, based on design and quantity.",
        ],
      },
      {
        heading: "Handmade products",
        body: [
          "Every piece is cut, assembled and finished by hand, so small variations in colour, texture and placement are part of its character and are not defects.",
          "Colours may look slightly different on screen than in person.",
        ],
      },
      {
        heading: "Customisation",
        body: [
          "You are responsible for checking names, dates, spellings and other customisation details before confirming. Pieces are made exactly as approved.",
        ],
      },
      {
        heading: "Designs and images",
        body: [
          "All designs, photographs and content on this website belong to Paper Dreamz by Ruchi Mishra and may not be copied or reused without permission.",
        ],
      },
      {
        heading: "Shipping and returns",
        body: ["Delivery, returns and cancellations are covered by our Shipping & Delivery and Returns & Refunds policies."],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    intro: "How we handle the details you share with us.",
    image: "/images/craft_design_petals.webp",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you enquire or order, we collect the details you share with us — such as your name, phone number, email, delivery address and customisation details.",
          "If you subscribe to our newsletter, we store your email address.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your details only to respond to your enquiry, make and deliver your order, and — if you subscribed — send you occasional updates.",
          "We share your delivery details with our courier partner only so that your order can reach you. We never sell your information.",
        ],
      },
      {
        heading: "Payments",
        body: ["We do not store your card or bank details on this website."],
      },
      {
        heading: "Your choices",
        body: [
          "You can ask us to update or delete your details, or unsubscribe from our newsletter, at any time by contacting us.",
        ],
      },
    ],
  },
};
