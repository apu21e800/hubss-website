/**
 * The 26 Oct 2026 copy review of the blog, applied to Studio. Runs on Vern's
 * PC: Sanity writes need the write token in .env.local.
 *
 *   npx tsx scripts/copy-review-2026-10-26.ts                 # dry run: every change, nothing written
 *   npx tsx scripts/copy-review-2026-10-26.ts --apply         # writes the word edits
 *   npx tsx scripts/copy-review-2026-10-26.ts --case          # also the sentence-case pass on titles and headings
 *   npx tsx scripts/copy-review-2026-10-26.ts --only=<slug>   # one post (dry run unless --apply)
 *
 * Vern, 26 Oct 2026: "a. DDB AAAA creative agency QA pass, with extra
 * attention to making sure the editorial stuff does not read like AI slop,
 * and is worded in a way Doug will not complain about ... Don't re-write
 * everything only improve, it's a lot of posts." Ten reviewers read the 76
 * published posts against docs/STYLE.md and docs/GLOSSARY.md and filed
 * local edits (a phrase, a sentence; never a paragraph); three independent
 * editors then read every edit before it went into this list. Each edit is
 * in scripts/copy-review-2026-10-26.json with the exact text it replaces,
 * its kind (tell, terminology, gobbledygook, paint, spelling, seo, claim)
 * and the reason in Doug's words.
 *
 * How it writes, so nothing Doug edited since the review is overwritten:
 * - A span is addressed by its block's and child's _key, not its position.
 * - An edit is applied only while the span still holds the exact text it
 *   replaces, once; otherwise it is listed under "Left alone" and skipped.
 * - A whole-sentence block whose only span is emptied is removed (unset),
 *   not left as an empty paragraph.
 * - A post's unpublished draft (drafts.<id>), when it has one, gets the same
 *   edits where its text still matches, so publishing the draft later does
 *   not bring the old wording back.
 * - Every write carries the document's revision (ifRevisionId): a post
 *   edited while the script runs is left alone and reported.
 * - The case pass (titles and headings to sentence case, docs/STYLE.md) is
 *   a separate decision: `--case` turns it on. A heading that also had a
 *   word edit is recased from its edited text.
 * - After the edits, every changed span is read by the house-style check
 *   (lib/style-lint.ts flagSentences); anything it still flags is printed
 *   as a note, never written back.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";
import { flagSentences, describeIssue } from "../lib/style-lint";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local") });

const APPLY = process.argv.includes("--apply");
const CASE = process.argv.includes("--case");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
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

interface Edit {
  slug: string;
  /** The published document's _id. */
  doc: string;
  /** The span, addressed by key: body[_key=="k4"].children[_key=="k5"].text, title, seo.metaTitle, featuredImage.alt ... */
  sanity: string;
  from: string;
  to: string;
  kind: string;
  why: string;
  group: "words" | "case";
  /** Set when the edit empties a block's only span: the block to remove instead. */
  unset?: string;
}

const LIST = JSON.parse(readFileSync(path.join(ROOT, "scripts/copy-review-2026-10-26.json"), "utf8")) as { generated: string; edits: Edit[] };

// ── Reading and writing a value at a key path ────────────────────────────────

type Seg = { key: string } | { index: number } | { field: string };

/** 'body[_key=="k4"].children[_key=="k5"].text' -> segments. */
function segments(p: string): Seg[] {
  const out: Seg[] = [];
  const re = /([A-Za-z_][\w]*)|\[_key=="([^"]+)"\]|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(p))) {
    if (m[1]) out.push({ field: m[1] });
    else if (m[2]) out.push({ key: m[2] });
    else out.push({ index: Number(m[3]) });
  }
  return out;
}

function readAt(doc: unknown, p: string): unknown {
  let cur: unknown = doc;
  for (const s of segments(p)) {
    if (cur == null) return undefined;
    if ("field" in s) cur = (cur as Record<string, unknown>)[s.field];
    else if ("index" in s) cur = Array.isArray(cur) ? cur[s.index] : undefined;
    else cur = Array.isArray(cur) ? cur.find((x) => x && typeof x === "object" && (x as { _key?: string })._key === s.key) : undefined;
  }
  return cur;
}

/** The block a span path sits in: 'body[_key=="k4"]' from a longer path, or null for a flat field. */
function blockOf(p: string): string | null {
  const m = /^body\[_key=="[^"]+"\]/.exec(p);
  return m ? m[0] : null;
}

// ── The plan for one document ────────────────────────────────────────────────

interface Change { path: string; before: string; after: string; edits: Edit[] }
interface Plan { id: string; rev: string; slug: string; set: Record<string, string>; unset: string[]; changes: Change[]; left: string[] }

function plan(doc: Record<string, unknown>, edits: Edit[]): Plan {
  const id = doc._id as string;
  const rev = doc._rev as string;
  const slug = edits[0].slug;
  const bySpan = new Map<string, Edit[]>();
  for (const e of edits) {
    if (e.group === "case" && !CASE) continue;
    const lst = bySpan.get(e.sanity) ?? [];
    lst.push(e);
    bySpan.set(e.sanity, lst);
  }
  const p: Plan = { id, rev, slug, set: {}, unset: [], changes: [], left: [] };
  for (const [spanPath, lst] of bySpan) {
    const current = readAt(doc, spanPath);
    if (typeof current !== "string") {
      p.left.push(`${spanPath}: not a text in this document (${lst.length} edit${lst.length === 1 ? "" : "s"})`);
      continue;
    }
    let text = current;
    const applied: Edit[] = [];
    let unsetBlock: string | undefined;
    // words first, in the order filed; the case edit last, on the result
    const ordered = [...lst.filter((e) => e.group === "words"), ...lst.filter((e) => e.group === "case")];
    for (const e of ordered) {
      if (e.group === "case") {
        if (text !== e.from) { p.left.push(`${spanPath}: the heading no longer reads «${short(e.from)}» (case pass skipped)`); continue; }
        text = e.to; applied.push(e); continue;
      }
      const n = count(text, e.from);
      if (n !== 1) {
        p.left.push(`${spanPath}: «${short(e.from)}» ${n === 0 ? "is no longer there" : `occurs ${n} times`} (${e.kind}: ${e.why})`);
        continue;
      }
      text = text.replace(e.from, e.to);
      applied.push(e);
      if (e.unset) unsetBlock = e.unset;
    }
    if (!applied.length) continue;
    if (unsetBlock && text.trim() === "") {
      // the edit emptied the block's only span: remove the block, if it is still a one-span block
      const blk = readAt(doc, unsetBlock) as { children?: unknown[] } | undefined;
      if (blk && Array.isArray(blk.children) && blk.children.length === 1) {
        p.unset.push(unsetBlock);
        p.changes.push({ path: unsetBlock, before: current, after: "(paragraph removed)", edits: applied });
        continue;
      }
    }
    if (text === current) continue;
    p.set[spanPath] = text;
    p.changes.push({ path: spanPath, before: current, after: text, edits: applied });
  }
  return p;
}

function count(hay: string, needle: string): number {
  if (!needle) return 0;
  let n = 0, i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
  return n;
}

const short = (s: string) => (s.length > 70 ? `${s.slice(0, 67)}...` : s);

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const edits = LIST.edits.filter((e) => !ONLY || e.slug === ONLY);
  if (!edits.length) {
    console.log(ONLY ? `No edits for ${ONLY}.` : "No edits.");
    return;
  }
  const byDoc = new Map<string, Edit[]>();
  for (const e of edits) byDoc.set(e.doc, [...(byDoc.get(e.doc) ?? []), e]);
  const ids = [...byDoc.keys()];
  const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in $ids || _id in $drafts]`, {
    ids,
    drafts: ids.map((i) => `drafts.${i}`),
  });
  const byId = new Map(docs.map((d) => [d._id as string, d]));

  const plans: Plan[] = [];
  const missing: string[] = [];
  for (const [id, lst] of byDoc) {
    const live = byId.get(id);
    if (!live) { missing.push(`${lst[0].slug} (${id})`); continue; }
    plans.push(plan(live, lst));
    const draft = byId.get(`drafts.${id}`);
    if (draft) plans.push(plan(draft, lst));
  }

  let spans = 0, applied = 0, left = 0, styleNotes = 0;
  for (const p of plans) {
    const n = p.changes.length;
    if (!n && !p.left.length) continue;
    console.log(`\n${p.slug}${p.id.startsWith("drafts.") ? " (unpublished draft)" : ""}: ${n} change${n === 1 ? "" : "s"}`);
    for (const c of p.changes) {
      spans++; applied += c.edits.length;
      console.log(`  ${c.path}`);
      console.log(`    - ${c.before}`);
      console.log(`    + ${c.after}`);
      for (const e of c.edits) console.log(`      (${e.kind}) ${e.why}`);
      if (c.after !== "(paragraph removed)") {
        const heading = /\.(title|metaTitle)$|^title$/.test(c.path) ? "whole" : "none";
        for (const f of flagSentences(c.after, { headings: heading, contact: false })) {
          for (const i of f.issues) { styleNotes++; console.log(`      note: ${describeIssue(i)}`); }
        }
      }
    }
    for (const l of p.left) { left++; console.log(`  left alone: ${l}`); }
  }
  if (missing.length) console.log(`\nNot in Studio any more (${missing.length}): ${missing.join(", ")}`);

  const docsToWrite = plans.filter((p) => p.changes.length);
  console.log(`\n${applied} edits on ${spans} spans in ${docsToWrite.length} documents${CASE ? " (case pass included)" : " (word edits only; --case adds the sentence-case pass)"}; ${left} left alone${styleNotes ? `; ${styleNotes} house-style notes (warnings only)` : ""}.`);
  if (!APPLY) {
    console.log("Dry run: nothing written. Run again with --apply to write.");
    return;
  }

  let written = 0;
  for (const p of docsToWrite) {
    try {
      let patch = client.patch(p.id).ifRevisionId(p.rev);
      if (Object.keys(p.set).length) patch = patch.set(p.set);
      if (p.unset.length) patch = patch.unset(p.unset);
      await patch.commit({ autoGenerateArrayKeys: true });
      written++;
    } catch (err) {
      console.log(`  NOT written: ${p.slug}${p.id.startsWith("drafts.") ? " (draft)" : ""} (${err instanceof Error ? err.message : err})`);
    }
  }
  console.log(`\nWritten: ${written} of ${docsToWrite.length}. The site shows the published posts' changes within seconds.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
