/**
 * The Field Notes pipeline: plan item → AI draft → style pass → fact check →
 * unpublished draft in Studio → an email to the editors.
 *
 * Run by app/api/cron/draft-field-note every Tuesday and Thursday morning
 * (vercel.json; Thursdays since 14 Oct 2026, Vern: "a blog or two a week"),
 * and on demand from Vercel → Settings → Cron Jobs → Run.
 *
 * Two a week use the plan up, so the run keeps it stocked
 * (lib/insights-planner.ts): when fewer than PLAN_MIN items are left it adds
 * new Ideas at the bottom, after the email has gone, if there's time left. A
 * run that finds the plan empty only fills it; the next run drafts.
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
 *
 * The photo (20 Oct 2026, Vern's standard: "the photo is of the subject").
 * When the draft leads with a documented job from the project map
 * (`leadJob`, one of the jobs its facts listed) and that job's first photo is
 * on Sanity's CDN, that photo is the featured photo, with the focal point and
 * crop of its gallery copy in Studio when one has them. Otherwise a stand-in:
 * the hero of the first of its systems, and the application's only when the
 * plan item names no system (buildDraftDocument says why). The notes say which.
 */

import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";
import { projectId, dataset } from "@/lib/sanity.client";
import { markdownToPortableText } from "@/lib/markdown-to-portable-text";
import { documentedJobs, factsBlock, jobPlace, relatedPostLines } from "@/lib/field-note-facts";
import { writeDraft, checkDraft, polishDraft, styleReport, type Draft, type FactCheck, type StylePass } from "@/lib/field-note-drafter";
import { getAllPosts } from "@/lib/blog";
import { inferCategory } from "@/lib/blog-taxonomy";
import { FIELD_NOTE_TYPES } from "@/lib/field-notes-taxonomy";
import { topUpPlan } from "@/lib/insights-planner";
import type { MapProject } from "@/lib/map-projects";
import type { SanityClient } from "@sanity/client";

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
  | { drafted: true; idea: string; picked: "ready" | "next idea" | "asked for"; slug: string; title: string; factCheck: FactCheck["verdict"]; toCheck: number; style: { flagged: number; left: number }; ideasLeft: number; notified: string[]; leadJob: string | null };

/** Below this many items left (Ideas and Ready), the email asks for more. */
const PLAN_LOW = 3;
/** The plan is topped up only when this little of the route's 300 s has gone (the planner gives up after 80 s). */
const TOP_UP_BEFORE_MS = 200_000;

/** Adds Ideas when the plan is low; a failure is logged, never thrown, so it can't cost a draft or its email. */
async function keepPlanStocked(client: ReturnType<typeof sanityWriteClient>): Promise<string[]> {
  try {
    return (await topUpPlan(client, await getAllPosts()))?.added ?? [];
  } catch (err) {
    console.error(`[planner] couldn't top up the plan: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

const LINKED = `{ _id, name, "slug": slug.current, "hero": heroImage{ "asset": asset._ref, alt } }`;
const IDEA = `{ _id, title, status, searchPhrase, type, brief, "systems": systems[]->${LINKED}, "applications": applications[]->${LINKED} }`;

function cleanSlug(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
}

// ── the lead job's photo ────────────────────────────────────────────────────

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A photo on this dataset's CDN: https://cdn.sanity.io/images/<project>/<dataset>/<hash>-<w>x<h>.<ext>, query string allowed. */
const CDN_IMAGE = new RegExp(`^https://cdn\\.sanity\\.io/images/${escapeRe(projectId)}/${escapeRe(dataset)}/([0-9a-f]{40})-(\\d+)x(\\d+)\\.([a-z]+)(?:[?#].*)?$`);

/**
 * The Sanity asset id of a CDN photo ("image-<hash>-<w>x<h>-<ext>"), or null
 * for anything else (a /images/map file, another project's photo). Pure.
 */
export function assetRefFromCdnUrl(url: string | null | undefined): string | null {
  const m = CDN_IMAGE.exec((url ?? "").trim());
  return m ? `image-${m[1]}-${m[2]}x${m[3]}-${m[4]}` : null;
}

/** The documented job a draft leads with, and the Sanity asset of its first photo (null when that photo is a /images/map file or the job has none). */
export interface LeadJob { job: MapProject; ref: string | null }

const slugsOf = (xs: Linked[] | null | undefined) => (xs ?? []).filter((x): x is Linked => !!x?.slug).map((x) => x.slug);

/**
 * The job named by the draft's `leadJob`, if it is one of the documented
 * jobs its facts listed (factsBlock makes the same documentedJobs call), so
 * an id the drafter made up or misspelt gets the stand-in. Pure.
 */
export function leadJobFor(idea: Pick<Idea, "systems" | "applications" | "brief">, leadJob: string | null | undefined): LeadJob | null {
  const id = leadJob?.trim();
  if (!id) return null;
  const job = documentedJobs(slugsOf(idea.systems), slugsOf(idea.applications), idea.brief).find((j) => j.id === id);
  return job ? { job, ref: assetRefFromCdnUrl(job.images[0]) } : null;
}

/** How a gallery copy of a photo is framed in Studio, set by hand there. */
export interface PhotoFraming { hotspot?: Record<string, unknown> | null; crop?: Record<string, unknown> | null }

/** Of the gallery copies of one photo, the one framed by hand: a hotspot first, then a crop. Pure. */
export function pickFraming(copies: readonly (PhotoFraming | null | undefined)[]): PhotoFraming | null {
  const framed = copies.find((c) => c?.hotspot) ?? copies.find((c) => c?.crop);
  return framed ? { hotspot: framed.hotspot ?? null, crop: framed.crop ?? null } : null;
}

/** Product and application gallery copies of one asset, published documents only. */
const GALLERY_COPIES = `*[_type in ["product", "application"] && !(_id in path("drafts.**")) && $ref in gallery[].asset._ref]{ "copies": gallery[asset._ref == $ref]{ hotspot, crop } }`;

/** The hand-set framing of the photo's gallery copies in Studio; a failed lookup costs the draft nothing. */
async function galleryFraming(client: SanityClient, ref: string): Promise<PhotoFraming | null> {
  try {
    const docs = await client.fetch<{ copies?: PhotoFraming[] | null }[]>(GALLERY_COPIES, { ref });
    return pickFraming(docs.flatMap((d) => d.copies ?? []));
  } catch (err) {
    console.error(`[field-notes] couldn't read the gallery framing of ${ref}: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

export async function draftNextFieldNote(opts: { ideaId?: string } = {}): Promise<PipelineResult> {
  const started = Date.now();
  const client = sanityWriteClient();

  // A plan item is edited live (no draft/publish), so its _id has no "drafts." prefix.
  // Ready items first, then Ideas; within each, priority then age.
  const pick = () =>
    client.fetch<Idea | null>(
      opts.ideaId
        ? `*[_type == "storyIdea" && _id == $id][0]${IDEA}`
        : `*[_type == "storyIdea" && status in ["ready", "idea"] && !(_id in path("drafts.**"))] | order(select(status == "ready" => 0, 1) asc, coalesce(priority, 2) asc, _createdAt asc)[0]${IDEA}`,
      { id: opts.ideaId ?? "" }
    );
  const idea = await pick();
  if (!idea && !opts.ideaId) {
    // An empty plan (the top-ups failed for a while): fill it and stop, so
    // the new ideas sit in Studio for a person to look at before the next run
    // drafts one, and the planner's time can't cost a draft its email.
    const added = await keepPlanStocked(client);
    return {
      drafted: false,
      reason: added.length
        ? `Blog ideas was empty; added ${added.length} idea${added.length === 1 ? "" : "s"}, and the next run drafts the first`
        : "Blog ideas has no Ready items or Ideas left",
    };
  }
  if (!idea) return { drafted: false, reason: `no plan item ${opts.ideaId}` };
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

  // The job it leads with gives the photo; the framing set by hand on its
  // gallery copy comes along (read here, so buildDraftDocument stays pure).
  const lead = leadJobFor(idea, draft.leadJob);
  if (draft.leadJob?.trim() && !lead) console.warn(`[field-notes] the draft leads with "${draft.leadJob}", which is not one of its documented jobs; the photo is the stand-in`);
  const framing = lead?.ref ? await galleryFraming(client, lead.ref) : null;

  const doc = buildDraftDocument(idea, draft, check, slug, style, framing);
  await client.create(doc);
  await client.patch(idea._id).set({ status: "drafted", draftSlug: slug, draftedAt: new Date().toISOString() }).commit();
  console.log(`[field-notes] drafted "${doc.title}" as ${doc._id} from ${idea._id}; lead job: ${lead ? `${lead.job.id} (${lead.ref ? `its photo${framing?.hotspot ? ", framed in Studio" : ""}` : "stand-in photo: its own is not on Sanity"})` : "none"}; fact check: ${check.verdict} (${check.unsupported.length}); style: ${style.left.length} of ${style.flagged} left${style.error ? ` (rewrite failed: ${style.error})` : ""}`);

  const { ideasLeft, next } = await client.fetch<{ ideasLeft: number; next: string | null }>(`{
    "ideasLeft": count(*[_type == "storyIdea" && status in ["ready", "idea"] && !(_id in path("drafts.**"))]),
    "next": *[_type == "storyIdea" && status in ["ready", "idea"] && !(_id in path("drafts.**"))] | order(select(status == "ready" => 0, 1) asc, coalesce(priority, 2) asc, _createdAt asc)[0].title
  }`);
  const notified = await notify(doc.title, doc.excerpt, `blogpost-${slug}`, check, style, { picked, ideaTitle: idea.title, ideasLeft, next });
  // After the email, so a slow planner can't cost it.
  if (Date.now() - started < TOP_UP_BEFORE_MS) await keepPlanStocked(client);
  else console.log("[planner] no time left this run; the next run tops the plan up");
  return { drafted: true, idea: idea._id, picked, slug, title: doc.title, factCheck: check.verdict, toCheck: check.unsupported.length, style: { flagged: style.flagged, left: style.left.length }, ideasLeft, notified, leadJob: lead?.job.id ?? null };
}

/** One email to BLOG_DRAFT_NOTIFY (comma-separated), through Resend. */
async function notify(
  title: string,
  excerpt: string,
  docId: string,
  check: FactCheck,
  style: StylePass,
  plan: { picked: "ready" | "next idea" | "asked for"; ideaTitle: string; ideasLeft: number; next?: string | null }
): Promise<string[]> {
  const to = (process.env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length || !process.env.RESEND_API_KEY) {
    console.warn("[field-notes] no email sent: BLOG_DRAFT_NOTIFY or RESEND_API_KEY is not set");
    return [];
  }
  const link = `https://hubss.com/studio/intent/edit/id=${docId};type=blogPost`;
  const text = [
    "A new blog draft is waiting in Studio → Blog posts. Nothing is on hubss.com until you read it and press Publish.",
    "",
    title,
    excerpt,
    "",
    plan.picked === "next idea"
      ? `From the plan: "${plan.ideaTitle}" (the next Idea; nothing was marked Ready).`
      : `From the plan: "${plan.ideaTitle}".`,
    plan.ideasLeft < PLAN_LOW
      ? `The plan is running low: ${plan.ideasLeft} item${plan.ideasLeft === 1 ? "" : "s"} left. New ideas are added by themselves when it gets low; you can add your own in Studio → Blog ideas.`
      : `${plan.ideasLeft} items left in the plan.`,
    ...(plan.next ? [`Next up: "${plan.next}". To change it, reorder or edit the plan in Studio.`] : []),
    "",
    check.unsupported.length
      ? `Fact check: ${check.unsupported.length} statement(s) to check before publishing. They're listed in the draft's "Notes for the editor".`
      : "Fact check: every statement about HUB matches the Product Portfolio Book.",
    style.left.some((l) => l.contact)
      ? `Style check: ${style.left.length} line(s) to fix, including a phone number, email or street address that isn't HUB's. They're listed in the notes and marked in yellow in Studio.`
      : style.left.length
        ? `Style check: ${style.left.length} sentence(s) still have an em dash or another machine tell. They're listed in the notes and marked in yellow in Studio.`
        : "Style check: no em dashes or machine tells.",
    "",
    `Open it: ${link}`,
  ].join("\n");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "HUB Surface Systems <noreply@hubss.com>",
    to,
    subject: `Blog draft ready to review: ${title}`,
    text,
  });
  if (error) {
    console.error("[field-notes] email failed:", error);
    return [];
  }
  return to;
}

/**
 * The PHOTO line of the notes: the lead job's photo (and whether its focal
 * point still needs setting), or the stand-in and, when the article leads
 * with a job whose photo isn't in Sanity, where that photo is.
 */
function photoNote(lead: LeadJob | null, framed: boolean, standIn: Linked | undefined): string {
  if (lead?.ref) {
    const job = lead.job;
    return `PHOTO: the ${job.title} photo from the project map, the job the article leads with. ${framed
      ? "Its focal point is the one set on its gallery copy in Studio."
      : `It has no focal point yet: set the focal point on the ${job.product} in Studio (the crosshair on the photo), not on the sky or a building.`}`;
  }
  const first = standIn ? `PHOTO: a stand-in, the ${standIn.name} page's hero photo.` : "PHOTO: none.";
  if (lead) {
    const src = lead.job.images[0];
    return `${first} The article leads with the ${lead.job.title} job, ${src
      ? `whose photo is not in Studio yet (https://hubss.com${src}): upload it and use it instead.`
      : "which has no photo on the project map yet: use one of that job when HUB has it."}`;
  }
  return standIn
    ? `${first} If the post describes a particular project, swap in a photo of it.`
    : "PHOTO: none. Add a featured photo of HUB's own work before publishing.";
}

/**
 * The unpublished blogPost document for a draft. Pure, so it can be tested
 * without Claude or Sanity. `style` is the style pass's result
 * (lib/field-note-drafter.ts); its leftovers go in the notes. `framing` is
 * the focal point and crop of the lead job's photo in a Studio gallery, read
 * by the caller (galleryFraming); without it the photo has none.
 */
export function buildDraftDocument(idea: Idea, draft: Draft, check: FactCheck, slug: string, style?: StylePass, framing?: PhotoFraming | null) {
  const systems = (idea.systems ?? []).filter((s): s is Linked => !!s?.slug);
  const apps = (idea.applications ?? []).filter((a): a is Linked => !!a?.slug);
  // The drafter writes no photos; drop any it wrote anyway (they'd point nowhere).
  const { blocks } = markdownToPortableText(draft.body, "k");
  const body = blocks.filter((b) => b._type !== "image");

  // The photo of the documented job the article leads with, when it is on
  // Sanity's CDN (Vern's standard, 20 Oct 2026: the photo is of the subject,
  // never a stand-in from another application). Alt text: the map's, else the
  // job and its place. The gallery copies' alt text is not used: it was
  // written in bulk and often names another kind of site.
  const lead = leadJobFor(idea, draft.leadJob);
  const jobPhoto = lead?.ref
    ? {
        _type: "image",
        asset: { _type: "reference", _ref: lead.ref },
        alt: lead.job.alt?.trim() || `${lead.job.title}, ${jobPlace(lead.job)}`,
        ...(framing?.hotspot ? { hotspot: framing.hotspot } : {}),
        ...(framing?.crop ? { crop: framing.crop } : {}),
      }
    : null;
  // Otherwise the stand-in photo: the hero of the first of the item's systems
  // that has one, and the application's only when the item names no system.
  // An application's hero can show another system altogether: the Parking
  // Lots hero is a StreetPrint walkway, which the asphalt patch article due
  // on 22 Oct 2026 would have worn. A system's hero at least shows the system
  // the article is about. From 7 to 20 Oct 2026 the application's came first,
  // after the line-painting draft, system first, came with a bike path: the
  // right system in the wrong setting, which is the lesser fault.
  const photoFrom = jobPhoto ? undefined : (systems.length ? systems : apps).find((x) => x.hero?.asset);
  const types = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));
  const phrases = [...new Set([idea.searchPhrase, ...draft.searchPhrases].map((p) => p?.trim()).filter((p): p is string => !!p))];
  const today = new Date().toISOString().slice(0, 10);

  const notes = [
    `Written by 21e8 on ${today} from the Blog idea "${idea.title}". Not on the site until someone presses Publish.`,
    "",
    check.unsupported.length
      ? `FACT CHECK: ${check.unsupported.length} statement(s) the HUB Product Portfolio Book doesn't back up. Fix or remove them before publishing:`
      : "FACT CHECK: every statement about HUB matches the Product Portfolio Book and the brief.",
    ...check.unsupported.map((u) => `- "${u.quote}": ${u.reason}`),
    "",
    ...(style ? [...styleReport(style, "before publishing (Studio marks them in yellow too)"), ""] : []),
    photoNote(lead, !!jobPhoto && !!framing?.hotspot, photoFrom),
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
    ...(jobPhoto
      ? { featuredImage: jobPhoto }
      : photoFrom?.hero?.asset
        ? { featuredImage: { _type: "image", asset: { _type: "reference", _ref: photoFrom.hero.asset }, alt: photoFrom.hero.alt?.trim() || draft.title.trim() } }
        : {}),
  };
}
