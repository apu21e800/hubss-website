/**
 * scripts/seed-field-notes-plan.ts — the first items in Studio's Field Notes
 * plan (sanity/schemas/storyIdea.ts).
 *
 * Chosen on 24 Sep 2026 from Semrush (Canada) for searches that are real,
 * cheap to win (keyword difficulty under 35) and close to a purchase, where
 * no Field Note already targets the phrase (lib/field-notes-taxonomy.ts) and
 * the catalogue has the facts to answer it:
 *
 *   parking lot line painting   1,000/mo  KD 6   CPC $7.33
 *   parking lot sealcoating       590/mo  KD 8
 *   driveway sealing            1,900/mo  KD 31
 *   concrete coating              260/mo  KD 14
 *   asphalt paint                 210/mo  KD 16
 *   raised crosswalk              140/mo  KD 24
 *
 * Left out on purpose: "interlocking driveway" (720/mo), "pavement markings",
 * "thermoplastic pavement markings", "rainbow crosswalk", "stamped blacktop"
 * and "pattern paving" already have posts aimed at them, and a second post
 * would compete with the first. "Runway markings" (140/mo) is the wrong
 * search: AirMark is for taxiways and aprons, not runways.
 *
 * Added 26 Sep 2026 from a second Semrush (Canada) pass, same rules:
 *
 *   bike box                       720/mo  KD 15   (MMAX + PreMark: the book's
 *                                                   bike-lane spread, p50)
 *   traffic calming measures       140/mo  KD 27   (+ "speed table", 110/mo KD 21)
 *   asphalt driveway resurfacing   110/mo  KD 15
 *
 * and two real installations from the homepage map that have no write-up yet
 * (York Region VIVA, Kelowna's crosswalk network). Their briefs say what Doug
 * has to add before marking them Ready; the drafter only knows what the brief
 * and the Idea Book tell it. Skipped: "pavement markings" (260/mo) competes
 * with the thermoplastic-pavement-markings post; "parking lot painting"
 * (590/mo) with the line-painting item above; "driveway coating" (70/mo,
 * KD 35) is the sealing item under another name.
 *
 * The first two are marked Ready, so the Tuesday drafter has work; the rest
 * wait for Vern or Doug to mark them. Each item is created once, with a fixed
 * id, and never overwritten: a re-run leaves Studio edits alone.
 *
 *   npm run plan:seed -- --dry-run
 *   npm run plan:seed
 */

import { createClient } from "@sanity/client";
import path from "path";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: path.join(process.cwd(), ".env.local"), quiet: true });
const DRY = process.argv.includes("--dry-run");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!DRY && !token) { console.error("ERROR: SANITY_API_WRITE_TOKEN is missing from .env.local."); process.exit(1); }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
  token: token || undefined,
});

interface Seed {
  key: string;
  title: string;
  status: "ready" | "idea";
  priority: 1 | 2 | 3;
  searchPhrase: string;
  type: string;
  systems: string[];        // product slugs
  applications: string[];   // application slugs
  brief: string;
}

const SEEDS: Seed[] = [
  {
    key: "parking-lot-sealcoating",
    title: "Parking lot sealcoating vs a maintenance coating that lasts",
    status: "ready",
    priority: 1,
    searchPhrase: "parking lot sealcoating",
    type: "Guide",
    systems: ["durashield", "streetbond"],
    applications: ["parking-lots"],
    brief: "For property managers, REITs and facility teams deciding how to look after an oxidized asphalt lot. Explain in plain terms what conventional sealcoating is for and why it tends to be a recurring job, then what DuraShield is and does (from the catalogue), where StreetBond colour fits in a lot (fire lanes, drive aisles, wayfinding zones), and how to decide between maintaining the surface and replacing it. No prices, and no numbers that aren't in the catalogue.",
  },
  {
    key: "parking-lot-line-painting",
    title: "Parking lot line painting vs thermoplastic markings",
    status: "ready",
    priority: 1,
    searchPhrase: "parking lot line painting",
    type: "Guide",
    systems: ["premark", "traffic-patterns", "traffic-patterns-xd"],
    applications: ["parking-lots", "regulatory-markings"],
    brief: "Most lots are striped with paint. Be honest about where paint is still the sensible choice (long, straight stall lines on a tight budget) and where preformed thermoplastic earns its keep: accessible parking symbols, arrows, stop bars, crosswalks inside the lot, fire lanes and branded zones. Explain the heat-applied, drive-on-immediately installation and the built-in retroreflectivity, from the catalogue. Audience: property managers and paving contractors.",
  },
  {
    key: "asphalt-paint",
    title: "Asphalt paint vs a colour coating: why painted asphalt fades",
    status: "idea",
    priority: 2,
    searchPhrase: "asphalt paint",
    type: "Guide",
    systems: ["streetbond", "durashield"],
    applications: ["public-spaces", "playgrounds"],
    brief: "People search 'asphalt paint' when they want colour on asphalt: a plaza, a playground game, a painted intersection. Explain in plain words why ordinary paint wears quickly on asphalt, what a coating system like StreetBond does differently (from the catalogue), and when DuraShield is the right call instead (maintenance, not colour).",
  },
  {
    key: "driveway-sealing",
    title: "Driveway sealing vs a maintenance coating, and when to stamp instead",
    status: "idea",
    priority: 2,
    searchPhrase: "driveway sealing",
    type: "Guide",
    systems: ["durashield", "streetprint"],
    applications: ["residential-driveways"],
    brief: "Homeowners reseal asphalt driveways again and again. Explain what a maintenance coating like DuraShield offers (from the catalogue), and when stamping the driveway with StreetPrint makes more sense. Link the existing driveway posts rather than repeating them.",
  },
  {
    key: "concrete-coating",
    title: "Concrete coating for plazas, walkways and entrances",
    status: "idea",
    priority: 3,
    searchPhrase: "concrete coating",
    type: "Guide",
    systems: ["streetbond"],
    applications: ["commercial-spaces", "public-spaces"],
    brief: "Grey concrete plazas, walkways and building entries that have stained and aged. Colour and protection with StreetBond on concrete, from the catalogue. Link the renewal post (asphalt-concrete-renewal).",
  },
  {
    key: "raised-crosswalk",
    title: "Raised crosswalks that drivers actually see",
    status: "idea",
    priority: 3,
    searchPhrase: "raised crosswalk",
    type: "Guide",
    systems: ["traffic-patterns-xd", "duratherm", "streetprint"],
    applications: ["crosswalks", "traffic-calming"],
    brief: "A raised crosswalk slows traffic; its surface is what makes it read as a crossing. Explain how the surface choice (preformed thermoplastic, inlaid thermoplastic, stamped asphalt) affects visibility and winter maintenance, from the catalogue. No crash statistics.",
  },

  // ── 26 Sep 2026 ──────────────────────────────────────────────────────────
  {
    key: "bike-box",
    title: "Bike boxes: what they are, and how the green stays green",
    status: "idea",
    priority: 2,
    searchPhrase: "bike box",
    type: "Guide",
    systems: ["mmax", "premark"],
    applications: ["bike-lanes", "regulatory-markings"],
    brief: "A bike box is the coloured advance stop area for cyclists at a signalized intersection. Explain plainly what it does for a cyclist and a driver, then how the coloured surface is built to last: MMAX for the green area and PreMark for the pre-cut bike symbol, exactly as the Idea Book's bike-lane spread specifies (page 50), with the open-to-traffic time and the colour facts from the book. Audience: municipal engineers and active-transportation planners. No collision statistics, no claims about other cities' programs.",
  },
  {
    key: "traffic-calming-measures",
    title: "Traffic calming measures that start with the surface",
    status: "idea",
    priority: 2,
    searchPhrase: "traffic calming measures",
    type: "Guide",
    systems: ["streetprint", "streetbond", "traffic-patterns-xd"],
    applications: ["traffic-calming", "crosswalks"],
    brief: "Cover the usual measures a municipality weighs (speed tables, raised crossings, curb extensions, narrowed lanes, gateway treatments) in plain words, then show where the surface does the work: the Idea Book's traffic-calming spread (page 54) — StreetPrint for traffic calming device treatments, StreetBond for sidewalks, pathways and plazas, TrafficPatternsXD for durable road surface treatments. Use 'speed table' naturally as a second phrase. Link the raised-crosswalk post if it exists by then. No speed-reduction percentages.",
  },
  {
    key: "asphalt-driveway-resurfacing",
    title: "Resurfacing an asphalt driveway: seal it, coat it, or stamp it",
    status: "idea",
    priority: 3,
    searchPhrase: "asphalt driveway resurfacing",
    type: "Guide",
    systems: ["streetprint", "durashield"],
    applications: ["private-driveways"],
    brief: "For homeowners with a grey, tired but sound asphalt driveway. Set out the three honest options — a seal (recurring), a maintenance coating (DuraShield, from the book), or reheating and stamping the existing asphalt with StreetPrint (the book's driveway spread, page 76: 'stone-paver looks, without demolition') — and how to tell which one the driveway needs. Link the existing driveway posts rather than repeating them. No prices.",
  },
  {
    key: "york-region-viva-brt",
    title: "York Region VIVA: red bus lanes on Highway 7",
    status: "idea",
    priority: 3,
    searchPhrase: "bus rapid transit red lanes",
    type: "Case Study",
    systems: ["mmax"],
    applications: ["bus-lanes"],
    brief: "REAL PROJECT — needs Doug before it is marked Ready: the year, what York Region needed, what was specified and why (MMAX, per the map pin), how the lanes were installed and how they have held up, and a photo of this installation. The drafter writes only what this brief and the Idea Book say; it must not invent the client's requirements or results. Audience: transit agencies and municipal engineers.",
  },
  {
    key: "kelowna-crosswalk-network",
    title: "Kelowna's crosswalk network, one intersection at a time",
    status: "idea",
    priority: 3,
    searchPhrase: "decorative crosswalks Kelowna",
    type: "Case Study",
    systems: ["traffic-patterns-xd"],
    applications: ["crosswalks"],
    brief: "REAL PROJECT — needs Doug before it is marked Ready: the years, how many crossings and where, what the City needed, why TrafficPatternsXD was specified (per the map pin), and a photo of the installation. The drafter writes only what this brief and the Idea Book say. Audience: municipal engineers in mid-sized cities.",
  },
];

async function main() {
  const products: { _id: string; slug: string }[] = await client.fetch(`*[_type == "product"]{ _id, "slug": slug.current }`);
  const apps: { _id: string; slug: string }[] = await client.fetch(`*[_type == "application"]{ _id, "slug": slug.current }`);
  const pid = new Map(products.map((p) => [p.slug, p._id]));
  const aid = new Map(apps.map((a) => [a.slug, a._id]));
  const missing = SEEDS.flatMap((s) => [
    ...s.systems.filter((x) => !pid.has(x)).map((x) => `${s.key}: system ${x}`),
    ...s.applications.filter((x) => !aid.has(x)).map((x) => `${s.key}: application ${x}`),
  ]);
  if (missing.length) { console.error(`ERROR: no Studio document for:\n  ${missing.join("\n  ")}`); process.exit(1); }

  const existing = new Set<string>(await client.fetch(`*[_type == "storyIdea"]._id`));
  for (const s of SEEDS) {
    const _id = `storyIdea-${s.key}`;
    if (existing.has(_id)) { console.log(`  = ${s.title} (already there; left as it is)`); continue; }
    const doc = {
      _id,
      _type: "storyIdea",
      title: s.title,
      status: s.status,
      priority: s.priority,
      searchPhrase: s.searchPhrase,
      type: s.type,
      systems: s.systems.map((x) => ({ _key: x, _type: "reference", _ref: pid.get(x)! })),
      applications: s.applications.map((x) => ({ _key: x, _type: "reference", _ref: aid.get(x)! })),
      brief: s.brief,
    };
    if (DRY) { console.log(`  + ${s.title} [${s.status}, priority ${s.priority}] (dry run)`); continue; }
    await client.createIfNotExists(doc);
    console.log(`  + ${s.title} [${s.status}, priority ${s.priority}]`);
  }
  console.log(DRY ? "\n(dry run — nothing written)" : "\nDone. Studio → Insights plan.");
}

main().catch((err) => { console.error(err); process.exit(1); });
