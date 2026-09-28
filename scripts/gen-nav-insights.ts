/**
 * Writes lib/nav-insights.json: the Insights menu's cover story, latest
 * posts and sections (components/sections/Nav.tsx, the desktop panel and the
 * phone drawer).
 *
 * Runs in `npm run build` right after gen-blog-index. It reads the newest
 * published blogPost documents that have a featured photo, keeps only posts
 * this build publishes (lib/blog-index.json less the archived posts, so the
 * menu never links to a page that doesn't exist or redirects), and writes for
 * each one: slug, title, the stored type ("Case Study", "Blog"...; the menu
 * prints its own label), publishedAt, the date as the site prints it, the
 * excerpt (the cover story's deck), the read time exactly as the post page
 * prints it (Studio's "Read time", else the words in the body at 225 a
 * minute, lib/blog.ts), and Sanity CDN addresses at the sizes the menu shows
 * them.
 *
 * SECTIONS (28 Sep 2026): Projects, Guides and Articles, each with the line
 * the site already prints for it (INSIGHTS_SECTIONS in
 * lib/field-notes-taxonomy.ts, `blurb`) and the number of posts its page
 * lists: every live post, grouped by the section its type belongs to, as
 * getPostsBySection() in lib/blog.ts counts them. Nothing is typed by hand.
 *
 * The menu imports the file: no request at runtime, and nothing reads /public.
 *
 * COVER STORY: the newest post whose photo is landscape and at least 1200px
 * wide, so the menu's big picture is never an upscaled one. When no post
 * qualifies, the photo editor's pick (CHROME_COVER in lib/chrome-images.mjs),
 * baked by scripts/gen-chrome-images.mjs.
 *
 * PHOTOS: straight from cdn.sanity.io, cropped by the CDN to the box
 * (fit=crop) around the focal point Doug sets in Studio (the hotspot, as
 * fp-x/fp-y), in whatever format the browser takes (auto=format). Never
 * through /_next/image: the optimiser allowance ran out in August 2026
 * (lib/chrome-images.mjs).
 *
 * WHEN SANITY IS DOWN: the JSON is committed, so the build keeps the
 * checked-in copy, says so, and carries on; the menu is one build behind.
 * This script never fails a build (gen-blog-index already stops one that has
 * no posts). A copy is rewritten only when its content changes.
 *
 * Manually: npm run gen:nav-insights
 */
import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";
import { FIELD_NOTE_TYPES, INSIGHTS_SECTIONS, isArchivedPost, sectionFor } from "../lib/field-notes-taxonomy";
import { countWords, inferCategory, readTimeFor } from "../lib/blog-taxonomy";
import { CHROME_COVER, chromeImage } from "../lib/chrome-images.mjs";

const ROOT = process.cwd();
loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const OUT = path.join(ROOT, "lib", "nav-insights.json");
const BLOG_INDEX = path.join(ROOT, "lib", "blog-index.json");

// How many posts follow the cover story. The desktop panel shows four, the
// phone drawer the cover and two more.
const LATEST = 4;
// The cover's photo must be at least this wide (and wider than tall).
const COVER_MIN_WIDTH = 1200;
// Square thumbnail: 64px on screen, 1x to 3x.
const THUMB_WIDTHS = [64, 128, 192];
// Cover: 16:9, about 490px wide on a 1440 screen, 1x to 2x and a bit. Wider
// than 3:2 so the panel fits a 1366x768 laptop without scrolling.
const COVER_WIDTHS = [640, 960, 1280];
const COVER_ASPECT = 16 / 9;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

interface Hotspot { x?: number | null; y?: number | null }
interface Crop { top?: number | null; bottom?: number | null; left?: number | null; right?: number | null }
interface Row {
  _id: string;
  slug: string;
  title: string;
  category?: string | null;
  publishedAt: string;
  excerpt?: string | null;
  readTime?: string | null;
  text?: string | null;
  tableText?: (string | null)[] | null;
  image?: { ref?: string | null; hotspot?: Hotspot | null; crop?: Crop | null } | null;
}

// The fields a post card needs beyond its photo: the excerpt, and what the
// read time is worked out from (lib/blog.ts, META_FIELDS and toMeta).
const TEXT_FIELDS = `excerpt, readTime, "text": pt::text(body), "tableText": body[_type == "table"].rows[].cells[]`;

export interface NavImage { src: string; srcSet: string }
export interface NavPost {
  slug: string;
  title: string;
  /** The type as Sanity stores it: "Case Study", "Project Profile", "Guide", "White Paper" or "Blog". */
  type: string;
  publishedAt: string;
  /** As the site prints dates: "Sep 8, 2026", on a Toronto calendar. */
  date: string;
  /** Studio's excerpt, as written (may be empty). The cover story prints it as its deck. */
  excerpt: string;
  /** As the post page prints it: "6 min read". */
  readTime: string;
  thumb: NavImage;
}
export interface NavSection {
  key: string;
  /** The section's name, as its page's H1 prints it: "Projects". */
  label: string;
  href: string;
  /** The section's one line (INSIGHTS_SECTIONS `blurb`), as its cross-link card prints it. */
  blurb: string;
  /** The posts its page lists. */
  count: number;
}
export interface NavInsights {
  cover: (NavPost & { image: NavImage }) | null;
  latest: NavPost[];
  sections: NavSection[];
  /** Every live post: what /blog lists. */
  total: number;
}

/** Read time as lib/blog.ts works it out: Studio's, else the body's words at 225 a minute. */
function readTimeOf(r: Row): string {
  const stated = r.readTime?.trim();
  if (stated) return stated;
  const tables = (r.tableText ?? [])
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\*\*/g, "");
  return readTimeFor(countWords(`${r.text ?? ""} ${tables}`));
}

/** "image-<id>-<w>x<h>-<ext>" → the asset's parts. */
function parseRef(ref: string) {
  const m = /^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-([a-z0-9]+)$/.exec(ref);
  return m ? { id: m[1], width: Number(m[2]), height: Number(m[3]), ext: m[4] } : null;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The part of the photo Studio says to show: the crop rectangle in pixels
 * (whole image when none was set), and the hotspot as a focal point inside
 * that rectangle, which is how the CDN reads fp-x/fp-y once rect= is applied.
 */
function framing(image: NonNullable<Row["image"]>) {
  const asset = parseRef(image.ref ?? "");
  if (!asset) return null;
  const c = image.crop ?? {};
  const [l, r, t, b] = [c.left ?? 0, c.right ?? 0, c.top ?? 0, c.bottom ?? 0].map(clamp01);
  const rect = {
    left: Math.round(asset.width * l),
    top: Math.round(asset.height * t),
    width: Math.max(1, Math.round(asset.width * (1 - l - r))),
    height: Math.max(1, Math.round(asset.height * (1 - t - b))),
  };
  const cropped = rect.width !== asset.width || rect.height !== asset.height;
  const h = image.hotspot;
  const focal =
    h && typeof h.x === "number" && typeof h.y === "number"
      ? {
          x: clamp01((h.x - l) / Math.max(1e-6, 1 - l - r)),
          y: clamp01((h.y - t) / Math.max(1e-6, 1 - t - b)),
        }
      : null;
  return { asset, rect: cropped ? rect : null, width: rect.width, height: rect.height, focal };
}

type Framing = NonNullable<ReturnType<typeof framing>>;

function cdnUrl(f: Framing, w: number, h: number): string {
  const q: string[] = [];
  if (f.rect) q.push(`rect=${f.rect.left},${f.rect.top},${f.rect.width},${f.rect.height}`);
  q.push(`w=${w}`, `h=${h}`, "fit=crop");
  if (f.focal) q.push("crop=focalpoint", `fp-x=${f.focal.x.toFixed(3)}`, `fp-y=${f.focal.y.toFixed(3)}`);
  q.push("auto=format");
  const { id, width, height, ext } = f.asset;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${width}x${height}.${ext}?${q.join("&")}`;
}

/**
 * srcset over the widths the source can actually fill. A rung wider than the
 * photo is dropped rather than upscaled; the smallest always stays.
 */
function sized(f: Framing, widths: number[], aspect: number): NavImage {
  const usable = widths.filter((w, i) => i === 0 || (w <= f.width && Math.round(w / aspect) <= f.height));
  const url = (w: number) => cdnUrl(f, w, Math.round(w / aspect));
  return {
    src: url(usable[Math.min(1, usable.length - 1)]),
    srcSet: usable.map((w) => `${url(w)} ${w}w`).join(", "),
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TORONTO_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026-09-08T12:00:00Z" → "Sep 8, 2026", the day a reader in Canada would put on it. */
function printedDate(iso: string): string {
  const [y, m, d] = TORONTO_DAY.format(new Date(iso)).split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

async function main() {
  const rows = await client.fetch<Row[]>(
    `*[_type == "blogPost" && defined(slug.current) && defined(title) && defined(publishedAt) && defined(featuredImage.asset)]
      | order(publishedAt desc, slug.current asc)[0...40]{
        _id, "slug": slug.current, title, category, publishedAt, ${TEXT_FIELDS},
        "image": featuredImage{ "ref": asset._ref, hotspot, crop }
      }`
  );

  // Only posts this build publishes. gen-blog-index writes the list first;
  // without it (a bare checkout), every post Sanity returns is kept. An
  // archived post is never offered: its address redirects (lib/blog.ts).
  const built = readJson<{ slug: string }[]>(BLOG_INDEX);
  const builtSlugs = built ? new Set(built.map((p) => p.slug)) : null;
  const live = (slug: string) => (!builtSlugs || builtSlugs.has(slug)) && !isArchivedPost(slug);
  const types = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));
  const typeOf = (r: Pick<Row, "category">, slug: string, title: string) =>
    r.category && types.has(r.category) ? r.category : inferCategory(slug, title);

  const posts: { post: NavPost; frame: Framing }[] = [];
  for (const r of rows) {
    const slug = r.slug.trim();
    if (!/^[a-z0-9-]+$/.test(slug)) continue;
    if (!live(slug)) continue;
    const frame = r.image ? framing(r.image) : null;
    if (!frame) continue;
    const title = r.title.trim();
    posts.push({
      frame,
      post: {
        slug,
        title,
        type: typeOf(r, slug, title),
        publishedAt: r.publishedAt,
        date: printedDate(r.publishedAt),
        excerpt: (r.excerpt ?? "").trim(),
        readTime: readTimeOf(r),
        thumb: sized(frame, THUMB_WIDTHS, 1),
      },
    });
  }
  if (posts.length === 0) throw new Error("Sanity returned no published post with a photo");

  let coverIndex = posts.findIndex(({ frame }) => frame.width >= COVER_MIN_WIDTH && frame.width > frame.height);
  let cover: NavInsights["cover"] = null;
  if (coverIndex >= 0) {
    const { post, frame } = posts[coverIndex];
    cover = { ...post, image: sized(frame, COVER_WIDTHS, COVER_ASPECT) };
  } else {
    // No photo in Sanity is big enough to lead: the photo editor's pick,
    // served from the files gen-chrome-images bakes. It is fetched by slug,
    // since it need not be among the newest posts.
    coverIndex = posts.findIndex(({ post }) => post.slug === CHROME_COVER.slug);
    const pick = await client.fetch<Row | null>(
      `*[_type == "blogPost" && slug.current == $slug && defined(title) && defined(publishedAt)][0]{
        _id, "slug": slug.current, title, category, publishedAt, ${TEXT_FIELDS}
      }`,
      { slug: CHROME_COVER.slug }
    );
    if (pick && live(pick.slug)) {
      const title = pick.title.trim();
      cover = {
        slug: pick.slug,
        title,
        type: typeOf(pick, pick.slug, title),
        publishedAt: pick.publishedAt,
        date: printedDate(pick.publishedAt),
        excerpt: (pick.excerpt ?? "").trim(),
        readTime: readTimeOf(pick),
        thumb: chromeImage("post", CHROME_COVER.src),
        image: chromeImage("cover", CHROME_COVER.src),
      };
      console.warn(`  ! nav-insights: no post has a landscape photo ${COVER_MIN_WIDTH}px wide; the cover is the pick, ${pick.slug}`);
    } else {
      console.warn(`  ! nav-insights: no cover story (no qualifying photo, and the fallback pick, ${CHROME_COVER.slug}, is not a published post in this build)`);
    }
  }

  // Section counts: every live post, photo or not, filed by its type the way
  // gen-blog-index and lib/blog.ts file it, so each number is the length of
  // the list its section page shows.
  const all = await client.fetch<Pick<Row, "slug" | "title" | "category">[]>(
    `*[_type == "blogPost" && defined(slug.current) && defined(title) && defined(publishedAt)]
      | order(publishedAt desc, slug.current asc){ "slug": slug.current, title, category }`
  );
  const counted = new Set<string>();
  const counts = new Map<string, number>();
  for (const r of all) {
    const slug = r.slug.trim();
    if (!/^[a-z0-9-]+$/.test(slug) || counted.has(slug) || !live(slug)) continue;
    counted.add(slug);
    const key = sectionFor(typeOf(r, slug, r.title.trim())).key;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sections: NavSection[] = INSIGHTS_SECTIONS.map((s) => ({
    key: s.key,
    label: s.plural,
    href: `/blog/${s.slug}`,
    blurb: s.blurb,
    count: counts.get(s.key) ?? 0,
  }));

  const out: NavInsights = {
    cover,
    latest: posts.filter((_, i) => i !== coverIndex).slice(0, LATEST).map(({ post }) => post),
    sections,
    total: counted.size,
  };

  const next = JSON.stringify(out, null, 1) + "\n";
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (next !== current) fs.writeFileSync(OUT, next);
  console.log(
    `  ✓ lib/nav-insights.json: cover "${cover?.slug ?? "none"}", then ${out.latest.map((p) => p.slug).join(", ")}; ${sections.map((s) => `${s.label} ${s.count}`).join(", ")}${next === current ? " (unchanged)" : ""}`
  );
}

main().catch((err) => {
  const kept = fs.existsSync(OUT);
  console.warn(
    `  ! gen-nav-insights: ${err instanceof Error ? err.message : err}. ${kept ? "Keeping the checked-in lib/nav-insights.json." : "No lib/nav-insights.json to fall back on: the Insights menu will show no posts."}`
  );
  if (!kept) fs.writeFileSync(OUT, JSON.stringify({ cover: null, latest: [], sections: [], total: 0 }, null, 1) + "\n");
});
