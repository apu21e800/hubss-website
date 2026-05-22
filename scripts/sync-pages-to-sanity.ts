/**
 * scripts/sync-pages-to-sanity.ts
 *
 * Phase 2, Increment 3 — About + Lunch & Learn extended-section sync.
 *
 * Idempotently backfills the new page-doc fields added in this increment
 * (About story/values/whyHub/partners, Lunch & Learn whatYouGet/personas/
 * faqs/section headings) from the current hardcoded values in the source.
 *
 * Hero / mission / contact-hero fields were already populated in a prior
 * migration and are NOT touched by this script.
 *
 * Usage:
 *   npx tsx scripts/sync-pages-to-sanity.ts            # apply
 *   npx tsx scripts/sync-pages-to-sanity.ts --dry-run  # report only
 */

import { createClient } from "@sanity/client";
import path from "path";
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
  token: token ?? "dry-run-no-token",
});

// ─── About page baseline ────────────────────────────────────────────────────
// Verbatim copies of the hardcoded values in app/about/page.tsx.

const ABOUT_STORY: string[] = [
  "HUB Surface Systems was founded on a simple belief: streets don't have to be grey. For decades, Canadian cities treated pavement as pure utility — functional, forgettable, interchangeable. We saw an opportunity to change that, starting with StreetPrint decorative stamped asphalt in the mid-1990s.",
  "Over thirty years, we grew our portfolio to address every surface challenge a Canadian municipality might face — from high-traffic arterial markings in York Region to decorative community crosswalks at UBC to Indigenous art installations on BC ferries. Every city, every application, every climate.",
  "Today, HUB operates from two regional offices — East in Milton, Ontario, and West in Ladysmith, British Columbia — backed by a network of certified applicators trained and authorized by HUB to install each system to spec. That credentialed installer program is what turns a quality product into a quality outcome.",
];

const ABOUT_STORY_ASIDE =
  "York Region. City of Toronto. City of Vancouver. UBC. The City of Sechelt. When you walk through a Canadian city and feel something — when a crosswalk catches your eye, when a plaza feels like it belongs — there's a chance we were there. That's what thirty years looks like on the ground.";

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
  { title: "6–8 Years of Proven Performance",  desc: "Thermoplastic and MMA markings deliver 6–8 years of high-visibility service life — documented across hundreds of Canadian municipalities in every climate." },
  { title: "Vision Zero Aligned",              desc: "Every HUB product is designed to support Vision Zero frameworks — from retroreflective crosswalk markings to high-contrast bike lane systems." },
  { title: "High-Visibility by Design",        desc: "Tactile and high-contrast marking solutions engineered for pedestrian safety and legibility in every lighting condition and season." },
  { title: "20-Year Performance",              desc: "StreetPrint and StreetBond installations are engineered for 20-year colour retention — documented across hundreds of Canadian municipalities." },
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
    if (!jsonEqual(remote[field], value)) {
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
  console.log(`Sync page-doc extended sections → Sanity${DRY_RUN ? " (DRY RUN)" : ""}`);

  let changed = 0, skipped = 0, missing = 0;

  // About page
  const aboutDesired = {
    aboutStory: ABOUT_STORY,
    aboutStoryAside: ABOUT_STORY_ASIDE,
    aboutValues: arrayWithKeys(ABOUT_VALUES, "v"),
    aboutWhyHub: arrayWithKeys(ABOUT_WHY_HUB, "w"),
    aboutPartnersIntro: ABOUT_PARTNERS_INTRO,
    aboutPartners: arrayWithKeys(ABOUT_PARTNERS, "p"),
  };
  const aboutResult = await patchPage("about", aboutDesired);
  changed += aboutResult.changed; skipped += aboutResult.skipped; missing += aboutResult.missing;

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
