"use client";

import { useEffect } from "react";

/** Marks the section an admin is previewing; styled in globals.css. */
const TARGET_ATTR = "data-admin-preview-target";

/**
 * The admin panel's "Preview" side panel opens pages as `?admin-preview=<element id>`. The pre-paint script in
 * app/layout.tsx copies that onto `<html data-admin-preview>`; this outlines the matching section and keeps it in view
 * while API content loads and reflows the page. Does nothing for normal visitors.
 */
export default function AdminPreview() {
  useEffect(() => {
    const target = document.documentElement.dataset.adminPreview;
    if (!target || target === "page") return;

    let marked: HTMLElement | null = null;
    const show = () => {
      const el = document.getElementById(target);
      if (!el) return;
      if (el !== marked) {
        marked?.removeAttribute(TARGET_ATTR);
        el.setAttribute(TARGET_ATTR, "");
        marked = el;
      }
      // Land just below the fixed site header (or centred, when the section fits on screen) rather than under it.
      const headerBottom = Math.max(0, document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
      const room = window.innerHeight - headerBottom;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const offset = el.offsetHeight < room * 0.9 ? headerBottom + (room - el.offsetHeight) / 2 : headerBottom + 12;
      window.scrollTo({ top: Math.max(0, top - offset) });
    };

    const timers = [400, 1200, 2500].map((ms) => setTimeout(show, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
