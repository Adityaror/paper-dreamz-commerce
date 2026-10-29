"use client";

import { useState } from "react";
import { Mail, Gift, Bell } from "lucide-react";
import Reveal from "./Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="bulk" className="relative bg-noir py-8">
      <Reveal className="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
        <div className="flex items-center gap-3 shrink-0">
          <Mail size={22} className="text-gold" strokeWidth={1.4} />
          <div className="text-left">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ivory">Join Our World</p>
            <p className="text-[12px] text-ivory-dim">Subscribe for exclusive offers, new launches &amp; more.</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex w-full max-w-md flex-1 gap-0"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full border border-gold/25 bg-transparent py-3 px-4 text-sm text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            className="btn-elite shrink-0 border border-gold/50 bg-emerald-2 px-6 text-[12px] font-semibold uppercase tracking-[0.15em] text-gold-light hover:bg-emerald hover:border-gold transition-colors"
          >
            Subscribe
          </button>
        </form>
        {submitted && <p className="text-xs text-gold">Thank you!</p>}

        <div className="hidden lg:flex items-center gap-8 text-ivory-dim text-[12px] shrink-0">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-gold" strokeWidth={1.4} />
            <span>
              Exclusive Offers
              <br />
              <span className="text-[11px] text-ivory-dim/70">For our subscribers</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-gold" strokeWidth={1.4} />
            <span>
              New Launches
              <br />
              <span className="text-[11px] text-ivory-dim/70">Be the first to know</span>
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
