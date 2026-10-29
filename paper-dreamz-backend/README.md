# Paper Dreamz — Backend

Laravel API + Filament admin panel for the Paper Dreamz frontend.

## Stack

- Laravel 12, PHP 8.5
- MySQL (local DB: `paperdreamz3`)
- Filament 3 — admin panel at `/admin`
- Laravel Sanctum (installed for future auth needs; current public API routes are unauthenticated)

## Setup

```bash
composer install
cp .env.example .env   # then adjust DB_* if needed
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Default local DB credentials (Homebrew MySQL default): `root` with no password, database `paperdreamz3`.

## Admin panel

Visit `http://localhost:8000/admin`.

Seeded admin login:
- Email: `ai@dsdspl.com`
- Password: `password`

**Change this password before deploying.**

Manageable content:
- **Hero Slides** — homepage hero video/heading/CTA
- **Collections** — Envelopes, Keepsakes, Gifting, etc.
- **Products** — New Arrivals grid (name, price, badge, image, linked collection)
- **FAQs**
- **Newsletter Subscribers** (read-only list; populated via the public API)
- **Site Settings** (singleton page) — meta/OG fields, footer brand blurb, "Est." year, copyright name, contact phone/email/address, social URLs, announcement bar text, logo, brand name/tagline
- **Nav Links** — label, href, orderable
- **Footer Links** — grouped `quick`/`care`, label, href, orderable
- **Payment Badges** — label, orderable
- **Value Props** — title, description, orderable
- **Story Section** (singleton page) — eyebrow, heading, accent word, body, image, CTA
- **Craft Banner** (singleton page) — eyebrow, quote, background image
- **Experience Section** (singleton page) — heading/subtext for the Experience block
- **Experience Items** — title, tag, image, orderable
- **Process Section** (singleton page) — heading/subtext for the Process Steps block
- **Process Steps** — number, title, tag, description, image, highlights list, orderable
- **Cinematic Intro** (singleton page) — intro video, poster image, skip-button label

## Public API

Base URL: `/api/v1`

| Method | Endpoint                  | Description                                               |
|--------|----------------------------|-------------------------------------------------------------|
| GET    | `/hero-slides`             | Active hero slides, ordered                                |
| GET    | `/collections`             | Active collections, ordered                                |
| GET    | `/collections/{slug}`      | Single collection                                           |
| GET    | `/products`                | Active products, ordered. `?collection=<slug>` to filter    |
| GET    | `/products/{slug}`         | Single product                                               |
| GET    | `/faqs`                    | Active FAQs, ordered                                        |
| GET    | `/site-settings`           | Site settings singleton (meta/OG, contact, socials, footer brand blurb) |
| GET    | `/nav-links`               | Active nav links, ordered                                   |
| GET    | `/footer-links`            | Active footer links, ordered. `?group=quick\|care` to filter |
| GET    | `/payment-badges`          | Active payment badges, ordered                              |
| GET    | `/value-props`             | Active value props, ordered                                 |
| GET    | `/story-section`           | Story section singleton                                     |
| GET    | `/craft-banner`            | Craft banner singleton                                      |
| GET    | `/experience`              | `{ section, items }` — Experience section + active items, ordered |
| GET    | `/process-steps`           | `{ section, steps }` — Process section + active steps, ordered |
| GET    | `/cinematic-intro`         | Cinematic intro singleton (video, poster, skip label)        |
| POST   | `/newsletter/subscribe`    | Body: `{ "email": "..." }`                                   |

All responses are wrapped in `{ "data": ... }` (Laravel API Resources). Singleton endpoints (`site-settings`, `story-section`, `craft-banner`, `cinematic-intro`, and the `section` key inside `experience`/`process-steps`) auto-create a default row on first request if none exists, so the API never 404s on an unconfigured singleton.

## Tests

```bash
php artisan test
```

## Notes for connecting the Next.js frontend

Set `NEXT_PUBLIC_API_URL` in `frontend` (e.g. `http://localhost:8000/api/v1` in dev). All of `Hero.tsx`, `Collections.tsx`, `NewArrivals.tsx`, `Faq.tsx`, `Navbar.tsx`, `Footer.tsx`, `ValueStrip.tsx`, `CraftedWithHeart.tsx`, `CraftBanner.tsx`, `Experience.tsx`, `ProcessSteps.tsx`, and `CinematicIntro.tsx` fetch from these endpoints client-side, each falling back to its original hardcoded content if the fetch fails. Image/video paths returned by the API are the same static paths used in `frontend/public` (e.g. `/images/...`, `/videos/...`) until the admin uploads real files through Filament, at which point those fields contain `/storage/...` paths served by this Laravel app — update `next.config.ts`'s `images.remotePatterns` to allow the Laravel host once that happens.

`layout.tsx`'s `<meta>` fields (title, description, OG tags) are **not** wired to `site-settings` — the frontend is a static export (`output: "export"`), so `export const metadata` runs at build time and can't await a runtime fetch. The fields exist and are editable in Filament, just unconsumed until the export strategy changes.

### Environment variables for production

| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | frontend | Point at the deployed Laravel host's `/api/v1`, not `localhost` |
| `APP_URL` | backend | Used for generating `/storage/...` asset URLs in API responses |

`config/cors.php`'s `allowed_origins` is hardcoded to `['*']` (no env var wired up yet) — fine for local dev, but should be restricted to the real frontend domain(s) directly in that file before production deploy.
