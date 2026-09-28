/**
 * scripts/plan-photo-text.ts: the words on the photos, planned without the photos.
 *
 * Compares the alt text and captions Sanity holds for every product,
 * application and page photo with what the site writes for them today
 * (scripts/lib/photo-plan.ts, the same plan `photos:sync` uses), and writes the
 * differences as a plan file of text-only patches. Nothing is uploaded and no
 * photo, order or asset changes: only `alt` and `caption` on photos Sanity
 * already has, matched by the photo's own /public path (`origin`), never by
 * position.
 *
 * Why it exists: the 27 Sep 2026 copy pass changed how captions are written
 * (no em dashes, TrafficPatternsXD named as thermoplastic), and a full
 * `photos:sync` to carry 2,500 new sentences would re-set every gallery. This
 * carries only the sentences.
 *
 * Reads the public dataset, so it needs no token:
 *   npx tsx scripts/plan-photo-text.ts <out.json>
 * The plan is applied on Vern's machine with .sanity-work/sanity_apply.py
 * (dry run first, backup, one transaction per document, ifRevisionID on each).
 * After that, `npm run photos:check` reports every document matching.
 */
import fs from "fs";
import { createClient } from "@sanity/client";
import { planProducts, planApplications, planPages, type PlannedPhoto, type Target } from "./lib/photo-plan";

const out = process.argv[2];
if (!out) {
  console.error("Usage: npx tsx scripts/plan-photo-text.ts <out.json>");
  process.exit(1);
}

const client = createClient({
  projectId: "9dbro2m1",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
});

type Img = { _key?: string; alt?: string; caption?: string; origin?: string } | null;
type Doc = { _id: string; _rev: string; heroImage: Img; homeHero: Img; aboutHero: Img; gallery: Img[] | null };

async function main() {
  const targets: Target[] = [...planProducts(), ...planApplications(), ...planPages()];
  const img = `{ _key, alt, caption, "origin": select(originAsset == asset._ref => origin, asset->source.url) }`;
  const docs: Doc[] = await client.fetch(
    `*[_id in $ids]{ _id, _rev, "heroImage": heroImage${img}, "homeHero": homepageHero.heroImage1${img}, "aboutHero": aboutHero.heroImage${img}, "gallery": gallery[]${img} }`,
    { ids: targets.map((t) => t.docId) },
  );
  const byId = new Map(docs.map((d) => [d._id, d]));

  const planDocs: { id: string; rev: string; set: Record<string, string>; expect: Record<string, string> }[] = [];
  let unmatched = 0;
  for (const t of targets) {
    const d = byId.get(t.docId);
    if (!d) continue;
    const set: Record<string, string> = {};
    const expect: Record<string, string> = {};
    const note = (path: string, got: string | undefined, want: string | undefined) => {
      if (want === undefined || got === want) return;
      set[path] = want;
      if (got !== undefined) expect[path] = got;
    };

    const hero = t.heroField === "homepageHero.heroImage1" ? d.homeHero : t.heroField === "aboutHero.heroImage" ? d.aboutHero : d.heroImage;
    if (hero && hero.origin === t.hero.src) {
      note(`${t.heroField}.alt`, hero.alt, t.hero.alt);
    }

    if (t.gallery && d.gallery) {
      const bySrc = new Map<string, PlannedPhoto>(t.gallery.map((g) => [g.src, g]));
      for (const g of d.gallery) {
        if (!g?._key) continue;
        const want = g.origin ? bySrc.get(g.origin) : undefined;
        if (!want) { unmatched++; continue; }
        note(`gallery[_key=="${g._key}"].alt`, g.alt, want.alt);
        note(`gallery[_key=="${g._key}"].caption`, g.caption, want.caption);
      }
    }
    if (Object.keys(set).length) planDocs.push({ id: d._id, rev: d._rev, set, expect });
  }

  const fields = planDocs.reduce((n, d) => n + Object.keys(d.set).length, 0);
  fs.writeFileSync(out, JSON.stringify({ label: "photo-text", docs: planDocs }, null, 1) + "\n");
  console.log(`${planDocs.length} documents, ${fields} fields to change; ${unmatched} Sanity photos have no match in the plan (left alone).`);
  const dashes = planDocs.flatMap((d) => Object.values(d.set)).filter((v) => /—/.test(v)).length;
  if (dashes) console.log(`WARNING: ${dashes} planned values still contain an em dash.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
