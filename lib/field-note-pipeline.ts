/**
 * The Field Notes pipeline: plan item → AI draft → fact check → unpublished
 * draft in Studio → an email to the editors.
 *
 * Run by app/api/cron/draft-field-note every Tuesday morning (vercel.json),
 * and on demand from Vercel → Settings → Cron Jobs → Run.
 *
 * What it will never do: publish. It writes a document whose id starts with
 * "drafts.", which Sanity keeps out of the published dataset, so the site
 * (which reads published documents only, lib/sanity.client.ts) can't show it.
 * A person opens it in Studio, checks the notes, edits, and presses Publish.
 */

import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";
import { markdownToPortableText } from "@/lib/markdown-to-portable-text";
import { factsBlock, relatedPostLines } from "@/lib/field-note-facts";
import { writeDraft, checkDraft, type Draft, type FactCheck } from "@/lib/field-note-drafter";
import { getAllPosts } from "@/lib/blog";
import { inferCategory } from "@/lib/blog-taxonomy";
import { FIELD_NOTE_TYPES } from "@/lib/field-notes-taxonomy";

export interface Linked { _id: string; name: string; slug: string; hero?: { asset?: string | null; alt?: string | null } | null }
export interface Idea {
  _id: string;
  title: string;
  status?: string;
  searchPhrase?: string | null;
  type?: string | null;
  brief?: string | null;
  systems?: Linked[] | null;
  applications?: Linked[] | null;
}

export type PipelineResult =
  | { drafted: false; reason: string }
  | { drafted: true; idea: string; slug: string; title: string; factCheck: FactCheck["verdict"]; toCheck: number; notified: string[] };

const LINKED = `{ _id, name, "slug": slug.current, "hero": heroImage{ "asset": asset._ref, alt } }`;
const IDEA = `{ _id, title, status, searchPhrase, type, brief, "systems": systems[]->${LINKED}, "applications": applications[]->${LINKED} }`;

function cleanSlug(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
}

export async function draftNextFieldNote(opts: { ideaId?: string } = {}): Promise<PipelineResult> {
  const client = sanityWriteClient();

  // A plan item is edited live (no draft/publish), so its _id has no "drafts." prefix.
  const idea = await client.fetch<Idea | null>(
    opts.ideaId
      ? `*[_type == "storyIdea" && _id == $id][0]${IDEA}`
      : `*[_type == "storyIdea" && status == "ready" && !(_id in path("drafts.**"))] | order(coalesce(priority, 2) asc, _createdAt asc)[0]${IDEA}`,
    { id: opts.ideaId ?? "" }
  );
  if (!idea) return { drafted: false, reason: opts.ideaId ? `no plan item ${opts.ideaId}` : "no plan item is marked Ready" };

  const systems = (idea.systems ?? []).filter((s): s is Linked => !!s?.slug);
  const apps = (idea.applications ?? []).filter((a): a is Linked => !!a?.slug);
  const facts = factsBlock({ productSlugs: systems.map((s) => s.slug), applicationSlugs: apps.map((a) => a.slug), brief: idea.brief });
  const related = relatedPostLines(await getAllPosts(), systems.map((s) => s.name));

  const draft = await writeDraft({ title: idea.title, searchPhrase: idea.searchPhrase, type: idea.type }, facts, related);
  const check = await checkDraft(draft, facts);

  // A slug nobody uses, drafts included.
  const base = cleanSlug(draft.slug || draft.title) || `field-note-${Date.now()}`;
  let slug = base;
  for (let n = 2; await client.fetch<number>(`count(*[_type == "blogPost" && slug.current == $slug])`, { slug }); n++) slug = `${base}-${n}`;

  const doc = buildDraftDocument(idea, draft, check, slug);
  await client.create(doc);
  await client.patch(idea._id).set({ status: "drafted", draftSlug: slug, draftedAt: new Date().toISOString() }).commit();
  console.log(`[field-notes] drafted "${doc.title}" as ${doc._id} from ${idea._id}; fact check: ${check.verdict} (${check.unsupported.length})`);

  const notified = await notify(doc.title, doc.excerpt, `blogpost-${slug}`, check);
  return { drafted: true, idea: idea._id, slug, title: doc.title, factCheck: check.verdict, toCheck: check.unsupported.length, notified };
}

/** One email to BLOG_DRAFT_NOTIFY (comma-separated), through Resend. */
async function notify(title: string, excerpt: string, docId: string, check: FactCheck): Promise<string[]> {
  const to = (process.env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length || !process.env.RESEND_API_KEY) {
    console.warn("[field-notes] no email sent: BLOG_DRAFT_NOTIFY or RESEND_API_KEY is not set");
    return [];
  }
  const link = `https://hubss.com/studio/intent/edit/id=${docId};type=blogPost`;
  const text = [
    "A new Field Notes draft is waiting in Studio. Nothing is on hubss.com until you publish it.",
    "",
    title,
    excerpt,
    "",
    check.unsupported.length
      ? `Fact check: ${check.unsupported.length} statement(s) to check before publishing. They're listed in the draft's "Notes for the editor".`
      : "Fact check: every statement about HUB matches the catalogue.",
    "",
    `Open it: ${link}`,
  ].join("\n");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "HUB Surface Systems <noreply@hubss.com>",
    to,
    subject: `Field Notes draft ready: ${title}`,
    text,
  });
  if (error) {
    console.error("[field-notes] email failed:", error);
    return [];
  }
  return to;
}

/**
 * The unpublished blogPost document for a draft. Pure, so it can be tested
 * without Claude or Sanity.
 */
export function buildDraftDocument(idea: Idea, draft: Draft, check: FactCheck, slug: string) {
  const systems = (idea.systems ?? []).filter((s): s is Linked => !!s?.slug);
  const apps = (idea.applications ?? []).filter((a): a is Linked => !!a?.slug);
  // The drafter writes no photos; drop any it wrote anyway (they'd point nowhere).
  const { blocks } = markdownToPortableText(draft.body, "k");
  const body = blocks.filter((b) => b._type !== "image");

  const photoFrom = [...systems, ...apps].find((x) => x.hero?.asset);
  const types = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));
  const phrases = [...new Set([idea.searchPhrase, ...draft.searchPhrases].map((p) => p?.trim()).filter((p): p is string => !!p))];
  const today = new Date().toISOString().slice(0, 10);

  const notes = [
    `Drafted by Claude on ${today} from the plan item "${idea.title}". Not on the site until someone presses Publish.`,
    "",
    check.unsupported.length
      ? `FACT CHECK: ${check.unsupported.length} statement(s) the HUB catalogue doesn't back up. Fix or remove them before publishing:`
      : "FACT CHECK: every statement about HUB matches the catalogue and the brief.",
    ...check.unsupported.map((u) => `- "${u.quote}": ${u.reason}`),
    "",
    photoFrom
      ? `PHOTO: a stand-in, the ${photoFrom.name} page's hero photo. If the post describes a particular project, swap in a photo of it.`
      : "PHOTO: none. Add a featured photo of HUB's own work before publishing.",
    "",
    "BASED ON:",
    ...draft.factsUsed.map((f) => `- ${f}`),
    "",
    "Before publishing: set the Publish date, read it through, and delete these notes if you like (they're never shown on the site).",
  ].join("\n");

  return {
    _id: `drafts.blogpost-${slug}`,
    _type: "blogPost",
    title: draft.title.trim(),
    slug: { _type: "slug", current: slug },
    category: idea.type && types.has(idea.type) ? idea.type : inferCategory(slug, draft.title),
    publishedAt: new Date().toISOString(),
    excerpt: draft.excerpt.trim(),
    body,
    editorNotes: notes,
    keywords: phrases.slice(0, 6),
    relatedProducts: systems.map((s) => ({ _key: `p-${s.slug}`, _type: "reference", _ref: s._id })),
    relatedApplications: apps.map((a) => ({ _key: `a-${a.slug}`, _type: "reference", _ref: a._id })),
    ...(photoFrom?.hero?.asset
      ? { featuredImage: { _type: "image", asset: { _type: "reference", _ref: photoFrom.hero.asset }, alt: photoFrom.hero.alt?.trim() || draft.title.trim() } }
      : {}),
  };
}
