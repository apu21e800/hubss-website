/**
 * Doug reviews first (27 Oct 2026). Vern: "in the beginning Doug wants to
 * review the Blogs and Socials before they go out, but once we gain his trust
 * not making mistakes and nailing the brand voice, he will leave it in our
 * domain."
 *
 * While it is on (the default), nothing goes out by itself:
 *  - social posts wait in Buffer as drafts, every stream (lib/buffer.ts,
 *    socialAutoQueue), until someone presses Add to Queue there;
 *  - a Projects article written from Doug's job photos is saved held, not
 *    scheduled (lib/project-posts.ts); "Scheduled" on, or Publish, releases it;
 *  - the Insights drafter's drafts wait for Publish, as they always have.
 * Doug reads what is waiting on his review page (app/review/[key]/page.tsx,
 * lib/review-page.ts), which needs no login: the address carries a key only
 * the server can make (reviewKey). The link reaches Vern by email, never Doug
 * from the site, and nothing on the site links to it.
 *
 * REVIEW_FIRST=off in Vercel (Production, then a redeploy) is the one switch
 * back to how it ran from 19 to 27 Oct: posts queued in Buffer, articles
 * scheduled when both checks are clean. Only Vern turns it.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const OFF = ["off", "no", "false", "0"];

/** True unless REVIEW_FIRST is off (or no, false, 0). */
export function reviewFirst(): boolean {
  const v = (process.env.REVIEW_FIRST ?? "").trim().toLowerCase();
  return !OFF.includes(v);
}

/** What the key is made from: REVIEW_SECRET when set (to change the link), else a secret the deployment already has. */
function reviewSecret(): string | undefined {
  return process.env.REVIEW_SECRET?.trim() || process.env.CRON_SECRET?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim() || undefined;
}

/** Bumping it changes every link, as setting REVIEW_SECRET does. */
const LABEL = "hubss-review-page-v1";
const KEY_LENGTH = 32;

/**
 * The review page's key: 32 characters (192 bits) of an HMAC of a server
 * secret, so the same deployment always makes the same link and nobody
 * without the secret can make one. Null when the server has no secret, and
 * then the page answers 404 to every key.
 */
export function reviewKey(secret = reviewSecret()): string | null {
  if (!secret) return null;
  return createHmac("sha256", secret).update(LABEL).digest("base64url").slice(0, KEY_LENGTH);
}

/** True only for the key reviewKey() makes, compared in constant time. */
export function isReviewKey(candidate: unknown, secret = reviewSecret()): boolean {
  const key = reviewKey(secret);
  if (!key || typeof candidate !== "string" || candidate.length !== key.length) return false;
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(key));
}

export const REVIEW_SITE = "https://hubss.com";

/** Doug's review page, or null when the server can't make a key. */
export function reviewLink(secret = reviewSecret()): string | null {
  const key = reviewKey(secret);
  return key ? `${REVIEW_SITE}/review/${key}` : null;
}

/**
 * The private Sanity document that records the link was emailed to the
 * editors: one per key (a short hash of it, never the key), so a new key, made
 * by setting REVIEW_SECRET, is emailed again. The dot keeps it out of the
 * public API, as lead counts are kept (lib/lead-counts.ts).
 */
export function reviewLinkRecordId(key: string): string {
  return `review.link-${createHash("sha256").update(key).digest("hex").slice(0, 12)}`;
}
