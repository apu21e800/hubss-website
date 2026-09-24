/**
 * Generates lib/map-blog-projects.json and lib/map-count.json.
 *
 * The homepage map's pins are the curated entries in lib/map-projects.ts. A
 * curated pin whose photo lives in a post's folder (/images/blog/<slug>/…) is
 * that post's pin, and gains a "Read the write-up" link: this script finds
 * those links and counts the pins.
 *
 * Since Sep 2026 the blog lives in Sanity, so a post only gets its link if it
 * is published: lib/blog-index.json (written just before this, by
 * scripts/gen-blog-index.ts) is the list. Before the move, a post could also
 * make a pin of its own from map* keys in its .mdx frontmatter. No post ever
 * used them, and the files are gone, so that path went with them. Map pins in
 * Studio ("Projects (Map Pins)") are the way forward, once the map reads them.
 *
 * `projects` stays in the payload (always empty now) so lib/map-projects.ts
 * reads the same shape.
 *
 * Statting or globbing content/ from inside a page is not an option — see the
 * note at the top of gen-gallery-manifest.mjs. Hence a build-time JSON.
 *
 * Runs from the "build" script. Manually: npm run gen:map-blog
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const BLOG_INDEX = path.join(ROOT, "lib", "blog-index.json");
const CURATED = path.join(ROOT, "lib", "map-projects.ts");
const OUT = path.join(ROOT, "lib", "map-blog-projects.json");
const COUNT_OUT = path.join(ROOT, "lib", "map-count.json");

/**
 * Which slugs already have a curated pin.
 *
 * Read out of the image paths, which is how the link was expressed before this
 * script existed: a curated entry pointing at /images/blog/<slug>/… is that
 * post's pin. No edit to the curated file is needed for the link to work, and
 * none was made — the existing convention is simply now machine-readable.
 */
function curatedSlugs(src) {
  const slugs = new Set();
  for (const m of src.matchAll(/"\/images\/blog\/([^/"]+)\//g)) slugs.add(m[1]);
  return slugs;
}

/**
 * How many curated entries there are.
 *
 * Counted from the file rather than trusted to a constant, because the number
 * IS the bug this pass is fixing: the phone card advertised "84 projects" at a
 * moment when there were 59, forty pixels above a header reading "59 Projects
 * Mapped". A figure a visitor reads is a claim, and this project does not
 * publish claims nobody measured.
 */
function curatedCount(src) {
  const anchor = src.indexOf("const curatedProjects: MapProject[] = [");
  if (anchor === -1) {
    throw new Error(
      "gen-map-blog: could not find the curated array in lib/map-projects.ts. " +
        "It is declared as `const curatedProjects: MapProject[] = [` — if that " +
        "line was renamed, rename it here too."
    );
  }
  const body = src.slice(anchor);
  const n = [...body.matchAll(/^ {4}id: "/gm)].length;
  if (n < 10 || n > 500) {
    throw new Error(
      `gen-map-blog: counted ${n} curated map entries, which is not credible — ` +
        `the shape of lib/map-projects.ts has changed and this regex needs updating.`
    );
  }
  return n;
}

const curatedSrc = fs.readFileSync(CURATED, "utf8");
const alreadyMapped = curatedSlugs(curatedSrc);
const curated = curatedCount(curatedSrc);

if (!fs.existsSync(BLOG_INDEX)) {
  throw new Error("gen-map-blog: lib/blog-index.json is missing. scripts/gen-blog-index.ts writes it and runs first in npm run build.");
}
const published = new Set(JSON.parse(fs.readFileSync(BLOG_INDEX, "utf8")).map((p) => p.slug));
const linked = [...alreadyMapped].filter((slug) => published.has(slug)).sort();
const unlinked = [...alreadyMapped].filter((slug) => !published.has(slug)).sort();

const payload = {
  projects: [],
  /** slug → true for curated pins that have a published post to link to. */
  linkedSlugs: Object.fromEntries(linked.map((s) => [s, true])),
  /** Measured, never typed. The phone card and the header both read this. */
  totalCount: curated,
  curatedCount: curated,
  derivedCount: 0,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 1) + "\n");

// The count on its own, in its own file.
//
// CanadaMapWrapper is a client component that renders on every phone visit,
// and it needs exactly one number. Importing it from lib/map-projects.ts would
// pull the whole dataset into the initial bundle for visitors who never open
// the map — which is the precise cost the wrapper exists to avoid. Twenty-odd
// bytes instead.
fs.writeFileSync(COUNT_OUT, JSON.stringify({ count: payload.totalCount }) + "\n");

console.log(
  `  ✓ lib/map-blog-projects.json — ${payload.totalCount} pins, ${linked.length} linked to a published post`
);
if (unlinked.length) {
  console.warn(`  ! ${unlinked.length} curated pin(s) point at a post folder with no published post, so they get no "Read the write-up" link: ${unlinked.join(", ")}`);
}
