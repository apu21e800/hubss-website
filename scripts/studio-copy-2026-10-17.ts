/**
 * Studio copy fixes from the 17 Oct 2026 copy review (claude/HUBSS-copy-review-2026-10-17.md
 * in the Claude project; the line-by-line list is the review doc Doug ticks).
 * Runs on Vern's PC: Sanity writes need the write token in .env.local.
 *
 *   npx tsx scripts/studio-copy-2026-10-17.ts                         # dry run: every change, writes nothing
 *   npx tsx scripts/studio-copy-2026-10-17.ts --only=claims           # dry run of one group
 *   npx tsx scripts/studio-copy-2026-10-17.ts --apply --only=claims   # writes that group
 *   npx tsx scripts/studio-copy-2026-10-17.ts --apply                 # writes every group
 *
 * Groups (each ships on its own yes):
 *   claims    the four lines nobody can source: PreMark "Provincially approved",
 *             Playgrounds "safe to fall on", Airports/AirMark helipads and jet
 *             blast, Crosswalks "Halifax to Vancouver" (Vern's yes)
 *   products  the product pages' facts against the makers' sheets: how each
 *             system goes in, colours, times, terms (Doug's ticks)
 *   chrome    the homepage cards, About and the footer line (Vern's yes)
 *
 * SUPERSEDED IN PART, the same day. The `claims` and `products` groups patched
 * product and application documents; since the 17 Oct batch that followed
 * (copy/book-words), every one of those fixes is in lib/products.ts and
 * lib/applications.ts, the code-first source, and reaches Studio whole with
 * `npm run sync:products` and `npm run sync:applications` (docs/SANITY-COPY-SYNC.md).
 * Run the syncs, not these two groups: after a sync every change in them is
 * skipped as already gone. `chrome` still stands: the homepage cards, About
 * and the footer line are Studio-only page documents the syncs do not write.
 *   npx tsx scripts/studio-copy-2026-10-17.ts --apply --only=chrome
 *
 * Every change names the exact text it replaces and is skipped (and listed)
 * when Studio no longer holds it, so an edit made since is never overwritten.
 * A document with an unpublished draft gets the same change in the draft.
 * Every write checks the document's revision (ifRevisionId).
 * Rich text (product and application "description") is patched inside its
 * spans; the block keys and marks stay as they are.
 */
import { createClient, type SanityClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import { flagSentences, describeIssue } from "../lib/style-lint";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local") });

const APPLY = process.argv.includes("--apply");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) ?? "--only=").slice(7).split(",").filter(Boolean);
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

type Group = "claims" | "products" | "chrome";
/** A text change: `from` must appear exactly once in the field; `to` replaces it. An empty `to` cuts the text. */
type Change = { group: Group; id: string; field: string; from: string; to: string; why: string };

const CHANGES: Change[] = [
  // ── claims: no source, so they come off ─────────────────────────────────
  { group: "claims", id: "product-premark", field: "description", from: " Provincially approved across Canada.", to: "", why: "no source; approvals are per province, by product list" },
  { group: "claims", id: "application-playgrounds", field: "description", from: "Both systems deliver surfaces that are safe to fall on, easy to clean, and designed to remain bright and engaging season after season without repainting.", to: "Both are easy to clean and stay bright season after season without repainting.", why: "a coating is not an impact surface (CSA Z614 is a different thing)" },
  { group: "claims", id: "application-airports", field: "description", from: "Taxiway centrelines, apron designations, holding position signs, helipad markings, and other non-runway airside surfaces", to: "Taxiway centrelines, apron designations, holding position signs and other non-runway airside surfaces", why: "helipads are not on AirMark's sheet (PPG TS007)" },
  { group: "claims", id: "product-airmark", field: "description", from: "AirMark is preformed thermoplastic for airfield markings on taxiways, aprons, helipads and other non-runway surfaces.", to: "AirMark is preformed thermoplastic for airfield markings on taxiways, aprons, ramps and other non-runway surfaces.", why: "helipads are not on AirMark's sheet; ramps are (PPG TS007)" },
  { group: "claims", id: "product-airmark", field: "description", from: "Certified crews heat-apply it, and it stands up to jet blast, snow clearing and rubber removal treatments.", to: "Certified crews heat-apply it, and it resists aviation and motor fuels, lubricants and de-icers.", why: "jet blast and rubber removal are not on the sheet; the fuels and de-icers are (PPG TS007)" },
  { group: "claims", id: "application-crosswalks", field: "description", from: "Specified by municipalities from Halifax to Vancouver.", to: "Specified by municipalities across Canada.", why: "no Halifax job in the map, the book or the posts" },
  { group: "claims", id: "product-airmark", field: "specs", from: "Taxiways, aprons, helipads, non-runway airfield surfaces", to: "Taxiways, aprons, ramps, non-runway airfield surfaces", why: "helipads are not on AirMark's sheet (PPG TS007)" },

  // ── products: the makers' sheets ────────────────────────────────────────
  { group: "products", id: "product-traffic-patterns", field: "description", from: "factory-made to your design at 125 mil and heat-fused into asphalt or concrete so it becomes part of the road.", to: "factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface.", why: "surface-applied (PPG TS001)" },
  { group: "products", id: "product-traffic-patterns", field: "description", from: "Anti-skid aggregate is intermixed through the full cross-section, not broadcast across the top, so the grip lasts as long as the colour.", to: "Anti-skid aggregate is intermixed through the full cross-section, so the grip lasts as long as the colour.", why: "the book's line (p. 11)" },
  { group: "products", id: "product-traffic-patterns", field: "description", from: "Customisable to community artwork: the same material carries a standard crossing, an entrance feature and an Indigenous-designed crosswalk.", to: "Custom designs to fit with the community: the same material carries a standard crossing, an entrance feature and an Indigenous-designed crosswalk.", why: "the book's line (p. 11)" },
  { group: "products", id: "product-traffic-patterns", field: "description", from: "for crosswalks, entrance features, parks and retail.", to: "for crosswalks, entrance features, parks and parking lots.", why: "the book's uses (p. 11)" },
  { group: "products", id: "product-traffic-patterns-xd", field: "description", from: "It is heat-fused into asphalt or concrete, not laid on it, which is what makes it hold under plow blades, road salt and the freeze-thaw that follows.", to: "It is heated on the asphalt and stamped through into its surface, which is what makes it hold under plow blades, road salt and the freeze-thaw that follows.", why: "stamped into asphalt, asphalt only (PPG TS002)" },
  { group: "products", id: "product-traffic-patterns-xd", field: "description", from: "with anti-skid aggregate rated 8–9 on the Mohs scale running through the full cross-section", to: "with anti-skid aggregate of 8 to 9 on the Mohs hardness scale (diamond is 10) running through the full cross-section", why: "say the scale once" },
  { group: "products", id: "product-traffic-patterns-xd", field: "description", from: "specified by Canadian transit authorities, municipalities and stakeholders across Canada", to: "specified by Canadian transit authorities, municipalities and commercial stakeholders across Canada", why: "the book's line (p. 13)" },
  { group: "products", id: "product-traffic-patterns-xd", field: "specs", from: "Heat-fused to asphalt or concrete", to: "Heated and stamped into asphalt", why: "PPG TS002; the spec's label \"Bond\" stays" },
  { group: "products", id: "product-streetbond", field: "description", from: "cracking, premature wear and slipperiness.", to: "cracking, premature wear and being slippery in wet conditions.", why: "the book's line (p. 25)" },
  { group: "products", id: "product-streetbond", field: "description", from: "It is the coating that locks in every StreetPrint pattern", to: "It is the coating that colours every StreetPrint pattern", why: "a coating colours and protects; it locks nothing in" },
  { group: "products", id: "product-streetbond", field: "description", from: "A life cycle of 8+ years, and easily refreshed", to: "A service life of 8+ years, and easily refreshed", why: "one term: service life" },
  { group: "products", id: "product-streetbond", field: "specs", from: "Moves with the pavement: no cracking, no peeling", to: "Flexes with the pavement instead of cracking or peeling", why: "GAF's promise carries a condition; this says what it does" },
  { group: "products", id: "product-streetbond", field: "seo.description", from: "StreetBond is a high-quality pavement coating system that transforms ordinary asphalt and concrete surfaces into vibrant, durable, and functional surfaces for streets, commercial spaces, and public facilities.", to: "StreetBond is a water-based, epoxy-modified acrylic pavement coating for asphalt and concrete: 63 standard colours, custom matching, 8+ years in Canadian service.", why: "209 characters and a machine tell; this is 154" },
  { group: "products", id: "product-streetbondsr", field: "description", from: "StreetBondSR is StreetBond formulated to reflect rather than absorb: the same flexible chemistry, engineered for cooler surfaces.", to: "StreetBondSR is StreetBond colours formulated to reflect rather than absorb.", why: "the book's line (p. 29)" },
  { group: "products", id: "product-streetbondsr", field: "description", from: "with a life cycle of 8+ years.", to: "with a service life of 8+ years.", why: "one term: service life" },
  { group: "products", id: "product-streetbondsr", field: "seo.description", from: "Solar reflective, LEED-aligned coatings for asphalt and concrete that reduce urban heat island effect and support sustainable hardscape design across Canada.", to: "Solar-reflective StreetBond colours with a solar reflectance of 0.33 or higher: cooler parking lots, plazas and schoolyards, and LEED v5 heat-island credits.", why: "157 characters and \"sustainable hardscape design\"; this is 150" },
  { group: "products", id: "product-duratherm", field: "description", from: "DuraTherm is thermoplastic heat-fused into a stamped surface.", to: "DuraTherm is thermoplastic set into a stamped surface and heat-fused to it.", why: "the book's subhead (p. 35): in a stamped surface, not into" },
  { group: "products", id: "product-duratherm", field: "description", from: "nothing for a plow blade to catch, nothing to trip on, no shear damage through winter maintenance.", to: "nothing for a plow blade to catch, nothing to trip on. Reflective options.", why: "the book's line (p. 35); \"shear damage\" is jargon" },
  { group: "products", id: "product-duratherm", field: "description", from: "Specified for crosswalks, speed bumps, traffic calming and identity work", to: "Specified for crosswalks, speed tables and traffic calming", why: "PPG TS003: crosswalks and traffic-calming surfaces; speed bumps are a parking-lot device" },
  { group: "products", id: "product-durashield", field: "description", from: "extending the life cycle of the pavement instead of replacing it", to: "extending the service life of the pavement instead of replacing it", why: "the book's line (p. 37)" },
  { group: "products", id: "product-premark", field: "description", from: "yield triangles, school legends, bike symbols and ladder lines", to: "yield markings, school legends, bike symbols and ladder crosswalks", why: "the road's words (Peterborough spec, Toronto policy)" },
  { group: "products", id: "product-premark", field: "description", from: "Heat-applied by torch: no stencils, no curing window, drive on immediately.", to: "Heat-applied by torch, with no preheating of the road: no stencils, no curing window, drive on immediately.", why: "PPG TS005: no surface preheating, year-round" },
  { group: "products", id: "product-mmax", field: "shortDesc", from: "MMA area markings. Methyl methacrylate. Fast installation. Built for Canada.", to: "MMA area markings. Fast installation. Built for tough environments.", why: "the book's subhead (p. 33); says MMA once" },
  { group: "products", id: "product-mmax", field: "description", from: "red bus lanes, green bike lanes, transit-priority corridors and traffic-calming zones.", to: "red bus lanes, green bike lanes, transit priority lanes and traffic-calming zones.", why: "plain words" },
  { group: "products", id: "product-mmax", field: "description", from: "stop pads, turning movements and queue jumps.", to: "bus stops, turns and queue-jump lanes.", why: "plain words" },
  { group: "products", id: "product-decomark", field: "description", from: "factory-fabricated to your vector artwork in the TrafficPatterns colour palette (standard and premium options), then heat-fused to asphalt or concrete.", to: "made in the factory from your artwork (a vector file) in standard and premium colours, then heat-applied to asphalt or concrete.", why: "DecoMark has its own standard colours (PPG TS004); the book says standard and premium options" },
  { group: "products", id: "product-decomark", field: "description", from: "It sits flush to grade, slip-resistant, and stays bright in every season.", to: "It is slip-resistant and stays bright in every season.", why: "surface-applied material is not flush to grade (PPG TS004)" },
  { group: "products", id: "product-airmark", field: "specs", from: "White and yellow", to: "Red, white, yellow, black and pink", why: "five standard colours (PPG TS007)" },
  { group: "products", id: "product-chipfill", field: "shortDesc", from: "Heat-activated preformed material for permanent pothole repair. Year-round, all-weather.", to: "Thermoplastic chips bonded with a torch, for pothole repair. Year-round, all-weather.", why: "loose chips, not preformed sheets (Geveko; Alberta Transportation listing)" },
  { group: "products", id: "product-chipfill", field: "description", from: "ChipFill is laid into the prepared excavation and activated with a propane torch, so it needs no specialized equipment and no hot-mix plant.", to: "ChipFill is thermoplastic chips, poured into the prepared hole in lifts of 15 mm (to 50 mm deep) and bonded with a propane torch, so it needs no specialized equipment and no hot-mix plant.", why: "Geveko; the Alberta Transportation listing's limits" },
  { group: "products", id: "product-chipfill", field: "specs", from: "Heat-activated preformed pothole repair material", to: "Thermoplastic chips, bonded with a torch", why: "Geveko" },
  { group: "products", id: "product-fast-patch", field: "shortDesc", from: "Back in service in under an hour.", to: "Back in service in about an hour in warm weather.", why: "WVCO data sheet: one hour at 21°C, longer in the cold" },
  { group: "products", id: "product-fast-patch", field: "description", from: "With minimal site preparation, a repair is back in service in less than 45 minutes, and the optional Fast Patch Kicker accelerator shortens the cure in cooler conditions so the work can go on year-round.", to: "With minimal site preparation, a repair is back in service in about an hour at 21°C (longer in the cold), and the optional Fast Patch Kicker accelerator shortens the cure in cooler conditions. It is applied from 4°C.", why: "WVCO data sheet: 1 h at 21°C, 3 to 4 h at 10°C; 4 to 40°C" },
  { group: "products", id: "product-fast-patch", field: "description", from: "bonding to the surrounding pavement with excellent freeze-thaw resistance and impact absorption.", to: "bonding to the surrounding pavement, with freeze-thaw resistance.", why: "impact absorption is not on the sheet" },
  { group: "products", id: "product-fast-patch", field: "specs", from: "Return to service in <45 minutes", to: "Return to service in about 1 hour at 21°C", why: "WVCO data sheet" },

  // ── chrome: the homepage cards, About, the footer ───────────────────────
  { group: "chrome", id: "page-homepage", field: "homepageSections.audiences[0].desc", from: "Crosswalks, transit corridors and plazas: Vision Zero aligned, accessible, installed by certified crews coast to coast.", to: "Crosswalks, transit corridors and plazas: built for Vision Zero programs, accessible, installed by certified crews coast to coast.", why: "a program, not a standard" },
  { group: "chrome", id: "page-homepage", field: "homepageSections.audiences[2].desc", from: "HUB certifies, trains and supports its installer network across Canada.", to: "HUB trains and certifies its installers across Canada.", why: "plainer" },
  { group: "chrome", id: "page-homepage", field: "homepageSections.systems.intro", from: "Stamped asphalt, preformed thermoplastic and coatings, chosen by what the surface has to take. Turning asphalt and concrete into your signature surface.", to: "Stamped asphalt, preformed thermoplastic and coatings, chosen by what the surface has to take.", why: "the second sentence is filler (26 Sep proposal)" },
  { group: "chrome", id: "page-about", field: "aboutStory[1]", from: "each one installed to spec by certified applicators that HUB trains and authorizes.", to: "each one installed to spec by certified installers that HUB trains and authorizes.", why: "HUB's word is installer" },
  { group: "chrome", id: "page-about", field: "aboutPartnersIntro", from: "HUB is an authorized distributor and applicator partner for the manufacturers behind its systems.", to: "HUB is an authorized distributor and installer for the manufacturers behind its systems.", why: "HUB's word is installer" },
  { group: "chrome", id: "page-about", field: "aboutPartners[0].desc", from: "StreetBond, StreetBondSR (solar reflective), DuraShield, and MMAX.", to: "StreetBond, StreetBondSR (solar reflective) and DuraShield.", why: "MMAX is Ennis-Flint by PPG, not GAF" },
  { group: "chrome", id: "page-about", field: "aboutPartners[1].desc", from: "including TrafficPatterns, TrafficPatternsXD, PreMark, AirMark, DuraTherm, and DecoMark. Their preformed thermoplastic systems are the gold standard for high-durability pavement markings across Canada.", to: "including TrafficPatterns, TrafficPatternsXD, PreMark, AirMark, DuraTherm, DecoMark and MMAX.", why: "MMAX belongs here; \"gold standard\" is praise" },
];

type Doc = Record<string, unknown> & { _id: string; _rev: string };
type Op = { id: string; rev: string; label: string; set: Record<string, unknown> };
const ops: Op[] = [];
const skipped: string[] = [];
let styleNotes = 0;

/** Replace `from` with `to` exactly once in a string; null when it is not there once. */
function replaceOnce(text: string, from: string, to: string): string | null {
  const i = text.indexOf(from);
  if (i < 0 || text.indexOf(from, i + 1) >= 0) return null;
  return (text.slice(0, i) + to + text.slice(i + from.length)).replace(/\s{2,}/g, " ").replace(/\s+([.,;:])/g, "$1").trim();
}

/** Portable text: the change inside one span, everything else as it was. */
function patchBlocks(blocks: unknown, from: string, to: string): unknown[] | null {
  if (!Array.isArray(blocks)) return null;
  let hits = 0;
  const next = blocks.map((b) => {
    if (!b || typeof b !== "object" || !Array.isArray((b as { children?: unknown[] }).children)) return b;
    const block = b as { children: { text?: string }[] };
    return {
      ...block,
      children: block.children.map((c) => {
        if (typeof c.text !== "string" || !c.text.includes(from)) return c;
        const t = replaceOnce(c.text, from, to);
        if (t === null) return c;
        hits++;
        return { ...c, text: t };
      }),
    };
  });
  return hits === 1 ? next : null;
}

/** Specs: the change inside one row's value. */
function patchSpecs(specs: unknown, from: string, to: string): unknown[] | null {
  if (!Array.isArray(specs)) return null;
  let hits = 0;
  const next = specs.map((s) => {
    const row = s as { value?: string };
    if (typeof row.value !== "string" || !row.value.includes(from)) return s;
    const v = replaceOnce(row.value, from, to);
    if (v === null) return s;
    hits++;
    return { ...row, value: v };
  });
  return hits === 1 ? next : null;
}

/** Read a dotted path with [n] indexes off a document. */
function getAt(doc: unknown, field: string): unknown {
  return field.split(".").reduce<unknown>((cur, part) => {
    if (cur === null || cur === undefined) return undefined;
    const m = part.match(/^(\w+)\[(\d+)\]$/);
    if (m) {
      const arr = (cur as Record<string, unknown>)[m[1]];
      return Array.isArray(arr) ? arr[Number(m[2])] : undefined;
    }
    return (cur as Record<string, unknown>)[part];
  }, doc);
}

async function main() {
  const groups = ONLY.length ? ONLY : ["claims", "products", "chrome"];
  const wanted = CHANGES.filter((c) => groups.includes(c.group));
  const ids = [...new Set(wanted.map((c) => c.id))];
  const docs = await client.fetch<Doc[]>(`*[_id in $ids || _id in $drafts]`, { ids, drafts: ids.map((i) => `drafts.${i}`) });
  const byId = new Map(docs.map((d) => [d._id, d]));
  for (const id of ids) if (!byId.has(id)) skipped.push(`${id}: not found`);

  for (const d of docs) {
    const base = d._id.replace(/^drafts\./, "");
    const mine = wanted.filter((c) => c.id === base);
    const set: Record<string, unknown> = {};
    const labels: string[] = [];
    for (const c of mine) {
      // Later changes to the same field build on the earlier ones in this run.
      const current = getAt({ ...d, ...set }, c.field);
      let next: unknown = null;
      if (c.field === "description") next = patchBlocks(current, c.from, c.to);
      else if (c.field === "specs") next = patchSpecs(current, c.from, c.to);
      else if (typeof current === "string") next = replaceOnce(current, c.from, c.to);
      if (next === null) {
        const already = typeof current === "string" ? current.includes(c.to) && c.to !== "" : JSON.stringify(current ?? "").includes(c.to) && c.to !== "";
        skipped.push(`${d._id} ${c.field}: ${already ? "already says it" : `no longer holds "${c.from.slice(0, 60)}"`}, left as it is`);
        continue;
      }
      // Rich text and arrays are set whole (only the changed span differs); strings by path.
      const top = c.field.split(/[.[]/)[0];
      if (c.field === "description" || c.field === "specs") set[c.field] = next;
      else if (c.field.includes("[") || c.field.includes(".")) set[top] = patchPath(set[top] ?? d[top], c.field.slice(top.length), next);
      else set[c.field] = next;
      labels.push(`${c.field}: ${c.why}`);
      const shown = typeof next === "string" ? next : JSON.stringify(next);
      for (const f of flagSentences(typeof next === "string" ? next : c.to)) for (const issue of f.issues) { styleNotes++; console.log(`  style  ${d._id} ${c.field}: ${describeIssue(issue)}`); }
      void shown;
    }
    if (Object.keys(set).length) ops.push({ id: d._id, rev: d._rev, label: labels.join("; "), set });
  }

  console.log(`\n${ops.length} documents to change${APPLY ? "" : " (dry run: nothing written)"}, groups: ${groups.join(", ")}`);
  for (const o of ops) {
    console.log(`\n  ${o.id}${o.id.startsWith("drafts.") ? " (draft)" : ""}`);
    for (const c of wanted.filter((c) => c.id === o.id.replace(/^drafts\./, ""))) {
      if (!o.label.includes(`${c.field}: ${c.why}`)) continue;
      console.log(`    ${c.field}`);
      console.log(`      - ${c.from}`);
      console.log(`      + ${c.to || "(cut)"}`);
    }
    // The field as it will read, so a reviewer sees the whole paragraph, not the diff alone.
    for (const [field, value] of Object.entries(o.set)) {
      if (field === "description" && Array.isArray(value)) {
        const text = value.map((b) => ((b as { children?: { text?: string }[] }).children ?? []).map((c) => c.text ?? "").join("")).join("\n");
        console.log(`    reads: ${text}`);
      } else if (field === "specs" && Array.isArray(value)) {
        console.log(`    specs: ${value.map((r) => `${(r as { label?: string }).label}: ${(r as { value?: string }).value}`).join(" | ")}`);
      } else if (typeof value === "string") {
        console.log(`    reads: ${value}`);
      }
    }
  }
  if (skipped.length) {
    console.log(`\nLeft alone (${skipped.length}):`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  if (styleNotes) console.log(`\n${styleNotes} house-style notes above (warnings only).`);
  if (!APPLY) {
    console.log("\nDry run. Run again with --apply (and --only=<group>) to write.");
    return;
  }
  let written = 0;
  for (const o of ops) {
    try {
      await client.patch(o.id).ifRevisionId(o.rev).set(o.set).commit({ autoGenerateArrayKeys: true });
      written++;
    } catch (err) {
      console.log(`  NOT written: ${o.id} (${err instanceof Error ? err.message : err})`);
    }
  }
  console.log(`\nWritten: ${written} of ${ops.length}. The site picks them up within minutes.`);
}

/** Set a value at a sub-path ("[0].desc", ".systems.intro") inside a copy of `obj`. */
function patchPath(obj: unknown, sub: string, value: unknown): unknown {
  const parts = sub.replace(/^\./, "").split(/\.(?![^[]*\])/).flatMap((p) => {
    const m = p.match(/^(\w*)\[(\d+)\](.*)$/);
    return m ? [m[1], Number(m[2]), ...(m[3] ? m[3].replace(/^\./, "").split(".") : [])].filter((x) => x !== "") : [p];
  });
  const walk = (cur: unknown, i: number): unknown => {
    if (i === parts.length) return value;
    const key = parts[i];
    if (typeof key === "number") {
      const arr = Array.isArray(cur) ? [...cur] : [];
      arr[key] = walk(arr[key], i + 1);
      return arr;
    }
    const o = cur && typeof cur === "object" ? { ...(cur as Record<string, unknown>) } : {};
    o[key] = walk(o[key], i + 1);
    return o;
  };
  return walk(obj, 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
