import { Quote } from "lucide-react";
import Reveal from "./Reveal";

type Testimonial = {
  name: string;
  city: string;
  quote: string[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Shradha Inani",
    city: "Hyderabad",
    quote: [
      "Absolutely loved the customised envelopes made for my baby’s cradle ceremony! The attention to detail was incredible, and every single piece was absolutely perfect. The cuts were precise, the finishing was flawless, and not even one envelope was faulty.",
      "Everyone who received them appreciated the beautiful work and kept asking where I got them from! Highly recommend her for anyone looking for beautifully customised envelopes for special occasions.",
    ],
  },
  {
    name: "Rajani Todi",
    city: "Kolkata",
    quote: [
      "We liked the envelope a lot when we first saw that reel — it was something different and really beautiful. Placing such a bulk order online felt scary at first, but we trusted her after she cleared all our doubts.",
      "When our courier finally arrived, the envelopes looked even more beautiful than they seemed on screen, exactly as we had hoped. Everyone appreciated them and asked where to buy them for themselves.",
    ],
  },
  {
    name: "Anu",
    city: "Pune",
    quote: [
      "I have had two very special creations made by Ruchi. The first was a handmade baby album for my grandson — so pretty, unique and beautifully detailed that everyone kept asking, “Who made this?”",
      "I then got a special message card made for my mom’s 85th birthday, and it became one of the most meaningful gifts for her. Ruchi has a wonderful ability to turn memories and emotions into something tangible and beautiful. Her work is not just handmade; it is made from the heart.",
    ],
  },
  {
    name: "Anju Sahni",
    city: "Mumbai",
    quote: [
      "Thank you so much for sending the parcel so promptly. I truly appreciate how efficiently and carefully you managed everything. The product is absolutely lovely, and I’m very happy with the quality — thank you for making the whole experience so smooth.",
    ],
  },
  {
    name: "Uma Goel",
    city: "New Delhi",
    quote: [
      "I’ve known Ruchi for about 15 years. Her consistency and professionalism impressed me the most. She instantly understands what I want, how I want it and, most importantly, when I want it.",
      "She has never disappointed me, be it with her neat work or delivering on time — always just the thing I had imagined.",
    ],
  },
  {
    name: "Renu",
    city: "Delhi",
    quote: [
      "I absolutely loved the envelopes! They are beautifully designed, elegant, and look even more lovely in person. The quality and detailing are amazing, and I would definitely recommend them to others.",
    ],
  },
  {
    name: "Sheenam",
    city: "Amritsar",
    quote: ["I was actually quite sure about ordering with you, because when little details are done with perfection, it can be seen in the whole."],
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="relative bg-bottle-green py-16 sm:py-20 text-ivory overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Kind Words</p>
          <h2 id="testimonials-heading" className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-ivory">
            Loved by families across India
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ivory-dim">
            From shagun envelopes for weddings and cradle ceremonies to baby albums, birthday cards and bulk festive gifting,
            every Paper Dreamz piece is cut, assembled and finished by hand. Here is what our customers say about the
            envelopes, keepsakes and personalised gifts they have ordered from us.
          </p>
        </Reveal>

        <div className="mt-12 columns-1 md:columns-2 lg:columns-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08} className="mb-6 break-inside-avoid">
              <figure className="rounded-2xl border border-gold/25 bg-black/20 p-7 shadow-lg">
                <Quote size={22} className="text-gold" aria-hidden />
                <blockquote className="mt-4 space-y-3 text-sm leading-relaxed text-ivory/90">
                  {t.quote.map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </blockquote>
                <figcaption className="mt-6 border-t border-gold/20 pt-4">
                  <span className="block font-display text-base text-gold-light">{t.name}</span>
                  <span className="block text-[10.5px] uppercase tracking-[0.2em] text-ivory-dim">{t.city}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
