/**
 * Writes lib/blog-index.json: the Field Notes posts this build publishes.
 *
 * Runs first in `npm run build` (and `npm run dev`). It reads every published
 * blogPost from Sanity, so the list is exactly what Studio had when the build
 * started. Three things read it:
 *  - /blog/[slug] builds a page for each entry and 404s anything else;
 *  - lib/blog.ts keeps every listing to these posts, so no card links to a
 *    page that doesn't exist yet (see the note there);
 *  - lib/search.ts indexes them (title, excerpt, type, search phrases), and
 *    app/api/revalidate compares against it to spot a new post.
 *
 * A failed read, or an empty blog, stops the build: shipping a site with no
 * posts would drop 74 pages from Google.
 *
 * Manually: npm run gen:blog-index
 */
import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";
import { FIELD_NOTE_TYPES } from "../lib/field-notes-taxonomy";
import { inferCategory } from "../lib/blog-taxonomy";

const ROOT = process.cwd();
loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

interface Row { _id: string; slug: string; title: string; excerpt?: string | null; category?: string | null; keywords?: (string | null)[] | null }

async function main() {
  // Same conditions as lib/blog.ts (toMeta) and app/api/revalidate: a post
  // without a slug, title or date can't be rendered, so it isn't built.
  const rows = await client.fetch<Row[]>(
    `*[_type == "blogPost" && defined(slug.current) && defined(title) && defined(publishedAt)] | order(publishedAt desc, slug.current asc){
      _id, "slug": slug.current, title, excerpt, category, keywords
    }`
  );
  const types = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));
  const seen = new Set<string>();
  const out = [];
  for (const r of rows) {
    const slug = r.slug.trim();
    if (!/^[a-z0-9-]+$/.test(slug)) { console.warn(`  ! blog post ${r._id} has an invalid slug "${slug}"; not built`); continue; }
    if (seen.has(slug)) { console.warn(`  ! two published posts use the slug "${slug}"; only the newer is built (${r._id} is left out)`); continue; }
    seen.add(slug);
    out.push({
      _id: r._id,
      slug,
      title: r.title.trim(),
      excerpt: (r.excerpt ?? "").trim().slice(0, 140),
      type: r.category && types.has(r.category) ? r.category : inferCategory(slug, r.title),
      keywords: (r.keywords ?? []).filter((k): k is string => typeof k === "string" && k.trim() !== ""),
    });
  }
  if (out.length === 0) {
    throw new Error("Sanity returned no published blog posts. Refusing to build a site with an empty blog. Check NEXT_PUBLIC_SANITY_DATASET.");
  }
  out.sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync(path.join(ROOT, "lib", "blog-index.json"), JSON.stringify(out, null, 1) + "\n");
  console.log(`  ✓ lib/blog-index.json — ${out.length} posts from Sanity`);
}

main().catch((err) => {
  console.error(`  ✗ gen-blog-index: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
