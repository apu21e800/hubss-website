/**
 * GET /api/cron/social-drafts — the daily run (14:00 UTC): the blog's
 * scheduled articles, then social, then the next project article.
 *
 * Vercel Cron calls it (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
 * Run it now: Vercel → hubss-website → Settings → Cron Jobs → Run.
 *
 * First, the forms' counts (lib/lead-counts.ts, logLeadSummary): one
 * `[leads]` log line with the last two weeks' delivered, held and failed
 * messages by form, which the Monday report reads. A failure there is a log
 * line only (no email, the run's status untouched): the counts themselves
 * are safe in Sanity and tomorrow's line has them.
 *
 * Then three steps, each on its own (a failure in one is emailed and the next
 * still runs; the response carries all three):
 *  1. publishDueDrafts (lib/project-posts.ts): every blog draft set to go
 *     live by itself whose time has come is published, and the site rebuilds.
 *  2. draftSocialForNewPosts (lib/social-pipeline.ts): Buffer posts for new
 *     articles, job photos and the library, queued for Buffer's next slots
 *     (drafts for approval with SOCIAL_AUTO_QUEUE=off, lib/buffer.ts). The copy gets the house
 *     style pass (lib/style-lint.ts); what it can't fix is in the email and in
 *     Studio under Sent to Buffer.
 *  3. draftProjectArticles (lib/project-posts.ts): one job photos post with
 *     its story becomes a scheduled Projects article, with whatever time the
 *     route has left (it needs about two and a half minutes; otherwise the
 *     next run does it).
 *
 * Needs, in Vercel (Production): CRON_SECRET, ANTHROPIC_API_KEY,
 * SANITY_API_WRITE_TOKEN, BUFFER_API_KEY; BLOG_DRAFT_NOTIFY and
 * RESEND_API_KEY for the emails; SOCIAL_AUTO_QUEUE=off to go back to
 * approving in Buffer. Until BUFFER_API_KEY is first set the social step does nothing.
 * After that, a social run that fails (an expired key, a missing setting, the
 * key itself gone) emails the editors what to do (notifyRunFailure), every
 * day until it's fixed.
 */

import { NextRequest, NextResponse } from "next/server";
import { draftSocialForNewPosts, notifyRunFailure, socialJobHasRun } from "@/lib/social-pipeline";
import { draftProjectArticles, publishDueDrafts } from "@/lib/project-posts";
import { sanityWriteClient } from "@/lib/sanity.write";
import { emailEditors } from "@/lib/editor-mail";
import { logLeadSummary } from "@/lib/lead-counts";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/** The route's budget: maxDuration less a margin for the response. */
const BUDGET_MS = 290_000;

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured on this server." }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const missing = ["ANTHROPIC_API_KEY", "SANITY_API_WRITE_TOKEN"].filter((k) => !process.env[k]);
  if (missing.length) {
    const message = `Not configured: ${missing.join(", ")}`;
    console.error(`[social] run failed: ${message}`);
    await notifyRunFailure(new Error(message));
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const deadline = Date.now() + BUDGET_MS;
  const now = new Date();
  const out: Record<string, unknown> = {};
  let failed = false;
  const client = sanityWriteClient().withConfig({ timeout: 20_000 });

  // 0. The forms' counts, for the Monday report. Seconds at most; never
  //    stops the run.
  try {
    // No retries: while Sanity is down this step must not eat the run's time.
    const leads = await logLeadSummary(client.withConfig({ timeout: 10_000, maxRetries: 0 }), now, Boolean(process.env.GA4_API_SECRET));
    const { delivered, held, failed: notSent } = leads.last7;
    out.leads = { last7: { delivered, held, failed: notSent } };
  } catch (err) {
    out.leads = { error: errorText(err) };
    console.error(`[leads] summary failed: ${errorText(err)}`);
  }

  // 1. The blog: scheduled drafts whose time has come.
  try {
    out.published = await publishDueDrafts(client, now);
  } catch (err) {
    failed = true;
    out.published = { error: errorText(err) };
    console.error(`[projects] publishing failed: ${errorText(err)}`);
    await emailEditors(
      "Scheduled articles didn't run",
      `Today's run couldn't check the blog's scheduled drafts. Nothing was published and nothing is lost: a draft whose time has come goes at the next run.\n\nWhat happened: ${errorText(err)}`,
      "projects"
    );
  }

  // 2. Social.
  if (!process.env.BUFFER_API_KEY) {
    // Normal before Buffer is set up. Once the job has drafted anything, a
    // missing key means it was lost: say so.
    if (await socialJobHasRun()) {
      const message = "BUFFER_API_KEY is not set";
      failed = true;
      console.error(`[social] run failed: ${message}`);
      await notifyRunFailure(new Error(message));
      out.social = { error: message };
    } else {
      out.social = { skipped: "BUFFER_API_KEY is not set yet" };
    }
  } else {
    try {
      out.social = await draftSocialForNewPosts(now, { deadline });
    } catch (err) {
      failed = true;
      out.social = { error: errorText(err) };
      console.error(`[social] run failed: ${errorText(err)}`);
      await notifyRunFailure(err);
    }
  }

  // 3. The next project article, with the time that's left.
  try {
    out.projectArticles = await draftProjectArticles(client, now, { deadline });
  } catch (err) {
    failed = true;
    out.projectArticles = { error: errorText(err) };
    console.error(`[projects] drafting failed: ${errorText(err)}`);
    await emailEditors(
      "Project article didn't run",
      `Today's run couldn't look for job photos posts to write up. Nothing is lost: the next run tries again.\n\nWhat happened: ${errorText(err)}`,
      "projects"
    );
  }

  return NextResponse.json(out, { status: failed ? 500 : 200 });
}
