/**
 * Studio clean-up, 16 Oct 2026 (Vern: "please prepare it"), from the site QA
 * sweep the same day. Runs on Vern's PC: Sanity writes need the write token in
 * .env.local, which the cloud sessions do not have.
 *
 *   npx tsx scripts/studio-cleanup-2026-10-16.ts           # dry run: shows every change, writes nothing
 *   npx tsx scripts/studio-cleanup-2026-10-16.ts --apply   # writes them
 *
 * What it changes, each only while Studio still holds the value it replaces
 * (anything edited since is skipped and listed, never overwritten):
 *  1. The homepage's systems heading: "Six systems, six different jobs." to
 *     "Ten systems, ten different jobs.", as the Product Book counts them
 *     (Vern: "yes 10 systems"). The code fallback says the same since this commit.
 *  2. Three typos in the homepage product blurbs: "125mil", "Water based,
 *     epoxy modified", "schools, etc.".
 *  3. Search result text for 61 blog posts whose description (their excerpt)
 *     ran past 160 characters, and short titles for the 21 whose titles ran
 *     past 70: Studio's "Search result overrides" (seo.metaDescription,
 *     seo.metaTitle), only where those are empty. The excerpts and the titles
 *     on the page do not change.
 *
 * A post or product with an unpublished draft gets the same change in the
 * draft, so publishing the draft later does not undo it. Every write checks
 * the document's revision, so a document edited mid-run is left alone.
 * Not done here: the seven posts dated 8 Sep 2026 keep that date; it is the
 * date they were written for the new site (content/blog-archive), not a slip.
 */
import { createClient, type SanityClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import { flagSentences, describeIssue } from "../lib/style-lint";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local") });

const APPLY = process.argv.includes("--apply");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (APPLY && !token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local: nothing written.");
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "raw",
  token: token || undefined,
});

// ── 1. The homepage's systems heading
const HEADING = {
  id: "page-homepage",
  from: { heading: "Six systems,", headingAccent: "six different jobs." },
  to: { heading: "Ten systems,", headingAccent: "ten different jobs." },
};

// ── 2. Homepage product blurbs: [document, old text, new text]
const BLURBS: [string, string, string][] = [
  ["product-traffic-patterns", "factory-manufactured to 125mil and", "factory-manufactured to 125 mil and"],
  ["product-streetbond", "Water based, epoxy modified acrylic coatings", "Water-based, epoxy-modified acrylic coatings"],
  ["product-decomark", "community expression, schools, etc.", "community expression and schools."],
];

// ── 3. Search result text for blog posts, by slug: t = title (only where the
// post title ran past 70 characters), d = description (at most 160).
const SEO: Record<string, { t?: string; d: string }> = {
  "asphalt-concrete-renewal": { t: "Renew before you replace: asphalt and concrete restoration", d: "Replacing failed asphalt or concrete is costly and disruptive. How DuraShield, StreetBond and StreetPrint extend pavement life and improve its look." },
  "bc-childrens-hospital-labyrinth": { d: "StreetBond coatings and DecoMark markings made playful decorative paving and a labyrinth at BC Women & Children's Hospital in Vancouver." },
  "best-crosswalks-canada": { d: "TrafficPatternsXD gives Canadian municipalities and commercial parking lots durable, decorative, safe crosswalks, with over 15 years of proven performance." },
  "bowen-island-asphalt-path": { d: "A public art path at Snug Cove on Bowen Island, coated in StreetBond150 with custom colours for forest, sunset, water and earth." },
  "branded-crosswalks-vancouver-richmond": { t: "Branded crosswalks in Vancouver and Richmond: a case study", d: "How DecoMark and TrafficPatterns turned Commercial Drive in Vancouver and Brighouse Station in Richmond into safer, more vibrant civic landmarks." },
  "commercial-applications": { d: "How Cadillac Fairview used TrafficPatternsXD to give Fairview Park in Kitchener a heritage brick streetscape built for heavy traffic and universal access." },
  "commercial-parking-reit-specification": { d: "Commercial parking is brand real estate. How Canada's leading property managers use surface systems to cut maintenance costs and raise asset value." },
  "commercial-spaces-decorative-pavement": { t: "Decorative surface systems for commercial properties", d: "Retail entries, parking lots and plazas are a customer's first experience of a property. How decorative pavement is changing commercial real estate." },
  "community-branding-case-study": { d: "How Polygon Realty used StreetPrint stamped asphalt to give the roads and driveways of Windsor Gate in Coquitlam a distinctive brick look." },
  "community-identity-surface-design": { t: "How surface design builds community identity", d: "How municipalities, universities and First Nations use crosswalks, plazas and pathways for civic storytelling, culture and neighbourhood identity." },
  "community-spaces": { t: "Celebrating Little Italy on Commercial Drive", d: "How DecoMark and TrafficPatterns brought Vancouver's Little Italy to life with Italian flag crosswalks and surface branding on Commercial Drive." },
  "complete-streets-new-westminster": { d: "Front Street Mews in New Westminster: a pedestrian-friendly complete streets redevelopment with one continuous TrafficPatterns and StreetBond150 hardscape." },
  "corporate-logos-branded-pavement": { t: "Custom pavement graphics for corporate campuses", d: "From campus entries to branded retail courts, DecoMark thermoplastic puts print-quality graphics on pavement: UV-stable, skid-resistant and built to last." },
  "cycling-transit-integration-surface-solutions": { t: "Cycling and transit integration with lasting surfaces", d: "How London, Ontario used red MMAX and TrafficPatternsXD on the East London Link BRT to fit protected bike lanes alongside transit, in every season." },
  "decorative-asphalt-crosswalks": { d: "HUB Surface Systems' decorative asphalt crosswalks, from premium stamped thermoplastic to cost-effective coatings, designed for safety and durability." },
  "decorative-asphalt-high-traffic": { d: "When Emery Village BIA's pavers failed under heavy trucks, TrafficPatternsXD matched the original design with a fraction of the maintenance." },
  "decorative-crosswalk-commercial-drive": { d: "Three intersections on Vancouver's Commercial Drive in Italian flag colours, made with DecoMark and TrafficPatterns to celebrate Little Italy." },
  "decorative-crosswalks-community-identity": { d: "In the right hands a crosswalk becomes a statement about who a community is. How decorative surfaces are redefining civic identity across Canada." },
  "decorative-hardscape-grey-is-new-black": { t: "Grey is the new black: decorative hardscape in neutral tones", d: "How TrafficPatterns, TrafficPatternsXD and StreetBond bring durable, high-visibility designs in neutral tones to crosswalks, driveways, lots and plazas." },
  "decorative-paving-solutions": { d: "How StreetBond and DecoMark turn streets, plazas and public spaces into expressive places that build civic identity, improve safety and extend surface life." },
  "durable-coatings-waterparks": { d: "StreetBond is the coating of choice for bold splash pad designs: slip-resistant, durable and available in any UV-stable colour." },
  "durable-transit-lanes-crossings": { t: "Why Canadian cities are moving transit lanes past paint", d: "London's East London Link BRT and Toronto's TTC corridors replaced painted lanes with MMAX and TrafficPatternsXD, ending decades of repainting." },
  "educational-facilities": { d: "How UBC worked with Musqueam staff, elders and community members on a landmark TrafficPatterns crosswalk at University Boulevard and Wesbrook Mall." },
  "extending-transit-lane-lifespan": { d: "How MMAX, TrafficPatternsXD and StreetBond150 extend pavement life and cut maintenance costs for the TTC, East London Link, VIVA and Brighouse Station." },
  "how-stamped-asphalt-is-installed": { d: "StreetPrint goes into the pavement already there: no removal, no repaving. The three-step process, what each step needs, and which surfaces suit it." },
  "hub-certified-installer-network": { d: "Specifying a decorative surface is the easy half. How HUB's certified installer network covers the installation, province by province." },
  "keeping-pedestrians-safe": { d: "Canadian municipalities show surface treatments cut crashes without reconstruction. TrafficPatternsXD ends the paint-and-patch cycle with 8+ years of service." },
  "laneway-project": { d: "StreetBond coatings turn neglected laneways in Toronto and Vancouver into vibrant public spaces, through The Laneway Project and More Awesome Now." },
  "london-east-link-brt": { d: "London needed pedestrian safety and dedicated transit lanes in one corridor. TrafficPatternsXD and red MMAX each did the job it is built for." },
  "multimodal-connectivity-york-region": { d: "How TrafficPatternsXD and MMAX supported Complete Streets and Vision Zero on the VIVA BRT in York Region and the East London Link in London, Ontario." },
  "municipalities-case-study": { d: "How Toronto and the Laneway Project used StreetBond150 to turn underused laneways into welcoming public spaces, starting in Leslieville." },
  "pedestrian-channelization-public-spaces": { d: "Promenades in Burlington, Montreal and Victoria show how StreetBond150 coatings make durable, architecturally flexible pedestrian surfaces." },
  "pedestrian-walkways-surface-systems": { t: "Surface systems for walkways, greenways and urban trails", d: "How municipalities and parks departments use decorative coatings and stamped asphalt to make pathways into civic amenities, with a decade-plus of service." },
  "performance-crosswalks-asphalt-concrete": { d: "TrafficPatternsXD is the performance crosswalk of choice for Canadian cities: Kelowna has installed over 80 crosswalks in 13 years." },
  "pictograph-crosswalk-sechelt": { d: "Indigenous artists Dionne Paul and Lindsey Kyoko Adams told the origin story of the shíshálh Nation in a TrafficPatterns crosswalk in Sechelt, BC." },
  "playgrounds-recreation": { d: "How StreetBond150 turns dull school playgrounds into bright, safe, engaging spaces without full resurfacing, improving activity and behaviour." },
  "residential-driveways-stamped-asphalt": { t: "Why stamped asphalt driveways outperform interlocking stone", d: "Interlocking stone looks great on day one. Five years in come weeds, shifting pavers and spring pressure washing. Why stamped asphalt is the smarter choice." },
  "residential-driveways-stamped-asphalt-upgrade": { d: "Plain asphalt greys and pavers heave. Stamped asphalt has performed on Canadian streets for 30+ years and costs a fraction of what you'd expect." },
  "safety-durability-transit-stations": { d: "How TrafficPatternsXD gives GrandLinq LRT in Waterloo and VIVA in York Region safer, more durable platforms and crossings with lower maintenance." },
  "simcoe-rainbow-crosswalk": { d: "In Simcoe, Ontario, a young resident's two-year fundraising campaign led to a TrafficPatternsXD rainbow crosswalk, a lasting symbol of inclusion." },
  "snowplow-safe-decorative-pavement": { d: "Plow blades, road salt and freeze-thaw decide whether a decorative surface survives in Canada. What makes a surface plow-safe, and what does not." },
  "spirit-trail-wayfinding-vancouver": { d: "DuraTherm crosswalks and DecoMark wayfinding markings bring branding and directions to the 35 km Spirit Trail greenway on Vancouver's North Shore." },
  "stamped-asphalt-vs-concrete": { t: "Stamped asphalt vs decorative concrete in Canadian climates", d: "In Canadian climates stamped asphalt outperforms decorative concrete, at lower installed and lifecycle cost and with far more freeze-thaw resilience." },
  "streetbond-leed-urban-heat-island": { t: "StreetBondSR and urban heat island mitigation", d: "How solar-reflective coatings contribute to LEED credits, cut surface temperatures by up to 30°F and support sustainable design in Canadian projects." },
  "streetbondsr-solar-reflective-coatings": { t: "StreetBondSR in Osoyoos: solar reflective pavement", d: "Osoyoos, BC used StreetBondSR to reduce heat island effect across parks and paths. How high-SRI coatings work, and why municipal specs now call for them." },
  "surface-signage-wayfinding": { d: "As cities cut visual clutter and pedestrians look down, ground-level signage and wayfinding is becoming one of the urban designer's most effective tools." },
  "the-street-is-your-canvas": { d: "Why the surfaces we walk on matter, and why HUB Surface Systems has spent 27 years giving Canadian communities ways to say something with their streets." },
  "thermoplastic-colour-selection": { d: "Thirty-seven thermoplastic colours, sixty-three coating colours, twenty-three MMA colours and Pantone matching. How to narrow them for a real spec." },
  "toronto-premium-outlets-14-years": { d: "A retail crossing at Halton Hills has carried shoppers, delivery trucks and Ontario winters for 14 years. The TrafficPatternsXD is still doing its job." },
  "traffic-calming-surface-design": { t: "Traffic calming through surface design", d: "How stamped asphalt, coloured thermoplastic and patterned pavement measurably cut speeds at intersections and pedestrian zones, without speed bumps." },
  "trafficpatternsxd-urban-design": { t: "Heritage crosswalks in Woodbridge with TrafficPatternsXD", d: "Woodbridge needed crosswalks true to its heritage district that survive winters and plows. TrafficPatternsXD: brick looks, no raised edges, lasting wear." },
  "transportation-infrastructure-guide": { t: "Technical resources for public works and engineering teams", d: "Technical guidance and case studies for public works directors, transportation engineers and urban designers on Complete Streets and transit corridors." },
  "ubc-musqueam-crosswalk": { d: "A feature crosswalk at UBC in TrafficPatterns, designed by UBC and Musqueam together, welcomes arrivals at University Boulevard and Wesbrook Mall." },
  "university-campus-surface-branding": { t: "Campus identity at street level", d: "From UBC's Musqueam crosswalk to logos at campus entries, Canadian universities use pavement to express identity, guide pedestrians and honour partnerships." },
  "vancouver-decorative-crosswalk-design": { d: "Surface design for UBC, Commercial Drive and Granville & 41st: crosswalks, wayfinding and plazas that build district identity in durable thermoplastic." },
  "veterans-crosswalk-kitchener": { t: "Veterans crosswalk in Kitchener in TrafficPatterns", d: "Kitchener's Veterans Crosswalk is a permanent Remembrance Day tribute in TrafficPatterns thermoplastic: high-contrast, skid-resistant, built to outlast paint." },
  "vision-zero-surface-markings": { d: "As Canadian cities adopt Vision Zero, high-visibility pavement markings are emerging as one of the most cost-effective pedestrian safety tools." },
  "vision-zero-thermoplastic-crosswalks": { t: "Vision Zero crosswalks: moving beyond traffic paint", d: "Painted crosswalks lose retroreflectivity fast, worst in wet weather when visibility matters most. Why thermoplastic is now the Vision Zero standard." },
  "white-paper-resilient-transit-infrastructure": { d: "A strategic guide for public works directors: surfaces that extend marking life, reduce maintenance costs and improve multimodal safety on transit corridors." },
  "white-paper-transportation-urban-design": { t: "White paper: a technical guide for transportation engineers", d: "A technical guide for transportation engineers and urban designers on resilient, low-maintenance transit corridors built with advanced surfacing systems." },
  "white-rock-langley-trafficpatterns": { d: "How White Rock's Seaside Stroll and Langley's Railroad Heritage crosswalks use TrafficPatterns thermoplastic to make lasting community landmarks." },
};

type Change = { id: string; label: string; set: Record<string, string>; setIfMissing?: Record<string, unknown>; rev: string };
const changes: Change[] = [];
const skipped: string[] = [];
let styleProblems = 0;

function style(label: string, text: string) {
  for (const f of flagSentences(text)) {
    for (const issue of f.issues) {
      styleProblems++;
      console.log(`  style  ${label}: ${describeIssue(issue)}  "${f.text}"`);
    }
  }
}

/** The published document and its draft, if any. */
async function withDraft<T extends { _id: string; _rev: string }>(id: string, projection: string): Promise<T[]> {
  return client.fetch<T[]>(`*[_id in [$id, $draft]]${projection}`, { id, draft: `drafts.${id}` });
}

async function main() {
  // 1. Heading
  {
    const docs = await withDraft<{ _id: string; _rev: string; s?: { heading?: string; headingAccent?: string } }>(HEADING.id, "{_id, _rev, \"s\": homepageSections.systems}");
    for (const d of docs) {
      if (d.s?.heading === HEADING.from.heading && d.s?.headingAccent === HEADING.from.headingAccent) {
        changes.push({ id: d._id, rev: d._rev, label: "homepage systems heading", set: { "homepageSections.systems.heading": HEADING.to.heading, "homepageSections.systems.headingAccent": HEADING.to.headingAccent } });
      } else if (d.s?.heading !== HEADING.to.heading) {
        skipped.push(`${d._id}: systems heading is "${d.s?.heading} ${d.s?.headingAccent}", left as it is`);
      }
    }
  }
  // 2. Blurbs
  for (const [id, from, to] of BLURBS) {
    const docs = await withDraft<{ _id: string; _rev: string; homepageBlurb?: string }>(id, "{_id, _rev, homepageBlurb}");
    if (!docs.length) skipped.push(`${id}: not found`);
    for (const d of docs) {
      const now = d.homepageBlurb ?? "";
      if (now.includes(from)) {
        const next = now.replace(from, to);
        style(`${d._id} blurb`, next);
        changes.push({ id: d._id, rev: d._rev, label: `${id} homepage blurb`, set: { homepageBlurb: next } });
      } else if (!now.includes(to)) {
        skipped.push(`${d._id}: blurb no longer contains "${from}", left as it is`);
      }
    }
  }
  // 3. Blog search text
  const posts = await client.fetch<{ _id: string; _rev: string; slug: string; seo?: { metaTitle?: string; metaDescription?: string } }[]>(
    `*[_type == "blogPost" && slug.current in $slugs]{_id, _rev, "slug": slug.current, seo}`,
    { slugs: Object.keys(SEO) }
  );
  const found = new Set(posts.map((p) => p.slug));
  for (const slug of Object.keys(SEO)) if (!found.has(slug)) skipped.push(`blog/${slug}: no such post`);
  for (const p of posts) {
    const want = SEO[p.slug];
    const set: Record<string, string> = {};
    if (want.d.length > 160) throw new Error(`${p.slug}: description is ${want.d.length} characters`);
    if (want.t && want.t.length > 60) throw new Error(`${p.slug}: title is ${want.t.length} characters`);
    if (!p.seo?.metaDescription?.trim()) set["seo.metaDescription"] = want.d;
    else if (p.seo.metaDescription.trim() !== want.d) skipped.push(`${p._id}: already has a search description, left as it is`);
    if (want.t) {
      if (!p.seo?.metaTitle?.trim()) set["seo.metaTitle"] = want.t;
      else if (p.seo.metaTitle.trim() !== want.t) skipped.push(`${p._id}: already has a search title, left as it is`);
    }
    if (!Object.keys(set).length) continue;
    for (const [k, v] of Object.entries(set)) style(`${p._id} ${k}`, v);
    changes.push({ id: p._id, rev: p._rev, label: `blog/${p.slug} search text`, set, setIfMissing: { seo: {} } });
  }

  console.log(`\n${changes.length} documents to change${APPLY ? "" : " (dry run: nothing written)"}:`);
  for (const c of changes) {
    console.log(`  ${c.label}${c.id.startsWith("drafts.") ? " (draft)" : ""}`);
    for (const [k, v] of Object.entries(c.set)) console.log(`      ${k} = ${v}`);
  }
  if (skipped.length) {
    console.log(`\nLeft alone (${skipped.length}):`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  if (styleProblems) console.log(`\n${styleProblems} house-style notes above (warnings only).`);
  if (!APPLY) {
    console.log("\nDry run. Run again with --apply to write.");
    return;
  }

  let written = 0;
  for (const c of changes) {
    let patch = client.patch(c.id).ifRevisionId(c.rev);
    if (c.setIfMissing) patch = patch.setIfMissing(c.setIfMissing);
    try {
      await patch.set(c.set).commit({ autoGenerateArrayKeys: true });
      written++;
    } catch (err) {
      console.log(`  NOT written: ${c.label} (${err instanceof Error ? err.message : err})`);
    }
  }
  console.log(`\nWritten: ${written} of ${changes.length}. The site picks them up within minutes.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
