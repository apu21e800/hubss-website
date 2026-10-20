/**
 * "Stamped asphalt" in the link text, 20 Oct 2026: Job 4 of Vern's SEO
 * brief. "Stamped asphalt" is the site's best search term outside HUB's own
 * names, /products/streetprint is the page Google ranks for it, and nearly
 * every link to that page says only "StreetPrint". Runs on Vern's PC: Sanity
 * writes need the write token in .env.local, which the cloud sessions do
 * not have.
 *
 *   npx tsx scripts/stamped-asphalt-links.ts           # dry run (the default): reads the public API, shows every change, writes nothing, needs no token
 *   npx tsx scripts/stamped-asphalt-links.ts --apply   # writes them, with SANITY_API_WRITE_TOKEN from .env.local
 *
 * In the five posts in SLUGS, and nothing else:
 *  - every link to /products/streetprint gets "stamped asphalt" in its text:
 *    "see StreetPrint" becomes "see StreetPrint stamped asphalt", a bare
 *    "StreetPrint" becomes "StreetPrint stamped asphalt" (or takes in the
 *    words that follow it, when the sentence already goes on "stamped
 *    asphalt"), and a link that already says "stamped asphalt" is left alone;
 *  - a post with no such link gets one, on the first mention of "stamped
 *    asphalt" in a paragraph or a list item (failing that, of "StreetPrint").
 * Only the body blocks that change are written, one patch per block
 * (body[_key=="..."]); a document's patches go in one transaction that checks
 * the revision the script read (ifRevisionID), so a post edited mid-run is
 * left alone. With --apply it reads with the token, so an unpublished draft
 * of one of these posts gets the same change (publishing the draft later
 * then keeps it); the dry run can't see drafts, and says so.
 *
 * The rule for new articles is in the writers' glossary since the same day
 * (lib/glossary.ts). The page's own heading is Doug's copy: asked, not
 * changed.
 */
import { createClient, type SanityClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";

// The five published posts whose slug contains "stamped-asphalt" (Vern's SEO
// brief, Job 4, 20 Oct 2026).
export const SLUGS = [
  "how-stamped-asphalt-is-installed",
  "residential-driveways-stamped-asphalt",
  "residential-driveways-stamped-asphalt-upgrade",
  "stamped-asphalt-parking-lot",
  "stamped-asphalt-vs-concrete",
] as const;

/** The link a post gets, as Studio's link field stores it (a full URL; PostBody prints it relative). */
export const HREF = "https://hubss.com/products/streetprint";
/** /products/streetprint, relative or on hubss.com, with or without a trailing slash, query or anchor. */
const TO_STREETPRINT = /^(?:https?:\/\/(?:www\.)?hubss\.com)?\/products\/streetprint\/?(?:[?#].*)?$/i;
const PHRASE = /stamped asphalt/i;

export interface Span { _type: "span"; _key: string; text: string; marks?: string[] }
export interface MarkDef { _type: string; _key: string; href?: string; [k: string]: unknown }
type Child = Span | { _type: string; _key: string; [k: string]: unknown };
export interface Block { _type: string; _key: string; style?: string; listItem?: string; children?: Child[]; markDefs?: MarkDef[]; [k: string]: unknown }

/** One change, as the dry run prints it. */
export interface LinkChange { block: string; before: string; after: string }

export interface PostPlan {
  /** The blocks to write, whole, by _key. */
  blocks: Block[];
  changes: LinkChange[];
  /** Links already saying "stamped asphalt", left alone. */
  kept: string[];
  /** What the script could not fix by itself, for a person in Studio. */
  left: string[];
}

const isSpan = (c: unknown): c is Span => !!c && (c as Span)._type === "span" && typeof (c as Span).text === "string";
const isStreetPrintLink = (d: MarkDef) => d._type === "link" && TO_STREETPRINT.test((d.href ?? "").trim());
/** A span carrying no annotation (no link), only decorators such as bold. */
const plainSpan = (b: Block, s: Span) => !(s.marks ?? []).some((m) => (b.markDefs ?? []).some((d) => d._key === m));
const isProse = (b: Block) => b._type === "block" && (!b.style || b.style === "normal");

/** From 60 characters before `start` to 50 after `end`, so a long paragraph prints as one line. */
function around(text: string, start: number, end: number): string {
  const from = Math.max(0, start - 60);
  const to = Math.min(text.length, end + 50);
  return `${from > 0 ? "..." : ""}${text.slice(from, to)}${to < text.length ? "..." : ""}`;
}

/** The block as a reader sees it, the link `key` written [text](/products/streetprint), cut to the words around it. */
function shown(b: Block, key: string): string {
  let text = "";
  let start = -1;
  let end = -1;
  let open = false;
  for (const s of (b.children ?? []).filter(isSpan)) {
    const inLink = !!s.marks?.includes(key);
    if (inLink && !open) { if (start < 0) start = text.length; text += "["; open = true; }
    if (!inLink && open) { text += "](/products/streetprint)"; end = text.length; open = false; }
    text += s.text;
  }
  if (open) { text += "](/products/streetprint)"; end = text.length; }
  return start < 0 ? text : around(text, start, end);
}

/** The block's plain text, and where span `i` starts in it. */
function plainText(b: Block, i: number): { text: string; offset: number } {
  const kids = b.children ?? [];
  const before = kids.slice(0, i).filter(isSpan).map((s) => s.text).join("");
  return { text: kids.filter(isSpan).map((s) => s.text).join(""), offset: before.length };
}

function freshKey(b: Block): string {
  const taken = new Set([...(b.children ?? []).map((c) => c._key), ...(b.markDefs ?? []).map((d) => d._key)]);
  let n = 1;
  while (taken.has(`sa${n}`)) n++;
  return `sa${n}`;
}

/**
 * Every link to /products/streetprint in a block given "stamped asphalt" in
 * its text. Pure: returns a new block when something changed.
 */
export function fixLinks(block: Block): { block: Block | null; changes: LinkChange[]; kept: string[]; left: string[] } {
  const defs = (block.markDefs ?? []).filter(isStreetPrintLink);
  const out = { block: null as Block | null, changes: [] as LinkChange[], kept: [] as string[], left: [] as string[] };
  if (!defs.length) return out;
  const next: Block = structuredClone(block);
  for (const def of defs) {
    const kids = next.children ?? [];
    const at = kids.flatMap((c, i) => (isSpan(c) && c.marks?.includes(def._key) ? [i] : []));
    if (!at.length) continue;
    const before = at.map((i) => (kids[i] as Span).text).join("");
    if (PHRASE.test(before)) { out.kept.push(`${block._key}: "${before}"`); continue; }
    const last = kids[at[at.length - 1]] as Span;
    const following = kids[at[at.length - 1] + 1];
    const goesOn = isSpan(following) && plainSpan(next, following) ? /^\s+stamped asphalt\b/i.exec(following.text) : null;
    const old = shown(next, def._key);
    if (goesOn) {
      // "[StreetPrint](...) stamped asphalt is": the link takes in the words
      // that follow, so the sentence says them once.
      last.text += goesOn[0];
      (following as Span).text = (following as Span).text.slice(goesOn[0].length);
    } else {
      const named = at.map((i) => kids[i] as Span).find((s) => /StreetPrint/i.test(s.text));
      if (!named) { out.left.push(`${block._key}: the link "${before}" names neither StreetPrint nor stamped asphalt; give it "stamped asphalt" in Studio`); continue; }
      named.text = named.text.replace(/(StreetPrint)/i, "$1 stamped asphalt");
    }
    next.children = kids.filter((c) => !(isSpan(c) && c.text === ""));
    out.changes.push({ block: block._key, before: old, after: shown(next, def._key) });
  }
  if (out.changes.length) out.block = next;
  return out;
}

/**
 * A link to /products/streetprint on the first mention of "stamped asphalt"
 * (with "StreetPrint " before it, when it has that), in a paragraph or list
 * item, outside any other link; with no such mention, on the first
 * "StreetPrint", which then reads "StreetPrint stamped asphalt". Pure.
 */
export function addLink(body: Block[]): { block: Block; change: LinkChange } | null {
  for (const [pattern, insert] of [[/(?:StreetPrint )?stamped asphalt/i, false], [/StreetPrint/i, true]] as const) {
    for (const block of body.filter(isProse)) {
      const kids = block.children ?? [];
      for (let i = 0; i < kids.length; i++) {
        const s = kids[i];
        if (!isSpan(s) || !plainSpan(block, s)) continue;
        const m = pattern.exec(s.text);
        if (!m) continue;
        const next: Block = structuredClone(block);
        const key = freshKey(next);
        const linked = insert ? `${m[0]} stamped asphalt` : m[0];
        const pieces = ([
          { ...s, text: s.text.slice(0, m.index) },
          { _type: "span", _key: `${key}t`, text: linked, marks: [...(s.marks ?? []), key] },
          { _type: "span", _key: `${key}r`, text: s.text.slice(m.index + m[0].length), marks: [...(s.marks ?? [])] },
        ] satisfies Span[]).filter((p) => p.text !== "");
        next.children = [...kids.slice(0, i), ...pieces, ...kids.slice(i + 1)];
        next.markDefs = [...(next.markDefs ?? []), { _type: "link", _key: key, href: HREF }];
        const { text, offset } = plainText(block, i);
        return { block: next, change: { block: block._key, before: around(text, offset + m.index, offset + m.index + m[0].length), after: shown(next, key) } };
      }
    }
  }
  return null;
}

/** What one post needs: its links fixed, or a first link added. Pure. */
export function planPost(body: Block[]): PostPlan {
  const plan: PostPlan = { blocks: [], changes: [], kept: [], left: [] };
  let links = 0;
  for (const block of body) {
    if (block._type !== "block") continue;
    links += (block.markDefs ?? []).filter(isStreetPrintLink).length;
    const r = fixLinks(block);
    plan.kept.push(...r.kept);
    plan.left.push(...r.left);
    plan.changes.push(...r.changes);
    if (r.block) plan.blocks.push(r.block);
  }
  if (!links) {
    const added = addLink(body);
    if (added) {
      plan.blocks.push(added.block);
      plan.changes.push(added.change);
    } else {
      plan.left.push("no link to /products/streetprint and no mention of stamped asphalt or StreetPrint to put one on");
    }
  }
  return plan;
}

interface Doc { _id: string; _rev: string; slug: string; body?: Block[] | null }

async function main() {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });
  const APPLY = process.argv.includes("--apply");
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (APPLY && !token) {
    console.error("SANITY_API_WRITE_TOKEN is missing from .env.local: nothing written.");
    process.exit(1);
  }
  const config = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-01-01",
    useCdn: false,
  };
  // The dry run reads what the public sees; --apply reads with the token,
  // drafts included, so it changes them too.
  const client: SanityClient = APPLY
    ? createClient({ ...config, perspective: "raw", token })
    : createClient({ ...config, perspective: "published" });

  const docs = await client.fetch<Doc[]>(
    `*[_type == "blogPost" && slug.current in $slugs && !(_id in path("versions.**"))]{ _id, _rev, "slug": slug.current, body }`,
    { slugs: [...SLUGS] }
  );
  const order = (d: Doc) => SLUGS.indexOf(d.slug as (typeof SLUGS)[number]) * 2 + (d._id.startsWith("drafts.") ? 1 : 0);
  docs.sort((a, b) => order(a) - order(b));

  const todo: { doc: Doc; plan: PostPlan }[] = [];
  for (const slug of SLUGS) if (!docs.some((d) => d.slug === slug)) console.log(`\n${slug}\n  not found: nothing to do`);
  for (const doc of docs) {
    const plan = planPost(doc.body ?? []);
    console.log(`\n${doc.slug}${doc._id.startsWith("drafts.") ? " (unpublished draft)" : ""}`);
    for (const c of plan.changes) console.log(`  block ${c.block}\n    old: ${c.before}\n    new: ${c.after}`);
    for (const k of plan.kept) console.log(`  left as it is (already says stamped asphalt): block ${k}`);
    for (const l of plan.left) console.log(`  NOT CHANGED, for Studio: ${l}`);
    if (plan.blocks.length) todo.push({ doc, plan });
  }

  const blocks = todo.reduce((n, t) => n + t.plan.blocks.length, 0);
  console.log(`\n${blocks} block(s) to change in ${todo.length} post(s)${APPLY ? "" : " (dry run: nothing written)"}.`);
  if (!APPLY) {
    console.log("The dry run reads published posts only. --apply reads with the token and changes an unpublished draft of these posts too, if one exists.");
    console.log("Run again with --apply to write.");
    return;
  }

  let written = 0;
  for (const { doc, plan } of todo) {
    const tx = client.transaction();
    plan.blocks.forEach((b, i) => {
      tx.patch(doc._id, { ...(i === 0 ? { ifRevisionID: doc._rev } : {}), set: { [`body[_key=="${b._key}"]`]: b } });
    });
    try {
      await tx.commit();
      written += plan.blocks.length;
      console.log(`  written: ${doc.slug}${doc._id.startsWith("drafts.") ? " (draft)" : ""}, ${plan.blocks.length} block(s)`);
    } catch (err) {
      console.log(`  NOT written: ${doc.slug} (${err instanceof Error ? err.message : err}). Edited since the read? Run it again.`);
    }
  }
  console.log(`\nWritten: ${written} of ${blocks} block(s). Live posts show the change within seconds.`);
}

// Run only when called as a script, so the tests can import the pure parts.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
