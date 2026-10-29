/**
 * Writes the site's built-in copy (lib/content/*, lib/policies.ts) to
 * backend/database/seeders/data/site-content.json, which PaperDreamzSeeder
 * loads — so a freshly seeded admin panel starts with exactly what the site
 * shows. Re-run after changing any of those files:
 *
 *   node scripts/export-content.ts
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ABOUT_CONTENT } from "../lib/content/about.ts";
import { CATALOG } from "../lib/content/catalog.ts";
import { HOME_CONTENT } from "../lib/content/home.ts";
import { PAGES_CONTENT } from "../lib/content/pages.ts";
import { TESTIMONIALS, TESTIMONIALS_SECTION } from "../lib/content/testimonials.ts";
import { POLICIES } from "../lib/policies.ts";

const content = {
  page_sections: { ...HOME_CONTENT, ...ABOUT_CONTENT, ...PAGES_CONTENT },
  testimonials_section: TESTIMONIALS_SECTION,
  testimonials: TESTIMONIALS.map((t) => ({ name: t.name, city: t.city, highlight: t.highlight, body: t.body.join("\n\n") })),
  policies: Object.entries(POLICIES).map(([slug, p]) => ({
    slug,
    title: p.title,
    intro: p.intro,
    hero_image: p.image,
    sections: p.sections.map((s) => ({ heading: s.heading, body: s.body.join("\n\n") })),
  })),
  catalog: CATALOG,
};

const target = fileURLToPath(new URL("../../paper-dreamz-backend/database/seeders/data/site-content.json", import.meta.url));
writeFileSync(target, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Wrote ${target}`);
