/**
 * Tests for the Product Book edition's data (lib/idea-book-edition.ts):
 * `npm run test:idea-book`. No network.
 *
 * What they protect: the edition covers the printed book once, every leaf
 * points at pages, jobs, articles and systems that exist, every photo is a
 * region of a real page, and no em dash reaches the page (docs/STYLE.md).
 */
import assert from "node:assert/strict";
import { LEAVES, leafTitle, pageLabel, systemEntry, type Leaf, type Photo } from "../lib/idea-book-edition";
import { catalogueTotal } from "../lib/catalogue";
import { mapProjects } from "../lib/map-projects";
import { PRINT_APPLICATIONS, PRINT_SYSTEMS } from "../lib/idea-book-print";
import { applications } from "../lib/applications";
import { products } from "../lib/products";
import { colourFamily } from "../lib/colours";
import blogIndex from "../lib/blog-index.json";

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

const slugs = new Set((blogIndex as { slug: string }[]).map((p) => p.slug));
const mapIds = new Set(mapProjects.map((p) => p.id));

function photosOf(leaf: Leaf): Photo[] {
  switch (leaf.kind) {
    case "cover": case "divider": case "system": case "steps": case "templates": case "application": case "statement": case "installer": case "back": return [leaf.photo];
    case "welcome": case "partner": return leaf.photos;
    case "then-now": return [leaf.before, leaf.after];
    case "projects": return leaf.items.map((i) => i.photo);
    default: return [];
  }
}

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

console.log("The printed book, covered once");
check("every page of the book is in exactly one leaf, in order", () => {
  const seen = new Map<number, string>();
  let last = 0;
  for (const leaf of LEAVES) {
    for (const p of leaf.pages) {
      assert.ok(p >= 1 && p <= catalogueTotal, `${leaf.id}: page ${p}`);
      assert.ok(p > last, `${leaf.id}: page ${p} comes after ${last}`);
      assert.ok(!seen.has(p), `page ${p} is in ${seen.get(p)} and ${leaf.id}`);
      seen.set(p, leaf.id);
      last = p;
    }
  }
  const missing = Array.from({ length: catalogueTotal }, (_, i) => i + 1).filter((p) => !seen.has(p));
  assert.deepEqual(missing, [], `pages missing: ${missing.join(", ")}`);
});
check("ids are unique and URL-safe", () => {
  const ids = LEAVES.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9-]+$/, id);
});
check("page labels read as printed", () => {
  assert.equal(pageLabel(LEAVES[0]), "1");
  assert.equal(pageLabel(LEAVES.find((l) => l.id === "streetbond")!), "24–25");
});

console.log("Every reference exists");
check("every photo is a region of a page of the book", () => {
  for (const leaf of LEAVES) for (const ph of photosOf(leaf)) {
    assert.ok(ph.page >= 1 && ph.page <= catalogueTotal, `${leaf.id}: page ${ph.page}`);
    assert.ok(leaf.pages.includes(ph.page), `${leaf.id}: photo page ${ph.page} is one of its pages`);
    const top = ph.top ?? 0, bottom = ph.bottom ?? 1;
    assert.ok(top >= 0 && bottom <= 1 && bottom - top >= 0.2, `${leaf.id}: page ${ph.page} region ${top}-${bottom}`);
    assert.ok(ph.alt.length > 10, `${leaf.id}: alt for page ${ph.page}`);
  }
});
check("every system leaf shows its printed page, and the page is one of the leaf's", () => {
  for (const leaf of LEAVES) if (leaf.kind === "system") {
    const { entry } = systemEntry(leaf.slug);
    assert.ok(leaf.pages.includes(entry.page), `${leaf.slug}: printed on ${entry.page}, leaf has ${leaf.pages}`);
    assert.equal(entry.specs.length, 4, `${leaf.slug}: four specs`);
    assert.ok(entry.uses.length >= 3, `${leaf.slug}: uses strip`);
  }
});
check("every printed system and application is a product or application page the site has", () => {
  for (const slug of Object.keys(PRINT_SYSTEMS)) assert.ok(products.some((p) => p.slug === slug), slug);
  const leafIds = new Set(LEAVES.map((l) => l.id));
  for (const [slug, e] of Object.entries(PRINT_APPLICATIONS)) {
    // A spread the site has no page for (Creative design) is keyed by its leaf.
    assert.ok(applications.some((a) => a.slug === slug) || leafIds.has(slug), slug);
    for (const line of e.specify) assert.ok(products.some((p) => p.slug === line.slug), `${slug}: specify ${line.slug}`);
  }
});
check("every printed application spread is one leaf, on its printed page", () => {
  const used = new Map<string, number>();
  for (const leaf of LEAVES) {
    const slug = leaf.kind === "application" ? leaf.slug ?? leaf.id : leaf.kind === "then-now" ? leaf.id : undefined;
    if (!slug || !PRINT_APPLICATIONS[slug]) continue;
    assert.equal(PRINT_APPLICATIONS[slug].page, leaf.pages[0], `${slug}: printed on ${PRINT_APPLICATIONS[slug].page}, leaf starts at ${leaf.pages[0]}`);
    used.set(slug, (used.get(slug) ?? 0) + 1);
  }
  for (const slug of Object.keys(PRINT_APPLICATIONS)) assert.equal(used.get(slug), 1, `${slug} is in ${used.get(slug) ?? 0} leaves`);
});
check("the printed specify lines reach the leaves, with their captions", () => {
  const crosswalks = LEAVES.find((l) => l.kind === "application" && l.slug === "crosswalks");
  assert.ok(crosswalks && crosswalks.kind === "application");
  assert.deepEqual(crosswalks.specify.map((s) => s.name), ["TrafficPatternsXD", "TrafficPatterns", "DecoMark"]);
  assert.deepEqual(crosswalks.caption, { place: "Brampton, Ontario" });
  const busLanes = LEAVES.find((l) => l.kind === "application" && l.slug === "bus-lanes");
  assert.ok(busLanes && busLanes.kind === "application");
  assert.equal(busLanes.caption?.place, "Vaughan, Ontario", "the book's caption, not the map pin's city");
});
check("every job named is on the homepage map", () => {
  for (const leaf of LEAVES) {
    const ids = leaf.kind === "projects" ? leaf.items.map((i) => i.mapId) : "mapId" in leaf ? [leaf.mapId] : [];
    for (const id of ids) if (id) assert.ok(mapIds.has(id), `${leaf.id}: ${id}`);
  }
});
check("every article linked is a live post", () => {
  for (const leaf of LEAVES) {
    const posts = leaf.kind === "projects" ? leaf.items.map((i) => i.post) : "post" in leaf ? [leaf.post] : [];
    for (const p of posts) if (p) assert.ok(slugs.has(p), `${leaf.id}: ${p}`);
  }
});
check("every colour family named exists", () => {
  for (const leaf of LEAVES) if (leaf.kind === "colours") for (const f of leaf.families) assert.ok(colourFamily(f), `${leaf.id}: ${f}`);
});
check("the ten systems are in the contents, in the book's order", () => {
  const contents = LEAVES.find((l): l is Extract<Leaf, { kind: "divider" }> => l.kind === "divider" && l.id === "systems")!.contents!;
  const systems = LEAVES.filter((l): l is Extract<Leaf, { kind: "system" }> => l.kind === "system").map((l) => l.slug);
  assert.deepEqual(contents.map((c) => c.slug), systems);
  for (const c of contents) assert.equal(c.page, LEAVES.find((l) => l.kind === "system" && l.slug === c.slug)!.pages[1]);
});

console.log("House style");
check("no em dash anywhere in the edition", () => {
  for (const leaf of LEAVES) for (const s of strings(leaf)) assert.ok(!s.includes("—"), `${leaf.id}: "${s.slice(0, 60)}"`);
  for (const s of strings(PRINT_SYSTEMS)) assert.ok(!s.includes("—"), `print: "${s.slice(0, 60)}"`);
  for (const s of strings(PRINT_APPLICATIONS)) assert.ok(!s.includes("—"), `print: "${s.slice(0, 60)}"`);
});
check("every leaf has a title for the contents", () => {
  for (const leaf of LEAVES) assert.ok(leafTitle(leaf).length > 1, leaf.id);
});

console.log(`\n${LEAVES.length} leaves for ${catalogueTotal} pages`);
if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
