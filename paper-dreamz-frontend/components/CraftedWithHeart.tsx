"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { useTheme } from "@/context/ThemeContext";
import { apiGet, resolveAssetUrl } from "@/lib/api";

type StorySection = {
  eyebrow: string | null;
  heading: string | null;
  accent_word: string | null;
  body: string | null;
  image: string | null;
  cta_label: string | null;
  cta_link: string | null;
};

const FALLBACK_STORY = {
  eyebrow: "The Story Behind Every Creation",
  heading: "Handcrafted",
  accentWord: "passion,",
  body: "Paper Dreamz by Ruchi Mishra is a luxury handmade brand specializing in exquisite envelopes, keepsakes and gifts crafted with passion, precision and love.",
  image: "/images/brand_story_craft.webp",
  ctaLabel: "Know Our Story",
  ctaLink: "/about",
};

export default function CraftedWithHeart() {
  const { getSectionThemeStyle } = useTheme();
  const theme = getSectionThemeStyle("story");
  const [story, setStory] = useState(FALLBACK_STORY);

  useEffect(() => {
    let cancelled = false;

    apiGet<StorySection>("/story-section").then((data) => {
      if (cancelled || !data) return;

      setStory({
        eyebrow: data.eyebrow ?? FALLBACK_STORY.eyebrow,
        heading: data.heading ?? FALLBACK_STORY.heading,
        accentWord: data.accent_word ?? FALLBACK_STORY.accentWord,
        body: data.body ?? FALLBACK_STORY.body,
        image: resolveAssetUrl(data.image) ?? FALLBACK_STORY.image,
        ctaLabel: data.cta_label ?? FALLBACK_STORY.ctaLabel,
        ctaLink: data.cta_link ?? FALLBACK_STORY.ctaLink,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="story"
      style={{ backgroundColor: theme.customHex || undefined }}
      className={`relative transition-colors duration-500 ${theme.bgClass}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 items-center">
        <Reveal className="relative aspect-[4/3] lg:aspect-auto lg:h-[560px] w-full overflow-hidden order-2 lg:order-1">
          <Image
            src={story.image}
            alt="Handcrafted with passion"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2 px-8 sm:px-14 lg:px-20 py-16 lg:py-0">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${theme.subtextClass}`}>
            {story.eyebrow}
          </p>
          <h2 className={`mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] ${theme.textClass}`}>
            {story.heading}
            <br />
            with <span className="font-script text-gold text-6xl sm:text-7xl">{story.accentWord}</span>
            <br />
            made for you.
          </h2>
          <p className={`mt-8 max-w-md text-[15px] leading-relaxed ${theme.subtextClass}`}>{story.body}</p>
          <a
            href={story.ctaLink}
            className="mt-9 inline-flex items-center rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors shadow-sm"
          >
            {story.ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
