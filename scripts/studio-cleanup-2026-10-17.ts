/**
 * Studio clean-up, 17 Oct 2026, from Doug's round the same day. Runs on
 * Vern's PC: Sanity writes need the write token in .env.local, which the
 * cloud sessions do not have.
 *
 *   npx tsx scripts/studio-cleanup-2026-10-17.ts           # dry run: shows every change, writes nothing
 *   npx tsx scripts/studio-cleanup-2026-10-17.ts --apply   # writes them
 *
 * What it changes, each only while Studio still holds the value it replaces
 * (anything edited since is skipped and listed, never overwritten):
 *  1. The homepage's systems heading: "Ten systems, ten different jobs." to
 *     "Ten systems, endless applications." (Doug, 17 Oct: "change to 'Ten
 *     systems endless job types' or something to that effect"; Vern, the
 *     same day: "endless applications I think"). The code fallback
 *     (lib/homepage-copy.ts) says the same since this commit. To use another
 *     second phrase, change ACCENT below before running, or edit the line in
 *     Studio afterwards (Edit on the page, click the heading).
 *  2. The hero's second-button label, where Studio still holds the 14 Oct
 *     wording "Open the Product Book": it prints only while the book is
 *     switched off, but the old name should not sit in Studio either.
 *  3. The homepage blog section's eyebrow, "Insights" to "Projects" (Vern,
 *     17 Oct, evening: "instead of insights call them Projects... !!! see
 *     top nav"). Folded into change 4 the same night.
 *  4. The lines the 17 Oct copy review rewrote (lib/copy-superseded.ts, one
 *     list for this script and for the pages): the homepage section lines,
 *     the About hero and story, the Contact lead, three Lunch & Learn
 *     answers. The site already prints the new lines where Studio still
 *     holds the old ones; this makes Studio say what the pages say.
 *
 * A document with an unpublished draft gets the same change in the draft,
 * so publishing the draft later does not undo it. Every write checks the
 * document's revision (ifRevisionId), so a document edited mid-run is left
 * alone. scripts/studio-cleanup-2026-10-16.ts is the pattern.
 */
import { createClient, type SanityClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import { flagSentences, describeIssue } from "../lib/style-lint";
import { SUPERSEDED } from "../lib/copy-superseded";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local") });

const APPLY = process.argv.includes("--apply");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (APPLY && !token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local: nothing written.");
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "raw",
  token: token || undefined,
});

// ── 1. The homepage's systems heading
/** The second phrase: Doug's "endless job types" in the site's own word (Vern, 17 Oct 2026: "endless applications I think"). */
const ACCENT = "endless applications.";
const HEADING = {
  id: "page-homepage",
  from: { heading: "Ten systems,", headingAccent: "ten different jobs." },
  to: { heading: "Ten systems,", headingAccent: ACCENT },
};

// ── 2. The hero's second button: the book's old name
const CTA = {
  id: "page-homepage",
  from: "Open the Product Book",
  to: "Open the Product Portfolio Book",
};

type Change = { id: string; rev: string; label: string; set: Record<string, string> };
const changes: Change[] = [];
const skipped: string[] = [];
let styleProblems = 0;

function style(label: string, text: string) {
  for (const f of flagSentences(text)) {
    for (const issue of f.issues) {
      styleProblems++;
      console.log(`  style  ${label}: ${describeIssue(issue)}  "${f.text}"`);
    }
  }
}

async function withDraft<T extends { _id: string; _rev: string }>(id: string, projection: string): Promise<T[]> {
  return client.fetch<T[]>(`*[_id in [$id, $draft]]${projection}`, { id, draft: `drafts.${id}` });
}

/** A dotted path with array indexes ("homepageSections.audiences[0].desc", "aboutStory[1]") read from a document. */
function readPath(doc: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, part) => {
    const m = /^([^[]+)(?:\[(\d+)\])?$/.exec(part);
    if (!m || !o || typeof o !== "object") return undefined;
    const v = (o as Record<string, unknown>)[m[1]];
    return m[2] === undefined ? v : Array.isArray(v) ? v[Number(m[2])] : undefined;
  }, doc);
}

async function main() {
  // 1. Heading
  {
    const docs = await withDraft<{ _id: string; _rev: string; s?: { heading?: string; headingAccent?: string } }>(HEADING.id, "{_id, _rev, \"s\": homepageSections.systems}");
    if (!docs.length) skipped.push(`${HEADING.id}: not found`);
    for (const d of docs) {
      if (d.s?.heading === HEADING.from.heading && d.s?.headingAccent === HEADING.from.headingAccent) {
        style(`${d._id} systems heading`, `${HEADING.to.heading} ${HEADING.to.headingAccent}`);
        changes.push({ id: d._id, rev: d._rev, label: "homepage systems heading", set: { "homepageSections.systems.heading": HEADING.to.heading, "homepageSections.systems.headingAccent": HEADING.to.headingAccent } });
      } else if (d.s?.heading !== HEADING.to.heading || d.s?.headingAccent !== HEADING.to.headingAccent) {
        skipped.push(`${d._id}: systems heading is "${d.s?.heading} ${d.s?.headingAccent}", left as it is`);
      }
    }
  }
  // 2. Second-button label
  {
    const docs = await withDraft<{ _id: string; _rev: string; cta?: string }>(CTA.id, "{_id, _rev, \"cta\": homepageHero.cta2Label}");
    for (const d of docs) {
      const now = d.cta ?? "";
      if (now === CTA.from) {
        changes.push({ id: d._id, rev: d._rev, label: "homepage second button label", set: { "homepageHero.cta2Label": CTA.to } });
      } else if (now && now !== CTA.to && /\bProduct Book\b/.test(now)) {
        skipped.push(`${d._id}: second button label is "${now}", left as it is (change it in Studio)`);
      }
    }
  }

  // 3 and 4. The superseded lines, by document: one patch per document
  // (and per draft), each field only while it still holds the old line.
  {
    const byDoc = new Map<string, typeof SUPERSEDED>();
    for (const s of SUPERSEDED) byDoc.set(s.doc, [...(byDoc.get(s.doc) ?? []), s]);
    for (const [id, lines] of byDoc) {
      const docs = await withDraft<{ _id: string; _rev: string } & Record<string, unknown>>(id, "");
      if (!docs.length) { skipped.push(`${id}: not found`); continue; }
      for (const d of docs) {
        const set: Record<string, string> = {};
        for (const s of lines) {
          const now = readPath(d, s.path);
          if (now === s.from) { set[s.path] = s.to; style(`${d._id} ${s.path}`, s.to); }
          else if (now !== s.to) skipped.push(`${d._id}: ${s.path} is ${JSON.stringify(now)}, left as it is`);
        }
        if (Object.keys(set).length) changes.push({ id: d._id, rev: d._rev, label: `${id}: ${Object.keys(set).length} superseded line(s)`, set });
      }
    }
  }

  console.log(`\n${changes.length} documents to change${APPLY ? "" : " (dry run: nothing written)"}:`);
  for (const c of changes) {
    console.log(`  ${c.label}${c.id.startsWith("drafts.") ? " (draft)" : ""}`);
    for (const [k, v] of Object.entries(c.set)) console.log(`      ${k} = ${v}`);
  }
  if (skipped.length) {
    console.log(`\nLeft alone (${skipped.length}):`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  if (styleProblems) console.log(`\n${styleProblems} house-style notes above (warnings only).`);
  if (!APPLY) {
    console.log("\nDry run. Run again with --apply to write.");
    return;
  }

  let written = 0;
  for (const c of changes) {
    try {
      await client.patch(c.id).ifRevisionId(c.rev).set(c.set).commit({ autoGenerateArrayKeys: true });
      written++;
    } catch (err) {
      console.log(`  NOT written: ${c.label} (${err instanceof Error ? err.message : err})`);
    }
  }
  console.log(`\nWritten: ${written} of ${changes.length}. The site picks them up within minutes.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
