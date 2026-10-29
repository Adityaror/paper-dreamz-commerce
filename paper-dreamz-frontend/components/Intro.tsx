"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { apiGet, resolveAssetUrl } from "@/lib/api";
import { INTRO_SEEN_KEY } from "@/lib/intro";


type CinematicIntro = {
  video: string | null;
  mobile_video: string | null;
  poster_image: string | null;
  skip_label: string | null;
};

const FALLBACK = {
  video: "/videos/intro-v2.mp4",
  mobileVideo: "/videos/intro-mobile-v2.mp4",
  poster: "/images/intro-poster.webp",
  skipLabel: "Skip",
};

/** Fired on window once the intro has closed (or was skipped), so later overlays can wait for it. */
export const INTRO_DONE_EVENT = "pd:intro-done";

export const isIntroDone = () => document.documentElement.dataset.introDone === "1";

// These browser values are read once and never change while the page is open, so there is nothing to subscribe to.
const subscribeNever = () => () => {};

/** Set before first paint by app/layout.tsx for repeat visits this session and reduced-motion users. */
const shouldSkipIntro = () => document.documentElement.dataset.introSkip === "1";

let mobileAtLoad: boolean | undefined;
/** Phone-sized screen when the page loaded; fixed afterwards so resizing never restarts the video. */
const isMobileAtLoad = () => (mobileAtLoad ??= window.innerWidth < 768);

export default function Intro() {
  // While pre-rendering there is no browser: render the intro open but without a video, as before.
  const skip = useSyncExternalStore(subscribeNever, shouldSkipIntro, () => false);
  const isMobile = useSyncExternalStore<boolean | null>(subscribeNever, isMobileAtLoad, () => null);
  const [closed, setClosed] = useState(false);
  const [adminVideo, setAdminVideo] = useState<string | null>(null);
  const open = !skip && !closed;
  const src = isMobile === null ? null : (adminVideo ?? (isMobile ? FALLBACK.mobileVideo : FALLBACK.video));
  const [muted, setMuted] = useState(true);
  const [poster, setPoster] = useState(FALLBACK.poster);
  const [skipLabel, setSkipLabel] = useState(FALLBACK.skipLabel);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Admin → Settings → Cinematic Intro; the video only changes if it differs from the built-in one.
  useEffect(() => {
    if (skip || isMobile === null) return;
    let cancelled = false;
    apiGet<CinematicIntro>("/cinematic-intro").then((data) => {
      if (cancelled || !data) return;
      setAdminVideo(resolveAssetUrl(isMobile ? (data.mobile_video ?? data.video) : data.video) ?? null);
      setPoster(resolveAssetUrl(data.poster_image) ?? FALLBACK.poster);
      setSkipLabel(data.skip_label || FALLBACK.skipLabel);
    });
    return () => {
      cancelled = true;
    };
  }, [skip, isMobile]);

  useEffect(() => {
    if (open) return;
    document.documentElement.dataset.introDone = "1";
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  }, [open]);

  // Lock page scroll while the intro is showing.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    setClosed(true);
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          className="pd-intro fixed inset-0 z-[100] bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {src && (
            <video
              ref={videoRef}
              className="absolute inset-[7%] h-[86%] w-[86%] object-contain"
              src={src}
              poster={poster}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={close}
              onError={close}
            />
          )}
          {/* Feather the video edges into the black backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[7%] shadow-[inset_0_0_70px_55px_#000]"
          />
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Unmute intro" : "Mute intro"}
            className="absolute bottom-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white/90 transition-colors hover:bg-black/60"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            type="button"
            onClick={close}
            className="absolute bottom-6 right-6 rounded-full border border-white/40 bg-black/40 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 transition-colors hover:bg-black/60"
          >
            {skipLabel}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
