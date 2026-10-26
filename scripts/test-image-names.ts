/**
 * The descriptive filenames on Sanity photo URLs (lib/sanity-image.ts) and
 * the addresses the pages and the image sitemap share (lib/photos.ts).
 *
 *   npm run test:images
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseCsv } from "./lib/csv";
import { FILENAME_MAX, imageFilename, sanityAssetFile, slugForFilename, withFilename } from "../lib/sanity-image";
import { GALLERY, galleryImageSrc, heroImageSrc, sanityCrop, sanityLoader, sanitySized, sanitySrcSet, sanityTurn } from "../lib/photos";
import { honestPhoto, seoAlt } from "../lib/image-seo";
import { IMAGE_FACTS } from "../lib/image-facts";

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL  ${name}`);
    throw e;
  }
}

const ASSET = "https://cdn.sanity.io/images/9dbro2m1/production/66b2ab440130ad9d9262b1d1e21becbc21442b24-1920x1200.jpg";
const TURNED = "https://cdn.sanity.io/images/9dbro2m1/production/20a1b10d182d393b96800eb4b44743690bdf39f8-2400x1800.jpg";

test("lowercase ASCII words joined by hyphens", () => {
  assert.equal(slugForFilename("UBC Musqueam crosswalk, Vancouver"), "ubc-musqueam-crosswalk-vancouver");
  assert.equal(slugForFilename("  TrafficPatterns® crosswalk · Québec  "), "trafficpatterns-crosswalk-quebec");
  assert.equal(slugForFilename("BC Children's Hospital & Labyrinth"), "bc-childrens-hospital-and-labyrinth");
  assert.equal(slugForFilename("--Red bars--"), "red-bars");
  assert.equal(slugForFilename("日本"), "");
  assert.equal(slugForFilename(undefined), "");
});

test("at most 60 characters, cut at a word boundary", () => {
  const long = "The UBC Musqueam crosswalk at the University of British Columbia campus entrance in Vancouver";
  const name = slugForFilename(long);
  assert.equal(name, "the-ubc-musqueam-crosswalk-at-the-university-of-british");
  assert.ok(name.length <= FILENAME_MAX);
  assert.ok(!name.endsWith("-"));
  // Exactly 60 then a hyphen: kept whole.
  const sixty = "a".repeat(29) + " " + "b".repeat(30);
  assert.equal(slugForFilename(sixty + " c"), "a".repeat(29) + "-" + "b".repeat(30));
  // One word longer than the limit is cut where it stands.
  assert.equal(slugForFilename("x".repeat(80)), "x".repeat(60));
});

test("falls back from the alt to the title to the slug, then to nothing", () => {
  assert.equal(imageFilename("", "  ", "Geary Works walkway", "geary-works"), "geary-works-walkway");
  assert.equal(imageFilename(null, undefined, "geary-works-toronto"), "geary-works-toronto");
  assert.equal(imageFilename(null, ""), "");
});

test("names the asset path and leaves the query alone", () => {
  assert.equal(withFilename(ASSET, "UBC Musqueam crosswalk, Vancouver"), `${ASSET}/ubc-musqueam-crosswalk-vancouver.jpg`);
  assert.equal(
    withFilename(`${ASSET}?rect=0,0,1600,1000&w=640&h=360&fit=crop&crop=focalpoint&fp-x=0.420&fp-y=0.610&auto=format`, "Crosswalk"),
    `${ASSET}/crosswalk.jpg?rect=0,0,1600,1000&w=640&h=360&fit=crop&crop=focalpoint&fp-x=0.420&fp-y=0.610&auto=format`,
  );
  // A name already there is replaced, not doubled.
  assert.equal(withFilename(`${ASSET}/old-name.jpg?w=828`, "New name"), `${ASSET}/new-name.jpg?w=828`);
  // No text: the bare address. Not Sanity: unchanged.
  assert.equal(withFilename(`${ASSET}?w=828`, "", null), `${ASSET}?w=828`);
  assert.equal(withFilename("/images/hero/hero-1.jpg", "Hero"), "/images/hero/hero-1.jpg");
  assert.equal(withFilename("https://example.com/a.jpg", "A"), "https://example.com/a.jpg");
});

test("the asset file is read past the name", () => {
  assert.equal(sanityAssetFile(`${ASSET}/ubc.jpg?w=1`), "66b2ab440130ad9d9262b1d1e21becbc21442b24-1920x1200.jpg");
  assert.equal(sanityAssetFile(ASSET), "66b2ab440130ad9d9262b1d1e21becbc21442b24-1920x1200.jpg");
  assert.equal(sanityAssetFile("/images/hero/hero-1.jpg"), "");
  // A turned photo stays turned under its name.
  assert.equal(sanityTurn(withFilename(TURNED, "Splash pad")), 90);
  assert.match(sanitySized(TURNED, 1200, 80, "Splash pad"), /\/splash-pad\.jpg\?or=90&h=1200&q=80&auto=format&fit=max$/);
});

test("the builders keep their widths and parameters; only the path gains the name", () => {
  const bare = sanitySrcSet(ASSET, [828, 1200, 1920, 2560], 82);
  const named = sanitySrcSet(ASSET, [828, 1200, 1920, 2560], 82, "UBC Musqueam crosswalk");
  assert.equal(named, bare.split(`${ASSET}?`).join(`${ASSET}/ubc-musqueam-crosswalk.jpg?`));
  assert.equal(sanityCrop(ASSET, 780, 878, { x: 0.4, y: 0.6 }, 80, "UBC"), sanityCrop(ASSET, 780, 878, { x: 0.4, y: 0.6 }, 80).replace(".jpg?", ".jpg/ubc.jpg?"));
  assert.equal(heroImageSrc({ src: ASSET, alt: "UBC" }), `${ASSET}/ubc.jpg?w=1920&q=82&auto=format&fit=max`);
});

test("a gallery photo's address is the one its tile or fallback <img> carries", () => {
  const named = withFilename(ASSET, "Coloured bike lane");
  // First tile (16:9), q80; the other tiles q78; past the first screen, the noscript copy.
  assert.equal(galleryImageSrc(ASSET, "Coloured bike lane", 0, 30), sanityLoader({ src: named, width: GALLERY.srcWidth, quality: 80 }));
  assert.equal(galleryImageSrc(ASSET, "Coloured bike lane", 6, 30), sanityLoader({ src: named, width: GALLERY.srcWidth, quality: 78 }));
  assert.equal(galleryImageSrc(ASSET, "Coloured bike lane", 7, 30), sanitySized(named, 1200, 80));
  // Ten photos: all ten are tiles (no button for three or fewer left over).
  assert.equal(galleryImageSrc(ASSET, "x", 9, 10), sanityLoader({ src: withFilename(ASSET, "x"), width: GALLERY.srcWidth, quality: 78 }));
});


// The gallery lines (lib/image-seo.ts honestLine, lib/image-facts.ts from the
// captions sheet, 26 Oct 2026): every line the facts can make reads as a
// caption, names a real system once, and spells the province out.
const SYSTEMS = ["StreetPrint", "StreetBond", "StreetBondSR", "TrafficPatterns", "TrafficPatternsXD", "DecoMark", "DuraTherm", "PreMark", "MMAX", "DuraShield", "AirMark", "ChipFill", "AggreFill", "Fast Patch DPR"];
test("every gallery line the facts make is a clean caption", () => {
  const bad: string[] = [];
  for (const [file, fact] of Object.entries(IMAGE_FACTS)) {
    const line = seoAlt(file, "");
    if (!line) continue;
    if (fact.system && !SYSTEMS.includes(fact.system)) bad.push(`${file}: unknown system ${fact.system}`);
    if (/\s{2}|undefined|null|,\s*,|,\s*$|\bQuébec\b|, (?:BC|ON|QC|AB|YT)$/.test(line)) bad.push(`${file}: ${line}`);
    if (/[—!]|\bvs\b/.test(line)) bad.push(`${file}: ${line}`);
    const names = SYSTEMS.filter((n) => new RegExp(`\\b${n}\\b`).test(line));
    if (names.length > 1 && !(names.includes("StreetBond") && names.includes("StreetBondSR"))) bad.push(`${file}: two systems: ${line}`);
    if (line[0] !== line[0].toUpperCase()) bad.push(`${file}: lowercase start: ${line}`);
  }
  assert.deepEqual(bad, []);
});

test("a documented photo's line carries its system and place; a person's Studio line stays", () => {
  assert.equal(seoAlt("/images/applications/crosswalks/crosswalks-110.jpg", ""), "TrafficPatternsXD decorative crosswalk, Oakville, Ontario");
  // A product folder's photo keeps its product, whatever else the records say.
  assert.match(seoAlt("/images/products/streetprint/streetprint-25.jpg", ""), /^StreetPrint stamped asphalt/);
  const typed = honestPhoto({ src: "https://cdn.sanity.io/x.jpg", alt: "Doug's own words", origin: "/images/applications/crosswalks/crosswalks-110.jpg" });
  assert.equal(typed.alt, "Doug's own words");
  const bare = honestPhoto({ src: "https://cdn.sanity.io/x.jpg", alt: "Decorative crosswalk", origin: "/images/applications/crosswalks/crosswalks-110.jpg" });
  assert.equal(bare.alt, "TrafficPatternsXD decorative crosswalk, Oakville, Ontario");
});

// DecoMark and PreMark are graphics and markings ON a surface: a line never
// puts them in front of a surface word as if they were the path, the plaza or
// the lane, and only MMA, a road marking or no system names a bus lane
// marking (26 Oct 2026: "DecoMark park path surface" was live for an hour).
test("a graphic or a marking is never the surface it sits on", () => {
  const bad: string[] = [];
  for (const file of Object.keys(IMAGE_FACTS)) {
    const line = seoAlt(file, "").split(",")[0];
    if (/^(DecoMark|PreMark|AirMark) .*\b(surface|paving|surface treatment|coloured bike lane)$/.test(line)) bad.push(`${file}: ${line}`);
    if (/bus lane marking$/.test(line) && !/^(MMAX|PreMark) |^Bus lane marking$/.test(line)) bad.push(`${file}: ${line}`);
  }
  assert.deepEqual(bad, []);
  assert.equal(seoAlt("/images/applications/parks-paths/parks-paths-101.png", ""), "DecoMark graphics on a park path, North Vancouver, British Columbia");
  assert.equal(seoAlt("/images/applications/bike-lanes/bike-lanes-25.jpg", ""), "PreMark bike lane markings");
  assert.equal(seoAlt("/images/applications/sport-courts/sport-courts-16.jpg", ""), "DecoMark graphics on a sport court, Anjou, Montréal, Quebec");
  // A surfacing system is still the surface: its line is unchanged.
  assert.equal(seoAlt("/images/applications/parks-paths/parks-paths-51.jpg", ""), "StreetPrint park path surface");
});

// The captions sheet is what Doug reviews: its "proposed line" must be the
// line the site prints (scripts/gen-image-facts.ts fills it).
test("the captions sheet proposes the line the site prints", () => {
  const sheet = parseCsv(readFileSync(path.join(process.cwd(), "docs/site-audits/gallery-captions-2026-10-26.csv"), "utf8"));
  assert.ok(sheet.length > 1000, `the sheet has ${sheet.length} rows`);
  const off = sheet.filter((r) => r["proposed line"] !== seoAlt(r.file, "")).map((r) => `${r.file}: sheet "${r["proposed line"]}", site "${seoAlt(r.file, "")}"`);
  assert.deepEqual(off.slice(0, 5), [], `${off.length} rows differ; run npx tsx scripts/gen-image-facts.ts`);
});

console.log(`image names: ${passed} passed`);
