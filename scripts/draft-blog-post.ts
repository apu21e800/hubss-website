/**
 * `npx tsx scripts/draft-blog-post.ts <file.md> [--dry-run]`: a blog post
 * written as markdown (content/drafts/*.md) becomes an UNPUBLISHED draft in
 * Studio → Blog posts, with its photo and the systems it is about. A person
 * reads it there and presses Publish; the first Publish dates it
 * (sanity.config.ts). 16 Oct 2026, for the Product Book's launch post.
 * 21 Oct 2026, for the cold patch guide: the photo can be one already in
 * Studio, framed with a hotspot; the related systems are set; and the note
 * the editor sees in Studio says who wrote the piece (21e8), never how.
 *
 * Runs on Vern's PC (Sanity writes need SANITY_API_WRITE_TOKEN in .env.local).
 * --dry-run needs no token: it checks what a public read can (the photo is in
 * Studio, the systems and applications are published) and prints the
 * document. Never overwrites: if the draft or a published post already has the
 * slug, it stops and says so (edit that one in Studio instead).
 *
 * The file: front matter, then the body in markdown.
 *   title, slug, category (as stored: Blog prints as Article), excerpt,
 *   keywords (six at most), relatedProducts and relatedApplications (slugs);
 *   cover: { ref, alt, hotspot, crop }, a photo already in Studio, or
 *   cover: <a path in the repo> with coverAlt (and coverHotspot, coverCrop),
 *   uploaded on the real run; forDoug (28 Oct 2026), a line or a list of
 *   lines the note in Studio adds as "To confirm before Publish: ...";
 *   photos (13 Nov 2026, for the Midland crosswalk), a list of
 *   { file: <a path in the repo>, alt, caption }, uploaded on the real run
 *   and set after the body under "The job in photographs", as an article
 *   made from job photos has them (lib/project-posts.ts); sources, one line
 *   for the note in Studio on where the facts are from, when that is not
 *   the Product Portfolio Book and the site's own pages.
 * The body goes through the same converter as the drafter's drafts
 * (lib/markdown-to-portable-text.ts) and the same style check
 * (lib/style-lint.ts), with the photo's alt text and no "vs" in a title or a
 * heading, as scripts/replace-blog-drafts.ts checks them. One problem and
 * nothing is written.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { config as loadDotenv } from "dotenv";
import { markdownToPortableText } from "../lib/markdown-to-portable-text";
import { describeIssue, flagSentences } from "../lib/style-lint";
import { FIELD_NOTE_TYPES } from "../lib/field-notes-taxonomy";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const DRY = process.argv.includes("--dry-run");
const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Usage: npx tsx scripts/draft-blog-post.ts <file.md> [--dry-run]");
  process.exit(1);
}

type Hotspot = { x: number; y: number; width: number; height: number };
type Crop = { top: number; bottom: number; left: number; right: number };

const problems: string[] = [];
const stop = () => {
  console.error("Nothing written. Fix the file and run again:");
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
};
const isFrac = (n: unknown) => typeof n === "number" && n >= 0 && n <= 1;
const validHotspot = (h: unknown) => h == null || (typeof h === "object" && ["x", "y", "width", "height"].every((k) => isFrac((h as Record<string, unknown>)[k])));
const validCrop = (c: unknown) => c == null || (typeof c === "object" && ["top", "bottom", "left", "right"].every((k) => isFrac((c as Record<string, unknown>)[k])));
const slugList = (v: unknown) => (Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean) : []);

const { data, content } = matter(readFileSync(path.resolve(ROOT, file), "utf8"));
for (const k of ["title", "slug", "category", "excerpt"]) if (!data[k]) problems.push(`front matter is missing "${k}"`);
if (data.category && !FIELD_NOTE_TYPES.some((t) => t.label === data.category)) {
  problems.push(`category "${data.category}" isn't one of: ${FIELD_NOTE_TYPES.map((t) => t.label).join(", ")}`);
}
const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];
if (keywords.length > 6) problems.push(`${keywords.length} keywords; six at most`);
// What only Doug can settle (a town, a system, an artist's credit), printed in
// the note he reads in Studio. Plain words: he reads them as they are.
const forDoug = (Array.isArray(data.forDoug) ? data.forDoug : data.forDoug ? [data.forDoug] : []).map((q: unknown) => String(q).trim()).filter(Boolean);

// One line for the note in Studio on where the facts are from, when it isn't the book and the site's own pages.
const sourcesLine = typeof data.sources === "string" ? data.sources.trim() : "";

// The photo: one already in Studio (an object with its ref), or a file in the repo.
const coverRef = data.cover && typeof data.cover === "object" ? (data.cover as { ref?: unknown; alt?: unknown; hotspot?: Hotspot | null; crop?: Crop | null }) : null;
const coverPath = typeof data.cover === "string" ? data.cover : null;
const hotspot = coverRef ? coverRef.hotspot : (data.coverHotspot as Hotspot | null | undefined);
const crop = coverRef ? coverRef.crop : (data.coverCrop as Crop | null | undefined);
const alt = String(coverRef?.alt ?? data.coverAlt ?? "").trim();
if (coverRef && !/^image-[0-9a-f]+-\d+x\d+-\w+$/.test(String(coverRef.ref))) problems.push(`cover.ref "${coverRef.ref}" is not an image asset id`);
if (coverPath && !existsSync(path.resolve(ROOT, coverPath))) problems.push(`cover not found: ${coverPath}`);
if ((coverRef || coverPath) && !alt) problems.push(coverRef ? "cover.alt is missing" : "coverAlt is missing");
if (!validHotspot(hotspot)) problems.push("a hotspot needs x, y, width and height between 0 and 1");
if (!validCrop(crop)) problems.push("a crop needs top, bottom, left and right between 0 and 1");

// More photographs of the job, after the body under their own heading.
type ExtraPhoto = { file: string; alt: string; caption: string };
const extraPhotos: ExtraPhoto[] = (Array.isArray(data.photos) ? data.photos : []).map((p: unknown) => {
  const o = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
  return { file: String(o.file ?? "").trim(), alt: String(o.alt ?? "").trim(), caption: String(o.caption ?? "").trim() };
});
if (data.photos != null && !Array.isArray(data.photos)) problems.push("photos is a list of { file, alt, caption }");
extraPhotos.forEach((p, i) => {
  const n = `photo ${i + 1}`;
  if (!p.file) problems.push(`${n} has no file`);
  else if (!existsSync(path.resolve(ROOT, p.file))) problems.push(`${n} not found: ${p.file}`);
  if (!p.alt) problems.push(`${n} has no alt`);
});
if (new Set(extraPhotos.map((p) => p.file)).size !== extraPhotos.length) problems.push("the same photo is listed twice");
if (extraPhotos.length > 10) problems.push(`${extraPhotos.length} photos; ten at most`);

// The house style, as the drafter's pass checks it, plus the alt text and no "vs".
const title = String(data.title ?? "").trim();
const excerpt = String(data.excerpt ?? "").trim();
const flags = [
  ...flagSentences(title, { headings: "whole" }),
  ...flagSentences(excerpt),
  ...flagSentences(content, { headings: "markdown" }),
  ...(alt ? flagSentences(alt) : []),
  ...extraPhotos.flatMap((p) => [...flagSentences(p.alt), ...(p.caption ? flagSentences(p.caption) : [])]),
  ...forDoug.flatMap((q) => flagSentences(q)),
  ...(sourcesLine ? flagSentences(sourcesLine) : []),
];
for (const f of flags) problems.push(`house style, "${f.text}": ${f.issues.map(describeIssue).join("; ")}`);
for (const h of [title, ...content.split("\n").filter((l) => /^\s*#{1,6}\s/.test(l))]) {
  if (/\bvs\b/i.test(h)) problems.push(`"${h.trim()}": no "vs" in a title or a heading (Vern, 20 Oct 2026)`);
}
if (problems.length) stop();

const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
// Without a token the read is public: published documents and photos only.
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN || undefined,
});

async function refsFor(type: "product" | "application", slugs: string[]) {
  const out: { slug: string; id: string }[] = [];
  for (const s of slugs) {
    const id = await client.fetch<string | null>(`*[_type == $type && slug.current == $s && !(_id in path("drafts.**"))][0]._id`, { type, s });
    if (id) out.push({ slug: s, id });
    else problems.push(`no published ${type} has the slug "${s}"`);
  }
  return out;
}

function imageField(ref: string) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt,
    ...(hotspot ? { hotspot: { _type: "sanity.imageHotspot", ...hotspot } } : {}),
    ...(hotspot || crop ? { crop: { _type: "sanity.imageCrop", ...(crop ?? { top: 0, bottom: 0, left: 0, right: 0 }) } } : {}),
  };
}

/** The heading an article made from job photos puts over its photographs (lib/project-posts.ts). */
const PHOTOS_HEADING = "The job in photographs";

const words = (md: string) =>
  md.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_>`-]/g, " ").split(/\s+/).filter((w) => /\w/.test(w)).length;

async function main() {
  const products = await refsFor("product", slugList(data.relatedProducts));
  const apps = await refsFor("application", slugList(data.relatedApplications));
  let photo = "no photo";
  if (coverRef) {
    const asset = await client.fetch<{ w: number; h: number } | null>(`*[_id == $ref][0]{"w": metadata.dimensions.width, "h": metadata.dimensions.height}`, { ref: String(coverRef.ref) });
    if (!asset) problems.push(`cover ${coverRef.ref} is not in Studio`);
    else photo = `${coverRef.ref} (${asset.w}x${asset.h})`;
  } else if (coverPath) {
    photo = `${coverPath}, uploaded on the real run`;
  }
  if (problems.length) stop();

  const { blocks } = markdownToPortableText(content, "k");
  const body = blocks.filter((b) => b._type !== "image");
  const slug = String(data.slug).trim();
  const doc = {
    _id: `drafts.blogpost-${slug}`,
    _type: "blogPost",
    title,
    slug: { _type: "slug", current: slug },
    category: data.category,
    publishedAt: new Date().toISOString(),
    excerpt,
    body,
    keywords,
    relatedProducts: products.map((r) => ({ _key: `p-${r.slug}`, _type: "reference", _ref: r.id })),
    relatedApplications: apps.map((r) => ({ _key: `a-${r.slug}`, _type: "reference", _ref: r.id })),
    // What the editor sees in Studio: who wrote it, never how (Vern, 19 Oct 2026).
    editorNotes: [
      `Written by 21e8 on ${new Date().toISOString().slice(0, 10)}: read it, then Publish.`,
      // Where the facts are from. `sources:` in the front matter says it for a
      // piece that rests on something else (a client's own notes and photos).
      sourcesLine || "Every statement about HUB is from the Product Portfolio Book or the site's own pages, and any outside source is linked where it is used.",
      // `forDoug:` in the front matter (28 Oct 2026): what only Doug can
      // settle before it goes live, in plain words, one line each.
      ...forDoug.map((q) => `To confirm before Publish: ${q}`),
    ].join("\n"),
  };

  console.log(`${doc.title}\n/blog/${slug} · ${body.length} blocks · about ${words(content)} words · style check clean`);
  console.log(`photo: ${photo}${alt ? ` · alt "${alt}"` : ""}${hotspot ? ` · hotspot x ${hotspot.x} y ${hotspot.y} w ${hotspot.width} h ${hotspot.height}` : ""}`);
  if (extraPhotos.length) {
    console.log(`more photos, uploaded on the real run and set under "${PHOTOS_HEADING}":`);
    for (const p of extraPhotos) console.log(`  ${p.file} · alt "${p.alt}"${p.caption ? ` · caption "${p.caption}"` : ""}`);
  }
  console.log(`systems: ${products.map((r) => r.slug).join(", ") || "none"} · applications: ${apps.map((r) => r.slug).join(", ") || "none"}`);
  if (DRY) {
    console.log(JSON.stringify({ ...doc, body: `(${body.length} blocks)` }, null, 2));
    console.log("\n(dry run: nothing written)");
    return;
  }
  if (!TOKEN) { console.error("SANITY_API_WRITE_TOKEN missing from .env.local: nothing written."); process.exit(1); }
  const taken = await client.fetch<string[]>(`*[_type == "blogPost" && slug.current == $slug]._id`, { slug });
  if (taken.length) {
    console.error(`Stopped: /blog/${slug} already exists in Studio (${taken.join(", ")}). Edit it there.`);
    process.exit(1);
  }
  let featuredImage: ReturnType<typeof imageField> | undefined;
  if (coverRef) featuredImage = imageField(String(coverRef.ref));
  else if (coverPath) {
    const abs = path.resolve(ROOT, coverPath);
    const asset = await client.assets.upload("image", createReadStream(abs), { filename: path.basename(abs) });
    featuredImage = imageField(asset._id);
  }
  // The other photographs, in the order listed, as a job photos article sets them.
  const gallery: Record<string, unknown>[] = [];
  for (const [i, p] of extraPhotos.entries()) {
    const abs = path.resolve(ROOT, p.file);
    const asset = await client.assets.upload("image", createReadStream(abs), { filename: path.basename(abs) });
    gallery.push({ _type: "image", _key: `photo-${i + 1}`, asset: { _type: "reference", _ref: asset._id }, alt: p.alt, ...(p.caption ? { caption: p.caption } : {}) });
  }
  const withPhotos = gallery.length
    ? [...body, { _type: "block", _key: "photos-h2", style: "h2", markDefs: [], children: [{ _type: "span", _key: "photos-h2-s", text: PHOTOS_HEADING, marks: [] }] }, ...gallery]
    : body;
  await client.create({ ...doc, body: withPhotos, ...(featuredImage ? { featuredImage } : {}) });
  console.log(`Draft saved. Studio → Blog posts → "${doc.title}": read it, then Publish.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
