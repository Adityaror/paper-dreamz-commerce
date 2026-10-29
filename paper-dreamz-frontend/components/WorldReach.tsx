"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Globe2, MapPin, Mail } from "lucide-react";
import Reveal from "./Reveal";
import { ABOUT_CONTENT } from "@/lib/content/about";
import { usePageContent } from "@/lib/usePageContent";

// Equirectangular projection onto a 1000×500 canvas; the visible window is cropped to y 20–420.
const project = ([lon, lat]: [number, number]) => [((lon + 180) / 360) * 1000, ((90 - lat) / 180) * 500];
const VIEW = { top: 20, height: 400 };

// Simplified continent outlines (lon, lat) — only used as a mask for the dotted map.
const LAND: [number, number][][] = [
  // North America
  [[-168, 66], [-162, 70], [-140, 70], [-125, 72], [-95, 75], [-80, 73], [-62, 66], [-55, 52], [-66, 45], [-75, 38], [-81, 31], [-80, 25], [-84, 30], [-90, 29], [-97, 26], [-97, 21], [-87, 21], [-83, 10], [-78, 8], [-80, 8], [-92, 15], [-105, 20], [-112, 28], [-117, 32], [-124, 40], [-125, 48], [-135, 58], [-150, 60], [-165, 60]],
  // Greenland
  [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-60, 82], [-72, 77], [-55, 68]],
  // South America
  [[-78, 8], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -27], [-58, -38], [-65, -42], [-68, -55], [-75, -50], [-72, -35], [-71, -18], [-81, -5], [-80, 2]],
  // Europe
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [5, 58], [10, 63], [20, 70], [30, 71], [40, 68], [45, 60], [40, 45], [30, 45], [28, 41], [22, 37], [15, 40], [12, 44], [8, 44], [3, 42]],
  // British Isles
  [[-6, 50], [2, 51], [0, 56], [-3, 59], [-7, 57]],
  // Africa
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 12], [40, -2], [40, -15], [35, -25], [28, -34], [18, -34], [12, -18], [9, -2], [9, 4], [-8, 4], [-17, 14]],
  // Madagascar
  [[44, -25], [47, -25], [50, -15], [48, -13]],
  // Asia
  [[28, 41], [36, 36], [35, 32], [43, 12], [52, 16], [58, 22], [66, 25], [72, 20], [77, 8], [80, 15], [88, 22], [94, 16], [98, 8], [104, 1], [106, 10], [109, 12], [108, 21], [118, 24], [122, 31], [121, 40], [128, 35], [130, 42], [140, 46], [142, 53], [135, 55], [160, 60], [170, 65], [180, 68], [180, 72], [140, 73], [110, 77], [80, 73], [68, 69], [60, 69], [45, 60], [40, 45]],
  // Japan
  [[130, 31], [141, 35], [142, 45], [140, 41], [133, 34]],
  // Maritime Southeast Asia
  [[95, 5], [105, -6], [115, -8], [120, -9], [125, -8], [130, -3], [140, -3], [150, -8], [142, -9], [120, 0], [110, -2], [100, 2]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -27], [150, -37], [141, -38], [131, -31], [116, -35], [114, -27]],
  // New Zealand
  [[172, -35], [178, -38], [174, -41], [167, -46], [170, -45]],
];

type Side = "top" | "bottom" | "left" | "topEnd";
type Place = { name: string; lonLat: [number, number]; side: Side };

const ORIGIN: Place = { name: "Delhi, India", lonLat: [77.2, 28.6], side: "bottom" };
const REGIONS: Place[] = [
  { name: "USA", lonLat: [-98, 39], side: "bottom" },
  { name: "Europe", lonLat: [10, 50], side: "top" },
  { name: "Africa", lonLat: [22, 2], side: "bottom" },
  { name: "Australia", lonLat: [134, -25], side: "bottom" },
  { name: "Pacific Nations", lonLat: [168, -17], side: "topEnd" },
];

/** Icons for the highlight cards, in order; the text comes from Admin → Pages → About Page. */
const HIGHLIGHT_ICONS = [MapPin, Globe2, Mail];

const [OX, OY] = project(ORIGIN.lonLat);

function arcPath(to: Place) {
  const [tx, ty] = project(to.lonLat);
  const lift = Math.abs(OX - tx) * 0.35 + 30;
  return `M ${OX} ${OY} Q ${(OX + tx) / 2} ${Math.min(OY, ty) - lift} ${tx} ${ty}`;
}

const pct = (lonLat: [number, number]) => {
  const [x, y] = project(lonLat);
  return { left: `${x / 10}%`, top: `${((y - VIEW.top) / VIEW.height) * 100}%` };
};

const PILL_OFFSET: Record<Side, string> = {
  top: "-translate-x-1/2 -translate-y-[calc(100%+14px)]",
  bottom: "-translate-x-1/2 translate-y-[14px]",
  left: "-translate-x-[calc(100%+14px)] -translate-y-1/2",
  topEnd: "-translate-x-[calc(100%-14px)] -translate-y-[calc(100%+14px)]",
};

function Pill({ place, origin = false, delay }: { place: Place; origin?: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={pct(place.lonLat)}
      className="absolute"
    >
      <span
        className={`absolute whitespace-nowrap ${PILL_OFFSET[place.side]} flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.2em] shadow-[0_8px_24px_rgba(44,36,32,0.10)] ${
          origin ? "border-gold bg-gold text-noir" : "border-gold/40 bg-white text-ink"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${origin ? "bg-noir" : "bg-gold"}`} />
        {place.name}
      </span>
    </motion.div>
  );
}

export default function WorldReach() {
  const reduceMotion = useReducedMotion();
  const content = usePageContent("about.world", ABOUT_CONTENT["about.world"]);

  return (
    <section id="world" className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-cream-2/70 via-cream to-cream">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-blush/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-[380px] w-[380px] rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-deep">
            <span className="h-px w-8 bg-current opacity-60" />
            {content.eyebrow}
            <span className="h-px w-8 bg-current opacity-60" />
          </p>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
            {content.heading} <span className="font-script italic text-gold-deep">{content.accent}</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-taupe">
            {content.intro}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-14 rounded-[2rem] border border-gold/30 bg-white/75 p-3 sm:p-6 shadow-[0_30px_80px_rgba(156,122,63,0.15)] backdrop-blur-sm">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-cream via-white to-cream-2/60">
            <svg
              viewBox={`0 ${VIEW.top} 1000 ${VIEW.height}`}
              className="block h-auto w-full"
              role="img"
              aria-label="World map showing Paper Dreamz clients from Delhi across the USA, Europe, Africa, Australia and Pacific nations"
            >
              <defs>
                <pattern id="world-dots" width="7" height="7" patternUnits="userSpaceOnUse">
                  <circle cx="3.5" cy="3.5" r="1.6" fill="#c5a059" />
                </pattern>
                <clipPath id="world-land">
                  {LAND.map((poly, i) => (
                    <polygon key={i} points={poly.map((p) => project(p).join(",")).join(" ")} />
                  ))}
                </clipPath>
                <radialGradient id="world-glow">
                  <stop offset="0%" stopColor="#c5a059" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect x="0" y={VIEW.top} width="1000" height={VIEW.height} fill="url(#world-dots)" clipPath="url(#world-land)" opacity="0.4" />

              {REGIONS.map((r, i) => (
                <g key={r.name}>
                  <path d={arcPath(r)} fill="none" stroke="#c5a059" strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" />
                  <motion.path
                    d={arcPath(r)}
                    fill="none"
                    stroke="#9c7a3f"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.3 + i * 0.2, ease: "easeInOut" }}
                  />
                  {!reduceMotion && (
                    <g>
                      <rect x="-8" y="-5.5" width="16" height="11" rx="1.5" fill="#fff" stroke="#9c7a3f" strokeWidth="1.2" />
                      <path d="M -8 -5.5 L 0 1 L 8 -5.5" fill="none" stroke="#9c7a3f" strokeWidth="1.2" />
                      <animateMotion dur="5s" begin={`${2 + i * 0.9}s`} repeatCount="indefinite" path={arcPath(r)} rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                      <animate attributeName="opacity" dur="5s" begin={`${2 + i * 0.9}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.1;0.85;1" />
                    </g>
                  )}
                  {(() => {
                    const [x, y] = project(r.lonLat);
                    return (
                      <g>
                        <circle cx={x} cy={y} r="14" fill="url(#world-glow)" />
                        <circle cx={x} cy={y} r="5" fill="#9c7a3f" stroke="#fff" strokeWidth="2" />
                      </g>
                    );
                  })()}
                </g>
              ))}

              <circle cx={OX} cy={OY} r="34" fill="url(#world-glow)">
                {!reduceMotion && <animate attributeName="r" values="22;40;22" dur="3s" repeatCount="indefinite" />}
              </circle>
              <circle cx={OX} cy={OY} r="8" fill="#9c7a3f" stroke="#fff" strokeWidth="2.5" />
            </svg>

            <div className="pointer-events-none absolute inset-0 hidden sm:block">
              {REGIONS.map((r, i) => (
                <Pill key={r.name} place={r} delay={0.8 + i * 0.2} />
              ))}
              <Pill place={ORIGIN} origin delay={0.4} />
            </div>
          </div>
        </Reveal>

        <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:hidden">
          {[ORIGIN, ...REGIONS].map((p, i) => (
            <li
              key={p.name}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                i === 0 ? "border-gold bg-gold text-noir" : "border-gold/40 bg-white text-ink"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-noir" : "bg-gold"}`} />
              {p.name}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {content.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
            return (
            <Reveal
              key={h.label}
              delay={0.1 * i}
              className="flex items-center gap-5 rounded-2xl border border-gold/25 bg-white/70 p-6 shadow-[0_10px_30px_rgba(44,36,32,0.05)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block font-script text-3xl leading-none text-gold-deep">{h.value}</span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-taupe">{h.label}</span>
              </span>
            </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-12 max-w-2xl text-center">
          <p className="font-script text-2xl sm:text-3xl italic leading-snug text-ink">
            {content.closing_quote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
