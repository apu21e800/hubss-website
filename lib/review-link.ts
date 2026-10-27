/**
 * Doug's review page reaches Vern once by email (lib/review-first.ts): the
 * daily run's first step after the leads line (app/api/cron/social-drafts)
 * sends the link the first time it can, and again whenever the key changes
 * (REVIEW_SECRET set or changed), never twice for one key. The other emails
 * repeat it where it is useful (a new draft, social drafts, a held article).
 */
import type { SanityClient } from "@sanity/client";
import { emailEditors } from "@/lib/editor-mail";
import { reviewFirst, reviewKey, reviewLink, reviewLinkRecordId } from "@/lib/review-first";
import { isConflict } from "@/lib/social-outcome";

/** The email, pure for `npm run test:review`. To Vern (BLOG_DRAFT_NOTIFY), never Doug. */
export function reviewLinkEmail(link: string): { subject: string; text: string } {
  return {
    subject: "Doug's review page is ready",
    text: [
      `Doug's review page: ${link}`,
      "",
      "Send Doug this link once. It always shows what is waiting for his OK, so he can keep it (a bookmark, or the email). No login, and nothing on the site links to it; search engines are told to keep out.",
      "",
      "What it shows:",
      "- The articles you tick \"Ready for Doug's review\" in Studio (Blog posts → the draft). Ticking publishes nothing. Every word and the photo show until the article is published.",
      "- The social posts waiting in Buffer for approval, and the ones already lined up, under what they're about.",
      "",
      "Doug reviews first now: every social post waits in Buffer as a draft, and an article written from Doug's job photos waits held. Nothing goes out until you release it: Publish (or \"Scheduled\" on) in Studio, Add to Queue in Buffer.",
      "",
      "Once Doug is happy to leave it with 21e8: REVIEW_FIRST=off in Vercel (Production), then a redeploy. Posts then queue and clean articles schedule themselves, as before.",
      "",
      "If the link is ever shared by mistake: put any long random text in REVIEW_SECRET in Vercel and redeploy. The next morning's run emails the new link, and the old one stops working.",
    ].join("\n"),
  };
}

export type ReviewLinkOutcome = "sent" | "already sent" | "review first is off" | "no key" | "not sent";

/**
 * Emails the link unless this key's has gone already. The record is made
 * first (Sanity refuses a second with the same id, so two runs can't both
 * send) and taken back when the email doesn't go, so the next run tries again.
 */
export async function sendReviewLinkOnce(client: SanityClient, now = new Date()): Promise<ReviewLinkOutcome> {
  if (!reviewFirst()) return "review first is off";
  const key = reviewKey();
  const link = reviewLink();
  if (!key || !link) return "no key";
  const id = reviewLinkRecordId(key);
  try {
    await client.create({ _id: id, _type: "reviewLinkSent", sentAt: now.toISOString() });
  } catch (err) {
    if (isConflict(err)) return "already sent";
    throw err;
  }
  const { subject, text } = reviewLinkEmail(link);
  const to = await emailEditors(subject, text, "review");
  if (!to.length) {
    await client.delete(id).catch((err) => console.error(`[review] couldn't take back ${id}: ${err instanceof Error ? err.message : String(err)}`));
    return "not sent";
  }
  console.log("[review] the review page's link went to the editors");
  return "sent";
}
