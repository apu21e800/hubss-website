/**
 * scripts/import-blog-to-sanity.ts — the blog moves into Sanity.
 *
 * Writes each post in content/blog-archive/*.mdx (the blog's files until Sep
 * 2026) as a blogPost document, so that the site, which now reads Studio
 * (lib/blog.ts), shows exactly what it showed from the files:
 *
 *  - body: markdown → portable text (lib/markdown-to-portable-text.ts).
 *    Rendered by components/blog/PostBody.tsx, all 74 posts came out with the
 *    same headings, paragraphs, lists, quotes, tables, links, bold and italic
 *    as the MDX pages (1,909 blocks compared, 24 Sep 2026).
 *  - photos: the featured photo and every photo in the text are uploaded once
 *    (scripts/lib/sanity-photo-upload.ts, shared with the gallery photos).
 *  - type, search phrases and systems: what the site worked out from the files
 *    and lib/field-notes-taxonomy.ts is written out in full, so Doug sees it in
 *    Studio and can change it.
 *  - dates: the post's date, at noon UTC (the same day in every Canadian time
 *    zone). Posts sharing a date are a minute apart, in the order the site
 *    listed them, so /blog and the homepage keep their order.
 *
 * Document ids are kept for the 67 posts an earlier migration (May 2026) put in
 * Sanity with the whole markdown in one paragraph; the other 7 are created as
 * blogpost-<slug>. Keys are numbered, so an import of the same file produces
 * the same document.
 *
 * USAGE (from the repo root)
 *   npm run blog:dry                                    # the plan; writes nothing
 *   npm run blog:import -- --only=<slug> --backup=<f>   # one post first
 *   npm run blog:import -- --backup=<file.json>         # every post
 *   npm run blog:check                                  # Sanity vs the files; exits 1 on any difference
 *
 * A write needs SANITY_API_WRITE_TOKEN in .env.local and --backup: every
 * blogPost document it replaces (and any Studio draft of one) is saved there
 * first. A draft would hide the imported text in Studio, so the import stops
 * if it finds one, unless you pass --discard-drafts (they're backed up first).
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { config as loadDotenv } from "dotenv";
import { absPath, sha1Of, uploadedPhotos, uploadMissing } from "./lib/sanity-photo-upload";
import { plan, toDocument, type Planned } from "./lib/blog-import";

loadDotenv({ path: path.join(process.cwd(), ".env.local"), quiet: true });

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const DRY = args.includes("--dry-run");
const CHECK = args.includes("--check");
const DISCARD_DRAFTS = args.includes("--discard-drafts");
const ONLY = flag("only");
const BACKUP = flag("backup");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!DRY && !CHECK) {
  if (!token) { console.error("ERROR: SANITY_API_WRITE_TOKEN is missing from .env.local."); process.exit(1); }
  if (!BACKUP) { console.error("ERROR: a write needs --backup=<file.json> (the current blog documents are saved there first)."); process.exit(1); }
}

// "raw" when there's a token, so Studio drafts are visible to the plan; the
// public, token-less read only ever sees published documents.
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  // A stalled upload errors after two minutes and is retried
  // (scripts/lib/sanity-photo-upload.ts) instead of hanging the run.
  timeout: 120_000,
  perspective: token ? "raw" : "published",
  token: token || undefined,
});

// ─── Main ────────────────────────────────────────────────────────────────────

interface ExistingDoc { _id: string; slug?: string; title?: string; excerpt?: string; seo?: unknown; _updatedAt?: string }

async function main() {
  const mode = CHECK ? "CHECK" : DRY ? "DRY RUN" : "IMPORT";
  console.log(`Blog → Sanity (${mode})`);

  let posts = plan();
  if (ONLY) posts = posts.filter((p) => p.slug === ONLY);
  if (!posts.length) { console.error(ONLY ? `No post matches --only=${ONLY}` : "No posts found in content/blog-archive"); process.exit(1); }

  const missingFiles = [...new Set(posts.flatMap((p) => p.images))].filter((s) => !fs.existsSync(absPath(s)));
  if (missingFiles.length) {
    console.error(`ERROR: ${missingFiles.length} photo(s) are not on disk: ${missingFiles.slice(0, 5).join(", ")}`);
    process.exit(1);
  }

  // Systems and applications are references to their Studio documents.
  const productDocs: { _id: string; name: string }[] = await client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))]{ _id, name }`);
  const productIds = new Map(productDocs.map((d) => [d.name, d._id]));
  const appDocs: { _id: string; name: string; slug: string }[] = await client.fetch(`*[_type == "application" && !(_id in path("drafts.**"))]{ _id, name, "slug": slug.current }`);
  const applicationIds = new Map<string, string>();
  for (const a of appDocs) { applicationIds.set(a.name.toLowerCase(), a._id); applicationIds.set(a.slug.toLowerCase(), a._id); }
  const unknown = [
    ...posts.flatMap((p) => p.products.filter((n) => !productIds.has(n)).map((n) => `${p.slug}: system "${n}"`)),
    ...posts.flatMap((p) => p.applications.filter((a) => !applicationIds.has(a.toLowerCase())).map((a) => `${p.slug}: application "${a}"`)),
  ];
  if (unknown.length) { console.error(`ERROR: no Studio document for:\n  ${unknown.join("\n  ")}`); process.exit(1); }

  if (CHECK) return check(posts, productIds, applicationIds);

  // What Sanity has now.
  const existing: (ExistingDoc & { draft: boolean })[] = await client.fetch(
    `*[_type == "blogPost"]{ _id, "slug": slug.current, title, excerpt, seo, _updatedAt, "draft": _id in path("drafts.**") }`
  );
  const published = existing.filter((d) => !d.draft);
  const bySlug = new Map(published.map((d) => [d.slug ?? "", d]));
  const idFor = (p: Planned) => bySlug.get(p.slug)?._id ?? `blogpost-${p.slug}`;
  const ids = new Set(posts.map(idFor));
  const drafts = existing.filter((d) => d.draft && ids.has(d._id.replace(/^drafts\./, "")));

  const assetBySha = await uploadedPhotos(client);
  const allImages = [...new Set(posts.flatMap((p) => p.images))];
  const toUpload = allImages.filter((s) => !assetBySha.has(sha1Of(s)));

  console.log("\n  " + "post".padEnd(52) + "action".padEnd(9) + "photos".padStart(7) + "  type");
  for (const p of posts) {
    console.log("  " + p.slug.padEnd(52) + (bySlug.has(p.slug) ? "replace" : "create").padEnd(9) + String(p.images.length).padStart(7) + "  " + p.category);
  }
  const edited = posts.filter((p) => { const d = bySlug.get(p.slug); return d && ((d.title ?? "").trim() !== p.title || (d.excerpt ?? "").trim() !== p.excerpt); });
  const orphans = published.filter((d) => !posts.some((p) => p.slug === d.slug));
  console.log(`\n  ${posts.length} posts: ${posts.filter((p) => bySlug.has(p.slug)).length} replace a document from the May migration, ${posts.filter((p) => !bySlug.has(p.slug)).length} are new.`);
  console.log(`  ${allImages.length} distinct photos; ${allImages.length - toUpload.length} already in Sanity, ${toUpload.length} to upload.`);
  if (edited.length) console.log(`  Note: ${edited.length} Sanity document(s) have a title or excerpt that differs from the file. The site shows the file's; the import keeps it. ${edited.map((p) => p.slug).join(", ")}`);
  if (!ONLY && orphans.length) console.log(`  Note: ${orphans.length} published blogPost document(s) have no file and are left alone: ${orphans.map((d) => d._id).join(", ")}`);
  if (drafts.length) console.log(`  ${drafts.length} Studio draft(s) of these posts: ${drafts.map((d) => d._id).join(", ")}`);
  const seoKept = posts.filter((p) => bySlug.get(p.slug)?.seo);
  if (seoKept.length) console.log(`  Search-result overrides already set in Studio are kept for: ${seoKept.map((p) => p.slug).join(", ")}`);

  if (drafts.length && !DISCARD_DRAFTS) {
    console.error(`\nSTOP: ${drafts.length} draft(s) would hide the imported text in Studio, and publishing one would put the old text back. Re-run with --discard-drafts to back them up and remove them.`);
    process.exit(1);
  }
  if (DRY) { console.log("\n(dry run — nothing written)"); return; }

  // Back up every document this run replaces or removes, whole.
  const touched = [...ids, ...drafts.map((d) => d._id)];
  const current: unknown[] = await client.fetch(`*[_id in $ids]`, { ids: touched });
  fs.mkdirSync(path.dirname(path.resolve(BACKUP!)), { recursive: true });
  fs.writeFileSync(path.resolve(BACKUP!), JSON.stringify({ savedAt: new Date().toISOString(), documents: current }, null, 2));
  console.log(`\n  Backup of ${current.length} document(s): ${path.resolve(BACKUP!)}`);

  const { uploaded } = await uploadMissing(client, toUpload, assetBySha);

  for (const p of posts) {
    const docId = idFor(p);
    const doc = toDocument(p, docId, assetBySha, productIds, applicationIds, bySlug.get(p.slug)?.seo);
    await client.createOrReplace(doc, { autoGenerateArrayKeys: false });
    console.log(`  ✓ ${p.slug}`);
  }
  if (drafts.length) {
    const tx = client.transaction();
    for (const d of drafts) tx.delete(d._id);
    await tx.commit();
    console.log(`  Removed ${drafts.length} draft(s); they're in the backup.`);
  }
  console.log(`\nDone. ${posts.length} posts written, ${uploaded} photos uploaded. Run npm run blog:check next.`);
}

// ─── Check: Sanity against the files ─────────────────────────────────────────

async function check(posts: Planned[], productIds: Map<string, string>, applicationIds: Map<string, string>) {
  type Got = {
    _id: string; slug: string; title?: string; excerpt?: string; publishedAt?: string; readTime?: string; category?: string;
    keywords?: string[]; tags?: string[]; products?: string[]; applications?: string[];
    featured?: { alt?: string; origin?: string }; body?: Record<string, unknown>[];
  };
  const got: Got[] = await client.fetch(
    `*[_type == "blogPost" && !(_id in path("drafts.**")) && slug.current in $slugs]{
      _id, "slug": slug.current, title, excerpt, publishedAt, readTime, category, keywords, tags,
      "products": relatedProducts[]._ref, "applications": relatedApplications[]._ref,
      "featured": featuredImage{ alt, "origin": asset->source.url },
      "body": body[]{ ..., _type == "image" => { _type, _key, alt, caption, "src": asset->source.url } }
    }`,
    { slugs: posts.map((p) => p.slug) }
  );
  const bySlug = new Map(got.map((d) => [d.slug, d]));
  // Key order is Sanity's business, not a difference.
  const canon = (v: unknown): unknown =>
    Array.isArray(v) ? v.map(canon)
    : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon((v as Record<string, unknown>)[k])]))
    : v;
  const norm = (v: unknown) => JSON.stringify(canon(v ?? null));
  let bad = 0;
  for (const p of posts) {
    const d = bySlug.get(p.slug);
    const problems: string[] = [];
    if (!d) problems.push("not in Sanity");
    else {
      const want = {
        title: p.title, excerpt: p.excerpt, publishedAt: p.publishedAt, readTime: p.readTime, category: p.category,
        keywords: p.keywords, tags: p.tags.length ? p.tags : null,
        products: p.products.map((n) => productIds.get(n)), applications: p.applications.map((a) => applicationIds.get(a.toLowerCase())),
        featured: { alt: p.featured.alt, origin: p.featured.src },
      };
      const have = {
        title: d.title, excerpt: d.excerpt, publishedAt: d.publishedAt ? new Date(d.publishedAt).toISOString() : null, readTime: d.readTime, category: d.category,
        keywords: d.keywords ?? [], tags: d.tags ?? null,
        products: d.products ?? [], applications: d.applications ?? [],
        featured: { alt: d.featured?.alt, origin: d.featured?.origin },
      };
      for (const k of Object.keys(want) as (keyof typeof want)[]) {
        if (norm(want[k]) !== norm(have[k])) problems.push(`${k} differs`);
      }
      const wantBody = p.blocks.map((b) => (b._type === "image" ? { _type: "image", _key: b._key, alt: b.alt, ...(b.caption ? { caption: b.caption } : {}), src: b.src } : b));
      const haveBody = (d.body ?? []).map((b) =>
        Object.fromEntries(Object.entries(b).filter(([k, v]) => v !== null && !(b._type === "image" && k === "asset"))));
      if (norm(wantBody) !== norm(haveBody)) {
        const i = wantBody.findIndex((b, n) => norm(b) !== norm(haveBody[n]));
        problems.push(`body differs from block ${i + 1} (of ${wantBody.length}; Sanity has ${haveBody.length})`);
      }
    }
    if (problems.length) bad++;
    console.log(`  ${problems.length ? "✗" : "✓"} ${p.slug}${problems.length ? "  — " + problems.join("; ") : ""}`);
  }
  console.log(bad ? `\n${bad} post(s) differ from their file.` : `\nAll ${posts.length} posts match their files.`);
  process.exit(bad ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
