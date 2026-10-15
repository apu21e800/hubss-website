/**
 * Social drafts, three streams into one approval queue (Buffer). Nothing is
 * posted from here: Vern or Doug approves each draft in Buffer, and Buffer
 * posts it on its schedule. Run daily by app/api/cron/social-drafts.
 *
 *  1. Articles: an Insights post qualifies once it is live (in this
 *     deployment's built list, lib/blog.ts), is dated on or after
 *     SOCIAL_SINCE, and has no socialLog yet. The 74 posts imported on
 *     24 Sep 2026 are all dated earlier. There is no "recent" window on
 *     purpose: an AI draft can sit in Studio for weeks before someone
 *     publishes it, and it still gets its social drafts the day it goes live.
 *     Up to MAX_POSTS_PER_RUN a day, oldest first.
 *  2. From the field (since 14 Oct 2026): a published field post (Studio →
 *     From the field: photos of a finished job, the place, the system, a line
 *     of facts) gets posts linked to the system's page. One a day.
 *  3. From the library (since 14 Oct 2026): once a week, a documented job
 *     from the homepage map or a system or application spread from the Product
 *     Book (lib/social-library.ts), so the queue doesn't run dry between
 *     articles. Since 14 Oct a new field post takes the week's turn, so
 *     Doug's photos go first; with two articles a week that is three posts a
 *     week on each channel.
 *
 * Every link carries UTM tags (utm_source = the network, utm_medium=social,
 * utm_campaign = insights, field or library, utm_content = what it was), so
 * GA4 shows which posts and networks bring Lunch & Learn bookings.
 *
 * The copy goes through the same style pass as the Insights drafts
 * (lib/field-note-drafter.ts): any sentence with an em dash or another machine
 * tell is rewritten once, and whatever is left is written on the item's log,
 * which Studio shows under "Social drafts", and put in the email.
 *
 * Since 9 Oct 2026 failures are loud and cost nothing (lib/social-outcome.ts):
 *  - Each item is claimed (its socialLog created) before anything goes to
 *    Buffer, and create() refuses an id that exists. A second run at the same
 *    moment skips it, and a log Sanity won't take stops the run before
 *    Buffer has anything, so nothing is ever drafted twice.
 *  - An item that got no draft for a reason that can clear has its claim
 *    dropped, so the next run tries again, for GIVE_UP_DAYS from its first
 *    failed try (kept in a `socialRetry-<key>` document, which Studio
 *    doesn't list). One that has failed before waits behind the ones not tried
 *    yet, so a stuck item can't hold up new ones.
 *  - A run that stops (an expired key, no usable channel, a missing setting)
 *    emails the editors what to do (notifyRunFailure, from the cron route).
 *  - Nothing between a claim and its settling can outlast the function
 *    (Vercel stops it at 300 s, maxDuration in the route): each Buffer and
 *    Sanity call gives up after 20 s, and no item is started after 120 s or
 *    claimed after 150 s; what's left waits for the next day.
 */

import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";
import { getAllPosts, getPost } from "@/lib/blog";
import { bufferChannels, createBufferDraft, type BufferChannel } from "@/lib/buffer";
import { writeSocialCopy, polishSocialCopy, type SocialCopy, type SocialSource } from "@/lib/social-drafter";
import { styleReport } from "@/lib/field-note-drafter";
import { isSanityImage } from "@/lib/photos";
import { PRODUCT_CATALOGUE } from "@/lib/product-catalogue";
import { getMergedProduct } from "@/lib/products.server";
import { getMergedApplication } from "@/lib/applications.server";
import { absolute, idFor, imageFor, libraryDue, libraryPick, libraryQueue, SITE, type LibraryItem } from "@/lib/social-library";
import {
  daysSince,
  decideOutcome,
  failureHint,
  GIVE_UP_DAYS,
  isConflict,
  NO_CHANNELS,
  unusableReason,
  type ChannelSkip,
  type Outcome,
} from "@/lib/social-outcome";

/** Posts published before this never get social drafts (the imported library). */
export const SOCIAL_SINCE = "2026-09-25";
const MAX_POSTS_PER_RUN = 2;
const MAX_FIELD_PER_RUN = 1;

/** Which copy each Buffer service gets, and what it needs. */
const SERVICES: Record<string, { copy: keyof SocialCopy; utm: string; image?: "portrait" | "landscape"; needsImage?: boolean; metadata?: Record<string, unknown> }> = {
  linkedin: { copy: "linkedin", utm: "linkedin", image: "landscape" },
  facebook: { copy: "facebook", utm: "facebook", image: "landscape", metadata: { facebook: { type: "post" } } },
  instagram: { copy: "instagram", utm: "instagram", image: "portrait", needsImage: true, metadata: { instagram: { type: "post", shouldShareToFeed: true } } },
  twitter: { copy: "x", utm: "x", image: "landscape" },
  x: { copy: "x", utm: "x", image: "landscape" },
  threads: { copy: "short", utm: "threads", image: "landscape" },
  bluesky: { copy: "short", utm: "bluesky", image: "landscape" },
  mastodon: { copy: "short", utm: "mastodon", image: "landscape" },
};

export type Stream = "Article" | "From the field" | "From the library";

/** One thing to draft posts from, whatever stream it came from. */
interface SocialItem {
  /** The log key: an article's slug, "field:<id>" or "lib:<what>". */
  key: string;
  stream: Stream;
  title: string;
  source: SocialSource;
  /** The page the posts link to, without UTM tags. */
  pageUrl: string;
  /** utm_campaign: insights, field or library. */
  campaign: string;
  image?: string;
  imageAlt?: string;
  /** The photo's focal point in Studio, when known: crops centre on it. */
  imageHotspot?: { x: number; y: number } | null;
}

/**
 * A page link with UTM tags. For an article this is exactly the link the
 * pipeline has made since 25 Sep 2026 (utm_campaign was "field-notes" until
 * then; renamed with the site's Insights label before the first post went out).
 */
const utmLink = (item: Pick<SocialItem, "pageUrl" | "campaign" | "key">, source: string) =>
  `${item.pageUrl}?utm_source=${source}&utm_medium=social&utm_campaign=${item.campaign}&utm_content=${encodeURIComponent(item.key.replace(/^(field|lib):/, ""))}`;

export interface SocialResult {
  slug: string;
  title: string;
  stream: Stream;
  drafted: { service: string; channel: string }[];
  skipped: ChannelSkip[];
  /** The style pass on the copy: "clean", or the sentences to fix in Buffer. */
  styleCheck: string;
  /** See lib/social-outcome.ts. Only "retry" leaves the item to the next run. */
  outcome: Outcome;
  /** Studio's record of the item couldn't be written: what that means, for the email. */
  recordProblem?: string;
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Time limits inside the route's 300 s (see the header). */
const START_LIMIT_MS = 120_000;
const CLAIM_LIMIT_MS = 150_000;
const SANITY_TIMEOUT_MS = 20_000;

/** A field post as the query returns it. */
interface FieldDoc {
  _id: string;
  place?: string;
  note?: string;
  date?: string;
  system?: { name?: string; slug?: string } | null;
  application?: string | null;
  photo?: string | null;
  alt?: string | null;
  hotspot?: { x: number; y: number } | null;
}

function fieldItem(doc: FieldDoc): SocialItem | null {
  const system = doc.system;
  if (!system?.name || !system.slug || !doc.place || !doc.note || !doc.photo) return null;
  const about = PRODUCT_CATALOGUE[system.slug]?.description;
  const title = `${system.name} in ${doc.place}`;
  return {
    key: `field:${doc._id}`,
    stream: "From the field",
    title,
    source: {
      kind: "field",
      title,
      type: "Field report",
      excerpt: doc.note,
      text: [
        `Where: ${doc.place}.`,
        `System: ${system.name}.`,
        doc.application ? `Application: ${doc.application}.` : "",
        `What the crew says: ${doc.note}`,
        about ? `About ${system.name}, from the HUB Product Book: ${about}` : "",
      ].filter(Boolean).join("\n"),
      linkTo: `the ${system.name} page on hubss.com`,
    },
    pageUrl: `${SITE}/products/${system.slug}`,
    campaign: "field",
    image: doc.photo,
    imageAlt: doc.alt ?? title,
    imageHotspot: doc.hotspot,
  };
}

/** A library item, with the Studio hero photo of its page when there is one (what the page shows). */
async function libraryItem(lib: LibraryItem): Promise<SocialItem> {
  let image = lib.image;
  let imageAlt = lib.imageAlt;
  if (lib.hero) {
    try {
      const page = lib.hero.type === "product" ? await getMergedProduct(lib.hero.slug) : await getMergedApplication(lib.hero.slug);
      if (page?.heroPhoto?.src && isSanityImage(page.heroPhoto.src)) {
        image = page.heroPhoto.src;
        imageAlt = page.heroPhoto.alt || imageAlt;
      }
    } catch (err) {
      console.warn(`[social] ${lib.key}: no Studio hero photo (${errorText(err)}); using the site's`);
    }
  }
  return {
    key: lib.key,
    stream: "From the library",
    title: lib.title,
    source: { kind: "library", title: lib.title, type: lib.type, excerpt: lib.excerpt, text: lib.text, linkTo: lib.linkTo },
    pageUrl: absolute(lib.path),
    campaign: "library",
    image,
    imageAlt,
  };
}

export async function draftSocialForNewPosts(now = new Date()): Promise<{ posts: SocialResult[]; waiting: number }> {
  const started = Date.now();
  const client = sanityWriteClient().withConfig({ timeout: SANITY_TIMEOUT_MS });
  const [loggedSlugs, retries, fieldDocs, lastJobPostAt] = await Promise.all([
    client.fetch<string[]>(`*[_type == "socialLog"].slug`),
    client.fetch<{ slug: string; firstFailedAt: string }[]>(`*[_type == "socialRetry"]{ slug, firstFailedAt }`),
    client.fetch<FieldDoc[]>(
      `*[_type == "fieldPost" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(coalesce(date, _createdAt) asc){
        _id, place, note, date,
        "system": system->{ name, "slug": slug.current },
        "application": application->name,
        "photo": photos[0].asset->url,
        "alt": photos[0].alt,
        "hotspot": photos[0].hotspot{ x, y }
      }`
    ),
    // The newest job post (library or field): one a week (libraryDue). A log
    // settled with nothing in Buffer (every channel skipped) doesn't count; one
    // whose drafts couldn't be written onto it still does.
    client.fetch<string | null>(
      `*[_type == "socialLog" && (string::startsWith(slug, "lib:") || string::startsWith(slug, "field:")) && !(count(drafts) == 0 && count(skipped) > 0)] | order(createdAt desc)[0].createdAt`
    ),
  ]);
  const logged = new Set<string>(loggedSlugs);
  // When each item that keeps failing first failed.
  const failing = new Map<string, string>(retries.map((r) => [r.slug, r.firstFailedAt]));
  const failedLast = <T>(xs: T[], key: (x: T) => string) => xs.sort((a, b) => Number(failing.has(key(a))) - Number(failing.has(key(b))));

  // Oldest first, so a backlog goes out in the order it was published; one
  // that has failed before goes behind the ones not tried yet (a stable sort).
  const articles = failedLast(
    (await getAllPosts()).filter((p) => p.date >= SOCIAL_SINCE && !logged.has(p.slug)).reverse(),
    (p) => p.slug
  );
  // Built now, so a published field post missing its note, photo or system
  // (Studio's validation should stop that) is skipped instead of holding the
  // day's field slot for ever.
  const fields = failedLast(
    fieldDocs.filter((d) => !logged.has(`field:${d._id}`)).flatMap((d) => {
      const item = fieldItem(d);
      if (!item) console.warn(`[social] field:${d._id}: no note, photo or system; skipped until it has them`);
      return item ? [item] : [];
    }),
    (item) => item.key
  );
  // An article drafted today counts as posted: the library mustn't pick its job too.
  const posted = new Set([...logged, ...articles.map((p) => p.slug)]);
  // A field post not tried before takes the week's turn; one that keeps
  // failing doesn't, so it can't hold the library up for its 14 days of retries.
  const fieldPostToday = fields.some((f) => !failing.has(f.key));
  const library = libraryDue(now, lastJobPostAt ?? undefined, fieldPostToday) ? libraryPick(libraryQueue(), posted, now) : undefined;
  if (!articles.length && !fields.length && !library) return { posts: [], waiting: 0 };

  const channels = await bufferChannels();
  // With no channel the job writes for (none connected, or only YouTube and
  // the like), every item would end "nothing possible" and be closed for
  // good: stop here instead, and the route emails the editors.
  if (!channels.some((c) => SERVICES[c.service.toLowerCase()])) {
    const connected = channels.map((c) => c.service.toLowerCase()).join(", ");
    throw new Error(`${NO_CHANNELS} (connected: ${connected || "none"}).`);
  }

  // What to draft today, in order. Each is built only when its turn comes.
  const todo: { name: string; build: () => Promise<SocialItem | null> }[] = [
    ...articles.slice(0, MAX_POSTS_PER_RUN).map((meta) => ({
      name: meta.slug,
      build: async (): Promise<SocialItem | null> => {
        const post = await getPost(meta.slug);
        if (!post) return null;
        return {
          key: post.slug,
          stream: "Article",
          title: post.title,
          source: { kind: "article", title: post.title, excerpt: post.excerpt, text: post.text, type: post.category },
          pageUrl: `${SITE}/blog/${post.slug}`,
          campaign: "insights",
          image: post.featuredImage,
          imageAlt: post.featuredImageAlt ?? post.title,
        };
      },
    })),
    ...fields.slice(0, MAX_FIELD_PER_RUN).map((item) => ({ name: item.key, build: async () => item })),
    ...(library ? [{ name: library.key, build: () => libraryItem(library) }] : []),
  ];

  const results: SocialResult[] = [];
  let done = 0;
  for (const job of todo) {
    if (Date.now() - started > START_LIMIT_MS) {
      console.log(`[social] out of time for today; ${job.name} waits for the next run`);
      break;
    }
    const item = await job.build();
    if (!item) { done++; continue; }
    const result = await draftItem(client, item, channels, failing.get(item.key), now, started);
    if (result === "out of time") break;
    done++;
    if (result) results.push(result);
  }
  const waiting = Math.max(0, articles.length + fields.length + (library ? 1 : 0) - done);
  return { posts: results, waiting };
}

type Client = ReturnType<typeof sanityWriteClient>;

/** Claim, write, draft in Buffer, settle, email: one item. Null when another run has it. */
async function draftItem(
  client: Client,
  item: SocialItem,
  channels: BufferChannel[],
  firstFailedAt: string | undefined,
  now: Date,
  started: number
): Promise<SocialResult | null | "out of time"> {
  const links: Record<keyof SocialCopy, string> = {
    linkedin: utmLink(item, "linkedin"),
    facebook: utmLink(item, "facebook"),
    instagram: utmLink(item, "instagram"),
    x: utmLink(item, "x"),
    short: utmLink(item, "threads"),
  };
  const written = await writeSocialCopy(item.source, links);
  const { copy, style } = await polishSocialCopy(written);

  const result: SocialResult = {
    slug: item.key,
    title: item.title,
    stream: item.stream,
    drafted: [],
    skipped: [],
    styleCheck: styleReport(style, "in Buffer before approving").join("\n"),
    outcome: "retry",
  };

  // Claim the item before anything goes to Buffer (see the header). The copy
  // is written first, so a failure there (Anthropic down) leaves no claim.
  if (Date.now() - started > CLAIM_LIMIT_MS) {
    console.log(`[social] out of time for today; ${item.key} waits for the next run`);
    return "out of time";
  }
  const logId = idFor("socialLog", item.key);
  try {
    await client.create({
      _id: logId,
      _type: "socialLog",
      slug: item.key,
      title: item.title,
      source: item.stream,
      createdAt: now.toISOString(),
      drafts: [],
      skipped: [],
      styleCheck: result.styleCheck,
    });
  } catch (err) {
    if (isConflict(err)) {
      console.log(`[social] ${item.key}: another run has it; skipped`);
      return null;
    }
    throw err;
  }

  // _type names the array items for Studio's "Social drafts" view (sanity/schemas/socialLog.ts).
  const drafts: { _key: string; _type: "bufferDraft"; service: string; channel: string; bufferPostId: string }[] = [];
  for (const ch of channels) {
    const service = ch.service.toLowerCase();
    const rule = SERVICES[service];
    const label = ch.displayName || ch.name;
    if (!rule) { result.skipped.push({ service, channel: label, why: "not a network this pipeline writes for (YouTube needs a video)", kind: "lasting" }); continue; }
    const unusable = unusableReason(ch);
    if (unusable) { result.skipped.push({ service, channel: label, why: unusable, kind: "retry" }); continue; }
    // Everything from here is inside the try: nothing may escape between the
    // claim and its settling below, or the item would stay claimed with
    // nothing drafted.
    try {
      let text = copy[rule.copy];
      // The short copy was written with the Threads link; give each network its own.
      if (rule.copy === "short") text = text.replace(links.short, utmLink(item, rule.utm));
      const imageUrl = imageFor(item.image, rule.image, item.imageHotspot);
      if (rule.needsImage && !imageUrl) { result.skipped.push({ service, channel: label, why: "Instagram needs a photo and this has none", kind: "lasting" }); continue; }
      const id = await createBufferDraft({ channelId: ch.id, text, imageUrl, imageAlt: item.imageAlt ?? item.title, metadata: rule.metadata });
      drafts.push({ _key: ch.id, _type: "bufferDraft", service, channel: label, bufferPostId: id });
      result.drafted.push({ service, channel: label });
    } catch (err) {
      result.skipped.push({ service, channel: label, why: err instanceof Error ? err.message : String(err), kind: "retry" });
    }
  }

  result.outcome = decideOutcome(result.drafted.length, result.skipped, firstFailedAt ? daysSince(firstFailedAt, now) : null);
  const reasons = result.skipped.map((s) => `${s.channel} (${s.service}): ${s.why}`).join("; ");
  const retryId = idFor("socialRetry", item.key);
  if (result.outcome === "retry") {
    // Nothing reached Buffer and it may next time: drop the claim, so the
    // next daily run writes this item again. The email says why.
    try {
      await client.delete(logId);
      console.warn(`[social] ${item.key}: nothing drafted, the next run tries again. ${reasons}`);
    } catch (err) {
      result.recordProblem = `Its record under Sent to Buffer in Studio couldn't be cleared (${errorText(err)}), so the job won't try this again by itself.`;
      console.error(`[social] ${item.key}: nothing drafted, and the claim couldn't be dropped: ${errorText(err)}. ${reasons}`);
    }
    // The first failure starts the GIVE_UP_DAYS clock. If this write fails,
    // the clock starts at the next failure instead: a later give-up, never an
    // earlier one.
    if (!firstFailedAt) {
      await client
        .createIfNotExists({ _id: retryId, _type: "socialRetry", slug: item.key, firstFailedAt: now.toISOString() })
        .catch((err) => console.error(`[social] ${item.key}: couldn't note the first failure: ${errorText(err)}`));
    }
  } else {
    // Done with it: its failure clock (if any) can go. A leftover is harmless.
    if (firstFailedAt) {
      await client.delete(retryId).catch((err) => console.error(`[social] ${item.key}: couldn't remove ${retryId}: ${errorText(err)}`));
    }
    // Done, even if some channels failed, so it is never drafted twice;
    // what failed is in the log and in the email.
    try {
      await client
        .patch(logId)
        .set({
          drafts,
          skipped: result.skipped.map((s, i) => ({ _key: `s${i}`, _type: "skippedChannel", service: s.service, channel: s.channel, why: s.why })),
          styleCheck: result.styleCheck,
        })
        .commit();
    } catch (err) {
      result.recordProblem = `Studio's record of this under Sent to Buffer couldn't be filled in (${errorText(err)}). Nothing is lost: the drafts are in Buffer, and it won't be drafted again.`;
      console.error(`[social] ${item.key}: the log couldn't be filled in: ${errorText(err)}`);
    }
    console.log(`[social] ${item.key}: ${result.outcome}, ${result.drafted.length} Buffer draft(s), ${result.skipped.length} skipped${reasons ? ` (${reasons})` : ""}; style: ${style.left.length} of ${style.flagged} left${style.error ? ` (rewrite failed: ${style.error})` : ""}`);
  }
  await notify(result);
  return result;
}

/**
 * True once the job has made a log, so a missing BUFFER_API_KEY means the key
 * was lost (say, deleted during the yearly change) rather than "not set up
 * yet". False whenever it can't tell.
 */
export async function socialJobHasRun(): Promise<boolean> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return false;
  try {
    return (await sanityWriteClient().fetch<boolean>(`count(*[_type == "socialLog"]) > 0`)) === true;
  } catch {
    return false;
  }
}

function channelList(xs: { service: string; channel: string }[]) {
  return xs.map((x) => `${x.channel} (${x.service})`).join(", ");
}

/** One email to the editors (BLOG_DRAFT_NOTIFY). Never throws: a lost email mustn't stop the run. */
async function emailEditors(subject: string, text: string): Promise<void> {
  const to = (process.env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length || !process.env.RESEND_API_KEY) {
    console.error(`[social] no email sent (BLOG_DRAFT_NOTIFY or RESEND_API_KEY missing): ${subject}`);
    return;
  }
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "HUB Surface Systems <noreply@hubss.com>",
      to,
      subject,
      text,
    });
    if (error) console.error("[social] email failed:", error);
  } catch (err) {
    console.error("[social] email failed:", err);
  }
}

/** How an email names what the drafts are for. */
export function describe(r: Pick<SocialResult, "stream" | "title">): string {
  if (r.stream === "From the field") return `the job photos post "${r.title}"`;
  if (r.stream === "From the library") return `"${r.title}" from HUB's library (a documented job or a Product Book spread)`;
  return `the new Insights article "${r.title}"`;
}

async function notify(r: SocialResult) {
  const skippedLines = r.skipped.map((s) => `- ${s.channel} (${s.service}): ${s.why}`);
  const record = r.recordProblem ? ["", r.recordProblem] : [];
  const byHand = "Make the posts by hand in Buffer if you want them.";
  const tag = r.stream === "Article" ? "" : ` (${r.stream.toLowerCase()})`;
  const what = describe(r);

  if (r.outcome === "drafted") {
    await emailEditors(
      `Social drafts ready in Buffer: ${r.title}${tag}`,
      [
        `Social drafts for ${what} are waiting in Buffer. Nothing posts until you approve and schedule them.`,
        "",
        `Drafted: ${channelList(r.drafted)}`,
        ...(r.skipped.length ? ["", "Skipped:", ...skippedLines] : []),
        ...record,
        "",
        r.styleCheck,
        "",
        "Review them: https://publish.buffer.com/drafts",
      ].join("\n")
    );
    return;
  }

  if (r.outcome === "nothing-possible") {
    await emailEditors(
      `No social drafts for: ${r.title}${tag}`,
      [
        `No channel in Buffer can take ${what}, so nothing was drafted and the job is done with it. ${byHand}`,
        "",
        "Why:",
        ...skippedLines,
        ...record,
      ].join("\n")
    );
    return;
  }

  const hint = `What to do: ${failureHint(new Error(r.skipped.map((s) => s.why).join("; ")))}`;
  if (r.outcome === "gave-up") {
    await emailEditors(
      `Social drafts given up: ${r.title}${tag}`,
      [
        `Every channel has failed for ${what} for more than ${GIVE_UP_DAYS} days since its first try, so the job has stopped trying. Nothing was posted. ${byHand}`,
        "",
        "Why:",
        ...skippedLines,
        ...record,
        "",
        hint,
      ].join("\n")
    );
    return;
  }

  // "retry"
  await emailEditors(
    `Social drafts not made yet: ${r.title}${tag}`,
    [
      r.recordProblem
        ? `Nothing could be drafted in Buffer for ${what}, and nothing was posted.`
        : `Nothing could be drafted in Buffer for ${what}. Nothing was posted, and the next daily run (14:00 UTC) tries again, for up to ${GIVE_UP_DAYS} days from the first failure.`,
      "",
      "Why:",
      ...skippedLines,
      ...(r.recordProblem ? ["", `${r.recordProblem} ${byHand}`] : []),
      "",
      hint,
    ].join("\n")
  );
}

/**
 * The run stopped (an expired key, no channels, a missing setting): tell the
 * editors what to do, so it can't fail unnoticed. Called by the cron route.
 * Nothing is lost: anything it didn't finish has no log, so it is drafted on
 * the first run after the fix.
 */
export async function notifyRunFailure(err: unknown): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  await emailEditors(
    `Social drafts didn't run: ${message.length > 80 ? `${message.slice(0, 77)}...` : message}`,
    [
      "Today's social drafts job stopped. Nothing was posted and nothing is lost: any new article, field post or library post it didn't finish gets its Buffer drafts on the first daily run after this is fixed.",
      "",
      `What happened: ${message}`,
      "",
      `What to do: ${failureHint(err)}`,
    ].join("\n")
  );
}
