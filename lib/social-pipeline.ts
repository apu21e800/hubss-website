/**
 * Social drafts for new Field Notes: a published post → one draft per
 * connected Buffer channel → an email to the editors. Nothing is posted:
 * Vern or Doug approves and schedules each draft in Buffer.
 *
 * Run daily by app/api/cron/social-drafts (vercel.json). A post qualifies once
 * it is live (in this deployment's built list, lib/blog.ts), is dated on or
 * after SOCIAL_SINCE, and has no socialLog yet. The 74 posts imported on
 * 24 Sep 2026 are all dated earlier, so the library doesn't flood Buffer on
 * the first run. There is no "recent" window on purpose: an AI draft can sit
 * in Studio for weeks before someone publishes it, and it should still get
 * its social drafts the day it goes live.
 *
 * Every link carries UTM tags (utm_source = the network, utm_medium=social,
 * utm_campaign=field-notes, utm_content = the post's slug), so GA4 shows which
 * posts and networks bring Lunch & Learn bookings.
 *
 * The copy goes through the same style pass as the Insights drafts
 * (lib/field-note-drafter.ts): any sentence with an em dash or another machine
 * tell is rewritten once, and whatever is left is written on the post's log,
 * which Studio shows under "Social drafts", and put in the email.
 *
 * Since 9 Oct 2026 failures are loud and cost nothing (lib/social-outcome.ts):
 *  - Each article is claimed (its socialLog created) before anything goes to
 *    Buffer, and create() refuses an id that exists. A second run at the same
 *    moment skips it, and a log Sanity won't take stops the run before
 *    Buffer has anything, so an article is never drafted twice.
 *  - An article that got no draft for a reason that can clear has its claim
 *    dropped, so the next run tries again, for GIVE_UP_DAYS from its first
 *    failed try (kept in a `socialRetry-<slug>` document, which Studio
 *    doesn't list). One that has failed before waits behind the ones not tried
 *    yet, so a stuck article can't hold up new ones.
 *  - A run that stops (an expired key, no usable channel, a missing setting)
 *    emails the editors what to do (notifyRunFailure, from the cron route).
 *  - Nothing between a claim and its settling can outlast the function
 *    (Vercel stops it at 300 s, maxDuration in the route): each Buffer and
 *    Sanity call gives up after 20 s, and no article is started after 120 s
 *    or claimed after 150 s; what's left waits for the next day.
 */

import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";
import { getAllPosts, getPost } from "@/lib/blog";
import { bufferChannels, createBufferDraft } from "@/lib/buffer";
import { writeSocialCopy, polishSocialCopy, type SocialCopy } from "@/lib/social-drafter";
import { styleReport } from "@/lib/field-note-drafter";
import { isSanityImage, sanityOgImage } from "@/lib/photos";
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

const utmLink = (slug: string, source: string) =>
  // utm_campaign was "field-notes" until 25 Sep 2026; renamed with the site's
  // Insights label before the first post went out, so GA4 has one campaign.
  `https://hubss.com/blog/${slug}?utm_source=${source}&utm_medium=social&utm_campaign=insights&utm_content=${encodeURIComponent(slug)}`;

/** Instagram wants 4:5 portrait; everything else gets the 1200×630 share crop. */
function imageFor(src: string | undefined, shape: "portrait" | "landscape" | undefined): string | undefined {
  if (!src || !shape || !isSanityImage(src)) return undefined;
  if (shape === "landscape") return sanityOgImage(src);
  const url = new URL(src);
  url.searchParams.set("w", "1080");
  url.searchParams.set("h", "1350");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("fm", "jpg");
  url.searchParams.set("q", "85");
  return url.toString();
}

export interface SocialResult {
  slug: string;
  title: string;
  drafted: { service: string; channel: string }[];
  skipped: ChannelSkip[];
  /** The style pass on the copy: "clean", or the sentences to fix in Buffer. */
  styleCheck: string;
  /** See lib/social-outcome.ts. Only "retry" leaves the article to the next run. */
  outcome: Outcome;
  /** Studio's record of the article couldn't be written: what that means, for the email. */
  recordProblem?: string;
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Time limits inside the route's 300 s (see the header). */
const START_LIMIT_MS = 120_000;
const CLAIM_LIMIT_MS = 150_000;
const SANITY_TIMEOUT_MS = 20_000;

export async function draftSocialForNewPosts(now = new Date()): Promise<{ posts: SocialResult[]; waiting: number }> {
  const started = Date.now();
  const client = sanityWriteClient().withConfig({ timeout: SANITY_TIMEOUT_MS });
  const logged = new Set<string>(await client.fetch(`*[_type == "socialLog"].slug`));
  // When each article that keeps failing first failed.
  const failing = new Map<string, string>(
    (await client.fetch<{ slug: string; firstFailedAt: string }[]>(`*[_type == "socialRetry"]{ slug, firstFailedAt }`)).map((r) => [r.slug, r.firstFailedAt])
  );
  // Oldest first, so a backlog goes out in the order it was published; one
  // that has failed before goes behind the ones not tried yet (a stable sort).
  const due = (await getAllPosts())
    .filter((p) => p.date >= SOCIAL_SINCE && !logged.has(p.slug))
    .reverse()
    .sort((a, b) => Number(failing.has(a.slug)) - Number(failing.has(b.slug)));
  if (!due.length) return { posts: [], waiting: 0 };

  const channels = await bufferChannels();
  // With no channel the job writes for (none connected, or only YouTube and
  // the like), every article would end "nothing possible" and be closed for
  // good: stop here instead, and the route emails the editors.
  if (!channels.some((c) => SERVICES[c.service.toLowerCase()])) {
    const connected = channels.map((c) => c.service.toLowerCase()).join(", ");
    throw new Error(`${NO_CHANNELS} (connected: ${connected || "none"}).`);
  }
  const results: SocialResult[] = [];
  for (const meta of due.slice(0, MAX_POSTS_PER_RUN)) {
    if (Date.now() - started > START_LIMIT_MS) {
      console.log(`[social] out of time for today; ${meta.slug} waits for the next run`);
      break;
    }
    const post = await getPost(meta.slug);
    if (!post) continue;
    const links = {
      linkedin: utmLink(post.slug, "linkedin"),
      facebook: utmLink(post.slug, "facebook"),
      instagram: utmLink(post.slug, "instagram"),
      x: utmLink(post.slug, "x"),
      short: utmLink(post.slug, "threads"),
    };
    const written = await writeSocialCopy({ title: post.title, excerpt: post.excerpt, text: post.text, type: post.category }, links);
    const { copy, style } = await polishSocialCopy(written);

    const result: SocialResult = {
      slug: post.slug,
      title: post.title,
      drafted: [],
      skipped: [],
      styleCheck: styleReport(style, "in Buffer before approving").join("\n"),
      outcome: "retry",
    };

    // Claim the article before anything goes to Buffer (see the header). The
    // copy is written first, so a failure there (Anthropic down) leaves no claim.
    if (Date.now() - started > CLAIM_LIMIT_MS) {
      console.log(`[social] out of time for today; ${post.slug} waits for the next run`);
      break;
    }
    const logId = `socialLog-${post.slug}`;
    try {
      await client.create({
        _id: logId,
        _type: "socialLog",
        slug: post.slug,
        title: post.title,
        createdAt: now.toISOString(),
        drafts: [],
        skipped: [],
        styleCheck: result.styleCheck,
      });
    } catch (err) {
      if (isConflict(err)) {
        console.log(`[social] ${post.slug}: another run has this article; skipped`);
        continue;
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
      // claim and its settling below, or the article would stay claimed with
      // nothing drafted.
      try {
        let text = copy[rule.copy];
        // The short copy was written with the Threads link; give each network its own.
        if (rule.copy === "short") text = text.replace(links.short, utmLink(post.slug, rule.utm));
        const imageUrl = imageFor(post.featuredImage, rule.image);
        if (rule.needsImage && !imageUrl) { result.skipped.push({ service, channel: label, why: "Instagram needs a photo and the post has none", kind: "lasting" }); continue; }
        const id = await createBufferDraft({ channelId: ch.id, text, imageUrl, imageAlt: post.featuredImageAlt ?? post.title, metadata: rule.metadata });
        drafts.push({ _key: ch.id, _type: "bufferDraft", service, channel: label, bufferPostId: id });
        result.drafted.push({ service, channel: label });
      } catch (err) {
        result.skipped.push({ service, channel: label, why: err instanceof Error ? err.message : String(err), kind: "retry" });
      }
    }

    const firstFailedAt = failing.get(post.slug);
    result.outcome = decideOutcome(result.drafted.length, result.skipped, firstFailedAt ? daysSince(firstFailedAt, now) : null);
    const reasons = result.skipped.map((s) => `${s.channel} (${s.service}): ${s.why}`).join("; ");
    const retryId = `socialRetry-${post.slug}`;
    if (result.outcome === "retry") {
      // Nothing reached Buffer and it may next time: drop the claim, so the
      // next daily run writes this article again. The email says why.
      try {
        await client.delete(logId);
        console.warn(`[social] ${post.slug}: nothing drafted, the next run tries again. ${reasons}`);
      } catch (err) {
        result.recordProblem = `Its record under Social drafts in Studio couldn't be cleared (${errorText(err)}), so the job won't try this article again by itself.`;
        console.error(`[social] ${post.slug}: nothing drafted, and the claim couldn't be dropped: ${errorText(err)}. ${reasons}`);
      }
      // The first failure starts the GIVE_UP_DAYS clock. If this write fails,
      // the clock starts at the next failure instead: a later give-up, never an
      // earlier one.
      if (!firstFailedAt) {
        await client
          .createIfNotExists({ _id: retryId, _type: "socialRetry", slug: post.slug, firstFailedAt: now.toISOString() })
          .catch((err) => console.error(`[social] ${post.slug}: couldn't note the first failure: ${errorText(err)}`));
      }
    } else {
      // Done with it: its failure clock (if any) can go. A leftover is harmless.
      if (firstFailedAt) {
        await client.delete(retryId).catch((err) => console.error(`[social] ${post.slug}: couldn't remove ${retryId}: ${errorText(err)}`));
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
        result.recordProblem = `Studio's record of this article under Social drafts couldn't be filled in (${errorText(err)}). Nothing is lost: the drafts are in Buffer, and the article won't be drafted again.`;
        console.error(`[social] ${post.slug}: the log couldn't be filled in: ${errorText(err)}`);
      }
      console.log(`[social] ${post.slug}: ${result.outcome}, ${result.drafted.length} Buffer draft(s), ${result.skipped.length} skipped${reasons ? ` (${reasons})` : ""}; style: ${style.left.length} of ${style.flagged} left${style.error ? ` (rewrite failed: ${style.error})` : ""}`);
    }
    await notify(result);
    results.push(result);
  }
  return { posts: results, waiting: Math.max(0, due.length - MAX_POSTS_PER_RUN) };
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

async function notify(r: SocialResult) {
  const skippedLines = r.skipped.map((s) => `- ${s.channel} (${s.service}): ${s.why}`);
  const record = r.recordProblem ? ["", r.recordProblem] : [];
  const byHand = "Make the posts by hand in Buffer if you want them.";

  if (r.outcome === "drafted") {
    await emailEditors(
      `Social drafts ready in Buffer: ${r.title}`,
      [
        `Social drafts for the new Insights article "${r.title}" are waiting in Buffer. Nothing posts until you approve and schedule them.`,
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
      `No social drafts for: ${r.title}`,
      [
        `No channel in Buffer can take the new Insights article "${r.title}", so nothing was drafted and the job is done with it. ${byHand}`,
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
      `Social drafts given up: ${r.title}`,
      [
        `Every channel has failed for the Insights article "${r.title}" for more than ${GIVE_UP_DAYS} days since its first try, so the job has stopped trying. Nothing was posted. ${byHand}`,
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
    `Social drafts not made yet: ${r.title}`,
    [
      r.recordProblem
        ? `Nothing could be drafted in Buffer for the new Insights article "${r.title}", and nothing was posted.`
        : `Nothing could be drafted in Buffer for the new Insights article "${r.title}". Nothing was posted, and the next daily run (14:00 UTC) tries again, for up to ${GIVE_UP_DAYS} days from the first failure.`,
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
 * The articles lose nothing: any it didn't finish has no log, so it is
 * drafted on the first run after the fix.
 */
export async function notifyRunFailure(err: unknown): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  await emailEditors(
    `Social drafts didn't run: ${message.length > 80 ? `${message.slice(0, 77)}...` : message}`,
    [
      "Today's social drafts job stopped. Nothing was posted and nothing is lost: any new Insights article it didn't finish gets its Buffer drafts on the first daily run after this is fixed.",
      "",
      `What happened: ${message}`,
      "",
      `What to do: ${failureHint(err)}`,
    ].join("\n")
  );
}
