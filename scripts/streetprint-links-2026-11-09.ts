/**
 * A link to /products/streetprint at the first mention of StreetPrint stamped
 * asphalt, in seven posts that name it and link to it nowhere (the stamped
 * asphalt ranking review, 9 Nov 2026). Runs on Vern's PC: Sanity writes need
 * the write token in .env.local, which the cloud sessions do not have.
 *
 *   npx tsx scripts/streetprint-links-2026-11-09.ts           # dry run (the default): reads the public API, shows every change, writes nothing, needs no token
 *   npx tsx scripts/streetprint-links-2026-11-09.ts --apply   # writes them, with SANITY_API_WRITE_TOKEN from .env.local
 *
 * Search Console (Canada, 9 Aug to 7 Nov 2026): Google shows fifteen hubss.com
 * pages for "stamped asphalt" and /products/streetprint averages about #3.
 * The posts that explain stamped asphalt already link to it with the words in
 * the link (scripts/stamped-asphalt-links.ts, 20 Oct 2026). These seven say
 * "StreetPrint stamped asphalt" (or "StreetPrint (Genuine Stamped Asphalt)")
 * and link nowhere, so each gets one link, on those words, in the paragraph
 * named below: the glossary's rule for new articles since 20 Oct
 * (lib/glossary.ts), applied to old ones. Nothing else in a post changes.
 *
 * Each change is checked before it is written: the paragraph and the words
 * are where the plan says, the words carry no link already, and the post has
 * no link to /products/streetprint anywhere (one that does is left alone).
 * One patch per post, on the one paragraph (body[_key=="..."]), checking the
 * revision the script read (ifRevisionID), so a post edited mid-run is left
 * alone. With --apply it reads with the token, so an unpublished draft of one
 * of these posts gets the same change when its paragraph still reads the same.
 *
 * Left out on purpose: asphalt-concrete-renewal (its one mention is a heading),
 * stamped-asphalt-parking-lot (its stamped asphalt is TrafficPatternsXD's),
 * decorative-asphalt-high-traffic (the same), and the posts whose "stamped
 * asphalt" names no system.
 */
import { createClient, type SanityClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import type { Block, MarkDef, Span } from "./stamped-asphalt-links";

export const HREF = "https://hubss.com/products/streetprint";

export interface LinkPlan {
  slug: string;
  /** The paragraph's _key and the span's _key, as read on 9 Nov 2026. */
  block: string;
  span: string;
  /** The words that become the link: their first appearance in the span. */
  words: string;
}

export const PLAN: LinkPlan[] = [
  { slug: "commercial-spaces-decorative-pavement", block: "k9", span: "k8", words: "StreetPrint stamped asphalt" },
  { slug: "community-branding-case-study", block: "kr", span: "kq", words: "Genuine Stamped Asphalt" },
  { slug: "decorative-crosswalks-community-identity", block: "ki", span: "kh", words: "StreetPrint stamped asphalt" },
  { slug: "pedestrian-channelization-public-spaces", block: "k7", span: "k6", words: "StreetPrint (Genuine Stamped Asphalt)" },
  { slug: "roadway-accents-natures-walk", block: "k6", span: "k5", words: "stamped asphalt" },
  { slug: "streetbond-leed-urban-heat-island", block: "k9", span: "k8", words: "StreetPrint stamped asphalt" },
  { slug: "traffic-calming-surface-design", block: "k9", span: "k8", words: "StreetPrint stamped asphalt" },
];

const TO_STREETPRINT = /^(?:https?:\/\/(?:www\.)?hubss\.com)?\/products\/streetprint\/?(?:[?#].*)?$/i;
const isSpan = (c: unknown): c is Span => !!c && (c as Span)._type === "span" && typeof (c as Span).text === "string";
const linksToStreetPrint = (body: Block[]) =>
  body.some((b) => (b.markDefs ?? []).some((d: MarkDef) => d._type === "link" && TO_STREETPRINT.test((d.href ?? "").trim())));

export interface Result {
  /** The paragraph to write, whole; null when nothing is written. */
  block: Block | null;
  /** What a reader sees before and after, the link in [brackets]; or why nothing changed. */
  before?: string;
  after?: string;
  skipped?: string;
}

/** The plan applied to one post's body. Pure. */
export function linkPost(body: Block[], plan: LinkPlan): Result {
  if (linksToStreetPrint(body)) return { block: null, skipped: "the post already links to /products/streetprint" };
  const block = body.find((b) => b._key === plan.block);
  if (!block || block._type !== "block") return { block: null, skipped: `no paragraph ${plan.block}` };
  const kids = block.children ?? [];
  const at = kids.findIndex((c) => c._key === plan.span);
  const span = kids[at];
  if (!isSpan(span)) return { block: null, skipped: `no span ${plan.span} in paragraph ${plan.block}` };
  const annotations = new Set((block.markDefs ?? []).map((d) => d._key));
  if ((span.marks ?? []).some((m) => annotations.has(m))) return { block: null, skipped: `span ${plan.span} is already inside a link` };
  const i = span.text.indexOf(plan.words);
  if (i < 0) return { block: null, skipped: `"${plan.words}" is no longer in paragraph ${plan.block}` };

  const key = `${plan.span}sp1109`;
  if ((block.markDefs ?? []).some((d) => d._key === `${key}link`) || kids.some((c) => String(c._key).startsWith(key))) {
    return { block: null, skipped: "already changed" };
  }
  const marks = span.marks ?? [];
  const pieces = ([
    { _type: "span", _key: `${key}a`, text: span.text.slice(0, i), marks: [...marks] },
    { _type: "span", _key: `${key}b`, text: plan.words, marks: [...marks, `${key}link`] },
    { _type: "span", _key: `${key}c`, text: span.text.slice(i + plan.words.length), marks: [...marks] },
  ] as Span[]).filter((s) => s.text !== "");
  const next: Block = {
    ...structuredClone(block),
    children: [...kids.slice(0, at), ...pieces, ...kids.slice(at + 1)],
    markDefs: [...(block.markDefs ?? []), { _type: "link", _key: `${key}link`, href: HREF }],
  };
  const from = Math.max(0, i - 60);
  const to = Math.min(span.text.length, i + plan.words.length + 50);
  const cut = (s: string) => `${from > 0 ? "..." : ""}${s}${to < span.text.length ? "..." : ""}`;
  return {
    block: next,
    before: cut(span.text.slice(from, to)),
    after: cut(`${span.text.slice(from, i)}[${plan.words}](${HREF})${span.text.slice(i + plan.words.length, to)}`),
  };
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
  const client: SanityClient = APPLY
    ? createClient({ ...config, perspective: "raw", token })
    : createClient({ ...config, perspective: "published" });

  const slugs = PLAN.map((p) => p.slug);
  const docs = await client.fetch<Doc[]>(
    `*[_type == "blogPost" && slug.current in $slugs && !(_id in path("versions.**"))]{ _id, _rev, "slug": slug.current, body }`,
    { slugs },
  );

  const todo: { doc: Doc; block: Block }[] = [];
  for (const plan of PLAN) {
    const mine = docs.filter((d) => d.slug === plan.slug).sort((a, b) => Number(a._id.startsWith("drafts.")) - Number(b._id.startsWith("drafts.")));
    if (!mine.length) console.log(`\n${plan.slug}\n  not found: nothing to do`);
    for (const doc of mine) {
      const r = linkPost(doc.body ?? [], plan);
      console.log(`\n${plan.slug}${doc._id.startsWith("drafts.") ? " (unpublished draft)" : ""}`);
      if (!r.block) { console.log(`  left as it is: ${r.skipped}`); continue; }
      console.log(`  paragraph ${plan.block}\n    old: ${r.before}\n    new: ${r.after}`);
      todo.push({ doc, block: r.block });
    }
  }

  console.log(`\n${todo.length} paragraph(s) to change${APPLY ? "" : " (dry run: nothing written)"}.`);
  if (!APPLY) {
    console.log("The dry run reads published posts only. --apply reads with the token and changes an unpublished draft of these posts too, if one exists.");
    console.log("Run again with --apply to write.");
    return;
  }

  let written = 0;
  for (const { doc, block } of todo) {
    try {
      // The same shape as scripts/stamped-asphalt-links.ts: a transaction whose patch checks the revision read.
      await client.transaction().patch(doc._id, { ifRevisionID: doc._rev, set: { [`body[_key=="${block._key}"]`]: block } }).commit();
      written++;
      console.log(`  written: ${doc.slug}${doc._id.startsWith("drafts.") ? " (draft)" : ""}`);
    } catch (err) {
      console.log(`  NOT written: ${doc.slug} (${err instanceof Error ? err.message : err}). Edited since the read? Run it again.`);
    }
  }
  console.log(`\nWritten: ${written} of ${todo.length}. Live posts show the change within seconds.`);
}

// Run only when called as a script, so a test can import the pure parts.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
