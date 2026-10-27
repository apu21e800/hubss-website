/**
 * The review links reach Vern by email (lib/review-first.ts): the daily
 * run's first step after the leads line (app/api/cron/social-drafts) sends
 * them the first time it can, and again whenever the keys change (a secret
 * set or rotated in Vercel), saying then that the old links are dead. The
 * other emails repeat Vern's link where it is useful (a new draft, social
 * drafts, a held article).
 */
import type { SanityClient } from "@sanity/client";
import { emailEditors } from "@/lib/editor-mail";
import { agencyLink, reviewFirst, reviewKey, reviewLink, reviewLinkRecordId } from "@/lib/review-first";

/** The email, pure for `npm run test:review`. To Vern (BLOG_DRAFT_NOTIFY), never Doug. */
export function reviewLinkEmail(links: { dougs: string; agency: string }, replaces = false): { subject: string; text: string } {
  return {
    subject: replaces ? "New review links (the old ones no longer open)" : "Doug's review page is ready",
    text: [
      ...(replaces
        ? [
            "A secret in Vercel changed, so the review links changed and the old ones now show a 404. Send Doug his new link, and use the new one yourself.",
            "",
          ]
        : []),
      `Doug's link (send him this once; he keeps it): ${links.dougs}`,
      "",
      `Your link (keep it to yourself): ${links.agency}`,
      "",
      "Your link shows everything waiting: new drafts, with the checks' notes, and the social posts waiting in Buffer. Read each one, fix what needs it (Studio for an article, Buffer for a post), then press \"Put on Doug's page\". Doug's link shows only what you put there: every word and photo, no login. Nothing on either page publishes or posts.",
      "",
      "Doug reviews first now: every social post waits in Buffer as a draft, and an article written from Doug's job photos waits held. After his OK: Publish (or \"Scheduled\" on) in Studio, Add to Queue in Buffer.",
      "",
      "Once Doug is happy to leave it with 21e8: REVIEW_FIRST=off in Vercel (Production), then a redeploy. Posts then queue and clean articles schedule themselves, as before.",
      "",
      "To keep these links the same whatever else changes in Vercel, set REVIEW_SECRET there (Production) to any long random text, once; the next morning's run emails the links it makes. If a link is ever shared by mistake, change REVIEW_SECRET the same way.",
    ].join("\n"),
  };
}

export type ReviewLinkOutcome = "sent" | "already sent" | "review first is off" | "no key" | "not sent";

/**
 * Emails the links unless these keys' email has gone already. The email goes
 * first and the record after it (createIfNotExists), so a slow or failed
 * write can only ever mean one email too many, never none: a record that
 * landed with no email behind it can't happen.
 */
export async function sendReviewLinkOnce(client: SanityClient, now = new Date()): Promise<ReviewLinkOutcome> {
  if (!reviewFirst()) return "review first is off";
  const key = reviewKey();
  const dougs = reviewLink();
  const agency = agencyLink();
  if (!key || !dougs || !agency) return "no key";
  const id = reviewLinkRecordId(key);
  const sent = await client.fetch<{ mine: boolean; others: number }>(
    `{ "mine": defined(*[_id == $id][0]._id), "others": count(*[_type == "reviewLinkSent" && _id != $id]) }`,
    { id }
  );
  if (sent.mine) return "already sent";
  const { subject, text } = reviewLinkEmail({ dougs, agency }, sent.others > 0);
  const to = await emailEditors(subject, text, "review");
  if (!to.length) return "not sent";
  await client.createIfNotExists({ _id: id, _type: "reviewLinkSent", sentAt: now.toISOString() });
  console.log("[review] the review links went to the editors");
  return "sent";
}
