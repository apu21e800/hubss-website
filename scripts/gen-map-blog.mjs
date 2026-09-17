/**
 * Generates lib/map-blog-projects.json — map pins derived from blog posts.
 *
 * WHY THIS EXISTS: there was no connection at all between a blog post and a
 * pin on the homepage map. The 59 pins were hand-typed into
 * lib/map-projects.ts, and the only thing tying a pin to its post was that
 * somebody had typed an image path pointing into that post's folder. Publish a
 * project write-up and the map did not know. By September 2026 there were 74
 * posts and 29 of them referenced, with documented installations — Geary Works
 * in Toronto, the London East Link BRT, fourteen years of Toronto Premium
 * Outlets — written up on the site and absent from the map of the site's
 * projects.
 *
 * Now: a post that states where it is gets a pin, automatically, on the next
 * deploy. Add these six keys to the frontmatter and the map picks it up:
 *
 *   mapCity: "Toronto"
 *   mapProvince: "ON"              # two-letter code
 *   mapLat: 43.6710
 *   mapLng: -79.4400
 *   mapProduct: "DecoMark"         # exactly as the product is branded
 *   mapApplication: "Community Branding"
 *
 * Optional: mapYear ("2023"), and mapRepresentative: true when the post's
 * featured image is HUB work in the same system rather than a photograph of
 * this installation — the pin then carries the "Representative" tag, the same
 * honesty rule the curated entries follow.
 *
 * A post with SOME of those keys but not all is a mistake, not a preference,
 * so it is reported loudly at build time rather than silently skipped.
 *
 * Curated entries in lib/map-projects.ts still win: if a post's slug already
 * has a curated pin, the curated copy stays and the post is only linked to it.
 * Curated entries carry hand-written problem/solution prose that a blog post
 * does not have in a machine-readable form.
 *
 * Statting or globbing content/ from inside a page is not an option — see the
 * note at the top of gen-gallery-manifest.mjs. Hence a build-time JSON.
 *
 * Runs from the "build" script. Manually: npm run gen:map-blog
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const BLOG = path.join(ROOT, "content", "blog");
const CURATED = path.join(ROOT, "lib", "map-projects.ts");
const OUT = path.join(ROOT, "lib", "map-blog-projects.json");
const COUNT_OUT = path.join(ROOT, "lib", "map-count.json");

/** Minimal frontmatter reader — `key: value`, quoted or bare, no nesting. */
function frontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[kv[1]] = v;
  }
  return out;
}

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

const REQUIRED = ["mapCity", "mapProvince", "mapLat", "mapLng", "mapProduct", "mapApplication"];

const curatedSrc = fs.readFileSync(CURATED, "utf8");
const alreadyMapped = curatedSlugs(curatedSrc);
const curated = curatedCount(curatedSrc);

const files = fs.existsSync(BLOG)
  ? fs.readdirSync(BLOG).filter((f) => f.endsWith(".mdx")).sort()
  : [];

const derived = [];
const linked = [];
const partial = [];

for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  const fm = frontmatter(fs.readFileSync(path.join(BLOG, file), "utf8"));
  const present = REQUIRED.filter((k) => fm[k] !== undefined && fm[k] !== "");

  if (present.length === 0) continue;
  if (present.length < REQUIRED.length) {
    partial.push({ slug, missing: REQUIRED.filter((k) => !present.includes(k)) });
    continue;
  }
  if (alreadyMapped.has(slug)) {
    // Curated entry wins; the post is simply linked to it.
    linked.push(slug);
    continue;
  }

  const lat = Number(fm.mapLat);
  const lng = Number(fm.mapLng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    partial.push({ slug, missing: ["mapLat/mapLng are not numbers"] });
    continue;
  }

  derived.push({
    id: slug,
    title: fm.title ?? slug,
    city: fm.mapCity,
    province: fm.mapProvince,
    lat,
    lng,
    product: fm.mapProduct,
    application: fm.mapApplication,
    ...(fm.mapYear ? { year: String(fm.mapYear) } : {}),
    images: fm.featuredImage ? [fm.featuredImage] : [],
    ...(String(fm.mapRepresentative) === "true" ? { imageIsRepresentative: true } : {}),
    excerpt: fm.excerpt ?? "",
    // The post is the long form. The modal links to it rather than duplicating
    // it, which is the point of deriving the pin from the post at all.
    problem: "",
    solution: "",
    slug,
  });
}

const payload = {
  projects: derived,
  /** slug → true for curated pins that have a post to link to. */
  linkedSlugs: Object.fromEntries([...alreadyMapped].sort().map((s) => [s, true])),
  /** Measured, never typed. The phone card and the header both read this. */
  totalCount: curated + derived.length,
  curatedCount: curated,
  derivedCount: derived.length,
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
  `  ✓ lib/map-blog-projects.json — ${payload.totalCount} pins ` +
    `(${curated} curated, ${derived.length} from blog posts, ${linked.length} posts linked to a curated pin)`
);
for (const p of partial) {
  console.warn(
    `  ! content/blog/${p.slug}.mdx has map frontmatter but is missing: ${p.missing.join(", ")} — no pin created`
  );
}
