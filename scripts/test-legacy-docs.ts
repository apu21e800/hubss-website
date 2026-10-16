/**
 * `npm run test:redirects`: every old spec-sheet address in
 * lib/legacy-doc-redirects.ts lands on a PDF that is really in /public/docs,
 * and the addresses Search Console showed the most clicks for are covered.
 * No network.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CURRENT_DOCS, KNOWN, legacyDocRedirects, literal, TO_PAGE } from "../lib/legacy-doc-redirects";
import { products } from "../lib/products";

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`);
  }
}

const PUBLIC = path.join(process.cwd(), "public");
const redirects = legacyDocRedirects();

check("every destination is a file in /public/docs, or a system's page that exists", () => {
  for (const r of redirects) {
    if (r.destination.startsWith("/products/")) {
      assert.ok(products.some((p) => `/products/${p.slug}` === r.destination), `${r.source} -> ${r.destination}`);
      continue;
    }
    const file = path.join(PUBLIC, decodeURIComponent(r.destination));
    assert.ok(fs.existsSync(file), `${r.source} -> ${r.destination}`);
  }
});
check("an old sheet sent to its system's page has no copy here (a file added later takes over)", () => {
  const firstPage = redirects.findIndex((r) => !r.destination.startsWith("/docs/"));
  assert.ok(firstPage > 0, "system-page rules exist");
  assert.ok(redirects.slice(firstPage).every((r) => !r.destination.startsWith("/docs/")), "they all come after the file rules");
  for (const from of Object.keys(TO_PAGE)) {
    const name = from.slice(from.lastIndexOf("/") + 1);
    assert.ok(!CURRENT_DOCS.some((d) => d.endsWith(`/${name}`)), `${name} is in /public/docs: drop it from TO_PAGE`);
  }
});
check("the StreetBond safety data sheets land on the StreetBond page until HUB sends current ones", () => {
  const sds = redirects.filter((r) => /SDS-StreetBond/.test(r.source));
  assert.equal(sds.length, 3);
  for (const r of sds) assert.equal(r.destination, "/products/streetbond");
});
check("every hand-matched old address points at a current PDF", () => {
  for (const [from, to] of Object.entries(KNOWN)) assert.ok(CURRENT_DOCS.includes(to), `${from} -> ${to}`);
});
check("no source is listed twice", () => {
  const sources = redirects.map((r) => r.source);
  assert.equal(new Set(sources).size, sources.length);
});

// The old addresses with the most Google clicks, Jun 2025 to Oct 2026.
const TOP = [
  "/wp-content/uploads/2023/03/MMAX-Product-Data.pdf",
  "/wp-content/uploads/2023/03/SB150-AL-Pavement-Coating-Part-A-B-TDS.pdf",
  "/wp-content/uploads/2023/03/TrafficPatternsXD-Specification-Branded.pdf",
  "/wp-content/uploads/2023/03/DuraShield-Pavement-Coating-Part-A-B-Color-Solar-Gray-TDS.pdf",
  "/wp-content/uploads/2023/03/StreetBond-SB150-Over-Concrete-Specification.pdf",
  "/wp-content/uploads/2023/03/SB120-Pavement-Coating-Part-A-B.pdf",
  "/wp-content/uploads/2023/03/TrafficPaint-for-Airfields.pdf",
  "/wp-content/uploads/2023/03/StreetBond-Pro-220-TDS.pdf",
  "/wp-content/uploads/2024/09/Application_Instructions_MMAX_Corundum_Area_Markings.pdf",
  "/wp-content/uploads/2023/03/StreetBond-QS-Concrete-TDS-1.pdf",
  "/wp-content/uploads/2023/03/StreetBond-Concrete-Primer-WB-TDS.pdf",
];

/** Does a redirect source (literal, or with the :year/:month params) match this path? */
function matches(source: string, p: string): boolean {
  const m = /^\/wp-content\/uploads\/\d{4}\/\d{2}\/(.+)$/.exec(p);
  const generic = m ? `/wp-content/uploads/:year(\\d{4})/:month(\\d{2})/${literal(m[1])}` : null;
  return source === literal(p) || source === generic;
}

check("the old sheets Google sent people to most are covered", () => {
  for (const p of TOP) {
    const hit = redirects.find((r) => matches(r.source, p));
    assert.ok(hit, `${p} has no rule`);
  }
});

console.log(`\n${redirects.length} redirects for ${CURRENT_DOCS.length} current PDFs and ${Object.keys(KNOWN).length} renamed ones`);
if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
