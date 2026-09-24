/**
 * scripts/sync-pages-to-sanity.ts
 *
 * Pushes the page copy in the code into Sanity's page docs, idempotently:
 *   - homepage, about, contact: the hero text (and the about mission line)
 *   - about: story, values, whyHub, partners
 *   - lunch-learn: whatYouGet, personas, faqs, section headings
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
  "homepageHero.cta1Label":  "See the Work",
  "homepageHero.cta1Href":   "#field-notes",
  "homepageHero.cta2Label":  "See the Systems",
  "homepageHero.cta2Href":   "#systems",
};

const ABOUT_HERO_TEXT: Record<string, string> = {
  "aboutHero.eyebrow":    "Canadian-Operated Since 1999 · All 10 Provinces",
  "aboutHero.heading":    "The people who made your city look like your city.",
  "aboutHero.subheading": "Since 1999, HUB Surface Systems — a proudly Canadian company, coast to coast — has been connecting communities with pavement technologies that do more than carry traffic. They carry identity.",
  aboutMission:           "Every surface tells a story. We give communities the language to write it.",
};

const CONTACT_HERO_TEXT: Record<string, string> = {
  "contactHero.eyebrow":    "Get In Touch",
  "contactHero.heading":    "Start a Project",
  "contactHero.subheading": "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
};

// ─── About page baseline ────────────────────────────────────────────────────
// Verbatim copies of the hardcoded values in app/about/page.tsx.

// KEEP IN STEP WITH app/about/page.tsx. This script holds its own copy of the
// about-page text and is what actually reaches Sanity; the constants in the
// page component are only the fallback for when Sanity has no value. Editing
// one without the other is how the live page and the code drift apart.
//
// Sep 2026 corrections: "mid-1990s" and "over thirty years" contradicted the
// "Since 1999" printed across the rest of the site, and "Indigenous art
// installations on BC ferries" is a claim no HUB document supports — the
// documented Indigenous work is UBC, Sechelt, Granville Street, Burnaby and
// London.
const ABOUT_STORY: string[] = [
  "HUB Surface Systems was founded on a simple belief: streets don't have to be grey. For decades, Canadian cities treated pavement as pure utility — functional, forgettable, interchangeable. We saw an opportunity to change that, and built the company around StreetPrint decorative stamped asphalt — the original stamped asphalt system, a Canadian invention installed here since 1992.",
  "Since 1999 we have grown the portfolio to address every surface challenge a Canadian municipality might face — from high-traffic transit corridors in York Region and London to decorative community crosswalks at UBC to Indigenous recognition artwork in Sechelt, Vancouver and Burnaby. Every city, every application, every climate.",
  "Today, HUB operates from two regional offices — East in Milton, Ontario, and West in Ladysmith, British Columbia — backed by a network of certified applicators trained and authorized by HUB to install each system to spec. That credentialed installer program is what turns a quality product into a quality outcome.",
];

const ABOUT_STORY_ASIDE =
  "York Region. City of Toronto. City of Vancouver. UBC. The City of Sechelt. When you walk through a Canadian city and feel something — when a crosswalk catches your eye, when a plaza feels like it belongs — there's a chance we were there. That's what a thousand projects look like on the ground.";

const ABOUT_VALUES: { heading: string; body: string }[] = [
  {
    heading: "What We Build",
    body: "Decorative crosswalks, civic plazas, community murals, transit lanes, private driveways, and parks. Surface solutions that carry meaning — from high-visibility school zones in Milton to Indigenous art installations in Sechelt.",
  },
  {
    heading: "Who We Build For",
    body: "Municipalities, landscape architects, urban planners, developers, and certified contractors across every Canadian province. If it's a surface that people walk, drive, or gather on — we have a system for it.",
  },
  {
    heading: "Why It Matters",
    body: "Beautiful streets make walkable cities. Legible surfaces slow cars. Identity-rich public spaces build community. This isn't just infrastructure — it's the civic layer that tells a city it's worth caring about.",
  },
];

const ABOUT_WHY_HUB: { title: string; desc: string }[] = [
  { title: "Flexibility vs Concrete",          desc: "Asphalt-based systems flex with Canada's freeze-thaw cycles, outlasting concrete alternatives by 2–3x in northern climates." },
  { title: "6–8 Year Marking Life",           desc: "PreMark thermoplastic carries a 6–8 year service life, and MMAX returns a lane to traffic in 45–60 minutes. Both figures are the catalogue's." },
  { title: "Vision Zero Aligned",              desc: "Every HUB product is designed to support Vision Zero frameworks — from retroreflective crosswalk markings to high-contrast bike lane systems." },
  { title: "High-Visibility by Design",        desc: "Tactile and high-contrast marking solutions engineered for pedestrian safety and legibility in every lighting condition and season." },
  { title: "Service Life, by System",          desc: "StreetPrint runs 10–20 years on sound pavement; TrafficPatternsXD 10+, TrafficPatterns 8+, StreetBond 8+. Quoted per system, because they do not wear the same." },
  { title: "Climate-Tested",                   desc: "Every system is stress-tested for freeze-thaw extremes, de-icing salts, and snowplow blades — from coastal BC to the Great Lakes." },
];

const ABOUT_PARTNERS_INTRO =
  "HUB is an authorized distributor and applicator partner for the manufacturers behind our core product systems — giving clients access to the broadest decorative pavement portfolio in Canada, with direct manufacturer technical support and specification backup.";

const ABOUT_PARTNERS: { key: string; desc: string }[] = [
  { key: "gaf",          desc: "GAF is the manufacturer behind HUB's coloured pavement coating systems — StreetBond, StreetBondSR (solar reflective), DuraShield, and MMAX. Their coatings technology has been the foundation of thousands of decorative surface installations across Canada." },
  { key: "ennis-flint",  desc: "Ennis-Flint (a PPG company) is the manufacturer behind HUB's full thermoplastics range — including TrafficPatterns, TrafficPatternsXD, PreMark, AirMark, DuraTherm, and DecoMark. Their preformed thermoplastic systems are the gold standard for high-durability pavement markings across Canada." },
];

// ─── Lunch & Learn page baseline ───────────────────────────────────────────
// Verbatim copies of the hardcoded values in components/sections/LunchLearnFunnel.tsx.

const LL_WHAT_YOU_GET = [
  { num: "01", title: "Spec Language Ready for Your RFP", desc: "Pre-written specification language for thermoplastic crosswalks, MMA bus lanes, coloured bike lanes, and more. Copy it straight into your next tender document." },
  { num: "02", title: "The Lifecycle Cost Math",          desc: "Lifecycle cost math, side by side. How HUB systems deliver years of high-performance service versus repeated seasonal interventions — the numbers usually surprise people." },
  { num: "03", title: "Lunch Included. No Catch.",        desc: "In-person sessions include catered lunch for your team. Virtual sessions come with a $25 lunch voucher delivered before we connect." },
];

const LL_PERSONAS = [
  { title: "Municipal Engineers & Planners",     desc: "Crosswalks, transit corridors, and complete streets that meet Vision Zero and Complete Streets specifications, with accessibility-aware design. Real installation data from Canadian municipalities coast to coast.", badge: "Vision Zero · Complete Streets" },
  { title: "Landscape Architects & Designers",   desc: "12+ StreetPrint patterns, full StreetBond Pantone palette, and decorative surfaces engineered to outlast the design life of the asphalt beneath them. Snowplow-safe. Engineering-approved.", badge: "Public Art · Driveways" },
  { title: "Engineering & Consulting Firms",     desc: "CE credits available. Walk away with real spec sheets, sample materials, and a list of certified HUB installers in your region.", badge: "CE Credits" },
  { title: "Contractors & Applicators",          desc: "Learn about the HUB certified applicator program — unlock territory rights and bid on jobs your competitors can't touch.", badge: "Certified Applicator Program" },
];

const LL_FAQS = [
  { q: "How long is the session?",                       a: "30–45 minutes of presentation, followed by open Q&A. We're respectful of your team's calendar and stick to the time we agree on." },
  { q: "Is this actually free?",                         a: "100% free. No invoice, no minimum order attached, and we won't badger you afterward. We just want you to know what you're specifying — the rest follows naturally." },
  { q: "Do we get continuing education credits?",        a: "Yes. HUB Lunch & Learn sessions count toward AIBC, RAIC, and PEO continuing professional development requirements. We provide the documentation." },
  { q: "In-person or virtual?",                          a: "Both. In-person sessions are available coast to coast through our certified applicator network. Virtual sessions use Zoom or Teams — we mail sample kits before we connect." },
];

const LL_SECTION_HEADINGS = {
  whatYouGetEyebrow: "What You Walk Away With",
  whatYouGetHeading: "Not a Sales Pitch. An Education.",
  personasEyebrow:   "Who It's Built For",
  personasHeading:   "Your Whole Team. One Session.",
  faqEyebrow:        "Common Questions",
  faqHeading:        "Everything You Need to Know",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function arrayWithKeys<T extends Record<string, unknown>>(items: T[], prefix: string): (T & { _key: string })[] {
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
 * component it was copied from. Lunch & Learn is not checked: its copy was
 * rewritten in the component, and app/lunch-learn/page.tsx deliberately
 * ignores the seeded strings this script still holds.
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
    aboutStoryAside: ABOUT_STORY_ASIDE,
    aboutValues: arrayWithKeys(ABOUT_VALUES, "v"),
    aboutWhyHub: arrayWithKeys(ABOUT_WHY_HUB, "w"),
    aboutPartnersIntro: ABOUT_PARTNERS_INTRO,
    aboutPartners: arrayWithKeys(ABOUT_PARTNERS, "p"),
  };

  const drift = [
    ...assertStillInSource("app/page.tsx", homeDesired),
    ...assertStillInSource("app/about/page.tsx", aboutDesired),
    ...assertStillInSource("app/contact/page.tsx", contactDesired),
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
