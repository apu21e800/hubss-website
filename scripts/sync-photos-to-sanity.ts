/**
 * scripts/sync-photos-to-sanity.ts — the photos move into Sanity.
 *
 * Makes every product and application hero and gallery in Sanity match exactly
 * what the site shows today from /public, and sets the homepage and About hero
 * photos. The disk is the source. Order, curation, cross-posts, alt text and
 * captions all come from the same functions the pages use (lib/asset-scan.ts,
 * lib/image-seo.ts, lib/featured-images.ts), so the result can't drift from
 * what visitors see.
 *
 * Each photo is uploaded once (scripts/lib/sanity-photo-upload.ts, shared with
 * the blog import): at most 2400px on the long edge, JPEG q82, camera metadata
 * stripped. The asset records where it came from (source.name "hubss-public",
 * source.id = sha1 of the original file, source.url = its /public path), so a
 * re-run skips everything already uploaded, and the site can still read SEO
 * keywords from the original folder (lib/photos.ts, `origin`).
 *
 * USAGE (from the repo root)
 *   npm run photos:dry                               # the plan, and what would be uploaded
 *   npm run photos:sync -- --only=mmax --backup=<f>  # one document first
 *   npm run photos:sync -- --backup=<file.json>      # everything
 *   npm run photos:check                             # Sanity vs the plan; exits 1 on any difference
 *
 * A write needs SANITY_API_WRITE_TOKEN in .env.local, and --backup: the current
 * hero and gallery of every document it touches are saved there first.
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { config as loadDotenv } from "dotenv";
import { absPath, sha1Of, uploadedPhotos, uploadMissing } from "./lib/sanity-photo-upload";
import { products } from "../lib/products";
import { applications } from "../lib/applications";
import { galleryFor, altFor } from "../lib/asset-scan";
import { seoCaption, heroAlt } from "../lib/image-seo";
import { productImages, resolveImage } from "../lib/featured-images";

const ROOT = process.cwd();
loadDotenv({ path: path.join(ROOT, ".env.local") });

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const DRY = args.includes("--dry-run");
const CHECK = args.includes("--check");
const ONLY = flag("only");
const BACKUP = flag("backup");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!DRY && !CHECK) {
  if (!token) { console.error("ERROR: SANITY_API_WRITE_TOKEN is missing from .env.local."); process.exit(1); }
  if (!BACKUP) { console.error("ERROR: a write needs --backup=<file.json> (the current photos are saved there first)."); process.exit(1); }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  // A stalled upload errors after two minutes and is retried
  // (scripts/lib/sanity-photo-upload.ts) instead of hanging the run.
  timeout: 120_000,
  perspective: "published",
  token: token || undefined,
});

// ─── The plan: what each page shows today ──────────────────────────────────

interface PlannedPhoto { src: string; alt: string; caption?: string }
interface Target {
  label: string;            // slug, or "homepage" / "about"
  docId: string;
  heroField: string;        // path of the hero image field in the document
  hero: PlannedPhoto;
  gallery: PlannedPhoto[] | null;  // null: this document has no gallery (pages)
}

function planProducts(): Target[] {
  return products.filter((p) => !p.comingSoon).map((p) => {
    const featured = productImages[p.slug] ? resolveImage(productImages[p.slug]) : null;
    const bannerSrc = featured?.src ?? p.imageUrl;
    const fromFolder = galleryFor(bannerSrc, p.gallery, `images/products/${p.slug}`);
    return {
      label: p.slug,
      docId: `product-${p.slug}`,
      heroField: "heroImage",
      hero: { src: bannerSrc, alt: featured?.alt ?? `${p.name} — ${p.shortDesc}` },
      gallery: (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
        src,
        alt: altFor(src, `${p.name} decorative pavement by HUB Surface Systems`),
        caption: seoCaption(src) ?? altFor(src, p.name),
      })),
    };
  });
}

function planApplications(): Target[] {
  return applications.map((a) => {
    const fromFolder = galleryFor(a.imageUrl, a.gallery, `images/applications/${a.slug}`);
    return {
      label: a.slug,
      docId: `application-${a.slug}`,
      heroField: "heroImage",
      hero: { src: a.imageUrl, alt: altFor(a.imageUrl, `${a.name} surface systems by HUB — Canadian installation`) },
      gallery: (fromFolder.length > 0 ? fromFolder : [a.imageUrl]).map((src) => ({
        src,
        alt: altFor(src, `${a.name} surface systems by HUB — Canadian installation`),
        caption: seoCaption(src) ?? altFor(src, a.name),
      })),
    };
  });
}

function planPages(): Target[] {
  // The photos app/page.tsx (HeroSlideshow) and app/about/page.tsx show today.
  return [
    { label: "homepage", docId: "page-homepage", heroField: "homepageHero.heroImage1",
      hero: { src: "/images/hero/hero-1.jpg", alt: heroAlt("/images/hero/hero-1.jpg") }, gallery: null },
    { label: "about", docId: "page-about", heroField: "aboutHero.heroImage",
      hero: { src: "/images/hero/hero-3.jpg", alt: "HUB Surface Systems — Canadian decorative pavement specialists" }, gallery: null },
  ];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const imageValue = (assetId: string, photo: PlannedPhoto, key?: string) => ({
  ...(key ? { _key: key } : {}),
  _type: "image",
  asset: { _type: "reference", _ref: assetId },
  alt: photo.alt,
  ...(photo.caption ? { caption: photo.caption } : {}),
});

const getAt = (doc: Record<string, unknown> | null, dotted: string): unknown =>
  dotted.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), doc);

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const mode = CHECK ? "CHECK" : DRY ? "DRY RUN" : "SYNC";
  console.log(`Photos → Sanity (${mode})`);

  let targets = [...planProducts(), ...planApplications(), ...planPages()];
  if (ONLY) targets = targets.filter((t) => t.label === ONLY);
  if (!targets.length) { console.error(`Nothing matches --only=${ONLY}`); process.exit(1); }

  // Every file named in the plan must exist before anything is uploaded.
  const allSrcs = [...new Set(targets.flatMap((t) => [t.hero.src, ...(t.gallery ?? []).map((g) => g.src)]))];
  const missing = allSrcs.filter((s) => !fs.existsSync(absPath(s)));
  if (missing.length) {
    console.error(`ERROR: ${missing.length} planned photo(s) are not on disk, e.g. ${missing.slice(0, 5).join(", ")}`);
    process.exit(1);
  }

  if (CHECK) return check(targets);

  // What Sanity already has from earlier runs, by the sha1 of the original file.
  const assetBySha = await uploadedPhotos(client);
  const toUpload = allSrcs.filter((s) => !assetBySha.has(sha1Of(s)));

  const docs: Record<string, unknown>[] = await client.fetch(`*[_id in $ids]`, { ids: targets.map((t) => t.docId) });
  const docById = new Map(docs.map((d) => [d._id as string, d]));

  console.log("\n  " + "document".padEnd(26) + "photos".padStart(8) + "in Sanity".padStart(11));
  for (const t of targets) {
    const now = docById.get(t.docId);
    const nowCount = t.gallery ? ((getAt(now ?? null, "gallery") as unknown[] | undefined)?.length ?? 0) : (getAt(now ?? null, t.heroField) ? 1 : 0);
    console.log("  " + t.label.padEnd(26) + String(t.gallery ? t.gallery.length : 1).padStart(8) + String(nowCount).padStart(11) + (now ? "" : "   (no Sanity document!)"));
  }
  console.log(`\n  ${allSrcs.length} distinct photos; ${allSrcs.length - toUpload.length} already uploaded, ${toUpload.length} to upload.`);

  const noDoc = targets.filter((t) => !docById.has(t.docId));
  if (noDoc.length) { console.error(`ERROR: no Sanity document for ${noDoc.map((t) => t.docId).join(", ")}`); process.exit(1); }
  if (DRY) { console.log("\n(dry run — nothing written)"); return; }

  // Back up what is about to be replaced.
  const backup = targets.map((t) => ({ _id: t.docId, field: t.heroField, hero: getAt(docById.get(t.docId) ?? null, t.heroField) ?? null,
    gallery: t.gallery ? getAt(docById.get(t.docId) ?? null, "gallery") ?? null : undefined }));
  fs.mkdirSync(path.dirname(path.resolve(BACKUP!)), { recursive: true });
  fs.writeFileSync(path.resolve(BACKUP!), JSON.stringify({ savedAt: new Date().toISOString(), documents: backup }, null, 2));
  console.log(`\n  Backup of the current photos: ${path.resolve(BACKUP!)}`);

  // Upload what's missing.
  await uploadMissing(client, toUpload, assetBySha);

  // Point every document at its photos, in the site's order.
  for (const t of targets) {
    const set: Record<string, unknown> = { [t.heroField]: imageValue(assetBySha.get(sha1Of(t.hero.src))!, t.hero) };
    if (t.gallery) {
      const seen = new Map<string, number>();
      set.gallery = t.gallery.map((g) => {
        const sha = sha1Of(g.src);
        const n = (seen.get(sha) ?? 0) + 1;
        seen.set(sha, n);
        return imageValue(assetBySha.get(sha)!, g, `p${sha.slice(0, 15)}${n > 1 ? `_${n}` : ""}`);
      });
    }
    await client.patch(t.docId).set(set).commit({ autoGenerateArrayKeys: false });
    console.log(`  ✓ ${t.label}`);
  }
  console.log(`\nDone. ${targets.length} documents updated, ${toUpload.length} photos uploaded. Run npm run photos:check next.`);
}

// ─── Check: Sanity against the plan ─────────────────────────────────────────

async function check(targets: Target[]) {
  type Got = { origin?: string; alt?: string; caption?: string } | null;
  const img = `{ alt, caption, "origin": asset->source.url }`;
  const docs: { _id: string; heroImage: Got; homeHero: Got; aboutHero: Got; gallery: Got[] | null }[] = await client.fetch(
    `*[_id in $ids]{ _id, "heroImage": heroImage${img}, "homeHero": homepageHero.heroImage1${img}, "aboutHero": aboutHero.heroImage${img}, "gallery": gallery[]${img} }`,
    { ids: targets.map((t) => t.docId) }
  );
  const byId = new Map(docs.map((d) => [d._id, d]));
  const heroOf = (d: (typeof docs)[number], field: string): Got =>
    field === "homepageHero.heroImage1" ? d.homeHero : field === "aboutHero.heroImage" ? d.aboutHero : d.heroImage;
  let bad = 0;
  const same = (got: Got | undefined, want: PlannedPhoto) =>
    got?.origin === want.src && got?.alt === want.alt && (got?.caption ?? undefined) === (want.caption ?? undefined);
  for (const t of targets) {
    const d = byId.get(t.docId);
    const problems: string[] = [];
    if (!d) problems.push("no Sanity document");
    else {
      if (!same(heroOf(d, t.heroField), t.hero)) problems.push("hero differs");
      if (t.gallery) {
        const g = d.gallery ?? [];
        if (g.length !== t.gallery.length) problems.push(`gallery has ${g.length}, the site shows ${t.gallery.length}`);
        const firstDiff = t.gallery.findIndex((want, i) => !same(g[i], want));
        if (firstDiff !== -1 && g.length === t.gallery.length) problems.push(`photo ${firstDiff + 1} differs (${t.gallery[firstDiff].src})`);
      }
    }
    if (problems.length) bad++;
    console.log(`  ${problems.length ? "✗" : "✓"} ${t.label.padEnd(24)} ${t.gallery ? `${t.gallery.length} photos` : "hero"}${problems.length ? "  — " + problems.join("; ") : ""}`);
  }
  console.log(bad ? `\n${bad} document(s) differ from what the site shows.` : `\nAll ${targets.length} documents match what the site shows.`);
  process.exit(bad ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
