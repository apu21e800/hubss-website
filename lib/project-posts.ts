/**
 * Project posts: a job photos post with its story becomes a Projects article
 * on the site, by itself.
 *
 * Vern, 17 Oct 2026: "Doug adds photos and basic project information, it
 * becomes a blog post, queues for the blog and posts to social." Three steps,
 * all inside the daily run (app/api/cron/social-drafts, 14:00 UTC):
 *
 *  1. publishDueDrafts: every blog draft set to go live by itself whose time
 *     has come is published: the draft becomes the live document,
 *     dated that moment, and the site rebuilds to add the page (about five
 *     minutes, app/api/revalidate). The editors get an email. The next day's
 *     run drafts its social posts, as for any new article
 *     (lib/social-pipeline.ts).
 *  2. draftProjectArticles: one published job photos post with a story
 *     (fieldPost.writeUp, sanity/schemas/fieldPost.ts) and no article yet gets
 *     one. The Insights drafter (lib/field-note-drafter.ts) writes a project
 *     profile from the post's record and the system's approved facts and
 *     nothing else; the style pass and the fact check run as for every draft;
 *     the draft is saved scheduled for the daily run two weekdays out
 *     (scheduleSlot) with the post's photos, the first as the featured photo
 *     and the rest at the end of the article. The editors get an email that
 *     says when it goes live and how to hold it: open it in Studio → Blog
 *     posts and turn "Scheduled" off.
 *  3. The job photos post makes no social post of its own once it has a
 *     story (lib/social-pipeline.ts): the article carries the job, once.
 *
 * Nothing here posts to social. The pure parts (scheduleSlot, jobRecord,
 * buildProjectDocument, toPublished) are tested by scripts/test-project-posts.ts.
 */

import type { SanityClient } from "@sanity/client";
import { getAllPosts } from "@/lib/blog";
import { factsBlock, relatedPostLines } from "@/lib/field-note-facts";
import { writeDraft, checkDraft, polishDraft, styleReport, contactLeft, withLeft, type Draft, type FactCheck, type StylePass } from "@/lib/field-note-drafter";
import { contactIssues, hasContactAnyCase, maskContact, stripContact } from "@/lib/style-lint";
import { markdownToPortableText } from "@/lib/markdown-to-portable-text";
import { emailEditors } from "@/lib/editor-mail";
import { SITE } from "@/lib/social-library";
import { isConflict } from "@/lib/social-outcome";

export const TORONTO = "America/Toronto";
/** The daily run's hour (vercel.json, social-drafts): the time a scheduled article goes live. */
export const RUN_HOUR_UTC = 14;
/** A new article is scheduled for the first weekday at least this many days away. */
export const LEAD_DAYS = 2;
/** A draft is due this long before its time, so the run that starts at 14:00:00 publishes a 14:00 draft. */
const DUE_GRACE_MS = 10 * 60_000;
/** Articles written per run: a job a day, like the field stream. */
const MAX_ARTICLES_PER_RUN = 1;
/** What one article needs of the route's time: three Claude calls, the writes, the email. */
const NEEDS_MS = 150_000;
/** The type a job's article is filed under (lib/field-notes-taxonomy.ts): the Projects section. */
export const PROJECT_TYPE = "Project Profile";

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

// ── when ────────────────────────────────────────────────────────────────────

/**
 * When a new article goes live: the daily run on the first weekday (Monday to
 * Friday) at least LEAD_DAYS days from now, skipping any day another
 * scheduled draft already has, so two jobs posted the same day go out on two
 * days. 14:00 UTC is the same calendar day in Toronto, so UTC weekdays are
 * Toronto weekdays here.
 */
export function scheduleSlot(now: Date, taken: Iterable<string> = []): string {
  const used = new Set([...taken].map((t) => t.slice(0, 10)));
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + LEAD_DAYS, RUN_HOUR_UTC));
  for (let i = 0; i < 60; i++) {
    const weekday = day.getUTCDay();
    const iso = day.toISOString();
    if (weekday !== 0 && weekday !== 6 && !used.has(iso.slice(0, 10))) return iso;
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return day.toISOString();
}

/** "Wednesday 21 October at 10:00 Toronto time", for the emails and the notes. */
export function torontoWhen(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("weekday")} ${get("day")} ${get("month")} at ${get("hour")}:${get("minute")} Toronto time`;
}

/** The date a job was done, as the facts say it: "17 October 2026". */
function doneOn(date: string | null | undefined): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return "";
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).formatToParts(new Date(`${date.slice(0, 10)}T12:00:00Z`));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")} ${get("month")} ${get("year")}`;
}

// ── the source ──────────────────────────────────────────────────────────────

export interface FieldPhoto {
  asset?: string | null;
  alt?: string | null;
  caption?: string | null;
  hotspot?: Record<string, unknown> | null;
  crop?: Record<string, unknown> | null;
}

export interface Linked { _id: string; name?: string | null; slug?: string | null }

/** A job photos post as the query returns it. */
export interface ProjectSource {
  _id: string;
  place?: string | null;
  note?: string | null;
  writeUp?: string | null;
  date?: string | null;
  system?: Linked | null;
  application?: Linked | null;
  photos?: FieldPhoto[] | null;
}

const SOURCE = `{
  _id, place, note, writeUp, date,
  "system": system->{ _id, name, "slug": slug.current },
  "application": application->{ _id, name, "slug": slug.current },
  "photos": photos[]{ "asset": asset._ref, alt, caption, hotspot, crop }
}`;

/** The job as the post records it: the only source for the article's facts about this job. */
export function jobRecord(doc: ProjectSource): string {
  const photos = (doc.photos ?? []).filter((p) => p?.asset);
  const captions = photos.map((p) => p.caption?.trim() || p.alt?.trim()).filter(Boolean);
  const when = doneOn(doc.date);
  return [
    "THE JOB (HUB's own record of one installation, posted by HUB with its photographs; treat it as true and complete: say nothing about this job that is not here)",
    `- Where: ${doc.place?.trim()}`,
    when ? `- When it was done: ${when}` : "",
    `- System: ${doc.system?.name}`,
    doc.application?.name ? `- Kind of job: ${doc.application.name}` : "",
    `- What was done (the crew's note): ${doc.note?.trim()}`,
    `- The story (from HUB): ${doc.writeUp?.trim()}`,
    `- Photographs: ${photos.length} of the finished job${captions.length ? `. What they show: ${captions.join("; ")}` : ""}`,
  ].filter(Boolean).join("\n");
}

/** What the drafter is told about this kind of piece; it beats VOICE's SHAPE (lib/field-note-drafter.ts). */
export const PROFILE_INSTRUCTIONS = [
  "This is a PROJECT PROFILE of one finished job, for the Projects section of hubss.com: 450 to 750 words.",
  "The job comes first: where it is, what was built and when, in the first paragraph. Then what went in and why that system (from THE JOB and the system's facts), then how it was done or how it has held up where THE JOB says so, then a short close on specifying it.",
  "If THE JOB is short, the article is short. Never pad it with general pavement writing, and never add a client, a date, a size, a colour, a cost or a reason THE JOB doesn't give.",
  "The headline names the place and the work in plain words, as a newspaper's local page would.",
  "Never print a phone number, an email or a street address from THE JOB: a customer's details stay off the site. Name the place by its town, and by its site only where THE JOB names one.",
  "Never name a private homeowner or a family, even where THE JOB does: say \"a homeowner in Milton\". Name a business, school, city or agency only where THE JOB names it.",
].join("\n");

/**
 * The job post's own words, as Doug typed them: the place, the crew's note,
 * the story, and each photo's alt text and caption (the last two go on the
 * page exactly as written). A phone number, email or street address in any
 * of them holds the article for a person, whether or not the draft repeats
 * it (24 Oct 2026): it may say more about the customer than a rule can see.
 */
export function jobPostText(doc: ProjectSource): { label: string; text: string; place?: boolean }[] {
  const photos = (doc.photos ?? []).filter((p) => p?.asset);
  return [
    { label: "Job post, Where", text: doc.place?.trim() ?? "", place: true },
    { label: "Job post, What was done", text: doc.note?.trim() ?? "" },
    { label: "Job post, The story", text: doc.writeUp?.trim() ?? "" },
    ...photos.flatMap((p, i) => [
      { label: `Job post, photo ${i + 1} alt text`, text: p.alt?.trim() ?? "" },
      { label: `Job post, photo ${i + 1} caption`, text: p.caption?.trim() ?? "" },
    ]),
  ].filter((x) => x.text);
}

/**
 * What the slug is made from: the draft's own, unless it or the title shows
 * a phone number, email or street address that isn't HUB's. Then it is the
 * title with that taken out, so a held article's address can't reach its
 * URL while a person fixes the words.
 */
export function slugSource(draft: Pick<Draft, "slug" | "title">): string {
  if (hasContactAnyCase(draft.title) || hasContactAnyCase(draft.slug ?? "")) return stripContact(draft.title);
  return draft.slug || draft.title;
}

// ── the documents ───────────────────────────────────────────────────────────

/** The name the job goes by in the emails and the notes: "StreetBond in Osoyoos, British Columbia". */
export function jobName(doc: Pick<ProjectSource, "system" | "place">): string {
  return [doc.system?.name, doc.place?.trim()].filter(Boolean).join(" in ") || "a job photos post";
}

type ImageBlock = {
  _type: "image";
  /** Only inside the body array; a featured image carries none. */
  _key?: string;
  asset: { _type: "reference"; _ref: string };
  alt: string;
  caption?: string;
  hotspot?: Record<string, unknown>;
  crop?: Record<string, unknown>;
};

function imageOf(p: FieldPhoto, key: string | null, alt: string): ImageBlock {
  return {
    _type: "image",
    ...(key ? { _key: key } : {}),
    asset: { _type: "reference", _ref: p.asset as string },
    alt,
    ...(p.caption?.trim() ? { caption: p.caption.trim() } : {}),
    ...(p.hotspot ? { hotspot: p.hotspot } : {}),
    ...(p.crop ? { crop: p.crop } : {}),
  };
}

/** Studio's link to a draft, as the other drafter's emails give it. */
export const studioLink = (docId: string) => `https://hubss.com/studio/intent/edit/id=${docId};type=blogPost`;

/**
 * The scheduled blogPost draft for a job's article. Pure, so it can be tested
 * without Claude or Sanity. The post's first photo is the featured photo, the
 * rest close the article under their own heading; captions are the post's.
 *
 * It goes live by itself only when both checks are clean (readyToGo). A
 * draft the fact check couldn't match to the job's record, or that still has
 * an em dash, is saved with "Scheduled" off and the time filled
 * in: nothing unchecked reaches the site on its own (Vern: never invent
 * facts; Doug: not a single em dash). The email says which.
 */
export function readyToGo(check: FactCheck, style?: StylePass): boolean {
  return check.unsupported.length === 0 && (style?.left.length ?? 0) === 0;
}

export function buildProjectDocument(doc: ProjectSource, draft: Draft, check: FactCheck, slug: string, slot: string, style?: StylePass, today = new Date()) {
  const ready = readyToGo(check, style);
  const { blocks } = markdownToPortableText(draft.body, "k");
  // The drafter writes no photos; drop any it wrote anyway (they'd point nowhere).
  const body = blocks.filter((b) => b._type !== "image");
  const photos = (doc.photos ?? []).filter((p) => p?.asset);
  const [first, ...rest] = photos;
  const title = draft.title.trim();
  const name = jobName(doc);
  const gallery = rest.length
    ? [
        { _type: "block", _key: "photos-h2", style: "h2", markDefs: [], children: [{ _type: "span", _key: "photos-h2-s", text: "The job in photographs", marks: [] }] },
        ...rest.map((p, i) => imageOf(p, `photo-${i + 1}`, p.alt?.trim() || `${name}, photo ${i + 2} of ${photos.length}`)),
      ]
    : [];
  // Keywords go into the live page's search data (its schema) and no check
  // reads them, so one with a contact detail in it is dropped.
  const phrases = [...new Set(draft.searchPhrases.map((p) => p?.trim()).filter((p): p is string => !!p && !hasContactAnyCase(p)))];

  // The notes never quote a contact detail: they stay on the live post, in a
  // dataset anyone can read (maskContact). The job's place is masked as a
  // Where field is read, the rest as typed words.
  const place = doc.place?.trim() ?? "";
  const maskedPlace = place ? maskContact(place, { place: true }) : "";
  const masked = (t: string) => maskContact(place && maskedPlace !== place ? t.split(place).join(maskedPlace) : t, { typed: true });
  const notes = [
    `Written up by 21e8 on ${today.toISOString().slice(0, 10)} from the job photos post "${masked(name)}" (Studio → Job photos for social): its story, the crew's note, and the ${doc.system?.name ?? "system"} page's approved facts. Nothing else.`,
    "",
    ready
      ? `SCHEDULED for ${torontoWhen(slot)}. To move it, change "Goes live at". The day after it is live, its social posts go out.`
      : `HELD: a check below found something. It waits here until 21e8 has read it (set for ${torontoWhen(slot)} once released; a time already past goes at the next morning's run).`,
    "",
    check.unsupported.length
      ? `FACT CHECK: ${check.unsupported.length} statement(s) the job's record and the Product Portfolio Book don't back up. Fix or remove them before it goes live:`
      : "FACT CHECK: every statement matches the job's record and the Product Portfolio Book.",
    ...check.unsupported.map((u) => `- "${masked(u.quote)}": ${masked(u.reason)}`),
    "",
    ...(style ? [...styleReport(style, "before it goes live (Studio marks them in yellow too)"), ""] : []),
    first
      ? `PHOTOS: the post's first photo is the featured photo${rest.length ? `; the other ${rest.length} close the article, captions as written on the post` : ""}.`
      : "PHOTOS: the post had none with a file. Add a featured photo before it goes live.",
    "",
    "BASED ON:",
    ...draft.factsUsed.map((f) => `- ${masked(f)}`),
  ].join("\n");

  return {
    _id: `drafts.blogpost-${slug}`,
    _type: "blogPost",
    title,
    slug: { _type: "slug", current: slug },
    category: PROJECT_TYPE,
    // Today, not the slot: a draft published by hand before its day would
    // otherwise print a date in the future (datedPublish leaves one alone).
    // The run re-dates it the moment it goes.
    publishedAt: today.toISOString(),
    scheduled: ready,
    scheduledFor: slot,
    excerpt: draft.excerpt.trim(),
    body: [...body, ...gallery],
    editorNotes: notes,
    keywords: phrases.slice(0, 6),
    ...(doc.system?._id ? { relatedProducts: [{ _key: `p-${doc.system.slug ?? "system"}`, _type: "reference", _ref: doc.system._id }] } : {}),
    ...(doc.application?._id ? { relatedApplications: [{ _key: `a-${doc.application.slug ?? "application"}`, _type: "reference", _ref: doc.application._id }] } : {}),
    ...(first ? { featuredImage: imageOf(first, null, first.alt?.trim() || name) } : {}),
    fieldPost: { _type: "reference", _ref: doc._id, _weak: true },
  };
}

/** A scheduled draft as the publisher reads it. */
export interface ScheduledDraft {
  _id: string;
  _type: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  scheduled?: boolean | null;
  scheduledFor?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  editorNotes?: string | null;
  [key: string]: unknown;
}

/** What toPublished writes: the draft's fields, dated and no longer scheduled. */
export interface LiveDocument {
  _id: string;
  _type: string;
  scheduled: false;
  publishedAt: string;
  editorNotes: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  excerpt?: string | null;
  [key: string]: unknown;
}

/**
 * The live document a scheduled draft becomes: the same words, no longer
 * set to go by itself, and a line in the notes saying so. A first publish
 * is dated this moment (as Studio's Publish dates one, sanity.config.ts); a
 * scheduled edit to a live post keeps the post's date (`liveDate`), so a
 * correction to an old profile doesn't make it the newest post and doesn't
 * send it round social again.
 */
export function toPublished(draft: ScheduledDraft, now: Date, liveDate?: string | null): LiveDocument {
  const { _rev: _r, _createdAt: _c, _updatedAt: _u, scheduledFor: _s, scheduled: _st, publishedAt: _p, editorNotes, ...rest } = draft;
  void _r; void _c; void _u; void _s; void _st; void _p;
  const when = torontoWhen(now.toISOString());
  const notes = [`${liveDate ? "Edit published" : "Published"} on schedule, ${when} (21e8).`, editorNotes?.trim() ?? ""].filter(Boolean).join("\n\n");
  return { ...rest, _id: draft._id.replace(/^drafts\./, ""), scheduled: false, publishedAt: liveDate || now.toISOString(), editorNotes: notes };
}

// ── step 1: publish what is due ─────────────────────────────────────────────

export interface Published { id: string; slug: string; title: string; notified: string[] }
export interface PublishOutcome {
  published: Published[];
  failed: { id: string; title: string; error: string }[];
  /** Due, but showing a contact detail that isn't HUB's: switched off and the editors told (contactProblemsForLive). */
  held: { id: string; title: string; where: string[]; notified: string[] }[];
}

type Block = { _type?: string; children?: { text?: string }[]; alt?: unknown; caption?: unknown; rows?: { cells?: unknown[] }[] };

/**
 * Where a scheduled draft shows a phone number, email or street address that
 * isn't HUB's, read at the moment it would go live (the review of 24 Oct
 * 2026: a person can add one after the checks, or release a held draft with
 * a caption still to fix). The words are read as Claude's prose is; the
 * photos' alt text and captions, the tags, the keywords and the URL as
 * typed. Field names only, never the detail: they go into the notes and the
 * email. Pure, for test:project-posts.
 */
export function contactProblemsForLive(draft: ScheduledDraft): string[] {
  const where = new Set<string>();
  const prose = (label: string, t: unknown) => { if (typeof t === "string" && contactIssues(t).length) where.add(label); };
  const typed = (label: string, t: unknown) => { if (typeof t === "string" && hasContactAnyCase(t)) where.add(label); };
  prose("the title", draft.title);
  prose("the excerpt", draft.excerpt);
  const seo = (draft.seo ?? {}) as { metaTitle?: unknown; metaDescription?: unknown };
  prose("the search title", seo.metaTitle);
  prose("the search description", seo.metaDescription);
  const featured = (draft.featuredImage ?? {}) as { alt?: unknown; caption?: unknown };
  typed("the featured photo's alt text", featured.alt);
  typed("the featured photo's caption", featured.caption);
  for (const b of (Array.isArray(draft.body) ? draft.body : []) as Block[]) {
    if (b?._type === "block") prose("the body", (b.children ?? []).map((c) => c?.text ?? "").join(""));
    else if (b?._type === "image") { typed("a photo's alt text", b.alt); typed("a photo's caption", b.caption); }
    else if (b?._type === "table") for (const r of b.rows ?? []) for (const c of r?.cells ?? []) prose("a table", c);
  }
  for (const k of Array.isArray(draft.keywords) ? draft.keywords : []) typed("the keywords", k);
  for (const t of Array.isArray(draft.tags) ? draft.tags : []) typed("the tags", t);
  typed("the URL", draft.slug?.current);
  return [...where];
}

/**
 * Publishes every scheduled draft whose time has come, one transaction each
 * (the live document written, the draft removed). A draft that can't go
 * (no title or slug, or a slug another live post has) is left as it is and
 * the editors are told.
 */
export async function publishDueDrafts(client: SanityClient, now = new Date()): Promise<PublishOutcome> {
  const out: PublishOutcome = { published: [], failed: [], held: [] };
  const due = await client.fetch<ScheduledDraft[]>(
    `*[_type == "blogPost" && _id in path("drafts.**") && scheduled == true && defined(scheduledFor) && dateTime(scheduledFor) <= dateTime($by)] | order(scheduledFor asc)`,
    { by: new Date(now.getTime() + DUE_GRACE_MS).toISOString() }
  );
  for (const draft of due) {
    const title = draft.title?.trim() ?? "";
    const slug = draft.slug?.current?.trim() ?? "";
    const liveId = draft._id.replace(/^drafts\./, "");
    const where = contactProblemsForLive(draft);
    if (where.length) {
      out.held.push(await holdForContact(client, draft, where, now));
      continue;
    }
    try {
      if (!title || !slug) throw new Error("it has no title or no URL slug");
      const [clash, live] = await Promise.all([
        client.fetch<number>(`count(*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**")) && _id != $id])`, { slug, id: liveId }),
        client.fetch<{ publishedAt?: string | null } | null>(`*[_id == $id][0]{ publishedAt }`, { id: liveId }),
      ]);
      if (clash) throw new Error(`another live post already uses /blog/${slug}`);
      const doc = toPublished(draft, now, live?.publishedAt);
      try {
        await client.transaction().createOrReplace(doc).delete(draft._id).commit();
      } catch (err) {
        // A timeout can follow a commit that went through: if the live
        // document is there and the draft is gone, it was published.
        const after = await client.fetch<{ live: boolean; draft: boolean }>(`{ "live": defined(*[_id == $live][0]._id), "draft": defined(*[_id == $draft][0]._id) }`, { live: liveId, draft: draft._id });
        if (!(after.live && !after.draft)) throw err;
        console.warn(`[projects] ${draft._id}: the commit answered with an error but went through (${errorText(err)})`);
      }
      console.log(`[projects] published ${liveId} (/blog/${slug}) on schedule${live ? " (an edit to a live post)" : ""}`);
      const notified = await emailEditors(
        live ? `Updated on hubss.com: ${title}` : `On hubss.com in a few minutes: ${title}`,
        [
          live
            ? `The scheduled edit to "${title}" went live at ${torontoWhen(now.toISOString())}. It shows at ${SITE}/blog/${slug} within seconds, with the post's original date.`
            : `"${title}" went live at ${torontoWhen(now.toISOString())}, as scheduled. The site rebuilds for about five minutes, then the page is at ${SITE}/blog/${slug}.`,
          "",
          live
            ? "To change it again, edit it in Studio → Blog posts and press Publish."
            : "Its social posts go to Buffer with tomorrow morning's run. To change the article, edit it in Studio → Blog posts and press Publish; an edit shows within seconds.",
        ].join("\n"),
        "projects"
      );
      out.published.push({ id: liveId, slug, title, notified });
    } catch (err) {
      const error = errorText(err);
      console.error(`[projects] couldn't publish ${draft._id}: ${error}`);
      await emailEditors(
        `Scheduled article not published: ${title || draft._id}`,
        [
          `The daily run couldn't publish "${title || draft._id}" at its scheduled time because ${error}.`,
          "",
          "Nothing is on the site. It stays in Studio → Blog posts as a scheduled draft: fix it there and it goes at the next run, or turn \"Scheduled\" off and publish it yourself.",
          "",
          `Open it: ${studioLink(liveId)}`,
        ].join("\n"),
        "projects"
      );
      out.failed.push({ id: draft._id, title, error });
    }
  }
  return out;
}

/**
 * A due draft that shows a contact detail isn't published: "Scheduled" goes
 * off (the time is kept), the notes say why in field names only, and the
 * editors are told. If the switch can't be turned off, the draft still isn't
 * published this run, and the next run checks it again.
 */
async function holdForContact(client: SanityClient, draft: ScheduledDraft, where: string[], now: Date): Promise<PublishOutcome["held"][number]> {
  const title = draft.title?.trim() ?? "";
  const liveId = draft._id.replace(/^drafts\./, "");
  const fields = where.join(", ");
  try {
    await client
      .patch(draft._id)
      .set({
        scheduled: false,
        editorNotes: [`HELD on its day: it shows a phone number, email or street address that isn't HUB's (in ${fields}). It waits here until 21e8 has read it.`, draft.editorNotes?.trim() ?? ""].filter(Boolean).join("\n\n"),
      })
      .commit();
  } catch (err) {
    console.error(`[projects] ${draft._id}: couldn't switch it off after the contact check: ${errorText(err)}; not published this run`);
  }
  console.log(`[projects] held ${draft._id} at its time: a contact detail that isn't HUB's in ${fields}`);
  const notified = await emailEditors(
    `Held at its scheduled time: ${title || draft._id}`,
    [
      `"${title || draft._id}" was due on hubss.com at ${torontoWhen(String(draft.scheduledFor ?? now.toISOString()))}, but it now shows a phone number, email or street address that isn't HUB's, in ${fields}. Nothing is on the site: "Scheduled" is off and it waits in Studio → Blog posts.`,
      "",
      "Take the detail out and switch \"Scheduled\" on, and it goes at the next run. If it's meant to be there (a public place, or the owner agreed), press Publish in Studio.",
      "",
      `Open it: ${studioLink(liveId)}`,
    ].join("\n"),
    "projects"
  );
  return { id: draft._id, title, where, notified };
}

// ── step 2: write the next article ──────────────────────────────────────────

export interface Drafted { fieldPost: string; job: string; id: string; slug: string; title: string; /** When it goes live, or "held" when a check wants a read first. */ goesLive: string; factCheck: FactCheck["verdict"]; toCheck: number; style: { flagged: number; left: number }; notified: string[] }
export interface DraftOutcome {
  drafted: Drafted[];
  /** Job posts with a story still waiting for their article (tomorrow's run, or after a fix). */
  waiting: number;
  /** Why a post was passed over this run. */
  skipped: string[];
  failed: { fieldPost: string; job: string; error: string }[];
}

/**
 * Writes the article for the oldest job photos post that has a story and no
 * article yet, when the run has NEEDS_MS left before `deadline`. A post that
 * fails (Claude down, a refused write) is reported and tried again next run;
 * nothing is claimed before the draft exists, and the draft's id refuses a
 * second copy.
 */
export async function draftProjectArticles(client: SanityClient, now = new Date(), opts: { deadline?: number } = {}): Promise<DraftOutcome> {
  const out: DraftOutcome = { drafted: [], waiting: 0, skipped: [], failed: [] };
  const [candidates, withArticle] = await Promise.all([
    client.fetch<ProjectSource[]>(
      `*[_type == "fieldPost" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && defined(writeUp) && writeUp != "" && !defined(article)] | order(coalesce(date, _createdAt) asc)${SOURCE}`
    ),
    // The article exists but the post doesn't say so (the patch failed, or
    // the post was republished from an older draft): never write a second one.
    client.fetch<string[]>(`*[_type == "blogPost" && defined(fieldPost._ref)].fieldPost._ref`),
  ]);
  const done = new Set(withArticle);
  const todo: ProjectSource[] = [];
  for (const doc of candidates) {
    if (done.has(doc._id)) continue;
    const why = !doc.system?.slug || !doc.system.name ? "no system" : !doc.place?.trim() ? "no place" : !doc.note?.trim() ? "no note" : !doc.writeUp?.trim() ? "no story" : "";
    if (why) {
      out.skipped.push(`${doc._id}: ${why}`);
      console.warn(`[projects] ${doc._id}: ${why}; no article until it has one`);
      continue;
    }
    todo.push(doc);
  }
  let started = 0;
  for (const doc of todo.slice(0, MAX_ARTICLES_PER_RUN)) {
    if (opts.deadline && opts.deadline - Date.now() < NEEDS_MS) {
      console.log(`[projects] no time left this run; ${jobName(doc)} waits for the next`);
      break;
    }
    started++;
    try {
      const result = await draftOne(client, doc, now);
      if (result) out.drafted.push(result);
    } catch (err) {
      const error = errorText(err);
      console.error(`[projects] couldn't write the article for ${doc._id} (${jobName(doc)}): ${error}`);
      await emailEditors(
        `Project article not written yet: ${jobName(doc)}`,
        [
          `The daily run couldn't write the article for the job photos post "${jobName(doc)}". Nothing is on the site, and the next daily run (14:00 UTC) tries again.`,
          "",
          `What happened: ${error}`,
        ].join("\n"),
        "projects"
      );
      out.failed.push({ fieldPost: doc._id, job: jobName(doc), error });
    }
  }
  out.waiting = Math.max(0, todo.length - started);
  return out;
}

/** A run's claim on a job post while it writes, so two runs at once can't write two articles (a dashboard Run on top of the cron). */
const claimIdFor = (fieldPostId: string) => `projectClaim-${fieldPostId.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
/** A claim older than this is a run Vercel stopped before it could clear it. */
const STALE_CLAIM_MS = 10 * 60_000;

/** Takes the claim; false when another run holds a live one. */
async function claim(client: SanityClient, doc: ProjectSource, now: Date): Promise<boolean> {
  const _id = claimIdFor(doc._id);
  const take = () => client.create({ _id, _type: "projectClaim", fieldPost: doc._id, createdAt: now.toISOString() });
  try {
    await take();
    return true;
  } catch (err) {
    if (!isConflict(err)) throw err;
    const held = await client.fetch<{ createdAt?: string } | null>(`*[_id == $id][0]{ createdAt }`, { id: _id });
    const age = held?.createdAt ? now.getTime() - Date.parse(held.createdAt) : Infinity;
    if (age < STALE_CLAIM_MS) {
      console.log(`[projects] ${doc._id}: another run is writing its article; skipped`);
      return false;
    }
    console.warn(`[projects] ${doc._id}: a stale claim from a stopped run; taking over`);
    await client.delete(_id);
    await take();
    return true;
  }
}

async function draftOne(client: SanityClient, doc: ProjectSource, now: Date): Promise<Drafted | null> {
  if (!(await claim(client, doc, now))) return null;
  try {
    return await writeArticle(client, doc, now);
  } finally {
    // The article itself (its fieldPost reference) is what stops a second
    // one from now on; a claim left behind would block a retry after a failure.
    await client.delete(claimIdFor(doc._id)).catch((err) => console.error(`[projects] ${doc._id}: couldn't clear the claim: ${errorText(err)}`));
  }
}

async function writeArticle(client: SanityClient, doc: ProjectSource, now: Date): Promise<Drafted | null> {
  // draftProjectArticles has checked these.
  const system = { name: doc.system?.name ?? "", slug: doc.system?.slug ?? "" };
  const name = jobName(doc);
  const facts = factsBlock({
    productSlugs: [system.slug],
    applicationSlugs: doc.application?.slug ? [doc.application.slug] : [],
    brief: jobRecord(doc),
    // The article is this one job, with this post's photos: the project
    // map's other jobs would only compete with it for the first paragraph.
    jobs: false,
  });
  const related = relatedPostLines(await getAllPosts(), [system.name]);
  const written = await writeDraft({ title: name, type: PROJECT_TYPE, instructions: PROFILE_INSTRUCTIONS }, facts, related);
  const polished = await polishDraft(written);
  const draft = polished.draft;
  // A contact detail in the job post holds the article as one in the draft
  // does: the captions and alt text go on the page as typed, and the rest may
  // say more about the customer than the rule can see (jobPostText).
  const style = withLeft(polished.style, contactLeft(jobPostText(doc)));
  const check = await checkDraft(draft, facts);

  // Right before writing, so two runs at once can't both get here with time
  // to spare: the other run's draft is there by now.
  if (await client.fetch<number>(`count(*[_type == "blogPost" && fieldPost._ref == $id])`, { id: doc._id })) {
    console.log(`[projects] ${doc._id}: another run wrote its article; skipped`);
    return null;
  }
  const taken = await client.fetch<string[]>(`*[_type == "blogPost" && scheduled == true && defined(scheduledFor)].scheduledFor`);
  const slot = scheduleSlot(now, taken);

  // A slug nobody uses, drafts included, with no address in it (slugSource).
  const base = cleanSlug(slugSource(draft)) || `project-${Date.now()}`;
  let slug = base;
  for (let n = 2; await client.fetch<number>(`count(*[_type == "blogPost" && slug.current == $slug])`, { slug }); n++) slug = `${base}-${n}`;

  const document = buildProjectDocument(doc, draft, check, slug, slot, style, now);
  // Saved held, whatever the checks said: it is switched on only once the
  // editors have been told (below). A draft nobody knows about must never
  // go live by itself.
  await client.create({ ...document, scheduled: false });
  const liveId = document._id.replace(/^drafts\./, "");
  try {
    await client.patch(doc._id).set({ article: { _type: "reference", _ref: liveId, _weak: true } }).commit();
  } catch (err) {
    // The article exists and carries fieldPost, which is what stops a second
    // one; the post just won't show the link.
    console.error(`[projects] ${doc._id}: couldn't note the article on the post: ${errorText(err)}`);
  }
  console.log(`[projects] wrote "${document.title}" as ${document._id} from ${doc._id}; goes live ${slot}; fact check: ${check.verdict} (${check.unsupported.length}); style: ${style.left.length} of ${style.flagged} left${style.error ? ` (rewrite failed: ${style.error})` : ""}`);

  const when = torontoWhen(slot);
  let ready = document.scheduled;
  const notified = await emailEditors(
    ready ? `Goes live ${when.replace(/ at .*$/, "")} unless you hold it: ${document.title}` : `Needs a read before it goes: ${document.title}`,
    [
      ready
        ? `A Projects article was written from the job photos post "${name}" and is scheduled to go on hubss.com on ${when}. Nothing is on the site until then; its social posts go to Buffer the day after it is live.`
        : `A Projects article was written from the job photos post "${name}", but a check found something (below), so it is waiting in Studio → Blog posts and does not go live by itself. Fix the line, then switch "Scheduled" on or press Publish.`,
      "",
      document.title,
      document.excerpt,
      "",
      `Read it: ${studioLink(liveId)}`,
      ...(ready
        ? [
            "- To change a line, edit it there. It still goes out on time.",
            "- To hold it, turn \"Scheduled\" off. It then waits for you.",
            "- To move it, change \"Goes live at\" to a later day.",
          ]
        : []),
      "",
      check.unsupported.length
        ? `Fact check: ${check.unsupported.length} statement(s) to check before it goes live. They're listed in the draft's "Notes for the editor".`
        : "Fact check: every statement matches the job's record and the Product Portfolio Book.",
      style.left.some((l) => l.contact)
        ? `Style check: ${style.left.length} line(s) to fix, including a phone number, email or street address that isn't HUB's (in the article or the job post). Take it out of the article unless the owner has agreed to it being there. They're listed in the notes and marked in yellow in Studio.`
        : style.left.length
          ? `Style check: ${style.left.length} sentence(s) still have an em dash or another machine tell. They're listed in the notes and marked in yellow in Studio.`
          : "Style check: no em dashes or machine tells.",
    ].join("\n"),
    "projects"
  );
  if (ready) {
    if (notified.length) {
      try {
        await client.patch(document._id).set({ scheduled: true }).commit();
      } catch (err) {
        ready = false;
        console.error(`[projects] ${document._id}: couldn't switch it on after the email: ${errorText(err)}; it stays held`);
        await emailEditors(`Correction, held after all: ${document.title}`, `The draft "${document.title}" could not be switched to go live by itself (${errorText(err)}). It waits in Studio → Blog posts: read it and switch "Scheduled" on, or press Publish.\n\nOpen it: ${studioLink(liveId)}`, "projects");
      }
    } else {
      ready = false;
      console.error(`[projects] ${document._id}: the email didn't go, so the draft is held, not scheduled`);
      await client
        .patch(document._id)
        .set({ editorNotes: `HELD: not scheduled, because the notice to 21e8 could not be sent. 21e8 releases it after a read.\n\n${document.editorNotes}` })
        .commit()
        .catch((err) => console.error(`[projects] ${document._id}: couldn't note the hold: ${errorText(err)}`));
    }
  }
  return {
    fieldPost: doc._id,
    job: name,
    id: document._id,
    slug,
    title: document.title,
    goesLive: ready ? slot : "held",
    factCheck: check.verdict,
    toCheck: check.unsupported.length,
    style: { flagged: style.flagged, left: style.left.length },
    notified,
  };
}

function cleanSlug(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
}
