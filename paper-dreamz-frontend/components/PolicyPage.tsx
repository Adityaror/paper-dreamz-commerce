"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import PageHero from "./PageHero";
import Footer from "./Footer";
import Reveal from "./Reveal";
import { ThemeProvider } from "@/context/ThemeContext";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { POLICIES, type Policy, type PolicySlug } from "@/lib/policies";

type ApiPolicy = {
  slug: string;
  title: string;
  intro: string | null;
  hero_image: string | null;
  sections: { heading: string; body: string[] }[];
};

const isPolicySlug = (slug: string): slug is PolicySlug => slug in POLICIES;

/** Admin → Pages → Policy Pages; the built-in copy in lib/policies.ts is shown until it loads and whenever it can't be reached. */
function usePolicies(): Partial<Record<PolicySlug, Policy>> {
  const [policies, setPolicies] = useState<Partial<Record<PolicySlug, Policy>>>(POLICIES);

  useEffect(() => {
    let cancelled = false;
    apiGet<ApiPolicy[]>("/policy-pages").then((data) => {
      if (cancelled || !data || data.length === 0) return;
      const live: Partial<Record<PolicySlug, Policy>> = {};
      // Only the four policy routes exist on the site, so other slugs are ignored.
      for (const p of data.filter((p) => isPolicySlug(p.slug))) {
        const fallback = POLICIES[p.slug as PolicySlug];
        live[p.slug as PolicySlug] = {
          title: p.title || fallback.title,
          intro: p.intro ?? "",
          image: resolveAssetUrl(p.hero_image) ?? fallback.image,
          sections: p.sections.length > 0 ? p.sections : fallback.sections,
        };
      }
      setPolicies(live);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return policies;
}

/** Shared layout for the Customer Care policy pages. */
export default function PolicyPage({ slug }: { slug: PolicySlug }) {
  const policies = usePolicies();
  const policy = policies[slug] ?? POLICIES[slug];

  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 bg-cream">
        <PageHero eyebrow="Customer Care" title={policy.title} intro={policy.intro} image={policy.image} imageAlt={policy.title} />

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <nav aria-label="Policies" className="lg:sticky lg:top-40">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">Policies</p>
                <ul className="mt-4 space-y-2 border-l border-gold/25">
                  {(Object.keys(policies) as PolicySlug[]).map((s) => (
                    <li key={s}>
                      <Link
                        href={`/${s}`}
                        aria-current={s === slug ? "page" : undefined}
                        className={`-ml-px block border-l-2 pl-4 py-1 text-sm transition-colors ${
                          s === slug ? "border-gold text-ink font-semibold" : "border-transparent text-taupe hover:text-ink"
                        }`}
                      >
                        {policies[s]?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="lg:col-span-9 max-w-3xl space-y-10">
              {policy.sections.map((section, i) => (
                <Reveal key={section.heading} delay={Math.min(i, 3) * 0.05}>
                  <h2 className="font-display text-2xl sm:text-3xl text-ink">{section.heading}</h2>
                  <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-taupe">
                    {section.body.map((p) => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              ))}
              <p className="border-t border-gold/20 pt-6 text-sm text-taupe">
                Questions about this policy? <Link href="/contact" className="text-gold-deep underline underline-offset-4">Contact us</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
