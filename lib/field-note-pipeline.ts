/**
 * The Field Notes pipeline: plan item → AI draft → style pass → fact check →
 * unpublished draft in Studio → an email to the editors.
 *
 * Run by app/api/cron/draft-field-note every Tuesday morning (vercel.json),
 * and on demand from Vercel → Settings → Cron Jobs → Run.
 *
 * What it will never do: publish. It writes a document whose id starts with
 * "drafts.", which Sanity keeps out of the published dataset, so the site
 * (which reads published documents only, lib/sanity.client.ts) can't show it.
 * A person opens it in Studio, checks the notes, edits, and presses Publish.
 *
 * Which plan item (7 Oct 2026): the top item marked Ready; when none is, the
 * top Idea. So the plan no longer needs someone to mark one Ready every
 * Monday: Ready now means "this one next". The email says when the plan is
 * running low.
 */

import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";
import { markdownToPortableText } from "@/lib/markdown-to-portable-text";
import { factsBlock, relatedPostLines } from "@/lib/field-note-facts";
import { writeDraft, checkDraft, polishDraft, styleReport, type Draft, type FactCheck, type StylePass } from "@/lib/field-note-drafter";
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
  | { drafted: true; idea: string; picked: "ready" | "next idea" | "asked for"; slug: string; title: string; factCheck: FactCheck["verdict"]; toCheck: number; style: { flagged: number; left: number }; ideasLeft: number; notified: string[] };

/** Below this many items left (Ideas and Ready), the email asks for more. */
const PLAN_LOW = 3;

const LINKED = `{ _id, name, "slug": slug.current, "hero": heroImage{ "asset": asset._ref, alt } }`;
const IDEA = `{ _id, title, status, searchPhrase, type, brief, "systems": systems[]->${LINKED}, "applications": applications[]->${LINKED} }`;

function cleanSlug(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
}

export async function draftNextFieldNote(opts: { ideaId?: string } = {}): Promise<PipelineResult> {
  const client = sanityWriteClient();

  // A plan item is edited live (no draft/publish), so its _id has no "drafts." prefix.
  // Ready items first, then Ideas; within each, priority then age.
  const idea = await client.fetch<Idea | null>(
    opts.ideaId
      ? `*[_type == "storyIdea" && _id == $id][0]${IDEA}`
      : `*[_type == "storyIdea" && status in ["ready", "idea"] && !(_id in path("drafts.**"))] | order(select(status == "ready" => 0, 1) asc, coalesce(priority, 2) asc, _createdAt asc)[0]${IDEA}`,
    { id: opts.ideaId ?? "" }
  );
  if (!idea) return { drafted: false, reason: opts.ideaId ? `no plan item ${opts.ideaId}` : "the Insights plan has no Ready items or Ideas left" };
  const picked = opts.ideaId ? "asked for" : idea.status === "ready" ? "ready" : "next idea";

  const systems = (idea.systems ?? []).filter((s): s is Linked => !!s?.slug);
  const apps = (idea.applications ?? []).filter((a): a is Linked => !!a?.slug);
  const facts = factsBlock({ productSlugs: systems.map((s) => s.slug), applicationSlugs: apps.map((a) => a.slug), brief: idea.brief });
  const related = relatedPostLines(await getAllPosts(), systems.map((s) => s.name));

  const written = await writeDraft({ title: idea.title, searchPhrase: idea.searchPhrase, type: idea.type }, facts, related);
  // House style before the fact check, so the check (and the notes) quote the final wording.
  const { draft, style } = await polishDraft(written);
  const check = await checkDraft(draft, facts);

  // A slug nobody uses, drafts included.
  const base = cleanSlug(draft.slug || draft.title) || `field-note-${Date.now()}`;
  let slug = base;
  for (let n = 2; await client.fetch<number>(`count(*[_type == "blogPost" && slug.current == $slug])`, { slug }); n++) slug = `${base}-${n}`;

  const doc = buildDraftDocument(idea, draft, check, slug, style);
  await client.create(doc);
  await client.patch(idea._id).set({ status: "drafted", draftSlug: slug, draftedAt: new Date().toISOString() }).commit();
  console.log(`[field-notes] drafted "${doc.title}" as ${doc._id} from ${idea._id}; fact check: ${check.verdict} (${check.unsupported.length}); style: ${style.left.length} of ${style.flagged} left${style.error ? ` (rewrite failed: ${style.error})` : ""}`);

  const ideasLeft = await client.fetch<number>(`count(*[_type == "storyIdea" && status in ["ready", "idea"] && !(_id in path("drafts.**"))])`);
  const notified = await notify(doc.title, doc.excerpt, `blogpost-${slug}`, check, style, { picked, ideaTitle: idea.title, ideasLeft });
  return { drafted: true, idea: idea._id, picked, slug, title: doc.title, factCheck: check.verdict, toCheck: check.unsupported.length, style: { flagged: style.flagged, left: style.left.length }, ideasLeft, notified };
}

/** One email to BLOG_DRAFT_NOTIFY (comma-separated), through Resend. */
async function notify(
  title: string,
  excerpt: string,
  docId: string,
  check: FactCheck,
  style: StylePass,
  plan: { picked: "ready" | "next idea" | "asked for"; ideaTitle: string; ideasLeft: number }
): Promise<string[]> {
  const to = (process.env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length || !process.env.RESEND_API_KEY) {
    console.warn("[field-notes] no email sent: BLOG_DRAFT_NOTIFY or RESEND_API_KEY is not set");
    return [];
  }
  const link = `https://hubss.com/studio/intent/edit/id=${docId};type=blogPost`;
  const text = [
    "A new Insights draft is waiting in Studio. Nothing is on hubss.com until you publish it.",
    "",
    title,
    excerpt,
    "",
    plan.picked === "next idea"
      ? `From the plan: "${plan.ideaTitle}" (the next Idea; nothing was marked Ready).`
      : `From the plan: "${plan.ideaTitle}".`,
    plan.ideasLeft < PLAN_LOW
      ? `The plan is running low: ${plan.ideasLeft} item${plan.ideasLeft === 1 ? "" : "s"} left. Add a few in Studio → Insights plan.`
      : `${plan.ideasLeft} items left in the plan.`,
    "",
    check.unsupported.length
      ? `Fact check: ${check.unsupported.length} statement(s) to check before publishing. They're listed in the draft's "Notes for the editor".`
      : "Fact check: every statement about HUB matches the Idea Book.",
    style.left.length
      ? `Style check: ${style.left.length} sentence(s) still have an em dash or another machine tell. They're listed in the notes and marked in yellow in Studio.`
      : "Style check: no em dashes or machine tells.",
    "",
    `Open it: ${link}`,
  ].join("\n");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "HUB Surface Systems <noreply@hubss.com>",
    to,
    subject: `Insights draft ready: ${title}`,
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
 * without Claude or Sanity. `style` is the style pass's result
 * (lib/field-note-drafter.ts); its leftovers go in the notes.
 */
export function buildDraftDocument(idea: Idea, draft: Draft, check: FactCheck, slug: string, style?: StylePass) {
  const systems = (idea.systems ?? []).filter((s): s is Linked => !!s?.slug);
  const apps = (idea.applications ?? []).filter((a): a is Linked => !!a?.slug);
  // The drafter writes no photos; drop any it wrote anyway (they'd point nowhere).
  const { blocks } = markdownToPortableText(draft.body, "k");
  const body = blocks.filter((b) => b._type !== "image");

  // The stand-in photo: the application's hero first, then the system's. A
  // post about parking lots gets a parking lot, not the product's best-known
  // shot of something else (7 Oct 2026: the line-painting draft came with a
  // bike path).
  const photoFrom = [...apps, ...systems].find((x) => x.hero?.asset);
  const types = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));
  const phrases = [...new Set([idea.searchPhrase, ...draft.searchPhrases].map((p) => p?.trim()).filter((p): p is string => !!p))];
  const today = new Date().toISOString().slice(0, 10);

  const notes = [
    `Drafted by Claude on ${today} from the plan item "${idea.title}". Not on the site until someone presses Publish.`,
    "",
    check.unsupported.length
      ? `FACT CHECK: ${check.unsupported.length} statement(s) the HUB Idea Book doesn't back up. Fix or remove them before publishing:`
      : "FACT CHECK: every statement about HUB matches the Idea Book and the brief.",
    ...check.unsupported.map((u) => `- "${u.quote}": ${u.reason}`),
    "",
    ...(style ? [...styleReport(style, "before publishing (Studio marks them in yellow too)"), ""] : []),
    photoFrom
      ? `PHOTO: a stand-in, the ${photoFrom.name} page's hero photo. If the post describes a particular project, swap in a photo of it.`
      : "PHOTO: none. Add a featured photo of HUB's own work before publishing.",
    "",
    "BASED ON:",
    ...draft.factsUsed.map((f) => `- ${f}`),
    "",
    "Before publishing: read it through, and delete these notes if you like (they're never shown on the site). The first Publish dates the article that day.",
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
