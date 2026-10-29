"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";
import { useTheme } from "@/context/ThemeContext";
import { apiGet, resolveAssetUrl } from "@/lib/api";

type ProcessApiStep = {
  id: number;
  step_number: number;
  title: string;
  tag: string | null;
  description: string | null;
  image: string | null;
  highlights: string[];
  sort_order: number;
};

type ProcessApiSection = {
  heading: string | null;
  subtext: string | null;
};

type ProcessApiResponse = {
  section: ProcessApiSection;
  steps: ProcessApiStep[];
};

const FALLBACK_SECTION = {
  heading: "Craftsmanship in Motion",
  subtext: "From initial sketch to heirloom finish—explore the 5-step masterclass behind every Paper Dreamz creation.",
};

const FALLBACK_STEPS = [
  {
    n: "01",
    title: "Sketch & Monogram",
    tag: "Custom Crest Conception",
    desc: "Every bespoke suite begins with hand-drawn calligraphy and monogram drafting, tailored to your family's heritage and celebration.",
    highlights: ["Bespoke Monogram Crest", "Fine Calligraphy Drafting", "Texture & Tone Matching"],
    img: "/images/craft_design_sketch.webp",
  },
  {
    n: "02",
    title: "3D Petal Layering",
    tag: "Precision Tweezers Sculpting",
    desc: "Individual floral petals are sculpted, micro-embossed for delicate vein texture, and layered in relief to create a blooming 3D sculpture.",
    highlights: ["Dimensional 3D Florals", "Micro-Embossed Textures", "Hand-Formed Curves"],
    img: "/images/craft_design_petals.webp",
  },
  {
    n: "03",
    title: "Pearl Brooch Setting",
    tag: "Hand-Set Cameo & Crystals",
    desc: "Lustrous freshwater pearl beads, crystals, and vintage cameos are hand-stitched onto velvet and shimmer paper with jeweler's precision.",
    highlights: ["Lustrous Pearl Accents", "Hand-Set Brooches", "Heirloom Durability"],
    img: "/images/craft_design_pearls.webp",
  },
  {
    n: "04",
    title: "Mandala Foil Filigree",
    tag: "Laser Lace & Die Stamping",
    desc: "Intricate laser-cut lace borders paired with hot foil stamping in matte gold, champagne, and rose copper metallic finishes.",
    highlights: ["Hot Foil Die Stamping", "Intricate Laser Filigree", "Rich Metallic Shimmer"],
    img: "/images/craft_design_lotus.webp",
  },
  {
    n: "05",
    title: "Finished Keepsake",
    tag: "Heirloom Masterpiece Suite",
    desc: "Meticulous white-glove inspection, French ribbon binding, custom seal wax stamping, and signature luxury gift presentation.",
    highlights: ["Archival Packaging", "Wax Seal Monogram", "Turnkey Royal Delivery"],
    img: "/images/craft_design_finished.webp",
  },
];

function toStepNumberLabel(n: number): string {
  return String(n).padStart(2, "0");
}

export default function ProcessSteps() {
  const [section, setSection] = useState(FALLBACK_SECTION);
  const [steps, setSteps] = useState(FALLBACK_STEPS);
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { getSectionThemeStyle } = useTheme();
  const theme = getSectionThemeStyle("process");

  useEffect(() => {
    let cancelled = false;

    apiGet<ProcessApiResponse>("/process-steps").then((data) => {
      if (cancelled || !data) return;

      if (data.section) {
        setSection({
          heading: data.section.heading ?? FALLBACK_SECTION.heading,
          subtext: data.section.subtext ?? FALLBACK_SECTION.subtext,
        });
      }

      if (data.steps && data.steps.length > 0) {
        setSteps(
          data.steps.map((step) => ({
            n: toStepNumberLabel(step.step_number),
            title: step.title,
            tag: step.tag ?? "",
            desc: step.description ?? "",
            highlights: step.highlights ?? [],
            img: resolveAssetUrl(step.image) ?? "",
          })),
        );
        setActiveStep(0);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance step every 6 seconds if not hovered/paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeStep, steps.length]);

  const current = steps[activeStep];

  return (
    <section
      id="process"
      style={{ backgroundColor: theme.customHex || undefined }}
      className={`relative py-14 sm:py-20 overflow-hidden transition-colors duration-500 ${theme.bgClass}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        
        {/* Section Header */}
        <Reveal className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold-deep text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles size={12} className="text-gold" />
            <span>The Sequence of Making</span>
          </div>
          <h2 className={`font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight ${theme.textClass}`}>
            {section.heading}
          </h2>
          <p className={`mt-3 text-xs sm:text-sm max-w-md mx-auto ${theme.subtextClass}`}>
            {section.subtext}
          </p>
        </Reveal>

        {/* Interactive Step Navigator Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.n}
                onClick={() => {
                  setActiveStep(idx);
                  setIsAutoPlaying(false);
                }}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? "bg-bottle-green text-gold-light border-gold shadow-md scale-[1.03]"
                    : "bg-white/60 text-ink/80 border-gold/20 hover:border-gold hover:text-ink hover:bg-white"
                }`}
              >
                <span className={`font-mono text-[11px] font-bold ${isActive ? "text-gold" : "text-taupe"}`}>
                  {step.n}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Interactive Spotlight Card with Left & Right Navigation Arrows */}
        <div className="relative group/card">
          
          {/* Left Navigation Arrow (< Prev) */}
          <button
            onClick={() => {
              setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
              setIsAutoPlaying(false);
            }}
            aria-label="Previous step"
            className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cream/95 hover:bg-bottle-green text-ink hover:text-gold-light border border-gold/40 shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>

          {/* Right Navigation Arrow (> Next) */}
          <button
            onClick={() => {
              setActiveStep((prev) => (prev + 1) % steps.length);
              setIsAutoPlaying(false);
            }}
            aria-label="Next step"
            className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cream/95 hover:bg-bottle-green text-ink hover:text-gold-light border border-gold/40 shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>

          <div className={`border rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl backdrop-blur-md relative overflow-hidden transition-colors duration-500 ${theme.cardBgClass}`}>
            
            {/* Subtle Accent Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full filter blur-[90px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Step Details */}
              <div className="lg:col-span-6 space-y-5">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-4xl sm:text-5xl text-gold-gradient font-bold">
                      {current.n}
                    </span>
                    <div className="h-8 w-px bg-gold/30" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-deep block font-bold">
                        {current.tag}
                      </span>
                      <span className={`text-xs ${theme.subtextClass}`}>
                        Phase {current.n} of {toStepNumberLabel(steps.length)}
                      </span>
                    </div>
                  </div>

                  {/* Step Indicators Counter */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveStep(i);
                          setIsAutoPlaying(false);
                        }}
                        aria-label={`Go to step ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeStep === i ? "w-6 bg-gold" : "w-1.5 bg-gold/25 hover:bg-gold/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight ${theme.textClass}`}>
                    {current.title}
                  </h3>
                  <p className={`mt-3 text-sm leading-relaxed font-light ${theme.subtextClass}`}>
                    {current.desc}
                  </p>
                </div>

                {/* Highlight Badges */}
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gold-deep">
                    Key Craft Highlights:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {current.highlights.map((h, hi) => (
                      <span
                        key={hi}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 border border-gold/25 text-[11px] text-ink font-medium shadow-xs"
                      >
                        <CheckCircle2 size={12} className="text-gold-deep shrink-0" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Commission Link CTA */}
                <div className="pt-3 flex items-center justify-between">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-light hover:bg-emerald-2 transition-colors shadow-sm border border-gold/30"
                  >
                    <span>Commission Custom Piece</span>
                    <ChevronRight size={14} />
                  </a>

                  <span className={`text-[11px] font-mono hidden sm:inline ${theme.subtextClass}`}>
                    Use arrows &lt; &gt; to navigate
                  </span>
                </div>

              </div>

              {/* Right Column: Step Image Showcase with Smooth Cross-fade */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-gold/30 shadow-2xl bg-black/5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.n}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={current.img}
                        alt={current.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Floating Badge */}
                  <div className="absolute bottom-4 left-4 z-10 rounded-full bg-bottle-green/90 backdrop-blur-md border border-gold/30 px-3.5 py-1 text-[10.5px] font-mono text-gold-light shadow-md">
                    Step {current.n} • {current.title}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

