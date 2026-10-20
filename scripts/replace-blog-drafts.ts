/**
 * 21e8's rewrites of six blog posts (20 Oct 2026) go into Studio as
 * unpublished drafts for a read and a Publish, and the paint article is
 * dropped. Vern, 20 Oct 2026, on the drafter's first pieces: "need
 * significant improvement ... don't talk constantly about the products being
 * better than line paint ... written to a higher standard."
 *
 * Runs on Vern's PC: Sanity writes need SANITY_API_WRITE_TOKEN in .env.local.
 *
 *   npx tsx scripts/replace-blog-drafts.ts             # dry run (the default): checks everything, prints every write, writes nothing; needs no token
 *   npx tsx scripts/replace-blog-drafts.ts --apply     # makes the writes, in the order the dry run prints them
 *   npx tsx scripts/replace-blog-drafts.ts --verbose   # the dry run, with each document printed in full (the body as an outline)
 *
 * The pieces are content/drafts/rewrites-2026-10-20/<slug>.md: front matter,
 * then the body in markdown. (<slug>.sources.md beside each is the fact record
 * for the editor; this script does not read it.) For each piece:
 *  - the body goes through lib/markdown-to-portable-text.ts and the house style
 *    check (lib/style-lint.ts, as scripts/draft-blog-post.ts runs it, plus the
 *    photo's alt text and "no vs in a title or heading"). One flag anywhere and
 *    nothing is written;
 *  - relatedProducts and relatedApplications become references to the
 *    published product and application documents;
 *  - the featured photo is `cover` (an asset already in Studio, with its alt,
 *    hotspot and crop) or `coverFile` (a file in the repo, uploaded once: an
 *    identical file already in Studio is reused);
 *  - `keepImages` puts the live post's own inline photos back after the
 *    paragraphs they followed, and `keepNotes` keeps its notes for the editor
 *    under the new first line;
 *  - target "live": drafts.<id> is written as the live post with the new
 *    title, excerpt, body, keywords, photo, related systems and notes, and
 *    every other field kept (publishedAt, search overrides). The live post
 *    stays as it is until someone presses Publish, and keeps its date;
 *  - target "draft": that draft is replaced the same way, keeping its
 *    publishedAt.
 * Then the paint article of 13 Oct: its plan item becomes "Not doing it"
 * (status "dropped") and its unpublished draft is deleted.
 *
 * Safe to run twice: a draft this script wrote is written again with the same
 * content. It leaves a piece alone, and says why, rather than overwrite work
 * done in Studio: a draft of a live post that someone else started, a draft
 * set to go live by itself, a slug another post uses, a draft that has gone.
 * Nothing is published, and no other document is touched.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { createHash } from "crypto";
import { createReadStream, existsSync, readdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import sharp from "sharp";
import { config as loadDotenv } from "dotenv";
import { markdownToPortableText, portableTextToPlain } from "../lib/markdown-to-portable-text";
import { describeIssue, flagSentences } from "../lib/style-lint";
import { FIELD_NOTE_TYPES } from "../lib/field-notes-taxonomy";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const APPLY = process.argv.includes("--apply");
const VERBOSE = process.argv.includes("--verbose");
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
if (APPLY && !TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local: nothing written.");
  process.exit(1);
}

const DIR = path.join(ROOT, "content", "drafts", "rewrites-2026-10-20");
/** The first line of every draft this script writes; also how it knows its own drafts on a second run. */
const NOTE = "Rewritten by 21e8 on 20 Oct 2026 to the house standard: read it, then Publish.";
const LIVE_NOTE = `${NOTE} The live post keeps its date.`;
/** The 13 Oct draft whose subject was paint (Vern, 20 Oct 2026): dropped, not rewritten. */
const PAINT = { idea: "storyIdea-asphalt-paint", draft: "drafts.blogpost-asphalt-paint-vs-coating-system" };

// Without a token the read is public: published documents only, so drafts can't be seen.
const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "raw",
  token: TOKEN || undefined,
});
const SEES_DRAFTS = !!TOKEN;

type Hotspot = { x: number; y: number; width: number; height: number };
type Crop = { top: number; bottom: number; left: number; right: number };
type Doc = Record<string, unknown> & { _id: string };
type Block = Record<string, unknown> & { _type: string; _key: string };

interface Front {
  title: string;
  slug: string;
  target: "live" | "draft";
  id: string;
  category: string;
  excerpt: string;
  keywords: string[];
  relatedProducts: string[];
  relatedApplications: string[];
  cover?: { ref: string; alt: string; hotspot?: Hotspot | null; crop?: Crop | null };
  coverFile?: string;
  coverAlt?: string;
  coverHotspot?: Hotspot | null;
  coverCrop?: Crop | null;
  keepImages?: { key: string; after: string }[];
  keepNotes?: boolean;
}

interface Plan {
  file: string;
  front: Front;
  liveId: string;
  draftId: string;
  doc?: Doc;
  words: number;
  blocks: number;
  photo: string;
  related: string[];
  kept: string;
  /** Why this piece is left alone, when it is. */
  skip?: string;
  /** For a coverFile not yet in Studio: uploaded on --apply, then set on the document. */
  upload?: { path: string; alt: string; hotspot?: Hotspot | null; crop?: Crop | null };
}

const errors: string[] = [];
const fail = (file: string, msg: string) => errors.push(`${file}: ${msg}`);

const isFrac = (n: unknown) => typeof n === "number" && n >= 0 && n <= 1;
const validHotspot = (h: unknown) => h == null || (typeof h === "object" && ["x", "y", "width", "height"].every((k) => isFrac((h as Record<string, unknown>)[k])));
const validCrop = (c: unknown) => c == null || (typeof c === "object" && ["top", "bottom", "left", "right"].every((k) => isFrac((c as Record<string, unknown>)[k])));
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

function readFront(file: string, data: Record<string, unknown>): Front | null {
  for (const k of ["title", "slug", "target", "id", "category", "excerpt"]) {
    if (!data[k]) { fail(file, `front matter is missing "${k}"`); return null; }
  }
  const front: Front = {
    title: String(data.title).trim(),
    slug: String(data.slug).trim(),
    target: data.target === "live" ? "live" : "draft",
    id: String(data.id).trim(),
    category: String(data.category).trim(),
    excerpt: String(data.excerpt).trim(),
    keywords: strings(data.keywords),
    relatedProducts: strings(data.relatedProducts),
    relatedApplications: strings(data.relatedApplications),
    cover: data.cover as Front["cover"],
    coverFile: data.coverFile ? String(data.coverFile) : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    coverHotspot: data.coverHotspot as Hotspot | null | undefined,
    coverCrop: data.coverCrop as Crop | null | undefined,
    keepImages: Array.isArray(data.keepImages) ? (data.keepImages as Front["keepImages"]) : undefined,
    keepNotes: data.keepNotes === true,
  };
  if (data.target !== "live" && data.target !== "draft") fail(file, `target is "${data.target}"; it must be live or draft`);
  if (!FIELD_NOTE_TYPES.some((t) => t.label === front.category)) fail(file, `category "${front.category}" isn't one of: ${FIELD_NOTE_TYPES.map((t) => t.label).join(", ")}`);
  const expected = `${front.target === "draft" ? "drafts." : ""}blogpost-${front.slug}`;
  if (front.id !== expected) fail(file, `id ${front.id} does not match the slug and target (expected ${expected})`);
  if (front.keywords.length > 6) fail(file, `${front.keywords.length} keywords; six at most`);
  if (!!front.cover === !!front.coverFile) fail(file, "give exactly one of cover (an asset in Studio) or coverFile (a file in the repo)");
  if (front.cover && !/^image-[0-9a-f]+-\d+x\d+-\w+$/.test(String(front.cover.ref))) fail(file, `cover.ref "${front.cover.ref}" is not an image asset id`);
  if (front.cover && !front.cover.alt) fail(file, "cover.alt is missing");
  if (front.coverFile && !front.coverAlt) fail(file, "coverAlt is missing");
  if (!validHotspot(front.cover?.hotspot) || !validHotspot(front.coverHotspot)) fail(file, "a hotspot needs x, y, width and height between 0 and 1");
  if (!validCrop(front.cover?.crop) || !validCrop(front.coverCrop)) fail(file, "a crop needs top, bottom, left and right between 0 and 1");
  return front;
}

/** The house style, as scripts/draft-blog-post.ts checks it, plus the photo's alt text and no "vs" in a title or heading. */
function styleProblems(front: Front, markdown: string): string[] {
  const alt = front.cover?.alt ?? front.coverAlt ?? "";
  const flags = [
    ...flagSentences(front.title, { headings: "whole" }),
    ...flagSentences(front.excerpt),
    ...flagSentences(markdown, { headings: "markdown" }),
    ...flagSentences(alt),
  ];
  const out = flags.map((f) => `"${f.text}": ${f.issues.map(describeIssue).join("; ")}`);
  for (const h of [front.title, ...markdown.split("\n").filter((l) => /^\s*#{1,6}\s/.test(l))]) {
    if (/\bvs\b/i.test(h)) out.push(`"${h.trim()}": no "vs" in a title or a heading (Vern, 20 Oct 2026)`);
  }
  return out;
}

const plainOf = (b: Block) => (Array.isArray(b.children) ? (b.children as { text?: string }[]).map((c) => c.text ?? "").join("") : "");

/** The live post's own inline photos, each put back after the paragraph it followed. */
function withKeptImages(file: string, body: Block[], live: Doc | null, keep: Front["keepImages"]): Block[] {
  if (!keep?.length) return body;
  const liveBody = (live?.body as Block[] | undefined) ?? [];
  const out = [...body];
  for (const k of keep) {
    const img = liveBody.find((b) => b._type === "image" && b._key === k.key);
    if (!img) { fail(file, `the live post has no inline photo ${k.key}`); continue; }
    const at = out.findIndex((b) => b._type === "block" && plainOf(b).startsWith(k.after));
    if (at < 0) { fail(file, `no paragraph starts "${k.after}" for photo ${k.key} to follow`); continue; }
    if (out.some((b) => b._key === img._key)) { fail(file, `block key ${img._key} is already in the new body`); continue; }
    out.splice(at + 1, 0, img);
  }
  return out;
}

function imageField(ref: string, alt: string, hotspot?: Hotspot | null, crop?: Crop | null) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt,
    ...(hotspot ? { hotspot: { _type: "sanity.imageHotspot", ...hotspot } } : {}),
    ...(hotspot || crop ? { crop: { _type: "sanity.imageCrop", ...(crop ?? { top: 0, bottom: 0, left: 0, right: 0 }) } } : {}),
  };
}

const fmtHotspot = (h?: Hotspot | null) => (h ? `hotspot x ${h.x} y ${h.y} w ${h.width} h ${h.height}` : "no hotspot");
const fmtCrop = (c?: Crop | null) => (c && (c.top || c.bottom || c.left || c.right) ? `crop top ${c.top} bottom ${c.bottom} left ${c.left} right ${c.right}` : "no crop");

async function refsFor(file: string, type: "product" | "application", slugs: string[]) {
  const out: { slug: string; id: string }[] = [];
  for (const s of slugs) {
    const id = await client.fetch<string | null>(`*[_type == $type && slug.current == $s && !(_id in path("drafts.**"))][0]._id`, { type, s });
    if (id) out.push({ slug: s, id });
    else fail(file, `no published ${type} has the slug "${s}"`);
  }
  return out;
}

async function plan(file: string): Promise<Plan | null> {
  const { data, content } = matter(readFileSync(path.join(DIR, file), "utf8"));
  const front = readFront(file, data);
  if (!front) return null;
  for (const p of styleProblems(front, content)) fail(file, `house style: ${p}`);

  const liveId = front.target === "live" ? front.id : front.id.replace(/^drafts\./, "");
  const draftId = `drafts.${liveId}`;
  const [live, draft] = await Promise.all([
    client.fetch<Doc | null>(`*[_id == $id][0]`, { id: liveId }),
    SEES_DRAFTS ? client.fetch<Doc | null>(`*[_id == $id][0]`, { id: draftId }) : Promise.resolve(null),
  ]);

  const converted = markdownToPortableText(content, "k").blocks.filter((b) => b._type !== "image");
  const words = portableTextToPlain(converted).split(/\s+/).filter(Boolean).length;
  const body = withKeptImages(file, converted as unknown as Block[], live, front.keepImages);

  const products = await refsFor(file, "product", front.relatedProducts);
  const apps = await refsFor(file, "application", front.relatedApplications);
  const related = [...products, ...apps].map((r) => `${r.slug} → ${r.id}`);

  const p: Plan = { file, front, liveId, draftId, words, blocks: body.length, photo: "", related, kept: "" };

  // The featured photo.
  let featuredImage: ReturnType<typeof imageField> | undefined;
  if (front.cover) {
    const asset = await client.fetch<{ w: number; h: number } | null>(`*[_id == $ref][0]{"w": metadata.dimensions.width, "h": metadata.dimensions.height}`, { ref: front.cover.ref });
    if (!asset) fail(file, `cover asset ${front.cover.ref} is not in Studio`);
    featuredImage = imageField(front.cover.ref, front.cover.alt, front.cover.hotspot, front.cover.crop);
    p.photo = `${front.cover.ref} (${asset ? `${asset.w}x${asset.h}` : "missing"}) · ${fmtHotspot(front.cover.hotspot)} · ${fmtCrop(front.cover.crop)}`;
  } else if (front.coverFile) {
    const abs = path.resolve(ROOT, front.coverFile);
    if (!existsSync(abs)) {
      fail(file, `coverFile ${front.coverFile} not found`);
    } else {
      const meta = await sharp(abs).metadata();
      const sha1 = createHash("sha1").update(readFileSync(abs)).digest("hex");
      const existing = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]._id`, { sha1 });
      if (existing) featuredImage = imageField(existing, front.coverAlt ?? "", front.coverHotspot, front.coverCrop);
      else p.upload = { path: abs, alt: front.coverAlt ?? "", hotspot: front.coverHotspot, crop: front.coverCrop };
      p.photo = `${front.coverFile} (${meta.width}x${meta.height}) ${existing ? `already in Studio as ${existing}` : "uploaded on --apply"} · ${fmtHotspot(front.coverHotspot)} · ${fmtCrop(front.coverCrop)}`;
    }
  }

  // What the document is built on, and whether it may be written.
  let base: Doc | null = null;
  if (front.target === "live") {
    if (!live) fail(file, `the live post ${liveId} is not in Studio`);
    base = live;
    if (draft && !String(draft.editorNotes ?? "").startsWith(NOTE)) {
      p.skip = `${draftId} already holds edits made in Studio. Publish or discard them there, then run this again.`;
    }
  } else {
    if (live) p.skip = `${liveId} has been published since; nothing written (change the piece's target to live).`;
    else if (SEES_DRAFTS && !draft) p.skip = `${draftId} is no longer in Studio; nothing written.`;
    base = draft;
  }
  if (draft?.scheduled === true) p.skip = `${draftId} is set to go live by itself. Switch "Goes live by itself" off in Studio, then run this again.`;
  const taken = await client.fetch<string[]>(`*[_type == "blogPost" && slug.current == $slug && !(_id in [$liveId, $draftId])]._id`, { slug: front.slug, liveId, draftId });
  if (taken.length) p.skip = `/blog/${front.slug} is also used by ${taken.join(", ")}; nothing written.`;

  const { _rev, _createdAt, _updatedAt, ...kept } = (base ?? {}) as Doc & { _rev?: string; _createdAt?: string; _updatedAt?: string };
  void _rev; void _createdAt; void _updatedAt;
  // The same photo as before (a light pass): keep the fields Studio's import set on it.
  const before = kept.featuredImage as { asset?: { _ref?: string } } | undefined;
  if (featuredImage && before?.asset?._ref === featuredImage.asset._ref) featuredImage = { ...before, ...featuredImage };
  const first = front.target === "live" ? LIVE_NOTE : NOTE;
  // Notes carried over lose a first line this script wrote, so a second run (or a run after Publish) doesn't stack it.
  const carried = front.keepNotes ? String(base?.editorNotes ?? "").trim() : "";
  const oldNotes = [LIVE_NOTE, NOTE].reduce((s, n) => (s.startsWith(n) ? s.slice(n.length).trim() : s), carried);
  p.doc = {
    ...kept,
    _id: draftId,
    _type: "blogPost",
    title: front.title,
    slug: { _type: "slug", current: front.slug },
    category: front.category,
    excerpt: front.excerpt,
    body,
    keywords: front.keywords,
    ...(featuredImage ? { featuredImage } : {}),
    relatedProducts: products.map((r) => ({ _key: `p-${r.slug}`, _type: "reference", _ref: r.id })),
    relatedApplications: apps.map((r) => ({ _key: `a-${r.slug}`, _type: "reference", _ref: r.id })),
    editorNotes: oldNotes ? `${first}\n\n${oldNotes}` : first,
  };

  const keptFields = Object.keys(kept).filter((k) => !["_id", "_type", "title", "slug", "category", "excerpt", "body", "keywords", "featuredImage", "relatedProducts", "relatedApplications", "editorNotes", "publishedAt", "seo"].includes(k));
  if (base) {
    const seo = kept.seo as { metaTitle?: string; metaDescription?: string } | undefined;
    p.kept = `kept from ${base._id}: publishedAt ${kept.publishedAt ?? "(none)"}${seo?.metaTitle || seo?.metaDescription ? `, search overrides (${[seo.metaTitle && `title "${seo.metaTitle}"`, seo.metaDescription && `description "${seo.metaDescription}"`].filter(Boolean).join(", ")})` : ""}${keptFields.length ? `; other fields kept: ${keptFields.join(", ")}` : ""}`;
  } else if (!SEES_DRAFTS) {
    p.kept = `${draftId} is private, so this dry run can't read it; with the token the script reads it and keeps its publishedAt and every other field`;
  } else {
    p.kept = "nothing to keep";
  }
  return p;
}

function describeWrite(p: Plan): string {
  const d = p.doc!;
  const n = (k: string) => (Array.isArray(d[k]) ? (d[k] as unknown[]).length : 0);
  return `createOrReplace ${p.draftId}: title, slug, category, excerpt, body (${n("body")} blocks), keywords (${n("keywords")}), featuredImage${p.upload ? " (after the upload)" : ""}, relatedProducts (${n("relatedProducts")}), relatedApplications (${n("relatedApplications")}), editorNotes "${String(d.editorNotes).split("\n")[0]}"${p.front.keepNotes ? " + the live post's notes" : ""}`;
}

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.endsWith(".sources.md")).sort();
  const plans: Plan[] = [];
  for (const f of files) {
    const p = await plan(f);
    if (p) plans.push(p);
  }

  const idea = await client.fetch<{ _id: string; title?: string; status?: string; draftSlug?: string } | null>(`*[_id == $id][0]{_id, title, status, draftSlug}`, { id: PAINT.idea });
  const paintDraft = SEES_DRAFTS ? await client.fetch<{ _id: string; title?: string; slug?: string } | null>(`*[_id == $id][0]{_id, title, "slug": slug.current}`, { id: PAINT.draft }) : undefined;
  const paintLive = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id: PAINT.draft.replace(/^drafts\./, "") });

  console.log(`${plans.length} pieces in ${path.relative(ROOT, DIR)}${APPLY ? "" : " (dry run: nothing is written)"}${SEES_DRAFTS ? "" : "\nNo token: drafts are private, so this run reads only published documents. With the token (and on --apply) it also checks each draft before writing it."}\n`);
  plans.forEach((p, i) => {
    console.log(`${i + 1}. ${p.file}`);
    console.log(`   title    ${p.front.title}`);
    console.log(`   slug     /blog/${p.front.slug}`);
    console.log(`   target   ${p.front.target}: ${p.front.target === "live" ? `${p.liveId} (live) → writes ${p.draftId}` : `replaces ${p.draftId}`}`);
    console.log(`   size     ${p.words} words · ${p.blocks} blocks`);
    console.log(`   photo    ${p.photo}`);
    console.log(`   related  ${p.related.length ? p.related.join("; ") : "none"}`);
    console.log(`   style    ${errors.some((e) => e.startsWith(`${p.file}: house style`)) ? "PROBLEMS (below)" : "style check clean"}`);
    console.log(`   keeps    ${p.kept}`);
    console.log(p.skip ? `   LEFT ALONE  ${p.skip}` : `   write    ${describeWrite(p)}`);
    if (VERBOSE && p.doc) {
      const outline = (p.doc.body as Block[]).map((b) => (b._type === "block" ? `${b.style}${b.listItem ? ` ${b.listItem}` : ""}: ${plainOf(b).slice(0, 70)}` : `${b._type} ${b._key}${b._type === "image" ? `: ${String(b.alt ?? "").slice(0, 60)}` : ""}`));
      console.log(JSON.stringify({ ...p.doc, body: outline }, null, 2).replace(/^/gm, "   "));
    }
    console.log("");
  });
  console.log(`${plans.length + 1}. The paint article (13 Oct), dropped rather than rewritten`);
  console.log(`   plan item  ${idea ? `${idea._id}: "${idea.title}", status ${idea.status ?? "(none)"}` : `${PAINT.idea} not found`}`);
  console.log(`   draft      ${paintDraft === undefined ? `${PAINT.draft} (private: this run can't read it)` : paintDraft ? `${paintDraft._id}: "${paintDraft.title}", /blog/${paintDraft.slug}` : `${PAINT.draft} is already gone`}`);
  if (paintLive) console.log(`   note       a published post ${paintLive} exists: this script deletes only the draft and leaves it alone`);
  console.log(`   write      ${!idea ? "no plan item to patch" : idea.status === "dropped" ? "the plan item is already dropped" : `patch ${PAINT.idea}: status "dropped"`}`);
  console.log(`   write      ${paintDraft === null ? "nothing to delete" : `delete ${PAINT.draft}`}`);

  if (errors.length) {
    console.error(`\nNothing written. ${errors.length} problem(s) to fix first:`);
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }
  if (!APPLY) {
    console.log("\nDry run. Run again with --apply to write.");
    return;
  }

  console.log("\nWriting:");
  let written = 0;
  for (const p of plans) {
    if (p.skip || !p.doc) { console.log(`  left alone  ${p.draftId}: ${p.skip}`); continue; }
    if (p.upload) {
      const asset = await client.assets.upload("image", createReadStream(p.upload.path), { filename: path.basename(p.upload.path) });
      p.doc.featuredImage = imageField(asset._id, p.upload.alt, p.upload.hotspot, p.upload.crop);
      console.log(`  uploaded    ${path.relative(ROOT, p.upload.path)} as ${asset._id}`);
    }
    await client.createOrReplace(p.doc as Doc & { _type: string });
    written++;
    console.log(`  wrote       ${p.draftId} ("${p.front.title}")`);
  }
  if (idea && idea.status !== "dropped") {
    await client.patch(PAINT.idea).set({ status: "dropped" }).commit();
    console.log(`  patched     ${PAINT.idea}: status "dropped"`);
  }
  if (paintDraft !== null) {
    await client.delete(PAINT.draft);
    console.log(`  deleted     ${PAINT.draft}`);
  }
  console.log(`\nDone: ${written} of ${plans.length} drafts written. Studio → Blog posts: read each one, then Publish.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
