/**
 * The copy review of 26 Oct 2026, written into Studio. Runs on Vern's PC:
 * Sanity writes need the write token in .env.local, which the cloud sessions
 * do not have.
 *
 *   npx tsx scripts/copy-review-2026-10-26.ts            # dry run: lists every change, writes nothing
 *   npx tsx scripts/copy-review-2026-10-26.ts --apply    # writes the wording edits
 *   npx tsx scripts/copy-review-2026-10-26.ts --case     # dry run of the sentence-case pass (titles and headings)
 *   npx tsx scripts/copy-review-2026-10-26.ts --case --apply
 *   npx tsx scripts/copy-review-2026-10-26.ts --only=<slug>   # one article (either group)
 *
 * What it changes: the edits in scripts/copy-review-2026-10-26.json, one
 * per span of one article (title, standfirst, a span of the body, a search
 * phrase, the SEO title or description, a photo's alt or caption, a table
 * cell), each an exact `from` replaced by `to` inside that span. Vern, 26 Oct
 * 2026: an agency QA pass so the articles read as a senior specifier wrote
 * them and Doug has nothing to pick on: the machine tells (reversals,
 * triplets, filler), the glossary's words (heat-applied, installer, service
 * life, crosswalk, curb), the paint rule, Canadian spelling, light SEO. The
 * `case` group is separate: the older articles' Title Case titles and
 * headings in sentence case, 239 lines, held for Doug's yes (the copy review
 * of 17 Oct 2026, decision 9).
 *
 * Every change is made only while the span still holds the `from` text
 * exactly once; anything edited since is skipped and listed, never
 * overwritten. A document with an unpublished draft gets the same change in
 * the draft, so publishing it later does not undo the edit. Every write
 * checks the document's revision (ifRevisionId). The site shows a written
 * change within minutes (the publish webhook); the menus' and the search's
 * copies of titles follow on the next deploy.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import { flagSentences, describeIssue } from "../lib/style-lint";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local") });

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const GROUP: "words" | "case" = args.includes("--case") ? "case" : "words";
const ONLY = args.find((a) => a.startsWith("--only="))?.slice(7);
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

interface Edit { slug: string; doc: string; path: string; from: string; to: string; kind: string; why: string; group: "words" | "case"; flag?: boolean }
const ALL = (JSON.parse(readFileSync(path.join(ROOT, "scripts/copy-review-2026-10-26.json"), "utf8")) as { edits: Edit[] }).edits;
const edits = ALL.filter((e) => !e.flag && e.group === GROUP && (!ONLY || e.slug === ONLY));

/** A dotted path with array indexes ("body[3].children[0].text", "keywords[2]") read from a document. */
function readPath(doc: unknown, p: string): unknown {
  return p.split(".").reduce<unknown>((o, part) => {
    const m = /^([^[]+)((?:\[\d+\])*)$/.exec(part);
    if (!m || !o || typeof o !== "object") return undefined;
    let v: unknown = (o as Record<string, unknown>)[m[1]];
    for (const idx of m[2].matchAll(/\[(\d+)\]/g)) v = Array.isArray(v) ? v[Number(idx[1])] : undefined;
    return v;
  }, doc);
}

async function withDraft<T extends { _id: string; _rev: string }>(id: string): Promise<T[]> {
  return client.fetch<T[]>(`*[_id in [$id, $draft]]`, { id, draft: `drafts.${id}` });
}

type Change = { id: string; rev: string; slug: string; set: Record<string, string>; lines: string[] };
const changes: Change[] = [];
const skipped: string[] = [];
let styleNotes = 0;

async function main() {
  const byDoc = new Map<string, Edit[]>();
  for (const e of edits) byDoc.set(e.doc, [...(byDoc.get(e.doc) ?? []), e]);
  console.log(`${edits.length} ${GROUP} edit(s) in ${byDoc.size} article(s)${ONLY ? ` (only ${ONLY})` : ""}.`);
  for (const [id, list] of byDoc) {
    const docs = await withDraft<{ _id: string; _rev: string } & Record<string, unknown>>(id);
    if (!docs.length) { skipped.push(`${id}: not found`); continue; }
    for (const d of docs) {
      const set: Record<string, string> = {};
      const lines: string[] = [];
      // Several edits on one span apply in order, each to the span as the
      // one before left it.
      const current = (p: string) => (p in set ? set[p] : readPath(d, p));
      for (const e of list) {
        const now = current(e.path);
        if (typeof now !== "string") { skipped.push(`${d._id} ${e.path}: not a text span (${JSON.stringify(now)?.slice(0, 40)})`); continue; }
        const n = now.split(e.from).length - 1;
        if (n === 0) {
          if (now.includes(e.to)) continue; // already done
          skipped.push(`${d._id} ${e.path}: no longer says ${JSON.stringify(e.from.slice(0, 60))}, left as it is`);
          continue;
        }
        if (n > 1) { skipped.push(`${d._id} ${e.path}: ${JSON.stringify(e.from.slice(0, 60))} occurs ${n} times, left as it is`); continue; }
        const next = now.replace(e.from, e.to);
        set[e.path] = next;
        lines.push(`      ${e.path} [${e.kind}] ${e.why}\n        - ${e.from}\n        + ${e.to}`);
        for (const f of flagSentences(next)) for (const issue of f.issues) { styleNotes++; lines.push(`        style: ${describeIssue(issue)}`); }
      }
      if (Object.keys(set).length) changes.push({ id: d._id, rev: d._rev, slug: list[0].slug, set, lines });
    }
  }

  console.log(`\n${changes.length} document(s) to change${APPLY ? "" : " (dry run: nothing written)"}:`);
  for (const c of changes) {
    console.log(`\n  ${c.slug}${c.id.startsWith("drafts.") ? " (draft)" : ""}: ${Object.keys(c.set).length} span(s)`);
    for (const l of c.lines) console.log(l);
  }
  if (skipped.length) {
    console.log(`\nLeft alone (${skipped.length}):`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  if (styleNotes) console.log(`\n${styleNotes} house-style note(s) above (warnings only).`);
  if (!APPLY) {
    console.log(`\nDry run. Run again with --apply to write${GROUP === "words" ? "; --case for the sentence-case pass" : ""}.`);
    return;
  }
  let written = 0;
  for (const c of changes) {
    try {
      await client.patch(c.id).ifRevisionId(c.rev).set(c.set).commit({ autoGenerateArrayKeys: true });
      written++;
    } catch (err) {
      console.log(`  NOT written: ${c.slug} ${c.id} (${err instanceof Error ? err.message : err})`);
    }
  }
  console.log(`\nWritten: ${written} of ${changes.length}. The articles show the change within minutes; titles in the menus and search follow the next deploy.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
