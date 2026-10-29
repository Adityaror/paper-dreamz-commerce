"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

type VoiceNote = {
  name: string;
  city: string;
  occasion: string;
  src: string;
  transcript?: string;
};

/*
 * Drop each recording into /public/audio and list it here.
 * Until a file exists the card shows an "arriving soon" state.
 */
const VOICE_NOTES: VoiceNote[] = [
  { name: "Client Name", city: "City", occasion: "Wedding Envelopes", src: "/audio/voice-01.mp3" },
  { name: "Client Name", city: "City", occasion: "Baby Keepsakes", src: "/audio/voice-02.mp3" },
  { name: "Client Name", city: "City", occasion: "Bulk Gifting", src: "/audio/voice-03.mp3" },
];

const BARS = Array.from({ length: 44 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

function VoiceCard({
  note,
  index,
  playing,
  onToggle,
}: {
  note: VoiceNote;
  index: number;
  playing: boolean;
  onToggle: (want: boolean) => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) el.play().catch(() => onToggle(false));
    else el.pause();
  }, [playing, onToggle]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  return (
    <Reveal delay={index * 0.1} className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl gold-border bg-gradient-to-br from-emerald/90 to-noir p-7 shadow-xl">
        <div className="pointer-events-none absolute inset-2.5 rounded-[1.25rem] border border-gold/10" />

        <audio
          ref={ref}
          src={note.src}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onEnded={() => {
            setProgress(0);
            onToggle(false);
          }}
          onError={() => setUnavailable(true)}
        />

        <p className="relative font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-gold">{note.occasion}</p>

        <div className="relative mt-8 flex items-center gap-5">
          <button
            type="button"
            disabled={unavailable}
            onClick={() => onToggle(!playing)}
            aria-label={playing ? `Pause ${note.name}` : `Play ${note.name}`}
            className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold/60 text-gold transition-all duration-300 hover:bg-gold hover:text-noir disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13a.5.5 0 0 0 .76.43l10.4-6.5a.5.5 0 0 0 0-.86L8.76 5.07A.5.5 0 0 0 8 5.5z" />}
            </svg>
          </button>

          <div className="flex-1">
            <div onClick={seek} className="flex h-12 cursor-pointer items-center gap-[3px]" role="presentation">
              {BARS.map((h, i) => {
                const filled = duration > 0 && i / BARS.length < progress / duration;
                return (
                  <span
                    key={i}
                    style={{ height: `${h * 100}%` }}
                    className={`w-[3px] flex-1 rounded-full transition-colors duration-200 ${filled ? "bg-gold" : "bg-ivory-dim/25"}`}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] tracking-widest text-ivory-dim/60">
              <span>{fmt(progress)}</span>
              <span>{unavailable ? "Arriving soon" : fmt(duration)}</span>
            </div>
          </div>
        </div>

        {note.transcript && (
          <p className="relative mt-6 font-script text-lg italic leading-relaxed text-ivory">“{note.transcript}”</p>
        )}

        <div className="relative mt-auto flex items-center gap-4 pt-8">
          <span className="h-px w-8 bg-gold" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ivory">{note.name}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory-dim/60">{note.city}</span>
        </div>
      </article>
    </Reveal>
  );
}

export default function AudioTestimonials() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section id="voices" className="relative overflow-hidden bg-bottle-green py-16 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Voice Notes</p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-ivory sm:text-5xl lg:text-6xl">
            Hear it in their own voice
          </h2>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/50" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gold/50" />
          </div>
          <p className="mt-6 text-sm text-ivory-dim">Heartfelt notes recorded by the clients who received our creations.</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VOICE_NOTES.map((note, i) => (
            <VoiceCard
              key={note.src}
              note={note}
              index={i}
              playing={playingIndex === i}
              onToggle={(want) => setPlayingIndex((cur) => (want ? i : cur === i ? null : cur))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
