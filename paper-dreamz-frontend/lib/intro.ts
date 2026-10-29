/**
 * sessionStorage key marking that the cinematic intro was watched or skipped. Shared by the Intro component and the
 * pre-paint script in app/layout.tsx (a server component, which can't import plain values from a "use client" file).
 */
export const INTRO_SEEN_KEY = "pd-intro-seen";
