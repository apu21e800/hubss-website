/**
 * The review links reach Vern by email (lib/review-first.ts): the daily
 * run's first step after the leads line (app/api/cron/social-drafts) sends
 * them the first time it can, and again whenever the keys change (a secret
 * set or rotated in Vercel), saying then that the old links are dead. The
 * other emails repeat Vern's link where it is useful (a new draft, social
 * drafts, a held article).
 *
 * Two emails, never one (the second review of #104): Doug's link alone, with
 * a note ready to paste and nothing in it about how the page is made, so it
 * is safe to pass on whole; and Vern's, which can put things on Doug's page
 * and says how the machinery runs, marked not to forward.
 */
import type { SanityClient } from "@sanity/client";
import { emailEditors } from "@/lib/editor-mail";
import { agencyLink, reviewFirst, reviewKey, reviewLink, reviewLinkRecordId } from "@/lib/review-first";

export interface ReviewEmail {
  subject: string;
  text: string;
}

/** The two emails, pure for `npm run test:review`. Both to Vern (BLOG_DRAFT_NOTIFY), never Doug. */
export function reviewLinkEmails(links: { dougs: string; agency: string }, replaces = false): { dougs: ReviewEmail; agency: ReviewEmail } {
  return {
    dougs: {
      subject: replaces ? "Doug's new review link (the old one no longer opens)" : "Doug's review link, to send him",
      text: [
        replaces
          ? "Doug's review link changed, and his old one now shows a page-not-found. Send him the new one."
          : "Doug's review link. Send it to him from your own email, once: the note below is ready to paste.",
        "",
        links.dougs,
        "",
        "- - -",
        "",
        "Hi Doug,",
        "",
        `Here's your review page: ${links.dougs}`,
        "",
        "It always shows what's lined up to go out next: new articles for hubss.com and HUB's social posts, with every word and photo. I'll let you know when there's something new. Have a look and reply with OK, or with anything you'd change. Nothing goes out without your OK.",
        "",
        "Keep the link: it doesn't change.",
      ].join("\n"),
    },
    agency: {
      subject: replaces ? "Your new review link (21e8 only, don't forward)" : "Your review link (21e8 only, don't forward)",
      text: [
        ...(replaces ? ["A secret in Vercel changed, so the review links changed and the old ones now show a 404.", ""] : []),
        `Your link: ${links.agency}`,
        "",
        "Don't forward this email, and don't send Doug this link: it shows the drafts before you've read them, the checks' notes, and a button that puts things on his page. His link came in its own email.",
        "",
        "Your link shows everything waiting: new drafts, with the checks' notes, and the social posts waiting in Buffer. Read each one, fix what needs it (Studio for an article, Buffer for a post), then press \"Put on Doug's page\". Doug's link shows only what you put there: every word and photo, no login. Nothing on either page publishes or posts.",
        "",
        "Doug reviews first now: every social post waits in Buffer as a draft, and an article written from Doug's job photos waits held. After his OK: Publish (or \"Scheduled\" on) in Studio, Add to Queue in Buffer.",
        "",
        "Once Doug is happy to leave it with 21e8: REVIEW_FIRST=off in Vercel (Production), then a redeploy. Posts then queue and clean articles schedule themselves, as before.",
        "",
        "To keep both links the same whatever else changes in Vercel, set REVIEW_SECRET there (Production) to any long random text, once; the next morning's run emails the links it makes. If a link is ever shared by mistake, change REVIEW_SECRET the same way.",
      ].join("\n"),
    },
  };
}

export type ReviewLinkOutcome = "sent" | "already sent" | "review first is off" | "no key" | "not sent";

/**
 * Emails the links unless these keys' emails have gone already. The emails
 * go first and the record after them (createIfNotExists), so a slow or failed
 * write can only ever mean an email too many, never none. The record is keyed
 * on both keys (a hash of them, never a key), so a change to either is
 * emailed.
 */
export async function sendReviewLinkOnce(client: SanityClient, now = new Date()): Promise<ReviewLinkOutcome> {
  if (!reviewFirst()) return "review first is off";
  const dougsKey = reviewKey();
  const agencyKey = reviewKey(undefined, "agency");
  const dougs = reviewLink();
  const agency = agencyLink();
  if (!dougsKey || !agencyKey || !dougs || !agency) return "no key";
  const id = reviewLinkRecordId(`${dougsKey}|${agencyKey}`);
  const sent = await client.fetch<{ mine: boolean; others: number }>(
    `{ "mine": defined(*[_id == $id][0]._id), "others": count(*[_type == "reviewLinkSent" && _id != $id]) }`,
    { id }
  );
  if (sent.mine) return "already sent";
  const emails = reviewLinkEmails({ dougs, agency }, sent.others > 0);
  const toDougs = await emailEditors(emails.dougs.subject, emails.dougs.text, "review");
  const toAgency = await emailEditors(emails.agency.subject, emails.agency.text, "review");
  if (!toDougs.length || !toAgency.length) return "not sent";
  await client.createIfNotExists({ _id: id, _type: "reviewLinkSent", sentAt: now.toISOString() });
  console.log("[review] the review links went to the editors");
  return "sent";
}
