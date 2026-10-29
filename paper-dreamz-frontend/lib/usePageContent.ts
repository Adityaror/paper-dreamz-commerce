"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

const isBlank = (value: unknown) =>
  value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);

/**
 * Content of one admin-editable page block (Admin → Pages), fetched from
 * `/page-sections/{key}`. Starts as `fallback` (the built-in copy in
 * `lib/content/*`) and keeps it for any field the admin left empty, or
 * entirely when the API can't be reached.
 *
 * Image fields come back as stored paths — pass them through `resolveAssetUrl`.
 * Pass `enabled: false` to skip the request and just use `fallback`.
 */
export function usePageContent<T extends Record<string, unknown>>(key: string, fallback: T, enabled = true): T {
  const [saved, setSaved] = useState<Partial<T> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    apiGet<Partial<T>>(`/page-sections/${key}`).then((data) => {
      if (!cancelled && data) setSaved(data);
    });
    return () => {
      cancelled = true;
    };
  }, [key, enabled]);

  if (!enabled || !saved) return fallback;

  const merged = { ...fallback };
  for (const field of Object.keys(fallback) as (keyof T)[]) {
    if (!isBlank(saved[field])) merged[field] = saved[field] as T[keyof T];
  }
  return merged;
}
