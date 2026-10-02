/**
 * scripts/sync-pages-to-sanity.ts
 *
 * Pushes the page copy in the code into Sanity's page docs, idempotently:
 *   - homepage, about, contact: the hero text
 *   - about: story, whyHub, partners intro (lib/about-content.ts)
 *   - lunch-learn: whatYouGet, personas, faqs (lib/lunch-learn-content.ts),
 *     section headings
 *
 * 30 Sep 2026: About and Lunch & Learn copy is imported from the lib files the
 * pages read, instead of being held here a second time. The Lunch & Learn part
 * used to push the launch-era seed back into Sanity, CE credit claims and all
 * (the page ignored it through its shim, but the claim sat in Studio). The
 * About fields the page no longer shows (mission, story aside, values, partner
 * paragraphs) are left as they are in Sanity: never read, hidden in Studio.
 *
 * Hero text was added on 24 Sep 2026. Before that the heroes were left alone
 * ("already populated in a prior migration"), so when the code's About hero was
 * corrected from "For over thirty years" to "Since 1999" on 7 Sep, the live
 * page kept the old line: Sanity overrides the code and nothing pushed the fix.
 * Hero fields are set by path (homepageHero.tagline, ...), so the hero image
 * stored beside them is never touched.
 *
 * Before any write, every string this script would send for the homepage,
 * about and contact pages is checked against the page component it copies. If
 * a component has changed and this file has not, the script stops and names
 * the string instead of writing stale copy over the live page.
 *
 * Usage:
 *   npx tsx scripts/sync-pages-to-sanity.ts            # apply
 *   npx tsx scripts/sync-pages-to-sanity.ts --dry-run  # report only
 */

import { createClient } from "@sanity/client";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import { ABOUT_HERO, ABOUT_STORY, ABOUT_WHY_HUB, ABOUT_PARTNERS_INTRO } from "../lib/about-content";
import { LL_WHAT_YOU_GET, LL_PERSONAS, LL_FAQS } from "../lib/lunch-learn-content";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

loadDotenv({ path: path.join(ROOT, ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !DRY_RUN) {
  console.error("ERROR: SANITY_API_WRITE_TOKEN missing from environment.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  // Published documents only, so the diff and the patch target what the site
  // shows. With a token the default perspective would mix in Studio drafts.
  perspective: "published",
  // A dry run reads the public dataset with no token at all; a placeholder token
  // is sent as a real one and Sanity answers 401, so the dry run never ran.
  token: token || undefined,
});

// ─── Hero text ──────────────────────────────────────────────────────────────
// Verbatim copies of the fallbacks in app/page.tsx, app/about/page.tsx and
// app/contact/page.tsx. Keys are paths into the page doc.

const HOME_HERO_TEXT: Record<string, string> = {
  "homepageHero.eyebrow":    "Redefining Hardscapes · Since 1999",
  "homepageHero.heading":    "The World Is",
  "homepageHero.subheading": "Your Canvas.",
  "homepageHero.tagline":    "Let’s build your signature space.",
  // 30 Sep 2026 (QA A2, E34): the work is the map of documented projects,
  // and the labels are sentence case, as in app/page.tsx.
  "homepageHero.cta1Label":  "See the work",
  "homepageHero.cta1Href":   "#map",
  "homepageHero.cta2Label":  "See the systems",
  "homepageHero.cta2Href":   "#systems",
};

const ABOUT_HERO_TEXT: Record<string, string> = {
  "aboutHero.eyebrow":    ABOUT_HERO.eyebrow,
  "aboutHero.heading":    ABOUT_HERO.heading,
  "aboutHero.subheading": ABOUT_HERO.subheading,
};

const CONTACT_HERO_TEXT: Record<string, string> = {
  "contactHero.eyebrow":    "Get in touch",
  "contactHero.heading":    "Start a project",
  "contactHero.subheading": "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
};

// ─── Lunch & Learn section headings ──────────────────────────────────────────
// Verbatim copies of the defaults in app/lunch-learn/page.tsx (checked against
// it before any write). The items come from lib/lunch-learn-content.ts.
const LL_SECTION_HEADINGS = {
  whatYouGetEyebrow: "What you walk away with",
  whatYouGetHeading: "A working session for your team.",
  personasEyebrow:   "Who it's built for",
  personasHeading:   "Your whole team, one session.",
  faqEyebrow:        "Common questions",
  faqHeading:        "Everything you need to know",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function arrayWithKeys<T extends object>(items: T[], prefix: string): (T & { _key: string })[] {
  return items.map((item, i) => ({ ...item, _key: `${prefix}_${i}` }));
}

function jsonEqual(a: unknown, b: unknown): boolean {
  // Sort keys + ignore _key so insertion order and Sanity-managed keys don't trigger false diffs.
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([k]) => k !== "_key")
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    const out: Record<string, unknown> = {};
    for (const [k, v] of entries) out[k] = normalize(v);
    return out;
  }
  return value;
}

/** Value at a dotted path ("aboutHero.subheading") or a plain field name. */
function atPath(doc: Record<string, unknown>, field: string): unknown {
  return field.split(".").reduce<unknown>(
    (o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined),
    doc,
  );
}

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([k]) => k !== "_key")
      .flatMap(([, v]) => stringsIn(v));
  }
  return [];
}

/**
 * Stop before writing if a string this script would send is no longer in the
 * component it was copied from. The About copy and the Lunch & Learn items are
 * imported from the files the pages read, so they cannot drift and are not
 * checked; the hero text of the homepage and Contact, and the Lunch & Learn
 * headings, are copies and are.
 */
function assertStillInSource(file: string, desired: Record<string, unknown>): string[] {
  const source = readFileSync(path.join(ROOT, file), "utf8");
  return stringsIn(desired)
    .filter((s) => !source.includes(s) && !source.includes(JSON.stringify(s).slice(1, -1)))
    .map((s) => `${file} no longer contains: "${s.length > 90 ? s.slice(0, 90) + "…" : s}"`);
}

async function patchPage(slug: string, desired: Record<string, unknown>) {
  const remote = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug }
  );
  if (!remote) {
    console.log(`  ? no Sanity page doc for slug=${slug} — skipping`);
    return { changed: 0, skipped: 0, missing: 1 };
  }

  const diffs: string[] = [];
  for (const [field, value] of Object.entries(desired)) {
    if (!jsonEqual(atPath(remote, field), value)) {
      diffs.push(field);
    }
  }

  if (diffs.length === 0) {
    console.log(`  ✓ ${slug} — already in sync`);
    return { changed: 0, skipped: 1, missing: 0 };
  }

  console.log(`  ✏  ${slug}`);
  for (const d of diffs) console.log(`      ${d}: <changed>`);

  if (!DRY_RUN) {
    await client.patch(remote._id).set(desired).commit({ autoGenerateArrayKeys: false });
  }
  return { changed: 1, skipped: 0, missing: 0 };
}

async function main() {
  console.log(`Sync page copy → Sanity${DRY_RUN ? " (DRY RUN)" : ""}`);

  let changed = 0, skipped = 0, missing = 0;

  const homeDesired = { ...HOME_HERO_TEXT };
  const contactDesired = { ...CONTACT_HERO_TEXT };
  const aboutDesired = {
    ...ABOUT_HERO_TEXT,
    aboutStory: ABOUT_STORY,
    aboutWhyHub: arrayWithKeys(ABOUT_WHY_HUB, "w"),
    aboutPartnersIntro: ABOUT_PARTNERS_INTRO,
  };

  const drift = [
    ...assertStillInSource("app/page.tsx", homeDesired),
    ...assertStillInSource("app/contact/page.tsx", contactDesired),
    ...assertStillInSource("app/lunch-learn/page.tsx", LL_SECTION_HEADINGS),
  ];
  if (drift.length) {
    console.error("\nSTOPPED, nothing written. This script's copy of the page text is out of date:");
    for (const d of drift) console.error(`  ${d}`);
    console.error("Update the constants in scripts/sync-pages-to-sanity.ts to match, then run it again.");
    process.exit(1);
  }

  for (const [slug, desired] of [["homepage", homeDesired], ["about", aboutDesired], ["contact", contactDesired]] as const) {
    const result = await patchPage(slug, desired);
    changed += result.changed; skipped += result.skipped; missing += result.missing;
  }

  // Lunch & Learn page
  const llDesired = {
    lunchLearnWhatYouGet: arrayWithKeys(LL_WHAT_YOU_GET, "w"),
    lunchLearnPersonas:   arrayWithKeys(LL_PERSONAS,     "p"),
    lunchLearnFaqs:       arrayWithKeys(LL_FAQS,         "f"),
    lunchLearnSectionHeadings: LL_SECTION_HEADINGS,
  };
  const llResult = await patchPage("lunch-learn", llDesired);
  changed += llResult.changed; skipped += llResult.skipped; missing += llResult.missing;

  console.log(`\nDone. ${changed} updated, ${skipped} already in sync, ${missing} missing in Sanity.`);
  if (DRY_RUN) console.log("(dry run — no writes made)");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
