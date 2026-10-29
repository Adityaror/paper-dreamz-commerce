/**
 * Client-side fetch helper for the Laravel api/v1 backend.
 *
 * The frontend is a static export (`output: "export"` in next.config.ts), so
 * there is no server runtime to fetch at build/request time — every call here
 * runs in the browser from inside a "use client" component's useEffect.
 */

const RAW_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://paperdreamz3api.dsdspl.com/api/v1"
).replace(/\/+$/, "");

const API_URL = RAW_URL.endsWith("/api/v1") ? RAW_URL : `${RAW_URL}/api/v1`;

/** Origin the API is served from, derived from API_URL, e.g. "https://paperdreamz3api.dsdspl.com". */
const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, "");

/**
 * Resolves a path returned by the API into a URL the browser can load.
 *
 * Three shapes are seen in practice:
 * - Absolute URLs (http/https) — passed through unchanged.
 * - Root-relative paths (e.g. "/images/hero.jpg") — seed data reusing the
 *   frontend's own bundled `public/` assets; passed through unchanged so
 *   they resolve against the frontend origin, not the API.
 * - Bare relative paths (e.g. "hero/video.mp4") — a Filament FileUpload path
 *   on Laravel's public disk; prefixed with the API origin's /storage URL.
 */
export function resolveAssetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) {
    if (path.includes("wedding-envelopes")) {
      const clean = path.split("?")[0];
      return `${clean}?v=5`;
    }
    return path;
  }
  return `${API_ORIGIN}/storage/${path.replace(/^storage\//, "")}`;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const inFlight = new Map<string, Promise<unknown>>();

/**
 * Fetches JSON from `api/v1/{path}` and returns `data.data` (Laravel API
 * Resource collections/items are wrapped in a `data` key).
 *
 * Returns `null` on any network/HTTP/parsing error instead of throwing, so
 * callers can fall back to hardcoded content and the site never breaks.
 */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T | null> {
  // Several components may ask for the same endpoint on one page (e.g. /catalog); share one request.
  if (!init) {
    const pending = inFlight.get(path);
    if (pending) return pending as Promise<T | null>;
    const request = fetchJson<T>(path).finally(() => inFlight.delete(path));
    inFlight.set(path, request);
    return request;
  }
  return fetchJson<T>(path, init);
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });

    if (!res.ok) {
      throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status);
    }

    const json = await res.json();
    return (json?.data ?? json) as T;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[api] GET ${path} failed:`, error);
    }
    return null;
  }
}

/**
 * POSTs JSON to `api/v1/{path}`. Returns `{ ok, data, message }` rather than
 * throwing, so form components can show inline errors without a try/catch.
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<{ ok: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        json?.message ??
        (json?.errors ? Object.values(json.errors).flat().join(" ") : `Request failed with status ${res.status}`);
      return { ok: false, message };
    }

    return { ok: true, data: json?.data ?? json };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[api] POST ${path} failed:`, error);
    }
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
